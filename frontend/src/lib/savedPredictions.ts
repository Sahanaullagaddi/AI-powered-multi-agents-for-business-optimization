import type { PredictionRow } from "@/components/medguard/dashboard/types";

const KEY = "medguard.savedPredictions.v1";
const LIMIT = 50;

function isRow(x: any): x is PredictionRow {
  return (
    x &&
    typeof x === "object" &&
    typeof x.patient === "string" &&
    Array.isArray(x.drugs) &&
    typeof x.risk === "string" &&
    typeof x.score === "number" &&
    Array.isArray(x.organs) &&
    typeof x.date === "string"
  );
}

export function readSavedPredictions(): PredictionRow[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRow).slice(0, LIMIT);
  } catch {
    return [];
  }
}

export function prependSavedPrediction(row: PredictionRow) {
  const next = [row, ...readSavedPredictions()].slice(0, LIMIT);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
