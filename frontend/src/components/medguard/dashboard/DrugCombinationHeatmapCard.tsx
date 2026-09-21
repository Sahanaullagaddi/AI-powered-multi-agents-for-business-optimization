import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

type HeatCell = { a: string; b: string; value: number };

type Severity = "Low" | "Moderate" | "Critical";

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function severityFromIntensity(intensity: number): Severity {
  if (intensity >= 0.72) return "Critical";
  if (intensity >= 0.36) return "Moderate";
  return "Low";
}

function reasonForPair(a: string, b: string, severity: Severity) {
  // Demo-only explanation text; in production this would come from a knowledge graph + patient context.
  if (severity === "Critical") {
    return `High-risk interaction signature detected for ${a} + ${b}: overlapping metabolism pathways and elevated organ-toxicity flags in recent cohort cases.`;
  }
  if (severity === "Moderate") {
    return `Moderate interaction likelihood for ${a} + ${b}: co-administration patterns suggest monitoring for dose-dependent adverse effects and timing-related peaks.`;
  }
  return `Low interaction likelihood for ${a} + ${b}: limited co-occurrence signal; standard monitoring recommended.`;
}

function buildHeatmap(rows: PredictionRow[], maxDrugs = 8) {
  const all = rows.flatMap((r) => r.drugs);
  const drugs = uniq(all)
    .slice(0, maxDrugs)
    .sort((x, y) => x.localeCompare(y));

  const counts = new Map<string, number>();
  const key = (a: string, b: string) => (a < b ? `${a}||${b}` : `${b}||${a}`);

  rows.forEach((r) => {
    const present = r.drugs.filter((d) => drugs.includes(d));
    for (let i = 0; i < present.length; i++) {
      for (let j = i + 1; j < present.length; j++) {
        const k = key(present[i], present[j]);
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
  });

  const cells: HeatCell[] = [];
  for (const a of drugs) {
    for (const b of drugs) {
      if (a === b) continue;
      cells.push({ a, b, value: counts.get(key(a, b)) ?? 0 });
    }
  }

  const max = Math.max(1, ...cells.map((c) => c.value));
  return { drugs, cells, max };
}

export default function DrugCombinationHeatmapCard({ rows }: { rows: PredictionRow[] }) {
  const [limit, setLimit] = useState(8);
  const [selected, setSelected] = useState<{ a: string; b: string; v: number; severity: Severity } | null>(null);

  const { drugs, cells, max } = useMemo(() => buildHeatmap(rows, limit), [rows, limit]);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">AI Risk Heatmap (Drug Interactions)</CardTitle>
          <CardDescription>
            Hover to view interaction severity • Click a pair to read the AI interaction reason (mock)
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Pairs: {cells.filter((c) => c.value > 0).length}</Badge>
          <Button variant="outline" size="sm" onClick={() => setLimit((n) => (n === 8 ? 12 : 8))}>
            {limit === 8 ? "Show more" : "Show fewer"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!drugs.length ? (
          <p className="text-sm text-muted-foreground">Not enough data to build a heatmap.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold">Severity scale:</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(var(--mg-heat-low) / 0.55)" }} />
                  Low
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(var(--mg-heat-moderate) / 0.55)" }} />
                  Moderate
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(var(--mg-heat-critical) / 0.55)" }} />
                  Critical
                </span>
              </div>

              <div className="grid" style={{ gridTemplateColumns: `140px repeat(${drugs.length}, minmax(44px, 1fr))` }}>
                <div />
                {drugs.map((d) => (
                  <div key={d} className="px-2 pb-2 text-[11px] font-semibold text-muted-foreground">
                    {d}
                  </div>
                ))}

                {drugs.map((rowDrug) => (
                  <div key={rowDrug} className="contents">
                    <div className="pr-3 py-2 text-[11px] font-semibold text-muted-foreground">{rowDrug}</div>
                    {drugs.map((colDrug) => {
                      if (rowDrug === colDrug) {
                        return <div key={colDrug} className="h-10 border bg-muted/50" aria-hidden />;
                      }

                      const v = cells.find((c) => c.a === rowDrug && c.b === colDrug)?.value ?? 0;
                      const intensity = v / max;
                      const severity = severityFromIntensity(intensity);

                      const bgStyle =
                        v === 0
                          ? { background: "hsl(var(--background) / 0.35)" }
                          : severity === "Critical"
                            ? { background: "hsl(var(--mg-heat-critical) / 0.24)" }
                            : severity === "Moderate"
                              ? { background: "hsl(var(--mg-heat-moderate) / 0.22)" }
                              : { background: "hsl(var(--mg-heat-low) / 0.20)" };

                      const hoverRing =
                        severity === "Critical"
                          ? "ring-1 ring-destructive/40"
                          : severity === "Moderate"
                            ? "ring-1 ring-accent/35"
                            : "ring-1 ring-primary/30";

                      const title =
                        v === 0
                          ? `${rowDrug} + ${colDrug}: no cases`
                          : `${rowDrug} + ${colDrug}: ${v} cases • Severity: ${severity}`;

                      return (
                        <button
                          key={colDrug}
                          type="button"
                          onClick={() => {
                            if (!v) return;
                            setSelected({ a: rowDrug, b: colDrug, v, severity });
                          }}
                          className={
                            "group relative grid h-10 place-items-center border text-xs font-semibold text-foreground/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                            (v === 0 ? "cursor-default" : "cursor-pointer")
                          }
                          style={bgStyle}
                          title={title}
                        >
                          <span className={v === 0 ? "text-muted-foreground" : ""}>{v || ""}</span>
                          <div className={"pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 " + hoverRing} />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {selected ? (
                <div className="mt-4 rounded-2xl border bg-card/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      Interaction reason: {selected.a} + {selected.b}
                    </p>
                    <Badge
                      variant={selected.severity === "Critical" ? "destructive" : selected.severity === "Moderate" ? "secondary" : "outline"}
                    >
                      {selected.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {reasonForPair(selected.a, selected.b, selected.severity)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Signal strength: {selected.v} co-occurrence cases</p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Tip: Click a non‑zero cell to view the AI interaction reason.</p>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                Note: This demo heatmap shows co‑occurrence and a derived severity indicator; a production system would integrate pharmacology + patient context.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
