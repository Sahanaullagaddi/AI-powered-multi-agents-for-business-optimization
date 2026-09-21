import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

function dayLabel(date: string) {
  // Works with mock labels like "Today 10:14", "Mon 09:31", etc.
  const first = date.trim().split(" ")[0];
  if (!first) return "Day";
  return first === "Today" ? "Today" : first;
}

export default function TrendsPanelCard({ rows }: { rows: PredictionRow[] }) {
  const data = useMemo(() => {
    const byDay = new Map<string, { day: string; high: number; critical: number }>();
    for (const r of rows) {
      const d = dayLabel(r.date);
      if (!byDay.has(d)) byDay.set(d, { day: d, high: 0, critical: 0 });
      const item = byDay.get(d)!;
      if (r.risk === "High") item.high += 1;
      if (r.risk === "Critical") item.critical += 1;
    }

    // Stable order for common labels.
    const order = ["Today", "Yesterday", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return Array.from(byDay.values()).sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));
  }, [rows]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Trends Panel</CardTitle>
        <CardDescription>Research-style trend of high/critical signals over time (demo aggregation)</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} interval={0} />
              <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="high" stackId="a" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="critical" stackId="a" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
