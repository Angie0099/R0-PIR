from __future__ import annotations

import argparse
import sqlite3
import sys


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser()
    parser.add_argument("--database", required=True)
    parser.add_argument("--query", required=True)
    parser.add_argument("--subject")
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    connection = sqlite3.connect(args.database)
    sql = """
        SELECT d.title, d.subject, d.url, s.section_number, s.text,
               bm25(section_fts) AS rank
        FROM section_fts
        JOIN sections s ON s.id = section_fts.rowid
        JOIN documents d ON d.id = s.document_id
        WHERE section_fts MATCH ?
    """
    values: list[object] = [args.query]
    if args.subject:
        sql += " AND d.subject = ?"
        values.append(args.subject)
    sql += " ORDER BY rank LIMIT ?"
    values.append(args.limit)
    rows = connection.execute(sql, values).fetchall()
    for title, subject, url, section, text, rank in rows:
        print(f"\n=== {title} | {subject} | sección {section} | {rank:.3f} ===")
        print(url)
        print(text)
    connection.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
