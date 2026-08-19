from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--exclude-file", required=True)
    args = parser.parse_args()

    excluded = {
        line.strip()
        for line in Path(args.exclude_file).read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    }
    rows = [
        json.loads(line)
        for line in Path(args.input).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    kept = [row for row in rows if str(row.get("id") or "") not in excluded]
    found = {str(row.get("id") or "") for row in rows} & excluded
    missing = sorted(excluded - found)
    if missing:
        raise SystemExit(f"Exclusiones no encontradas: {missing[:5]}")
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in kept),
        encoding="utf-8",
    )
    print(json.dumps({"input": len(rows), "excluded": len(found), "kept": len(kept)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
