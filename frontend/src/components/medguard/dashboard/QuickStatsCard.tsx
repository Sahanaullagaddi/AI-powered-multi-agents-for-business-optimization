import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

export default function QuickStatsCard({ rows }: { rows: PredictionRow[] }) {
  const stats = {
    total: rows.length,
    critical: rows.filter(r => r.risk === "Critical").length,
    high: rows.filter(r => r.risk === "High").length,
    low: rows.filter(r => r.risk === "Low").length,
    avgScore: rows.length ? Math.round(rows.reduce((sum, r) => sum + r.score, 0) / rows.length) : 0,
    mostCommonDrug: (() => {
      const drugCounts = new Map<string, number>();
      rows.forEach(r => r.drugs.forEach(d => drugCounts.set(d, (drugCounts.get(d) || 0) + 1)));
      return Array.from(drugCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    })(),
  };

  const riskTrend = stats.critical > 5 ? "high" : stats.critical > 2 ? "medium" : "low";

  return (
    <Card className="shadow-card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Quick Stats
        </CardTitle>
        <CardDescription>Real-time overview of current filter results</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Cases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
              {stats.critical}
              {riskTrend === "high" && <AlertTriangle className="h-4 w-4" />}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.avgScore}</div>
            <div className="text-sm text-muted-foreground">Avg Risk Score</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{stats.mostCommonDrug}</div>
            <div className="text-sm text-muted-foreground">Top Drug</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Low: {stats.low}
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Moderate: {rows.filter(r => r.risk === "Moderate").length}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            High: {stats.high}
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical: {stats.critical}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}