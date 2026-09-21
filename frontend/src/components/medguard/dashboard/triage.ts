import type { Organ, PredictionRow } from "@/components/medguard/dashboard/types";

export type TriageTag =
  | "Renal"
  | "Hepatic"
  | "Anticoagulant"
  | "QT-risk"
  | "CNS"
  | "Polypharmacy";

function hasAnyDrug(row: PredictionRow, names: string[]) {
  const set = new Set(row.drugs.map((d) => d.toLowerCase()));
  return names.some((n) => set.has(n.toLowerCase()));
}

function includesAnyDrugSubstring(row: PredictionRow, parts: string[]) {
  const s = row.drugs.join(" ").toLowerCase();
  return parts.some((p) => s.includes(p.toLowerCase()));
}

export function getTriageTags(row: PredictionRow): TriageTag[] {
  const tags = new Set<TriageTag>();

  if (row.organs.includes("Kidney")) tags.add("Renal");
  if (row.organs.includes("Liver")) tags.add("Hepatic");
  if (row.organs.includes("Brain")) tags.add("CNS");
  if (row.drugs.length >= 5) tags.add("Polypharmacy");

  // Demo heuristics (string-based) — not clinical logic.
  if (
    hasAnyDrug(row, ["Warfarin", "Apixaban", "Rivaroxaban", "Dabigatran", "Heparin"]) ||
    includesAnyDrugSubstring(row, ["-xaban", "warfarin"])
  ) {
    tags.add("Anticoagulant");
  }

  // Common QT-risk demo list (string-based).
  if (hasAnyDrug(row, ["Azithromycin", "Citalopram", "Escitalopram", "Amiodarone", "Haloperidol"])) {
    tags.add("QT-risk");
  }

  return Array.from(tags);
}

export function riskWeight(risk: PredictionRow["risk"]) {
  return risk === "Critical" ? 4 : risk === "High" ? 3 : risk === "Moderate" ? 2 : 1;
}

export function buildPatientSummary(row: PredictionRow) {
  const tags = getTriageTags(row);
  const organLine = row.organs.length ? row.organs.join(", ") : "None flagged";

  return [
    `Patient: ${row.patient}`,
    `Date: ${row.date}`,
    `Risk: ${row.risk} (Toxicity ${row.score})`,
    `Drugs: ${row.drugs.join(" + ")}`,
    `Organs: ${organLine}`,
    `Triage tags (demo): ${tags.length ? tags.join(", ") : "—"}`,
    "Note: Demo-only summary; not medical advice.",
  ].join("\n");
}

export function primaryOrgan(row: PredictionRow): Organ | undefined {
  return row.organs[0];
}
