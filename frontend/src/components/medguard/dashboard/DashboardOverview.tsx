import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Pill, Clock, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react";

export default function DashboardOverview() {
  // Mock data - in real app, this would come from API/context
  const healthStatus = {
    overall: "Good",
    score: 85,
    lastCheck: "2 hours ago"
  };

  const recentChecks = [
    { drugs: ["Aspirin", "Warfarin"], risk: "High", date: "2024-03-08" },
    { drugs: ["Metformin", "Lisinopril"], risk: "Low", date: "2024-03-07" },
  ];

  const upcomingReminders = [
    { medicine: "Aspirin", time: "08:00 AM", dose: "100mg" },
    { medicine: "Metformin", time: "02:00 PM", dose: "500mg" },
  ];

  const dailyTip = "Stay hydrated! Drink at least 8 glasses of water daily to support your medication effectiveness.";

  const aiSummary = {
    totalChecks: 12,
    highRisk: 2,
    moderateRisk: 3,
    lowRisk: 7
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Health Status Overview */}
      <Card className="col-span-full lg:col-span-1">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Heart className="h-4 w-4 text-red-500" />
          <CardTitle className="text-sm font-medium ml-2">Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{healthStatus.overall}</div>
          <Progress value={healthStatus.score} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {healthStatus.lastCheck}
          </p>
        </CardContent>
      </Card>

      {/* Recent Drug Interaction Checks */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Pill className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-sm font-medium ml-2">Recent Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentChecks.slice(0, 2).map((check, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm">
                  {check.drugs.join(" + ")}
                </div>
                <Badge variant={check.risk === "High" ? "destructive" : "secondary"}>
                  {check.risk}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Medication Reminders */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Clock className="h-4 w-4 text-green-500" />
          <CardTitle className="text-sm font-medium ml-2">Today's Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingReminders.map((reminder, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{reminder.medicine}</div>
                  <div className="text-xs text-muted-foreground">{reminder.dose}</div>
                </div>
                <div className="text-sm">{reminder.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Health Tips */}
      <Card className="col-span-full lg:col-span-2">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <CardTitle className="text-sm font-medium ml-2">Daily Health Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{dailyTip}</p>
        </CardContent>
      </Card>

      {/* AI Risk Prediction Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <CardTitle className="text-sm font-medium ml-2">AI Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Checks:</span>
              <span className="font-medium">{aiSummary.totalChecks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-500">High Risk:</span>
              <span className="font-medium">{aiSummary.highRisk}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-500">Moderate:</span>
              <span className="font-medium">{aiSummary.moderateRisk}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-500">Low Risk:</span>
              <span className="font-medium">{aiSummary.lowRisk}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}