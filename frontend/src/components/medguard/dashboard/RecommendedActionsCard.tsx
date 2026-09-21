import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { buildPatientSummary, getTriageTags, primaryOrgan } from "@/components/medguard/dashboard/triage";
import { Copy, Info } from "lucide-react";

function recommendedActions(row: PredictionRow) {
  const tags = getTriageTags(row);
  const primary = primaryOrgan(row);

  const actions: string[] = [];
  if (row.risk === "Critical") actions.push("Escalate for immediate clinical review");
  if (row.risk === "High") actions.push("Prioritize same-shift review and monitoring plan");
  if (tags.includes("Anticoagulant")) actions.push("Check bleeding-risk modifiers and interacting co-meds");
  if (tags.includes("QT-risk")) actions.push("Review QT-risk stack; consider ECG/labs per protocol");
  if (primary) actions.push(`Focus review on ${primary} risk pathway and related labs`);
  if (row.drugs.length >= 5) actions.push("Rationalize regimen: duplicate therapy + deprescribing candidates");

  // Always ensure at least one action.
  if (!actions.length) actions.push("Confirm indication, dose, and monitoring plan");

  return actions.slice(0, 5);
}

export default function RecommendedActionsCard({ row }: { row?: PredictionRow }) {
  const content = useMemo(() => {
    if (!row) return null;
    return {
      tags: getTriageTags(row),
      actions: recommendedActions(row),
      summary: buildPatientSummary(row),
    };
  }, [row]);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
          <CardDescription>Demo-only guidance for clinical triage (not medical advice)</CardDescription>
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={!content}
          onClick={async () => {
            if (!content) return;
            await navigator.clipboard.writeText(content.summary);
          }}
        >
          <Copy className="h-4 w-4" /> Copy summary
        </Button>
      </CardHeader>

      <CardContent>
        {!content ? (
          <div className="rounded-2xl border bg-background p-4">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Select a patient</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Click a row in “Recent Predictions” or “Triage Queue” to generate a patient-specific action list.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="rounded-2xl border bg-background p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={row?.risk === "Critical" ? "destructive" : row?.risk === "High" ? "secondary" : "outline"}>
                  {row?.risk}
                </Badge>
                <Badge variant="outline">Toxicity {row?.score}</Badge>
                <Badge variant="outline">{row?.patient}</Badge>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{row?.drugs.join(" + ")}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {content.tags.length ? (
                  content.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-[11px]">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Suggested actions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {content.actions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                This list is generated from the demo model’s risk labels + simple tagging rules, and should be validated against local
                clinical protocols.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
