from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audit", required=True)
    parser.add_argument("--parts", nargs="+", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--summary", required=True)
    args = parser.parse_args()

    evidence: dict[str, dict[str, object]] = {}
    for part_name in args.parts:
        with Path(part_name).open(encoding="utf-8") as stream:
            for line in stream:
                row = json.loads(line)
                evidence[str(row["id"])] = row

    confidence_counts: Counter[str] = Counter()
    subject_counts: dict[str, Counter[str]] = defaultdict(Counter)
    ordered: list[dict[str, object]] = []
    with Path(args.audit).open(encoding="utf-8") as stream:
        for line in stream:
            audit = json.loads(line)
            question_id = str(audit["id"])
            row = evidence.get(question_id)
            if row is None:
                raise RuntimeError(f"Missing evidence row for {question_id}")
            ordered.append(row)
            level = str(row["confidence"])
            subject = str(row["subject"])
            confidence_counts[level] += 1
            subject_counts[subject][level] += 1

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as stream:
        for row in ordered:
            stream.write(json.dumps(row, ensure_ascii=False) + "\n")

    summary = {
        "total_questions": len(ordered),
        "confidence_counts": dict(confidence_counts),
        "subjects": {
            subject: dict(counts)
            for subject, counts in sorted(subject_counts.items())
        },
    }
    Path(args.summary).write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
