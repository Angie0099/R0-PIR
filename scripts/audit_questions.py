from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path


STOPWORDS = {
    "a", "al", "ante", "bajo", "con", "contra", "cual", "cuando", "de", "del",
    "desde", "donde", "el", "ella", "en", "entre", "es", "esta", "este", "estos",
    "ha", "hay", "la", "las", "lo", "los", "mas", "no", "o", "para", "por", "que",
    "se", "segun", "ser", "si", "sin", "sobre", "son", "su", "sus", "un", "una", "uno",
    "y", "ya", "respuesta", "correcta", "incorrecta", "opcion", "opciones", "siguiente",
    "senale", "indique", "afirmacion",
}

OCR_PATTERNS = {
    "replacement_character": re.compile("�"),
    "watermark_fragment": re.compile(r"(?:FSE\s+PSICOL|G[ÍI]A\s+2024\s*/\s*2025|LOG[ÍI]A\s+2024)", re.I),
    "split_ocr_word": re.compile(
        r"\b(?:de ne|siol[oó]g|espec[ií] cas|identi cables|re er|re ej|di cult|nalidad|loso f|"
        r"arti cial|in uenc|clasi cac|signi cat|f[íi]sio l[oó]g|incorecta)\b",
        re.I,
    ),
    "joined_words": re.compile(r"\b[a-záéíóúñ]{18,}\b", re.I),
}

PAGE_PATTERN = re.compile(r"p[áa]g(?:ina)?s?\.?\s*\d+(?:\s*[-–]\s*\d+)?", re.I)
SOURCE_PATTERN = re.compile(
    r"Manual|DSM-?5(?:-TR)?|CIE-?11|Belloch|Ballesteros|Caballo|Vallejo|Fonseca|Moreno|Sand[ií]n",
    re.I,
)


def fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = value.casefold()
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def tokens(value: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-záéíóúñü]{4,}", fold(value))
        if token not in STOPWORDS
    }


def signature(question: dict[str, object]) -> str:
    options = question.get("o") or {}
    parts = [str(question.get("e") or "")]
    parts.extend(str(options.get(key) or "") for key in "abcd")
    return fold(" | ".join(parts))


def explanation_repeat_ratio(value: str) -> float:
    normalized = fold(value)
    if len(normalized) < 200:
        return 0.0
    midpoint = len(normalized) // 2
    left = normalized[:midpoint].strip(" .;,:-")
    right = normalized[midpoint:].strip(" .;,:-")
    if not left or not right:
        return 0.0
    shorter = min(len(left), len(right))
    matches = sum(1 for a, b in zip(left[:shorter], right[:shorter]) if a == b)
    return matches / shorter


def citation_candidates(value: str) -> list[str]:
    candidates: list[str] = []
    for match in PAGE_PATTERN.finditer(value):
        start = max(0, match.start() - 260)
        snippet = value[start : match.end()].replace("\n", " ").strip()
        source_matches = list(SOURCE_PATTERN.finditer(snippet))
        if not source_matches:
            continue
        snippet = snippet[source_matches[-1].start() :]
        snippet = re.sub(r"\s+", " ", snippet).strip(" .;,:-")
        candidates.append(snippet)
    return list(dict.fromkeys(candidates))


def audit_question(question: dict[str, object], source_file: str) -> dict[str, object]:
    options = question.get("o") or {}
    answer = str(question.get("c") or "")
    explanation = str(question.get("x") or "").strip()
    prompt = str(question.get("e") or "").strip()
    correct_option = str(options.get(answer) or "")
    all_text = " ".join([prompt, *(str(options.get(key) or "") for key in "abcd")])
    flags: list[str] = []

    if not explanation:
        flags.append("missing_explanation")
    if not str(question.get("r") or "").strip():
        flags.append("missing_reference")
    for name, pattern in OCR_PATTERNS.items():
        if pattern.search(all_text):
            flags.append(f"question_{name}")
        if explanation and pattern.search(explanation):
            flags.append(f"explanation_{name}")

    folded_options = [fold(str(options.get(key) or "")) for key in "abcd"]
    if len(set(folded_options)) != 4:
        flags.append("duplicate_options")
    if any(len(value) < 2 for value in folded_options):
        flags.append("very_short_option")
    if any(value in {"ano", "anos", "mes", "meses"} for value in folded_options):
        flags.append("truncated_option")

    repeat_ratio = explanation_repeat_ratio(explanation)
    if repeat_ratio >= 0.92:
        flags.append("repeated_explanation")

    overlap = None
    if explanation:
        basis_tokens = tokens(prompt + " " + correct_option)
        explanation_tokens = tokens(explanation)
        overlap = len(basis_tokens & explanation_tokens) / max(1, len(basis_tokens))
        if len(explanation) >= 180 and overlap < 0.035:
            flags.append("possible_explanation_mismatch")

    citations = citation_candidates(explanation)
    return {
        "id": question.get("id"),
        "source_file": source_file,
        "subject": question.get("s"),
        "topics": question.get("t") or [],
        "prompt": prompt,
        "correct": answer,
        "correct_option": correct_option,
        "current_explanation": explanation,
        "current_reference": question.get("r") or "",
        "flags": sorted(set(flags)),
        "explanation_overlap": None if overlap is None else round(overlap, 4),
        "repeat_ratio": round(repeat_ratio, 4),
        "citation_candidates": citations,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank-dir", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--summary", required=True)
    args = parser.parse_args()

    bank_dir = Path(args.bank_dir)
    output_path = Path(args.output)
    summary_path = Path(args.summary)
    questions: list[tuple[dict[str, object], str]] = []
    for path in sorted(bank_dir.glob("*.json")):
        if path.name == "manifest.json":
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        questions.extend((question, path.name) for question in data)

    id_counts = Counter(str(question.get("id") or "") for question, _ in questions)
    signatures: dict[str, list[str]] = defaultdict(list)
    for question, _ in questions:
        signatures[signature(question)].append(str(question.get("id") or ""))

    audits = []
    for question, source_file in questions:
        row = audit_question(question, source_file)
        if id_counts[str(question.get("id") or "")] > 1:
            row["flags"].append("duplicate_id")
        duplicate_group = signatures[signature(question)]
        if len(duplicate_group) > 1:
            row["flags"].append("duplicate_question")
            row["duplicate_ids"] = duplicate_group
        row["flags"] = sorted(set(row["flags"]))
        audits.append(row)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as stream:
        for row in audits:
            stream.write(json.dumps(row, ensure_ascii=False) + "\n")

    flag_counts = Counter(flag for row in audits for flag in row["flags"])
    subject_summary: dict[str, dict[str, int]] = defaultdict(lambda: {"total": 0, "flagged": 0, "missing_explanation": 0})
    for row in audits:
        subject = str(row["subject"])
        subject_summary[subject]["total"] += 1
        if row["flags"]:
            subject_summary[subject]["flagged"] += 1
        if "missing_explanation" in row["flags"]:
            subject_summary[subject]["missing_explanation"] += 1

    summary = {
        "total_questions": len(audits),
        "unique_ids": len(id_counts),
        "duplicate_id_values": sum(1 for count in id_counts.values() if count > 1),
        "duplicate_question_groups": sum(1 for values in signatures.values() if len(values) > 1),
        "questions_with_any_flag": sum(1 for row in audits if row["flags"]),
        "citation_candidates_found": sum(1 for row in audits if row["citation_candidates"]),
        "flag_counts": dict(flag_counts.most_common()),
        "subjects": dict(sorted(subject_summary.items())),
    }
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
