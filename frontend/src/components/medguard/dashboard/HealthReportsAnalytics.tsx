import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, Target, Activity } from "lucide-react";

export default function HealthReportsAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data for charts
  const adherenceData = [
    { date: '2024-03-01', adherence: 95 },
    { date: '2024-03-02', adherence: 100 },
    { date: '2024-03-03', adherence: 90 },
    { date: '2024-03-04', adherence: 85 },
    { date: '2024-03-05', adherence: 100 },
    { date: '2024-03-06', adherence: 95 },
    { date: '2024-03-07', adherence: 100 },
  ];

  const riskTrendData = [
    { month: 'Jan', low: 5, moderate: 3, high: 1, critical: 0 },
    { month: 'Feb', low: 7, moderate: 4, high: 2, critical: 0 },
    { month: 'Mar', low: 8, moderate: 3, high: 1, critical: 1 },
  ];

  const organRiskData = [
    { name: 'Heart', value: 35, color: '#ef4444' },
    { name: 'Liver', value: 25, color: '#f97316' },
    { name: 'Kidney', value: 20, color: '#eab308' },
    { name: 'Brain', value: 15, color: '#22c55e' },
    { name: 'Other', value: 5, color: '#3b82f6' },
  ];

  const healthMetrics = {
    overallAdherence: 92,
    totalInteractions: 45,
    highRiskAlerts: 3,
    healthScore: 78
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.overallAdherence}%</div>
            <Progress value={healthMetrics.overallAdherence} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.totalInteractions}</div>
            <p className="text-xs text-muted-foreground">
              Analyzed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Alerts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{healthMetrics.highRiskAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.healthScore}/100</div>
            <Progress value={healthMetrics.healthScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Good condition
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics Overview</CardTitle>
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Medication Adherence Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence Trend</CardTitle>
            <CardDescription>Daily adherence percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="adherence"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Monthly breakdown of interaction risks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="low" stackId="a" fill="#22c55e" />
                <Bar dataKey="moderate" stackId="a" fill="#eab308" />
                <Bar dataKey="high" stackId="a" fill="#f97316" />
                <Bar dataKey="critical" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Organ Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Organ Risk Distribution</CardTitle>
            <CardDescription>Most affected organs in interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={organRiskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {organRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Health Improvement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Health Improvement Trends</CardTitle>
            <CardDescription>Key health metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Blood Pressure Control</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Cholesterol Management</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Medication Compliance</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Health Score</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <CardDescription>Download your health analytics and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Adherence Report
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Risk Analysis
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Monthly Summary
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4 mr-2" />
              Health Score Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}