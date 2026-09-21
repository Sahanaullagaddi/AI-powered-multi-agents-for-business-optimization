import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Bell, CheckCircle, AlertCircle } from "lucide-react";

interface Reminder {
  id: string;
  medication: string;
  dosage: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  taken: boolean;
  date: string;
}

export default function MedicationReminderPlanner() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      medication: "Lisinopril",
      dosage: "10mg",
      time: "08:00",
      period: "Morning",
      taken: false,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: "2",
      medication: "Aspirin",
      dosage: "81mg",
      time: "08:00",
      period: "Morning",
      taken: true,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: "3",
      medication: "Metformin",
      dosage: "500mg",
      time: "14:00",
      period: "Afternoon",
      taken: false,
      date: new Date().toISOString().split('T')[0]
    }
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');

  const periods = ['Morning', 'Afternoon', 'Evening', 'Night'] as const;

  const filteredReminders = reminders.filter(r => r.period === selectedPeriod && r.date === new Date().toISOString().split('T')[0]);

  const toggleTaken = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, taken: !r.taken } : r
    ));
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'Morning': return '🌅';
      case 'Afternoon': return '☀️';
      case 'Evening': return '🌆';
      case 'Night': return '🌙';
      default: return '⏰';
    }
  };

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'Morning': return 'text-orange-500';
      case 'Afternoon': return 'text-yellow-500';
      case 'Evening': return 'text-purple-500';
      case 'Night': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const missedReminders = reminders.filter(r =>
    !r.taken &&
    new Date(`${r.date}T${r.time}`) < new Date() &&
    r.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-4">
      {/* Missed Reminders Alert */}
      {missedReminders.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-700">Missed Doses</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {missedReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div>
                    <span className="font-medium">{reminder.medication}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {reminder.dosage} at {reminder.time}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleTaken(reminder.id)}
                    className="text-red-600 border-red-300"
                  >
                    Mark as Taken
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span>Today's Medication Schedule</span>
          </CardTitle>
          <CardDescription>
            Select a time period to view your medication reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            {periods.map(period => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                onClick={() => setSelectedPeriod(period)}
                className="flex items-center space-x-2"
              >
                <span>{getPeriodIcon(period)}</span>
                <span>{period}</span>
              </Button>
            ))}
          </div>

          {/* Reminders List */}
          <div className="space-y-3">
            {filteredReminders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No medications scheduled for {selectedPeriod.toLowerCase()}</p>
              </div>
            ) : (
              filteredReminders.map(reminder => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    reminder.taken ? 'bg-green-50 border-green-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={reminder.taken}
                      onCheckedChange={() => toggleTaken(reminder.id)}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{reminder.medication}</span>
                        <Badge variant="outline">{reminder.dosage}</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{reminder.time}</span>
                        <span className={getPeriodColor(reminder.period)}>
                          {getPeriodIcon(reminder.period)} {reminder.period}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {reminder.taken ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Bell className="h-5 w-5 text-gray-400" />
                    )}
                    <Button
                      size="sm"
                      variant={reminder.taken ? "secondary" : "default"}
                      onClick={() => toggleTaken(reminder.id)}
                    >
                      {reminder.taken ? "Taken" : "Mark Taken"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Adherence Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Adherence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reminders.filter(r => r.taken && r.date === new Date().toISOString().split('T')[0]).length}
              </div>
              <div className="text-sm text-muted-foreground">Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reminders.filter(r => !r.taken && r.date === new Date().toISOString().split('T')[0]).length}
              </div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {missedReminders.length}
              </div>
              <div className="text-sm text-muted-foreground">Missed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((reminders.filter(r => r.taken).length / reminders.length) * 100) || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Adherence</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}