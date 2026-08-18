from __future__ import annotations

import argparse
import json
import re
import sqlite3
import sys
from pathlib import Path

from pypdf import PdfReader


EXCLUDED_DIRS = {"tmp", "output", ".git", "node_modules"}


def clean_text(value: str) -> str:
    value = value.replace("\x00", " ")
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def discover_pdfs(roots: list[Path]) -> list[Path]:
    found: dict[str, Path] = {}
    for root in roots:
        if not root.exists():
            continue
        for path in root.rglob("*.pdf"):
            if any(part.lower() in EXCLUDED_DIRS for part in path.parts):
                continue
            found[str(path.resolve()).casefold()] = path.resolve()
    return sorted(found.values(), key=lambda path: str(path).casefold())


def prepare_database(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        path.unlink()
    connection = sqlite3.connect(path)
    connection.executescript(
        """
        PRAGMA journal_mode=WAL;
        PRAGMA synchronous=NORMAL;
        CREATE TABLE documents (
            id INTEGER PRIMARY KEY,
            path TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            page_count INTEGER NOT NULL DEFAULT 0,
            extracted_pages INTEGER NOT NULL DEFAULT 0,
            text_chars INTEGER NOT NULL DEFAULT 0,
            error TEXT
        );
        CREATE TABLE pages (
            id INTEGER PRIMARY KEY,
            document_id INTEGER NOT NULL REFERENCES documents(id),
            page_number INTEGER NOT NULL,
            text TEXT NOT NULL,
            UNIQUE(document_id, page_number)
        );
        CREATE VIRTUAL TABLE page_fts USING fts5(
            text,
            content='pages',
            content_rowid='id',
            tokenize='unicode61 remove_diacritics 2'
        );
        """
    )
    return connection


def index_pdf(connection: sqlite3.Connection, pdf_path: Path) -> dict[str, object]:
    cursor = connection.execute(
        "INSERT INTO documents(path, title) VALUES (?, ?)",
        (str(pdf_path), pdf_path.stem),
    )
    document_id = int(cursor.lastrowid)
    result: dict[str, object] = {
        "path": str(pdf_path),
        "title": pdf_path.stem,
        "page_count": 0,
        "extracted_pages": 0,
        "text_chars": 0,
        "error": None,
    }
    try:
        reader = PdfReader(str(pdf_path), strict=False)
        if reader.is_encrypted:
            reader.decrypt("")
        result["page_count"] = len(reader.pages)
        for page_number, page in enumerate(reader.pages, start=1):
            try:
                text = clean_text(page.extract_text() or "")
            except Exception as exc:  # Keep usable pages from partially broken PDFs.
                text = f"[PAGE_EXTRACTION_ERROR: {type(exc).__name__}: {exc}]"
            page_cursor = connection.execute(
                "INSERT INTO pages(document_id, page_number, text) VALUES (?, ?, ?)",
                (document_id, page_number, text),
            )
            connection.execute(
                "INSERT INTO page_fts(rowid, text) VALUES (?, ?)",
                (int(page_cursor.lastrowid), text),
            )
            if text and not text.startswith("[PAGE_EXTRACTION_ERROR"):
                result["extracted_pages"] = int(result["extracted_pages"]) + 1
                result["text_chars"] = int(result["text_chars"]) + len(text)
        connection.execute(
            """
            UPDATE documents
            SET page_count = ?, extracted_pages = ?, text_chars = ?
            WHERE id = ?
            """,
            (
                result["page_count"],
                result["extracted_pages"],
                result["text_chars"],
                document_id,
            ),
        )
    except Exception as exc:
        result["error"] = f"{type(exc).__name__}: {exc}"
        connection.execute(
            "UPDATE documents SET error = ? WHERE id = ?",
            (result["error"], document_id),
        )
    connection.commit()
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", action="append", required=True)
    parser.add_argument("--database", required=True)
    parser.add_argument("--summary", required=True)
    args = parser.parse_args()

    roots = [Path(value) for value in args.root]
    database_path = Path(args.database)
    summary_path = Path(args.summary)
    pdfs = discover_pdfs(roots)
    connection = prepare_database(database_path)
    documents: list[dict[str, object]] = []

    for index, pdf_path in enumerate(pdfs, start=1):
        print(f"[{index}/{len(pdfs)}] {pdf_path.name}", flush=True)
        documents.append(index_pdf(connection, pdf_path))

    connection.close()
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    summary = {
        "roots": [str(root.resolve()) for root in roots],
        "document_count": len(documents),
        "page_count": sum(int(item["page_count"]) for item in documents),
        "extracted_pages": sum(int(item["extracted_pages"]) for item in documents),
        "text_chars": sum(int(item["text_chars"]) for item in documents),
        "documents_with_errors": sum(1 for item in documents if item["error"]),
        "documents": documents,
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({key: summary[key] for key in summary if key != "documents"}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
