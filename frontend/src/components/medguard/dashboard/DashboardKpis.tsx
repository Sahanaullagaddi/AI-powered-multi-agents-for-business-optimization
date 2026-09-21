import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardKpis({
  total,
  highRisk,
}: {
  total: number;
  highRisk: number;
}) {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Total Predictions</CardTitle>
          <CardDescription>In current filter</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl font-extrabold">{total}</p>
        </CardContent>
      </Card>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">High‑Risk Combinations</CardTitle>
          <CardDescription>High + Critical</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl font-extrabold text-destructive">{highRisk}</p>
        </CardContent>
      </Card>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Most Common Drug</CardTitle>
          <CardDescription>Across filter (mock)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Warfarin</p>
          <p className="text-xs text-muted-foreground">Appears frequently in demo set</p>
        </CardContent>
      </Card>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">Model Version</CardTitle>
          <CardDescription>Demo</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-display text-3xl font-extrabold">v0.9</p>
        </CardContent>
      </Card>
    </section>
  );
}
