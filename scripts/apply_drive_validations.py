from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank-dir", required=True)
    parser.add_argument("--validations", required=True)
    args = parser.parse_args()

    rows = [
        json.loads(line)
        for line in Path(args.validations).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    by_id = {str(row["id"]): row for row in rows}
    if len(by_id) != len(rows):
        raise SystemExit("Hay identificadores duplicados en las validaciones.")

    updated = 0
    files_changed = 0
    found: set[str] = set()
    for path in sorted(Path(args.bank_dir).glob("*.json")):
        if path.name == "manifest.json":
            continue
        questions = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for question in questions:
            question_id = str(question.get("id") or "")
            validation = by_id.get(question_id)
            if validation is None:
                continue
            found.add(question_id)
            options = question.get("o") or {}
            answer = str(options.get(str(question.get("c") or "")) or "").strip()
            if str(question.get("e") or "") != str(validation["prompt"]):
                raise SystemExit(f"El enunciado ha cambiado: {question_id}")
            if answer != str(validation["answer"]):
                raise SystemExit(f"La respuesta ha cambiado: {question_id}")
            if str(question.get("x") or "").strip():
                raise SystemExit(f"La pregunta ya tiene justificación: {question_id}")
            question["x"] = validation["justification"]
            question["r"] = validation["reference"]
            question["v"] = "VALIDADA_DRIVE"
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
        raise SystemExit(f"No se localizaron {len(missing)} preguntas: {missing[:5]}")
    print(json.dumps({"updated": updated, "files_changed": files_changed}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
