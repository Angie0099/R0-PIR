from __future__ import annotations

import argparse
import json
import re
import sqlite3
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path


TARGET_SUBJECTS = {
    "Evaluación Psicológica",
    "Psicobiología",
    "Psicología Básica",
    "Psicología Clínica",
    "Psicología Evolutiva",
    "Psicología Experimental",
    "Psicología Social",
    "Psicología de la Personalidad y Diferencial",
    "Psicoterapias",
    "Tratamientos Adultos",
    "Tratamientos Infantiles",
}

STOPWORDS = {
    "acerca", "afirmacion", "afirmaciones", "alternativa", "cual", "cuando", "donde",
    "entre", "indica", "indique", "opcion", "opciones", "pregunta", "respuesta", "segun",
    "senala", "senale", "siguiente", "siguientes", "sobre", "tiene", "todos", "todas",
    "persona", "personas", "puede", "debe", "forma", "parte", "relacion", "respecto",
    "caracteristicas", "como", "para", "desde", "hasta", "porque", "pero", "solo", "cada",
    "otro", "otra", "otros", "otras", "mayor", "menor", "este", "esta", "estos", "estas",
}

NEGATIVE_STEM = re.compile(
    r"\b(?:incorrect[ao]s?|fals[ao]s?|excepto|menos|no)\b",
    re.I,
)

BAD_TEXT = re.compile(
    r"�|FSE\s+PSICOL|G[ÍI]A\s+2024|\b[a-záéíóúñ]{24,}\b|"
    r"\b(?:AMIR|APIR|CEDE|PERSEVER)\b|PSICOLOG[ÍI]A\s+A\b",
    re.I,
)

OCR_FRAGMENT = re.compile(r"\b(?:tr|yu|gi|ci|bi|ll|ne)\b", re.I)
OCR_SINGLE = re.compile(r"(?<!\w)[A-Za-z0-9](?!\w)")
SOURCE_ARTIFACT = re.compile(
    r"\b(?:AMI|MIR)\b|(?:^|\s)IR\s*$|(?:^|\s)(?:A|[ÍI]A)\s+2024\b|"
    r":\s*PSICOLOG[ÍI]A\s*$",
    re.I,
)
UPPER_ARTIFACT = re.compile(r"\b(?:IR|AP)\b|PSICOLOG[ÍI]A")


def fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = value.casefold()
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def words(value: str) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for token in re.findall(r"[a-záéíóúñü]{5,}", fold(value)):
        if token in STOPWORDS or token in seen:
            continue
        seen.add(token)
        result.append(token)
    return result


def windows(value: str, size: int = 1_100, overlap: int = 180) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(value):
        end = min(len(value), start + size)
        if end < len(value):
            boundary = value.rfind("\n", start + size // 2, end)
            if boundary > start:
                end = boundary
        chunk = value[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(value):
            break
        start = max(start + 1, end - overlap)
    return chunks


def best_window(
    text: str, prompt_tokens: set[str], answer_tokens: set[str], exact_answer: str
) -> tuple[str, int, float, bool, float]:
    best = ("", 0, 0.0, False, -1.0)
    for chunk in windows(text):
        normalized = fold(chunk)
        chunk_tokens = set(words(chunk))
        prompt_hits = len(prompt_tokens & chunk_tokens)
        answer_fraction = len(answer_tokens & chunk_tokens) / max(1, len(answer_tokens))
        exact = bool(exact_answer and exact_answer in normalized)
        score = prompt_hits * 1.7 + answer_fraction * 7.0 + (5.0 if exact else 0.0)
        if score > best[4]:
            best = (chunk, prompt_hits, answer_fraction, exact, score)
    return best


def evidence_excerpt(
    chunk: str, prompt_tokens: set[str], exact_answer: str, radius: int = 430
) -> tuple[str, int]:
    """Return the answer occurrence with the strongest nearby prompt context."""
    normalized = fold(chunk)
    positions = [match.start() for match in re.finditer(re.escape(exact_answer), normalized)]
    if not positions:
        return re.sub(r"\s+", " ", chunk)[:720], 0
    best_excerpt = ""
    best_hits = -1
    for position in positions:
        start = max(0, position - radius)
        end = min(len(chunk), position + len(exact_answer) + radius)
        excerpt = chunk[start:end]
        hits = len(prompt_tokens & set(words(excerpt)))
        if hits > best_hits:
            best_excerpt = excerpt
            best_hits = hits
    return re.sub(r"\s+", " ", best_excerpt).strip(), max(0, best_hits)


def eligible(question: dict[str, object], *, include_review: bool = False) -> bool:
    if str(question.get("s") or "") not in TARGET_SUBJECTS:
        return False
    has_explanation = bool(str(question.get("x") or "").strip())
    if has_explanation and not (
        include_review and str(question.get("v") or "") == "REVISAR"
    ):
        return False
    prompt = str(question.get("e") or "")
    options = question.get("o") or {}
    answer = str(options.get(str(question.get("c") or "")) or "").strip()
    full_question = " ".join(
        [prompt, *(str(options.get(key) or "") for key in "abcd")]
    )
    if NEGATIVE_STEM.search(fold(prompt)):
        return False
    if BAD_TEXT.search(full_question):
        return False
    if SOURCE_ARTIFACT.search(prompt):
        return False
    if UPPER_ARTIFACT.search(full_question):
        return False
    if len(OCR_FRAGMENT.findall(prompt)) >= 2:
        return False
    if len(OCR_SINGLE.findall(prompt)) >= 3:
        return False
    if OCR_FRAGMENT.search(answer):
        return False
    if not 4 <= len(answer) <= 260:
        return False
    if not 1 <= len(answer.split()) <= 35:
        return False
    option_values = [fold(str(options.get(key) or "")) for key in "abcd"]
    if len(set(option_values)) != 4:
        return False
    return True


def justification(prompt: str, answer: str, document: str) -> str:
    answer = answer.strip().rstrip(" .;:")
    normalized_prompt = fold(prompt)
    if re.search(r"\b(como se denomina|se llama|recibe el nombre|que concepto|que teoria|que modelo)\b", normalized_prompt):
        return (
            f"El concepto descrito en el enunciado corresponde a «{answer}». "
            f"La definición y los rasgos señalados coinciden con los recogidos en {document}."
        )
    if re.search(r"\b(quien|autor|autora)\b", normalized_prompt):
        return (
            f"La asociación correcta es «{answer}»: el manual atribuye a esta persona o propuesta "
            f"el concepto planteado en el enunciado ({document})."
        )
    if re.search(r"\b(cuant|edad|duracion|frecuencia|porcentaje|numero)\b", normalized_prompt):
        return (
            f"El dato correcto es «{answer}». Ese valor o intervalo es el que recoge {document} "
            "para el criterio preguntado."
        )
    if len(answer.split()) >= 9:
        statement = answer[0].lower() + answer[1:] if answer else answer
        return (
            f"La alternativa es correcta porque {statement}. Esta formulación coincide con la "
            f"descripción recogida en {document}."
        )
    return (
        f"La alternativa «{answer}» coincide con la definición, característica o relación que "
        f"{document} atribuye al concepto preguntado."
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bank-dir", required=True)
    parser.add_argument("--database", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument(
        "--subjects",
        help="Asignaturas separadas por |. Si se omite, usa todas las admitidas.",
    )
    parser.add_argument("--status", default="VALIDADA_ORIGINAL")
    parser.add_argument(
        "--include-review",
        action="store_true",
        help="Incluye preguntas con explicación provisional y estado REVISAR.",
    )
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    selected_subjects = (
        {value.strip() for value in args.subjects.split("|") if value.strip()}
        if args.subjects
        else TARGET_SUBJECTS
    )

    connection = sqlite3.connect(args.database)
    connection.row_factory = sqlite3.Row
    bank_dir = Path(args.bank_dir)
    validations: list[dict[str, object]] = []
    counts: Counter[str] = Counter()
    subject_counts: dict[str, Counter[str]] = defaultdict(Counter)
    files_changed = 0

    for path in sorted(bank_dir.glob("*.json")):
        if path.name == "manifest.json":
            continue
        questions = json.loads(path.read_text(encoding="utf-8"))
        changed = False
        for question in questions:
            subject = str(question.get("s") or "")
            if subject not in selected_subjects:
                continue
            counts["target_questions"] += 1
            subject_counts[subject]["target_questions"] += 1
            if not eligible(question, include_review=args.include_review):
                counts["not_eligible"] += 1
                subject_counts[subject]["not_eligible"] += 1
                continue

            prompt = str(question.get("e") or "")
            options = question.get("o") or {}
            answer = str(options.get(str(question.get("c") or "")) or "").strip()
            prompt_words = words(prompt)
            answer_words = words(answer)
            query_words = list(
                dict.fromkeys(
                    sorted(answer_words, key=len, reverse=True)[:5]
                    + sorted(prompt_words, key=len, reverse=True)[:9]
                )
            )
            if not query_words:
                continue
            match_query = " OR ".join(f'"{value}"' for value in query_words)
            rows = connection.execute(
                """
                SELECT d.title, d.url, s.section_number, s.text,
                       bm25(section_fts) AS rank
                FROM section_fts
                JOIN sections s ON s.id = section_fts.rowid
                JOIN documents d ON d.id = s.document_id
                WHERE section_fts MATCH ? AND d.subject = ? AND d.text_chars > 1000
                ORDER BY rank
                LIMIT 14
                """,
                (match_query, subject),
            ).fetchall()
            prompt_set = set(prompt_words)
            answer_set = set(answer_words)
            exact_answer = fold(answer).strip(" .;,:-")
            candidates: list[dict[str, object]] = []
            for row in rows:
                chunk, prompt_hits, answer_fraction, exact, score = best_window(
                    str(row["text"]), prompt_set, answer_set, exact_answer
                )
                excerpt, evidence_prompt_hits = evidence_excerpt(
                    chunk, prompt_set, exact_answer
                )
                candidates.append(
                    {
                        "document": str(row["title"]),
                        "url": str(row["url"]),
                        "section": int(row["section_number"]),
                        "prompt_hits": prompt_hits,
                        "answer_fraction": round(answer_fraction, 3),
                        "exact_answer": exact,
                        "score": round(score, 3),
                        "evidence_prompt_hits": evidence_prompt_hits,
                        "evidence_preview": excerpt,
                    }
                )
            candidates.sort(
                key=lambda value: (
                    bool(value["exact_answer"]),
                    float(value["answer_fraction"]),
                    int(value["prompt_hits"]),
                    float(value["score"]),
                ),
                reverse=True,
            )
            if not candidates:
                counts["no_match"] += 1
                subject_counts[subject]["no_match"] += 1
                continue
            best = candidates[0]
            token_count = len(answer_words)
            strong = (
                bool(best["exact_answer"])
                and len(exact_answer) >= 8
                and token_count >= 1
                and int(best["prompt_hits"]) >= 4
                and int(best["evidence_prompt_hits"]) >= 3
            )
            if not strong:
                counts["insufficient_evidence"] += 1
                subject_counts[subject]["insufficient_evidence"] += 1
                continue

            explanation = justification(prompt, answer, str(best["document"]))
            reference = (
                f"{best['document']} (manual original del Fondo Común de Drive, sección "
                f"{best['section']} del texto indexado)."
            )
            validations.append(
                {
                    "id": question.get("id"),
                    "subject": subject,
                    "prompt": prompt,
                    "answer": answer,
                    "justification": explanation,
                    "reference": reference,
                    "source_url": best["url"],
                    "section": best["section"],
                    "prompt_hits": best["prompt_hits"],
                    "answer_fraction": best["answer_fraction"],
                    "exact_answer": best["exact_answer"],
                    "evidence_prompt_hits": best["evidence_prompt_hits"],
                    "evidence_preview": best["evidence_preview"],
                    "status": args.status,
                }
            )
            counts["validated"] += 1
            subject_counts[subject]["validated"] += 1
            if args.write:
                question["x"] = explanation
                question["r"] = reference
                question["v"] = args.status
                changed = True

        if changed:
            files_changed += 1
            path.write_text(
                json.dumps(questions, ensure_ascii=False, separators=(",", ":")),
                encoding="utf-8",
            )

    connection.close()
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as stream:
        for row in validations:
            stream.write(json.dumps(row, ensure_ascii=False) + "\n")
    summary = {
        "mode": "write" if args.write else "dry-run",
        "files_changed": files_changed,
        "counts": dict(counts),
        "subjects": {
            subject: dict(values)
            for subject, values in sorted(subject_counts.items())
        },
    }
    Path(args.summary).write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
