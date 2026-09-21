import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { getTriageTags } from "@/components/medguard/dashboard/triage";
import { toast } from "sonner";

function suggestedPlan(row: PredictionRow) {
  const tags = getTriageTags(row);
  const primary = row.drugs[0];

  const suggestions: string[] = [];
  if (tags.includes("QT-risk")) suggestions.push("Avoid stacking QT-risk agents; consider a non-QT alternative (demo). ");
  if (tags.includes("Renal")) suggestions.push("Renal flag: consider dose adjustment + monitoring plan (demo). ");
  if (tags.includes("Hepatic")) suggestions.push("Hepatic flag: reduce CYP load; consider non-hepatic option (demo). ");
  if (tags.includes("Anticoagulant")) suggestions.push("Bleeding risk: review anticoagulant duplication + INR/anti-Xa strategy (demo). ");
  if (tags.includes("Polypharmacy")) suggestions.push("De-prescribe where possible; stagger administration times (demo). ");

  if (!suggestions.length) suggestions.push("No dominant flags detected; consider standard interaction check + routine monitoring (demo). ");

  const replaceTarget = row.drugs.find((d) => d.toLowerCase().includes("amiodarone")) ?? primary;
  const safer = row.drugs.map((d) => (d === replaceTarget ? `${d} (alternative: demo)` : d));

  return {
    tags,
    replaceTarget,
    safer,
    notes: suggestions,
    currentRisk: row.risk,
    suggestedRisk: row.risk === "Critical" ? "High" : row.risk === "High" ? "Moderate" : "Low",
  };
}

export default function AiPrescriptionOptimizationSuggestionCard({ row }: { row?: PredictionRow }) {
  const plan = useMemo(() => (row ? suggestedPlan(row) : null), [row]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">AI Prescription Optimization Suggestion</CardTitle>
        <CardDescription>Demo-safe safer-alternative suggestions for high-risk combinations</CardDescription>
      </CardHeader>

      <CardContent>
        {!row || !plan ? (
          <p className="text-sm text-muted-foreground">Select a patient to generate optimization suggestions.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Current combination</p>
                  <Badge variant={row.risk === "Critical" ? "destructive" : row.risk === "High" ? "secondary" : "outline"}>Risk: {plan.currentRisk}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{row.drugs.join(" + ")}</p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">AI suggested safer combination</p>
                  <Badge variant="outline">Suggested risk: {plan.suggestedRisk}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.safer.join(" + ")}</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs text-muted-foreground">Suggested actions (demo)</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {plan.notes.slice(0, 4).map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="soft"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(plan.safer.join(" + "));
                    toast.success("Suggested regimen copied (demo)");
                  } catch {
                    toast.error("Could not copy to clipboard");
                  }
                }}
              >
                Copy suggested regimen
              </Button>
              <Button type="button" variant="outline" disabled>
                Apply (demo)
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Disclaimer: These are simulated recommendations for UI/demo only; confirm with authoritative references.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
