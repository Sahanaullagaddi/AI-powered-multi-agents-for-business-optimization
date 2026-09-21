import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskLevel } from "@/components/medguard/dashboard/types";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { riskColors } from "@/components/medguard/dashboard/mockData";

export default function RiskDistributionCard({
  dist,
  onPickRisk,
}: {
  dist: Array<{ name: RiskLevel; value: number }>;
  onPickRisk: (risk: RiskLevel) => void;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Risk Distribution</CardTitle>
        <CardDescription>Click a slice to filter the table</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dist}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              onClick={(d) => onPickRisk((d as any).name as RiskLevel)}
            >
              {dist.map((entry) => (
                <Cell key={entry.name} fill={riskColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
