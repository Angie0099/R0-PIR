from __future__ import annotations

import argparse
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path


WATERMARKS = re.compile(
    r"(?:FSE\s+PSICOL\w*|(?:PSICO)?LOG[ÍI]A\s+2024\s*/\s*2025|G[ÍI]A\s+2024\s*/\s*2025)",
    re.I,
)

MANUAL_OVERRIDES: dict[str, dict[str, str]] = {
    "PERSEV_JUL25_D2_175": {
        "c": "c",
        "x": (
            "El test de Rorschach consta de 10 láminas; por tanto, la opción correcta es "
            "«10 láminas». La justificación anterior interpretaba por error el enunciado como "
            "una pregunta negativa."
        ),
        "r": "Fernández-Ballesteros, Evaluación psicológica, 2.ª ed., pp. 291-295.",
        "v": "CORREGIDA",
    },
    "SmCm5PIR2024_140": {
        "c": "c",
        "x": (
            "Son confabulaciones: falsificaciones de la memoria que aparecen en el contexto "
            "de una alteración amnésica, sin intención consciente de engañar. Se diferencian "
            "de la pseudología fantástica porque el paciente no reconoce la falsedad de lo narrado."
        ),
        "r": (
            "Vallejo Ruiloba, Introducción a la psicopatología y la psiquiatría, "
            "9.ª ed., p. 456; capítulo 43 «Memoria», p. 14."
        ),
        "v": "CORREGIDA",
    },
    # En estos casos la explicación importada pertenece a otra pregunta. Se conserva
    # la clave original, se retira el texto ajeno y se fuerza una revisión documental.
    "SmCm23PIR2025 (2)_005": {"c": "d", "x": "", "r": "", "v": "REVISAR"},
    "SmCm26PIR2025_161": {"c": "d", "x": "", "r": "", "v": "REVISAR"},
    "SmCm30PIR2025 (1)_114": {"c": "b", "x": "", "r": "", "v": "REVISAR"},
    "SmCm4PIR2024_180": {"c": "a", "x": "", "r": "", "v": "REVISAR"},
    "SmCm3PIR2024_039": {"c": "d", "x": "", "r": "", "v": "REVISAR"},
    "simu 9 comentado_006": {"c": "d", "x": "", "r": "", "v": "REVISAR"},
    "Simu 8 comentado _196": {"c": "d", "x": "", "r": "", "v": "REVISAR"},
    "PERSEVER___SIMULACRO_COMENTADO_JULIO-DOS-23_186": {
        "c": "c", "x": "", "r": "", "v": "REVISAR"
    },
    "Simu 6 comentado__148": {"c": "c", "x": "", "r": "", "v": "REVISAR"},
    "SmCm15PIR2025_014": {"c": "d", "x": "", "r": "", "v": "REVISAR"},
}

UNRESOLVED_FLAGS = {
    "duplicate_options",
    "truncated_option",
    "very_short_option",
    "question_replacement_character",
    "explanation_replacement_character",
    "question_joined_words",
    "explanation_joined_words",
    "question_split_ocr_word",
    "explanation_split_ocr_word",
    "possible_explanation_mismatch",
    "missing_explanation",
}


def fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    return re.sub(r"\W+", " ", value.casefold()).strip()


def remove_watermarks(value: str) -> str:
    value = WATERMARKS.sub(" ", value)
    value = re.sub(r"\s+([,.;:?!])", r"\1", value)
    return re.sub(r"\s{2,}", " ", value).strip()


def dedupe_explanation(value: str) -> str:
    if len(value) < 180:
        return value
    anchor = value[: min(100, max(45, len(value) // 8))]
    start = max(len(anchor), len(value) // 3)
    boundary = value.find(anchor, start)
    if boundary < 0:
        return value
    left = value[:boundary].strip()
    right = value[boundary:].strip()
    if fold(left) == fold(right):
        return left
    return value


def clean_reference(value: str) -> str:
    value = re.sub(r"\s+", " ", value).strip(" .;,:-")
    if value.count("(") > value.count(")"):
        value += ")"
    return value + "." if value else ""


def evidence_reference(row: dict[str, object]) -> str:
    candidates = row.get("candidates") or []
    if row.get("confidence") != "high" or not candidates:
        return ""
    candidate = candidates[0]
    document = str(candidate.get("document") or "").strip()
    page = candidate.get("page")
    if not document or not page:
        return ""
    return f"{document}, p. {page} (localización documental automática; pendiente de revisión final)."


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank-dir", required=True)
    parser.add_argument("--audit", required=True)
    parser.add_argument("--evidence", required=True)
    parser.add_argument("--conflicts", required=True)
    parser.add_argument("--report", required=True)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    audit: dict[str, dict[str, object]] = {}
    with Path(args.audit).open(encoding="utf-8") as stream:
        for line in stream:
            row = json.loads(line)
            audit[str(row["id"])] = row

    evidence: dict[str, dict[str, object]] = {}
    with Path(args.evidence).open(encoding="utf-8") as stream:
        for line in stream:
            row = json.loads(line)
            evidence[str(row["id"])] = row

    conflicts: dict[str, int] = {}
    with Path(args.conflicts).open(encoding="utf-8") as stream:
        for line in stream:
            row = json.loads(line)
            conflicts[str(row["id"])] = int(row["explanation_stated_answer"])

    counts: Counter[str] = Counter()
    files_changed = 0
    bank_dir = Path(args.bank_dir)
    for path in sorted(bank_dir.glob("*.json")):
        if path.name == "manifest.json":
            continue
        questions = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for question in questions:
            question_id = str(question.get("id") or "")
            row = audit[question_id]

            if question_id in conflicts:
                new_answer = "abcd"[conflicts[question_id] - 1]
                if question.get("c") != new_answer:
                    question["c"] = new_answer
                    question["v"] = "CORREGIDA"
                    counts["answer_keys_corrected"] += 1
                    changed = True

            explanation = str(question.get("x") or "")
            cleaned_explanation = dedupe_explanation(remove_watermarks(explanation))
            if cleaned_explanation != explanation:
                question["x"] = cleaned_explanation
                counts["explanations_cleaned"] += 1
                changed = True

            prompt = str(question.get("e") or "")
            cleaned_prompt = remove_watermarks(prompt)
            if cleaned_prompt != prompt:
                question["e"] = cleaned_prompt
                counts["prompts_cleaned"] += 1
                changed = True
            options = question.get("o") or {}
            for key in "abcd":
                value = str(options.get(key) or "")
                cleaned = remove_watermarks(value)
                if cleaned != value:
                    options[key] = cleaned
                    counts["options_cleaned"] += 1
                    changed = True

            override = MANUAL_OVERRIDES.get(question_id)
            if override:
                for key, value in override.items():
                    if question.get(key) != value:
                        question[key] = value
                        changed = True
                counts["manual_overrides"] += 1

            skip_reference = bool(override and "r" in override and not override["r"])
            if not skip_reference and not str(question.get("r") or "").strip():
                citations = row.get("citation_candidates") or []
                reference = clean_reference(str(citations[0])) if citations else ""
                if reference:
                    question["r"] = reference
                    counts["references_from_explanations"] += 1
                    changed = True
                else:
                    reference = evidence_reference(evidence[question_id])
                    if reference:
                        question["r"] = reference
                        if not question.get("v"):
                            question["v"] = "REVISAR"
                        counts["provisional_manual_references"] += 1
                        changed = True

            flags = set(row.get("flags") or [])
            if question_id in conflicts:
                flags.discard("possible_explanation_mismatch")
            flags.discard("repeated_explanation")
            flags.discard("question_watermark_fragment")
            flags.discard("explanation_watermark_fragment")
            if flags & UNRESOLVED_FLAGS and question.get("v") != "CORREGIDA":
                if question.get("v") != "REVISAR":
                    question["v"] = "REVISAR"
                    counts["marked_for_review"] += 1
                    changed = True

        if changed:
            files_changed += 1
            if args.write:
                path.write_text(
                    json.dumps(questions, ensure_ascii=False, separators=(",", ":")),
                    encoding="utf-8",
                )

    report = {
        "mode": "write" if args.write else "dry-run",
        "files_changed": files_changed,
        "counts": dict(counts),
    }
    Path(args.report).write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
