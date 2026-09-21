import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Organ, PredictionRow } from "@/components/medguard/dashboard/types";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function organScore(row: PredictionRow, organ: Organ): number {
  // Demo-only organ scoring: anchored to overall toxicity + boosted if organ is flagged.
  const base = clamp(row.score * 0.55, 0, 100);
  const boosted = row.organs.includes(organ) ? clamp(base + 25 + row.drugs.length * 2, 0, 100) : clamp(base * 0.35, 0, 100);
  return Math.round(boosted);
}

export default function PersonalizedPatientRiskProfileCard({ row }: { row?: PredictionRow }) {
  const profile = useMemo(() => {
    if (!row) return null;

    const safety = clamp(100 - row.score + (row.risk === "Low" ? 6 : row.risk === "Critical" ? -6 : 0), 0, 100);
    const organs: Organ[] = ["Liver", "Kidney", "Heart", "Brain"];

    return {
      safety: Math.round(safety),
      organs: organs.map((o) => ({ organ: o, score: organScore(row, o) })),
      insight:
        row.organs.includes("Liver") && row.drugs.length >= 3
          ? "Patient shows elevated liver interaction risk driven by multiple metabolized drugs (demo)."
          : row.drugs.length >= 5
            ? "High polypharmacy complexity increases interaction surface area (demo)."
            : "Risk profile derived from toxicity score + organ flags (demo).",
    };
  }, [row]);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">Personalized AI Patient Risk Profile</CardTitle>
          <CardDescription>Patient safety score + organ-specific risk (demo, not medical advice)</CardDescription>
        </div>
        {row ? (
          <Badge variant="outline">Safety Score: {profile?.safety}/100</Badge>
        ) : (
          <Badge variant="outline">Select a patient</Badge>
        )}
      </CardHeader>

      <CardContent>
        {!row || !profile ? (
          <p className="text-sm text-muted-foreground">Pick a prediction row to generate a patient risk profile.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs text-muted-foreground">AI insight</p>
              <p className="mt-1 text-sm font-semibold">{profile.insight}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {profile.organs.map((o) => (
                <div key={o.organ} className="rounded-2xl border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{o.organ}</p>
                    <p className="text-xs text-muted-foreground">{o.score}%</p>
                  </div>
                  <Progress className="mt-2" value={o.score} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
