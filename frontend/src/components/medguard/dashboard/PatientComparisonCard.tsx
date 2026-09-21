import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import type { PredictionRow } from "@/components/medguard/dashboard/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PatientComparisonCard({ rows }: { rows: PredictionRow[] }) {
  const [patient1, setPatient1] = useState<string>("");
  const [patient2, setPatient2] = useState<string>("");

  const patients = useMemo(() => {
    const unique = new Set(rows.map(r => r.patient));
    return Array.from(unique).sort();
  }, [rows]);

  const comparison = useMemo(() => {
    if (!patient1 || !patient2) return null;

    const p1Data = rows.filter(r => r.patient === patient1);
    const p2Data = rows.filter(r => r.patient === patient2);

    if (!p1Data.length || !p2Data.length) return null;

    const p1Latest = p1Data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const p2Latest = p2Data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return { p1: p1Latest, p2: p2Latest };
  }, [patient1, patient2, rows]);

  const chartData = useMemo(() => {
    if (!comparison) return [];
    return [
      {
        name: "Risk Score",
        [comparison.p1.patient]: comparison.p1.score,
        [comparison.p2.patient]: comparison.p2.score,
      },
      {
        name: "Drug Count",
        [comparison.p1.patient]: comparison.p1.drugs.length,
        [comparison.p2.patient]: comparison.p2.drugs.length,
      },
      {
        name: "Organ Impact",
        [comparison.p1.patient]: comparison.p1.organs.length,
        [comparison.p2.patient]: comparison.p2.organs.length,
      },
    ];
  }, [comparison]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg">Patient Comparison</CardTitle>
        <CardDescription>Compare risk profiles between two patients</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Patient 1</label>
            <Select value={patient1} onValueChange={setPatient1}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Patient 2</label>
            <Select value={patient2} onValueChange={setPatient2}>
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {comparison ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">{comparison.p1.patient}</h4>
                <Badge variant={comparison.p1.risk === "Critical" ? "destructive" : "outline"}>
                  {comparison.p1.risk}
                </Badge>
                <Progress value={comparison.p1.score} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Score: {comparison.p1.score}/100
                </p>
                <p className="text-sm">Drugs: {comparison.p1.drugs.join(", ")}</p>
                <p className="text-sm">Organs: {comparison.p1.organs.join(", ")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">{comparison.p2.patient}</h4>
                <Badge variant={comparison.p2.risk === "Critical" ? "destructive" : "outline"}>
                  {comparison.p2.risk}
                </Badge>
                <Progress value={comparison.p2.score} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Score: {comparison.p2.score}/100
                </p>
                <p className="text-sm">Drugs: {comparison.p2.drugs.join(", ")}</p>
                <p className="text-sm">Organs: {comparison.p2.organs.join(", ")}</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={comparison.p1.patient} fill="#8884d8" />
                  <Bar dataKey={comparison.p2.patient} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select two patients to compare their profiles.</p>
        )}
      </CardContent>
    </Card>
  );
}