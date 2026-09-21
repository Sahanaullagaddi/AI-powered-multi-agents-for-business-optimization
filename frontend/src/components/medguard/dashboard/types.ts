export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export type Organ = "Liver" | "Kidney" | "Heart" | "Brain";

export type PredictionRow = {
  patient: string;
  drugs: string[];
  risk: RiskLevel;
  score: number;
  organs: Organ[];
  date: string;
};

