from __future__ import annotations

import argparse
import sqlite3
import sys


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    parser.add_argument("--database", default="analysis/manual_index.sqlite")
    parser.add_argument("--limit", type=int, default=20)
    args = parser.parse_args()

    connection = sqlite3.connect(args.database)
    rows = connection.execute(
        """
        SELECT d.title, p.page_number,
               snippet(page_fts, 0, '[', ']', ' … ', 36)
        FROM page_fts
        JOIN pages p ON p.id = page_fts.rowid
        JOIN documents d ON d.id = p.document_id
        WHERE page_fts MATCH ?
        LIMIT ?
        """,
        (args.query, args.limit),
    ).fetchall()
    connection.close()
    for title, page, snippet in rows:
        print(f"{title} | p. {page} | {snippet}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
