from __future__ import annotations

import argparse
import json
import os
import re
import sqlite3
import sys
from pathlib import Path


SENTINEL = "__R0PIR_DRIVE_TEXT_END_7F3A9D__"
DOCUMENT_PREFIX = "__R0PIR_DRIVE_DOCUMENT_7F3A9D__"
QUIT = "__R0PIR_DRIVE_QUIT_7F3A9D__"


def disable_console_echo() -> None:
    if os.name != "nt":
        return
    try:
        import ctypes
        import msvcrt

        handle = msvcrt.get_osfhandle(sys.stdin.fileno())
        mode = ctypes.c_uint()
        kernel32 = ctypes.windll.kernel32
        if kernel32.GetConsoleMode(handle, ctypes.byref(mode)):
            kernel32.SetConsoleMode(handle, mode.value & ~0x0004)
    except Exception:
        pass


def split_sections(text: str, size: int = 5_000, overlap: int = 500) -> list[str]:
    text = re.sub(r"\r\n?", "\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    sections: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + size)
        if end < len(text):
            boundary = text.rfind("\n", start + size // 2, end)
            if boundary > start:
                end = boundary
        value = text[start:end].strip()
        if value:
            sections.append(value)
        if end >= len(text):
            break
        start = max(start + 1, end - overlap)
    return sections


def initialize(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY,
            url TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            subject TEXT NOT NULL,
            text_chars INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sections (
            id INTEGER PRIMARY KEY,
            document_id INTEGER NOT NULL REFERENCES documents(id),
            section_number INTEGER NOT NULL,
            text TEXT NOT NULL
        );
        CREATE VIRTUAL TABLE IF NOT EXISTS section_fts USING fts5(
            text,
            content='sections',
            content_rowid='id',
            tokenize='unicode61 remove_diacritics 2'
        );
        """
    )


def ingest_document(
    connection: sqlite3.Connection, *, title: str, subject: str, url: str, text: str
) -> tuple[int, int]:
    text = text.strip()
    if not text:
        raise RuntimeError("Drive returned no readable text")

    existing = connection.execute(
        "SELECT id FROM documents WHERE url = ?", (url,)
    ).fetchone()
    if existing:
        document_id = int(existing[0])
        section_ids = [
            int(row[0])
            for row in connection.execute(
                "SELECT id FROM sections WHERE document_id = ?", (document_id,)
            )
        ]
        connection.executemany(
            "DELETE FROM section_fts WHERE rowid = ?", ((value,) for value in section_ids)
        )
        connection.execute("DELETE FROM sections WHERE document_id = ?", (document_id,))
        connection.execute(
            "UPDATE documents SET title = ?, subject = ?, text_chars = ? WHERE id = ?",
            (title, subject, len(text), document_id),
        )
    else:
        cursor = connection.execute(
            "INSERT INTO documents(url, title, subject, text_chars) VALUES (?, ?, ?, ?)",
            (url, title, subject, len(text)),
        )
        document_id = int(cursor.lastrowid)

    sections = split_sections(text)
    for number, value in enumerate(sections, start=1):
        cursor = connection.execute(
            "INSERT INTO sections(document_id, section_number, text) VALUES (?, ?, ?)",
            (document_id, number, value),
        )
        connection.execute(
            "INSERT INTO section_fts(rowid, text) VALUES (?, ?)",
            (int(cursor.lastrowid), value),
        )
    connection.commit()
    return len(text), len(sections)


def read_document_text() -> str:
    parts: list[str] = []
    for line in sys.stdin:
        if line.rstrip("\r\n") == SENTINEL:
            break
        parts.append(line)
    return "".join(parts)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--database", required=True)
    parser.add_argument("--title")
    parser.add_argument("--subject")
    parser.add_argument("--url")
    parser.add_argument("--stream", action="store_true")
    args = parser.parse_args()

    if hasattr(sys.stdin, "reconfigure"):
        sys.stdin.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if args.stream:
        disable_console_echo()

    database = Path(args.database)
    database.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database)
    initialize(connection)

    if args.stream:
        for line in sys.stdin:
            command = line.rstrip("\r\n")
            if command == QUIT:
                break
            if not command.startswith(DOCUMENT_PREFIX):
                continue
            metadata = json.loads(command[len(DOCUMENT_PREFIX) :])
            text = read_document_text()
            chars, section_count = ingest_document(
                connection,
                title=str(metadata["title"]),
                subject=str(metadata["subject"]),
                url=str(metadata["url"]),
                text=text,
            )
            print(
                f"indexed title={metadata['title']!r} subject={metadata['subject']!r} "
                f"chars={chars} sections={section_count}",
                flush=True,
            )
        connection.close()
        return 0

    if not args.title or not args.subject or not args.url:
        parser.error("--title, --subject and --url are required unless --stream is used")
    text = read_document_text()
    chars, section_count = ingest_document(
        connection, title=args.title, subject=args.subject, url=args.url, text=text
    )
    connection.close()
    print(
        f"indexed title={args.title!r} subject={args.subject!r} "
        f"chars={chars} sections={section_count}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
