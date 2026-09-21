import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { getTriageTags, riskWeight } from "@/components/medguard/dashboard/triage";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default function TriageQueueCard({
  rows,
  selectedKey,
  onSelect,
}: {
  rows: PredictionRow[];
  selectedKey?: string;
  onSelect?: (row: PredictionRow) => void;
}) {
  const items = useMemo(() => {
    const sorted = [...rows]
      .sort((a, b) => {
        const w = riskWeight(b.risk) - riskWeight(a.risk);
        if (w !== 0) return w;
        return b.score - a.score;
      })
      .slice(0, 8);

    return sorted.map((r) => ({
      row: r,
      key: r.patient + r.date,
      tags: getTriageTags(r),
    }));
  }, [rows]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Triage Queue</CardTitle>
        <CardDescription>Prioritized review list using demo heuristics (no PHI)</CardDescription>
      </CardHeader>

      <CardContent>
        {!items.length ? (
          <p className="text-sm text-muted-foreground">No cases in the current filter.</p>
        ) : (
          <div className="grid gap-2">
            {items.map(({ row, key, tags }) => {
              const isSelected = selectedKey === key;
              const isCritical = row.risk === "Critical";
              return (
                <div
                  key={key}
                  className={
                    "rounded-2xl border p-3 transition-colors " +
                    (isSelected ? "bg-accent/10" : "bg-background")
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCritical ? <AlertTriangle className="h-4 w-4 text-destructive" /> : null}
                        <p className="text-sm font-semibold truncate">{row.patient}</p>
                        <Badge variant={isCritical ? "destructive" : row.risk === "High" ? "secondary" : "outline"}>
                          {row.risk}
                        </Badge>
                        <Badge variant="outline">Toxicity {row.score}</Badge>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground truncate">{row.drugs.join(" + ")}</p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {tags.length ? (
                          tags.slice(0, 4).map((t) => (
                            <Badge key={t} variant="outline" className="text-[11px]">
                              {t}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No tags</span>
                        )}
                      </div>
                    </div>

                    <Button size="sm" variant="outline" onClick={() => onSelect?.(row)}>
                      Review <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Tags are derived from organ flags and simple drug-name matching for demonstration only.
        </p>
      </CardContent>
    </Card>
  );
}
