import type { PredictionRow, RiskLevel } from "@/components/medguard/dashboard/types";

export const riskColors: Record<RiskLevel, string> = {
  Low: "hsl(var(--primary) / 0.55)",
  Moderate: "hsl(var(--primary) / 0.75)",
  High: "hsl(var(--accent))",
  Critical: "hsl(var(--destructive))",
};

export const mockRows: PredictionRow[] = [
  {
    patient: "PT-1042",
    drugs: ["Warfarin", "Amiodarone", "Omeprazole"],
    risk: "High",
    score: 74,
    organs: ["Heart", "Liver"],
    date: "Today 10:14",
  },
  {
    patient: "PT-1108",
    drugs: ["Metformin", "Lisinopril", "Ibuprofen"],
    risk: "Moderate",
    score: 48,
    organs: ["Kidney"],
    date: "Yesterday 16:02",
  },
  {
    patient: "PT-0987",
    drugs: ["Digoxin", "Furosemide", "Ibuprofen", "Amiodarone"],
    risk: "Critical",
    score: 91,
    organs: ["Kidney", "Heart"],
    date: "Mon 09:31",
  },
  {
    patient: "PT-0774",
    drugs: ["Atorvastatin", "Clopidogrel", "Omeprazole"],
    risk: "Low",
    score: 22,
    organs: [],
    date: "Sun 11:03",
  },
  {
    patient: "PT-1321",
    drugs: ["Warfarin", "Clopidogrel", "Atorvastatin", "Omeprazole"],
    risk: "High",
    score: 79,
    organs: ["Liver", "Heart"],
    date: "Sat 14:22",
  },
  {
    patient: "PT-1406",
    drugs: ["Metformin", "Lisinopril", "Furosemide"],
    risk: "Moderate",
    score: 53,
    organs: ["Kidney"],
    date: "Fri 08:10",
  },
];
