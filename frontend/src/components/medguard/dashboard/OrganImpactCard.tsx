import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import type { Organ } from "@/components/medguard/dashboard/types";

export default function OrganImpactCard({
  organ,
  onPickOrgan,
}: {
  organ: Array<{ organ: Organ; count: number }>;
  onPickOrgan: (o: Organ) => void;
}) {
  const max = useMemo(() => Math.max(0, ...organ.map((o) => o.count)), [organ]);
  const top = useMemo(() => organ.find((o) => o.count === max)?.organ, [organ, max]);

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg">Organ Impact Visualization</CardTitle>
          <CardDescription>Click a bar to filter • Most affected organ is highlighted</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {top ? <Badge variant="outline">Hotspot: {top}</Badge> : <Badge variant="outline">No organ flags</Badge>}
        </div>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={organ}
            margin={{ left: 8, right: 8 }}
            onClick={(state: any) => {
              const label = state?.activeLabel as Organ | undefined;
              if (label) onPickOrgan(label);
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="organ" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="count" radius={[10, 10, 0, 0]}>
              {organ.map((o) => {
                const isTop = !!top && o.organ === top && o.count > 0;
                return (
                  <Cell
                    key={o.organ}
                    fill={isTop ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                    opacity={isTop ? 1 : 0.75}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
