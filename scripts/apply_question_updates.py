from __future__ import annotations

import argparse
import json
from pathlib import Path


ALLOWED_FIELDS = {"c", "e", "t", "x", "r", "v"}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank-dir", required=True)
    parser.add_argument("--updates", required=True)
    args = parser.parse_args()

    rows = [
        json.loads(line)
        for line in Path(args.updates).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    by_id = {str(row["id"]): row for row in rows}
    if len(by_id) != len(rows):
        raise SystemExit("Hay identificadores duplicados en las actualizaciones.")

    found: set[str] = set()
    updated = 0
    files_changed = 0
    for path in sorted(Path(args.bank_dir).glob("*.json")):
        if path.name == "manifest.json":
            continue
        questions = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for question in questions:
            question_id = str(question.get("id") or "")
            row = by_id.get(question_id)
            if row is None:
                continue
            found.add(question_id)
            expected_c = row.get("expected_c")
            if expected_c is not None and question.get("c") != expected_c:
                raise SystemExit(f"La clave actual no coincide: {question_id}")
            fields = row.get("set") or {}
            unexpected = sorted(set(fields) - ALLOWED_FIELDS)
            if unexpected:
                raise SystemExit(f"Campos no permitidos en {question_id}: {unexpected}")
            question.update(fields)
            updated += 1
            changed = True
        if changed:
            files_changed += 1
            path.write_text(
                json.dumps(questions, ensure_ascii=False, separators=(",", ":")),
                encoding="utf-8",
            )

    missing = sorted(set(by_id) - found)
    if missing:
        raise SystemExit(f"No se localizaron preguntas: {missing[:5]}")
    print(json.dumps({"updated": updated, "files_changed": files_changed}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
