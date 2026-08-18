from __future__ import annotations

import argparse
import json
import re
import sqlite3
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path


STOPWORDS = {
    "acerca", "afirmacion", "afirmaciones", "alternativa", "cual", "cuando", "donde",
    "entre", "incorrecta", "correcta", "indica", "indique", "opcion", "opciones", "pregunta",
    "respuesta", "segun", "senala", "senale", "siguiente", "siguientes", "sobre", "tiene",
    "todos", "todas", "trastorno", "trastornos", "persona", "personas", "paciente", "puede",
    "debe", "forma", "parte", "relacion", "respecto", "caracteristicas", "sido", "esta", "este",
    "estos", "estas", "como", "para", "desde", "hasta", "porque", "pero", "solo", "cada",
    "otro", "otra", "otros", "otras", "menos", "mayor", "menor", "verdadero", "falso",
}

ROUTES = {
    "Evaluación Psicológica": (
        "evaluacion", "ballesteros", "fonseca evaluacion", "manual para la evaluacion",
        "inteligencia", "dsm", "cie 11", "belloch", "caballo", "vallejo",
    ),
    "Psicología Clínica": (),
    "Tratamientos Adultos": (
        "caballo 2024", "manual para la evaluacion", "belloch", "vallejo", "dsm", "cie 11",
        "raich", "suicida", "sueno", "conducta alimentaria",
    ),
    "Tratamientos Infantiles": (
        "caballo 2024", "manual para la evaluacion", "belloch", "vallejo", "dsm", "cie 11",
        "fonseca", "raich", "suicida", "sueno", "conducta alimentaria",
    ),
    "Psicoterapias": (
        "caballo 2024", "manual para la evaluacion", "belloch", "vallejo", "raich", "suicida",
    ),
    "Psicología Experimental": ("evaluacion", "ballesteros"),
}


def fold(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = value.casefold()
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def word_list(value: str) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for token in re.findall(r"[a-záéíóúñü]{5,}", fold(value)):
        if token in STOPWORDS or token in seen:
            continue
        seen.add(token)
        result.append(token)
    return result


def route_document_ids(connection: sqlite3.Connection, subject: str) -> list[int]:
    rows = connection.execute("SELECT id, title FROM documents WHERE text_chars > 0").fetchall()
    if subject == "Psicología Clínica":
        return [int(row[0]) for row in rows]
    route_terms = ROUTES.get(subject)
    if route_terms is None:
        return []
    selected = []
    for document_id, title in rows:
        normalized = fold(str(title))
        if any(term in normalized for term in route_terms):
            selected.append(int(document_id))
    return selected


def chunks(text: str) -> list[str]:
    values = re.split(r"(?<=[.!?;:])\s+|\n+", text)
    return [value.strip() for value in values if 25 <= len(value.strip()) <= 900]


def best_snippet(page_text: str, prompt_tokens: set[str], correct_tokens: set[str]) -> tuple[str, float, int, float]:
    best_value = ""
    best_score = -1.0
    best_prompt_hits = 0
    best_correct_fraction = 0.0
    for value in chunks(page_text):
        sentence_tokens = set(word_list(value))
        prompt_hits = len(prompt_tokens & sentence_tokens)
        correct_hits = len(correct_tokens & sentence_tokens)
        correct_fraction = correct_hits / max(1, len(correct_tokens))
        score = correct_hits * 4.0 + prompt_hits * 1.4 + correct_fraction * 3.0
        if score > best_score:
            best_value = value
            best_score = score
            best_prompt_hits = prompt_hits
            best_correct_fraction = correct_fraction
    return best_value[:900], best_score, best_prompt_hits, best_correct_fraction


def confidence(correct_option: str, snippet: str, prompt_hits: int, correct_fraction: float) -> str:
    exact = fold(correct_option).strip(" .;,:-")
    snippet_folded = fold(snippet)
    correct_token_count = len(word_list(correct_option))
    if exact and len(exact) >= 8 and exact in snippet_folded and prompt_hits >= 1:
        return "high"
    if correct_token_count >= 2 and correct_fraction >= 0.8 and prompt_hits >= 2:
        return "high"
    if correct_token_count == 1 and correct_fraction == 1.0 and prompt_hits >= 3:
        return "high"
    if correct_fraction >= 0.5 and prompt_hits >= 1:
        return "medium"
    if prompt_hits >= 2:
        return "low"
    return "none"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--audit", required=True)
    parser.add_argument("--database", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--shards", type=int, default=1)
    parser.add_argument("--shard-index", type=int, default=0)
    args = parser.parse_args()

    if args.shards < 1 or not 0 <= args.shard_index < args.shards:
        parser.error("--shard-index must be between 0 and --shards - 1")

    connection = sqlite3.connect(args.database)
    connection.row_factory = sqlite3.Row
    subjects = {subject: route_document_ids(connection, subject) for subject in set(ROUTES) | {"Psicología Clínica"}}
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    confidence_counts = Counter()
    subject_counts: dict[str, Counter[str]] = defaultdict(Counter)
    total = 0

    with Path(args.audit).open(encoding="utf-8") as source, output_path.open("w", encoding="utf-8") as target:
        for line_number, line in enumerate(source):
            if line_number % args.shards != args.shard_index:
                continue
            audit = json.loads(line)
            total += 1
            subject = str(audit.get("subject") or "")
            document_ids = subjects.get(subject, [])
            if not document_ids:
                result = {"id": audit.get("id"), "subject": subject, "confidence": "no_coverage", "candidates": []}
                confidence_counts["no_coverage"] += 1
                subject_counts[subject]["no_coverage"] += 1
                target.write(json.dumps(result, ensure_ascii=False) + "\n")
                continue

            prompt = str(audit.get("prompt") or "")
            correct_option = str(audit.get("correct_option") or "")
            correct_words = word_list(correct_option)
            prompt_words = word_list(prompt)
            query_words = (sorted(correct_words, key=len, reverse=True)[:4] + sorted(prompt_words, key=len, reverse=True)[:8])
            query_words = list(dict.fromkeys(query_words))
            if not query_words:
                result = {"id": audit.get("id"), "subject": subject, "confidence": "none", "candidates": []}
                confidence_counts["none"] += 1
                subject_counts[subject]["none"] += 1
                target.write(json.dumps(result, ensure_ascii=False) + "\n")
                continue

            match_query = " OR ".join(f'"{word}"' for word in query_words)
            placeholders = ",".join("?" for _ in document_ids)
            sql = f"""
                SELECT d.title, d.path, p.page_number, p.text, bm25(page_fts) AS rank
                FROM page_fts
                JOIN pages p ON p.id = page_fts.rowid
                JOIN documents d ON d.id = p.document_id
                WHERE page_fts MATCH ? AND d.id IN ({placeholders})
                ORDER BY rank
                LIMIT 12
            """
            rows = connection.execute(sql, [match_query, *document_ids]).fetchall()
            prompt_set = set(prompt_words)
            correct_set = set(correct_words)
            candidates = []
            for row in rows:
                snippet, score, prompt_hits, correct_fraction = best_snippet(
                    str(row["text"]), prompt_set, correct_set
                )
                level = confidence(correct_option, snippet, prompt_hits, correct_fraction)
                candidates.append(
                    {
                        "document": row["title"],
                        "path": row["path"],
                        "page": row["page_number"],
                        "confidence": level,
                        "score": round(score, 3),
                        "prompt_hits": prompt_hits,
                        "correct_fraction": round(correct_fraction, 3),
                        "snippet": snippet,
                    }
                )
            order = {"high": 4, "medium": 3, "low": 2, "none": 1}
            candidates.sort(key=lambda item: (order[item["confidence"]], item["score"]), reverse=True)
            best_level = candidates[0]["confidence"] if candidates else "none"
            result = {
                "id": audit.get("id"),
                "subject": subject,
                "confidence": best_level,
                "candidates": candidates[:3],
            }
            confidence_counts[best_level] += 1
            subject_counts[subject][best_level] += 1
            target.write(json.dumps(result, ensure_ascii=False) + "\n")
            if total % 1000 == 0:
                print(f"matched {total}", flush=True)

    connection.close()
    summary = {
        "total_questions": total,
        "shards": args.shards,
        "shard_index": args.shard_index,
        "confidence_counts": dict(confidence_counts),
        "subjects": {subject: dict(counts) for subject, counts in sorted(subject_counts.items())},
    }
    Path(args.summary).write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
