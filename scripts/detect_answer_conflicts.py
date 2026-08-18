from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path


CORRECT_PATTERNS = (
    re.compile(r"\bR\s*([1-4])\s+(?:es\s+)?correcta\b", re.I),
    re.compile(r"\brespuesta\s+([1-4])\s+(?:es\s+)?(?:la\s+)?correcta\b", re.I),
    re.compile(r"\bopci[oó]n\s+([1-4])\s+(?:es\s+)?(?:la\s+)?correcta\b", re.I),
)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audit", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--summary", required=True)
    args = parser.parse_args()

    conflicts: list[dict[str, object]] = []
    label_counts: Counter[int] = Counter()
    with Path(args.audit).open(encoding="utf-8") as stream:
        for line in stream:
            row = json.loads(line)
            explanation = str(row.get("current_explanation") or "")
            labels: list[int] = []
            for pattern in CORRECT_PATTERNS:
                labels.extend(int(match.group(1)) for match in pattern.finditer(explanation))
            unique = sorted(set(labels))
            if len(unique) != 1:
                continue
            stated = unique[0]
            label_counts[stated] += 1
            stored = "abcd".find(str(row.get("correct") or "")) + 1
            if stored == stated:
                continue
            conflicts.append(
                {
                    "id": row.get("id"),
                    "source_file": row.get("source_file"),
                    "subject": row.get("subject"),
                    "prompt": row.get("prompt"),
                    "stored_answer": stored,
                    "stored_option": row.get("correct_option"),
                    "explanation_stated_answer": stated,
                    "explanation": explanation,
                }
            )

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as stream:
        for row in conflicts:
            stream.write(json.dumps(row, ensure_ascii=False) + "\n")
    summary = {
        "conflicts": len(conflicts),
        "unique_correct_label_counts": dict(label_counts),
    }
    Path(args.summary).write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
