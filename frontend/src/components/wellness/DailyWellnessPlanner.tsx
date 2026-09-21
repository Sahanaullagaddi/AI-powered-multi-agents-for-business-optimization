import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sun,
  Moon,
  Apple,
  Activity,
  Droplets,
  Brain,
  Plus,
  Trash2,
  RotateCcw,
  Flame,
  Sparkles,
  Clock,
  HeartPulse,
  CalendarDays,
  Check,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface WellnessTask {
  id: string;
  title: string;
  description: string;
  time: string;
  category: "morning" | "afternoon" | "evening" | "night";
  type: "routine" | "nutrition" | "mind" | "fitness" | "water" | "medication";
  completed: boolean;
  isCustom?: boolean;
}

const DEFAULT_TASKS: WellnessTask[] = [
  {
    id: "morning-hydration",
    title: "Morning Hydration & Wake-up Stretch",
    description: "Drink 500ml water and do 5 mins light dynamic stretching",
    time: "8:00 AM",
    category: "morning",
    type: "routine",
    completed: true,
  },
  {
    id: "healthy-breakfast",
    title: "Nutritious Balanced Breakfast",
    description: "High-protein meal with fiber (e.g. Oatmeal with chia seeds & berries)",
    time: "9:00 AM",
    category: "morning",
    type: "nutrition",
    completed: false,
  },
  {
    id: "midday-movement",
    title: "Midday Posture & Walk Break",
    description: "10-15 minute walk to stimulate circulation and lower glucose spikes",
    time: "1:00 PM",
    category: "afternoon",
    type: "fitness",
    completed: false,
  },
  {
    id: "mindfulness-break",
    title: "Mindfulness & Deep Breathing",
    description: "5-minute 4-7-8 breathing or box meditation to reduce cortisol",
    time: "2:00 PM",
    category: "afternoon",
    type: "mind",
    completed: false,
  },
  {
    id: "light-dinner",
    title: "Early Heart-Healthy Dinner",
    description: "Low-sodium meal with leafy greens and lean protein",
    time: "7:00 PM",
    category: "evening",
    type: "nutrition",
    completed: false,
  },
  {
    id: "digital-detox-sleep",
    title: "Wind Down & Screen-Free Rest",
    description: "Dim lights 45 mins before bed to support natural melatonin release",
    time: "10:30 PM",
    category: "evening",
    type: "routine",
    completed: false,
  },
];

const PRESETS = [
  {
    id: "balance",
    label: "Balanced Daily Health",
    description: "Everyday routines for stamina and cognitive focus",
  },
  {
    id: "cardio",
    label: "Cardiovascular Support",
    description: "Optimized for blood pressure, circulation, and heart vitality",
  },
  {
    id: "stress",
    label: "Stress & Nervous System Calm",
    description: "Designed to lower anxiety, cortisol, and promote deep sleep",
  },
  {
    id: "metabolic",
    label: "Metabolic & Blood Sugar",
    description: "Post-meal walks, hydration, and fiber-rich meal timing",
  },
];

interface DailyWellnessPlannerProps {
  onBack?: () => void;
}

export default function DailyWellnessPlanner({ onBack }: DailyWellnessPlannerProps) {
  const { toast } = useToast();

  const [tasks, setTasks] = useState<WellnessTask[]>(() => {
    try {
      const saved = localStorage.getItem("medguard_wellness_tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("medguard_wellness_water");
      return saved ? Number(saved) : 5;
    } catch {
      return 5;
    }
  });

  const [exerciseMins, setExerciseMins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("medguard_wellness_exercise");
      return saved ? Number(saved) : 20;
    } catch {
      return 20;
    }
  });

  const [sleepHours, setSleepHours] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("medguard_wellness_sleep");
      return saved ? Number(saved) : 7.5;
    } catch {
      return 7.5;
    }
  });

  const [categoryFilter, setCategoryFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");
  const [activePreset, setActivePreset] = useState("balance");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newCategory, setNewCategory] = useState<"morning" | "afternoon" | "evening">("morning");

  useEffect(() => {
    try {
      localStorage.setItem("medguard_wellness_tasks", JSON.stringify(tasks));
      localStorage.setItem("medguard_wellness_water", waterGlasses.toString());
      localStorage.setItem("medguard_wellness_exercise", exerciseMins.toString());
      localStorage.setItem("medguard_wellness_sleep", sleepHours.toString());
    } catch (err) {
      console.error("Failed to save wellness data:", err);
    }
  }, [tasks, waterGlasses, exerciseMins, sleepHours]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter === "all") return true;
    return t.category === categoryFilter;
  });

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const nextState = !task.completed;
          if (nextState) {
            toast({
              title: "Task Completed! 🎉",
              description: `Great job on: "${task.title}"`,
            });
          }
          return { ...task, completed: nextState };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast({
      title: "Routine Removed",
      description: "The item has been removed from today's plan.",
    });
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a name for your routine task.",
        variant: "destructive",
      });
      return;
    }

    const newTask: WellnessTask = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || "Custom daily health activity",
      time: newTime,
      category: newCategory,
      type: "routine",
      completed: false,
      isCustom: true,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTitle("");
    setNewDesc("");
    setIsAddOpen(false);

    toast({
      title: "Routine Added ✨",
      description: `"${newTask.title}" added for ${newTask.time}.`,
    });
  };

  const resetAllTasks = () => {
    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
    setWaterGlasses(0);
    setExerciseMins(0);
    toast({
      title: "Planner Reset",
      description: "All daily checklist tasks have been reset for a fresh start.",
    });
  };

  const applyPresetPlan = (presetId: string) => {
    setActivePreset(presetId);
    let newItems: WellnessTask[] = [];

    if (presetId === "cardio") {
      newItems = [
        {
          id: "cardio-bp",
          title: "Morning Blood Pressure Check",
          description: "Sit quietly for 5 minutes before logging resting systolic/diastolic values",
          time: "7:30 AM",
          category: "morning",
          type: "routine",
          completed: false,
        },
        {
          id: "cardio-potassium",
          title: "Potassium & Nitric Oxide Boost",
          description: "Beetroot juice or spinach omelet with walnuts to support vascular dilation",
          time: "8:30 AM",
          category: "morning",
          type: "nutrition",
          completed: false,
        },
        {
          id: "cardio-brisk-walk",
          title: "30-Minute Aerobic Brisk Walk",
          description: "Maintain 60-70% max heart rate to improve endothelial function",
          time: "5:30 PM",
          category: "evening",
          type: "fitness",
          completed: false,
        },
        {
          id: "cardio-magnesium",
          title: "Magnesium & Calming Tea",
          description: "Chamomile or Hibiscus tea to naturally promote arterial relaxation",
          time: "9:30 PM",
          category: "evening",
          type: "mind",
          completed: false,
        },
      ];
    } else if (presetId === "stress") {
      newItems = [
        {
          id: "stress-sunlight",
          title: "10-Min Morning Sunlight Viewing",
          description: "Natural retinal photon stimulation anchors circadian rhythm and elevates dopamine",
          time: "8:00 AM",
          category: "morning",
          type: "routine",
          completed: false,
        },
        {
          id: "stress-tea",
          title: "Ashwagandha / Green Tea Break",
          description: "L-Theanine promotes alpha brainwaves for relaxed, clear alertness",
          time: "11:00 AM",
          category: "morning",
          type: "nutrition",
          completed: false,
        },
        {
          id: "stress-breathwork",
          title: "Physiological Sigh Breathwork",
          description: "Two quick inhales followed by long slow exhale for 5 minutes",
          time: "3:00 PM",
          category: "afternoon",
          type: "mind",
          completed: false,
        },
        {
          id: "stress-journal",
          title: "Evening Gratitude & Decompression",
          description: "Write down 3 positive moments to reduce bedtime ruminative thoughts",
          time: "9:00 PM",
          category: "evening",
          type: "mind",
          completed: false,
        },
      ];
    } else if (presetId === "metabolic") {
      newItems = [
        {
          id: "meta-water",
          title: "Hydration with Apple Cider Vinegar / Lemon",
          description: "Supports gastric acidity and gentle digestive preparation",
          time: "8:00 AM",
          category: "morning",
          type: "water",
          completed: false,
        },
        {
          id: "meta-walk-1",
          title: "15-Min Post-Breakfast Walk",
          description: "Blunts glucose spikes by up to 30% via muscle contraction glucose uptake",
          time: "10:00 AM",
          category: "morning",
          type: "fitness",
          completed: false,
        },
        {
          id: "meta-fiber",
          title: "Fiber First Lunch Routine",
          description: "Eat raw salad or greens before carbohydrates to form an intestinal fiber mesh",
          time: "1:00 PM",
          category: "afternoon",
          type: "nutrition",
          completed: false,
        },
        {
          id: "meta-walk-2",
          title: "Post-Dinner Evening Walk",
          description: "Gentle strolling enhances insulin sensitivity before bed",
          time: "7:45 PM",
          category: "evening",
          type: "fitness",
          completed: false,
        },
      ];
    } else {
      newItems = DEFAULT_TASKS;
    }

    setTasks(newItems);
    toast({
      title: "Routine Plan Updated 📋",
      description: `Loaded preset: "${PRESETS.find((p) => p.id === presetId)?.label}"`,
    });
  };

  const getTaskIcon = (type: WellnessTask["type"]) => {
    switch (type) {
      case "nutrition":
        return <Apple className="h-5 w-5 text-emerald-600" />;
      case "mind":
        return <Brain className="h-5 w-5 text-purple-600" />;
      case "fitness":
        return <Activity className="h-5 w-5 text-orange-600" />;
      case "water":
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case "medication":
        return <HeartPulse className="h-5 w-5 text-rose-600" />;
      default:
        return <Sun className="h-5 w-5 text-amber-600" />;
    }
  };

  const getTaskIconBg = (type: WellnessTask["type"]) => {
    switch (type) {
      case "nutrition":
        return "bg-emerald-100 text-emerald-600";
      case "mind":
        return "bg-purple-100 text-purple-600";
      case "fitness":
        return "bg-orange-100 text-orange-600";
      case "water":
        return "bg-blue-100 text-blue-600";
      case "medication":
        return "bg-rose-100 text-rose-600";
      default:
        return "bg-amber-100 text-amber-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Navigation & Streak */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card border rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack} className="h-8 px-2 text-muted-foreground mr-1">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-blue-50 text-blue-700 border-blue-200">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-3 bg-amber-50 text-amber-700 border-amber-200 font-semibold">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              4-Day Habit Streak
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Daily Wellness & Routine Planner</h2>
          <p className="text-sm text-muted-foreground">
            Personalized evidence-based health schedules, hydration monitoring, and habit adherence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Custom Routine
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <form onSubmit={handleAddNewTask}>
                <DialogHeader>
                  <DialogTitle>Add Daily Routine Task</DialogTitle>
                  <DialogDescription>
                    Add a customized health habit or medication timing to your daily checklist.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="routine-name">Routine Name *</Label>
                    <Input
                      id="routine-name"
                      placeholder="e.g. Evening Herbal Tea or Multivitamin"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="routine-time">Target Time</Label>
                      <Input
                        id="routine-time"
                        placeholder="e.g. 8:30 PM"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="routine-category">Period</Label>
                      <Select
                        value={newCategory}
                        onValueChange={(val: any) => setNewCategory(val)}
                      >
                        <SelectTrigger id="routine-category">
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                          <SelectItem value="evening">Evening (5PM - 10PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="routine-desc">Details / Notes</Label>
                    <Input
                      id="routine-desc"
                      placeholder="e.g. Take with a glass of water after food"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Routine</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="icon" onClick={resetAllTasks} title="Reset tasks for today">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Daily Progress Banner */}
      <Card className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-teal-50/60 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-lg text-slate-800">
                  Today's Wellness Completion
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completedCount === totalCount && totalCount > 0
                  ? "🌟 Spectacular! You have completed every scheduled health habit today!"
                  : completedCount > 0
                  ? `Keep going! You've accomplished ${completedCount} of ${totalCount} habits today.`
                  : "Start your morning routines to build a healthy lifestyle streak."}
              </p>
            </div>
            <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
              <span className="text-3xl font-extrabold text-indigo-700">{progressPercent}%</span>
              <span className="text-xs text-muted-foreground font-medium">
                {completedCount}/{totalCount} Completed
              </span>
            </div>
          </div>
          <Progress value={progressPercent} className="h-3 bg-slate-200/80" />
        </CardContent>
      </Card>

      {/* Preset Plan Selectors */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Quick Routine Presets (Click to switch plan)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPresetPlan(preset.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                activePreset === preset.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20"
                  : "bg-card hover:bg-accent/40 border-border text-foreground"
              }`}
            >
              <p className="text-sm font-semibold truncate">{preset.label}</p>
              <p
                className={`text-xs line-clamp-1 mt-0.5 ${
                  activePreset === preset.id ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Daily Trackers: Hydration, Exercise, Sleep */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hydration Tracker */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Droplets className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Hydration</CardTitle>
                  <CardDescription className="text-xs">Goal: 8 Glasses (2,000ml)</CardDescription>
                </div>
              </div>
              <Badge variant={waterGlasses >= 8 ? "default" : "secondary"} className={waterGlasses >= 8 ? "bg-emerald-600 text-white" : ""}>
                {waterGlasses}/8
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((cupNum) => (
                <button
                  key={cupNum}
                  type="button"
                  onClick={() => {
                    const next = cupNum <= waterGlasses && cupNum === waterGlasses ? cupNum - 1 : cupNum;
                    setWaterGlasses(next);
                  }}
                  className={`flex-1 h-9 rounded-md flex items-center justify-center transition-all ${
                    cupNum <= waterGlasses
                      ? "bg-blue-500 text-white shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-600"
                  }`}
                  title={`Glass ${cupNum}`}
                >
                  <Droplets className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => setWaterGlasses((v) => Math.max(0, v - 1))}
                disabled={waterGlasses === 0}
              >
                - 1 Glass
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs h-8 bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  setWaterGlasses((v) => Math.min(12, v + 1));
                  toast({ title: "Water Logged! 💧", description: "Stay hydrated for optimal drug metabolism." });
                }}
              >
                + 1 Glass
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Tracker */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Movement</CardTitle>
                  <CardDescription className="text-xs">Target: 30 Mins Daily</CardDescription>
                </div>
              </div>
              <Badge variant={exerciseMins >= 30 ? "default" : "secondary"} className={exerciseMins >= 30 ? "bg-emerald-600 text-white" : ""}>
                {exerciseMins}m / 30m
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={Math.min(100, (exerciseMins / 30) * 100)} className="h-2 bg-orange-100 [&>div]:bg-orange-500" />
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => {
                  setExerciseMins((v) => v + 15);
                  toast({ title: "Movement Logged! 🏃", description: "+15 minutes recorded towards your goal." });
                }}
              >
                + 15 Min Walk
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => {
                  setExerciseMins((v) => v + 30);
                  toast({ title: "Workout Logged! 💪", description: "Goal reached! 30 mins added." });
                }}
              >
                + 30 Min Exercise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tracker */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Moon className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Rest & Recovery</CardTitle>
                  <CardDescription className="text-xs">Recommended: 7-9 Hours</CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                {sleepHours} hrs
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last night's sleep duration:</span>
              <span className="font-semibold text-foreground">{sleepHours} Hours</span>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              {[6.5, 7.5, 8.5].map((hrs) => (
                <Button
                  key={hrs}
                  variant={sleepHours === hrs ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs h-8"
                  onClick={() => {
                    setSleepHours(hrs);
                    toast({ title: "Sleep Logged! 🌙", description: `Recorded ${hrs} hours of restorative sleep.` });
                  }}
                >
                  {hrs} hrs
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Checklist Schedule */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-bold">Today's Schedule & Habits</CardTitle>
              <CardDescription>
                Click any task card, checkbox, or button to toggle completion.
              </CardDescription>
            </div>

            {/* Time filter tabs */}
            <div className="flex items-center gap-1 bg-muted/70 p-1 rounded-lg">
              {(["all", "morning", "afternoon", "evening"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCategoryFilter(filter)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium capitalize transition-all ${
                    categoryFilter === filter
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No routine tasks in this category.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsAddOpen(true)}>
                Add a task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const isDone = task.completed;
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-50/40 border-emerald-200/80 shadow-xs"
                        : "bg-card hover:bg-accent/40 border-border hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 pr-4 flex-1">
                      {/* Checkbox circle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTask(task.id);
                        }}
                        className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full transition-all ${
                          isDone
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "border-2 border-slate-300 text-transparent hover:border-emerald-500"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </button>

                      {/* Icon */}
                      <div className={`mt-0.5 hidden sm:flex h-9 w-9 items-center justify-center rounded-lg ${getTaskIconBg(task.type)}`}>
                        {getTaskIcon(task.type)}
                      </div>

                      {/* Content */}
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`font-semibold text-sm transition-all ${
                              isDone ? "line-through text-slate-500" : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.isCustom && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs ${isDone ? "text-slate-400" : "text-muted-foreground"}`}>
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Time & Action Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 text-xs font-semibold text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{task.time}</span>
                        </div>

                        {/* Interactive toggle badge */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTask(task.id);
                          }}
                          className={`mt-1 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                              : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground border"
                          }`}
                        >
                          {isDone ? (
                            <>
                              <Check className="h-3 w-3 stroke-[3]" /> Completed
                            </>
                          ) : (
                            "Mark Complete"
                          )}
                        </button>
                      </div>

                      {/* Delete action for custom tasks */}
                      {task.isCustom && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          title="Delete routine"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Weekly Goals & Evidence Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Dynamic Weekly Goals Adherence
            </CardTitle>
            <CardDescription className="text-xs">
              Live adherence calculated from your daily check-ins
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-500" />
                  Drink 8 glasses of water daily
                </span>
                <span className="text-muted-foreground">
                  {waterGlasses >= 8 ? "Goal Met (100%)" : `${waterGlasses}/8 glasses (${Math.round((waterGlasses / 8) * 100)}%)`}
                </span>
              </div>
              <Progress value={Math.min(100, (waterGlasses / 8) * 100)} className="h-2 bg-blue-100 [&>div]:bg-blue-600" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-orange-500" />
                  30 minutes physical exercise
                </span>
                <span className="text-muted-foreground">
                  {exerciseMins >= 30 ? "Goal Met (100%)" : `${exerciseMins}/30 mins (${Math.round((exerciseMins / 30) * 100)}%)`}
                </span>
              </div>
              <Progress value={Math.min(100, (exerciseMins / 30) * 100)} className="h-2 bg-orange-100 [&>div]:bg-orange-600" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5 text-purple-500" />
                  7-9 hours restorative sleep
                </span>
                <span className="text-muted-foreground">
                  {sleepHours >= 7 && sleepHours <= 9 ? "Optimal Range" : `${sleepHours} hrs`}
                </span>
              </div>
              <Progress value={Math.min(100, (sleepHours / 8) * 100)} className="h-2 bg-purple-100 [&>div]:bg-purple-600" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                  Daily Routine Completion Rate
                </span>
                <span className="text-muted-foreground">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 bg-emerald-100 [&>div]:bg-emerald-600" />
            </div>
          </CardContent>
        </Card>

        {/* Clinical Lifestyle Insight */}
        <Card className="border shadow-sm bg-gradient-to-br from-card to-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-rose-500" />
              Pharmacology & Lifestyle Insights
            </CardTitle>
            <CardDescription className="text-xs">
              Scientific correlation between daily habits and medication safety
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
            <div className="p-3 bg-background border rounded-lg space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                💧 Hydration & Drug Elimination
              </p>
              <p>
                Adequate kidney perfusion through daily 2L water intake prevents drug metabolite crystallization and reduces renal toxicity from NSAIDs and antihypertensive agents.
              </p>
            </div>
            <div className="p-3 bg-background border rounded-lg space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                🚶 Light Post-Prandial Movement
              </p>
              <p>
                A 10-15 minute casual stroll after meals lowers post-prandial glucose surges by up to 22%, significantly assisting diabetic medications such as Metformin.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
