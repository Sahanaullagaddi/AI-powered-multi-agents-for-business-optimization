import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Bell,
  BellOff,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
  Settings,
  Pill,
  ShieldAlert,
  Sparkles,
  Check,
  Phone,
  ArrowRight,
  RefreshCw,
  Plus,
  Droplets,
  RotateCcw,
  CheckCheck,
  AlertCircle,
  FileText,
  Volume2
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface NotificationItem {
  id: string;
  type: "high_risk" | "moderate_risk" | "info" | "reminder" | "alert";
  title: string;
  message: string;
  timestamp: string; // ISO string for robust JSON storage
  read: boolean;
  actionable?: boolean;
  statusBadge?: string;
  actionTaken?: string;
  clinicalDetails?: {
    drugName?: string;
    dosage?: string;
    foodGuide?: string;
    mechanism?: string;
    contraindications?: string;
    doctorContact?: {
      name: string;
      role: string;
      phone: string;
      clinic: string;
    };
    safeAlternative?: string;
  };
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "high_risk",
    title: "High Risk Drug Interaction Detected",
    message: "Aspirin and Warfarin combination shows high bleeding risk. Consult your doctor immediately.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    actionable: true,
    clinicalDetails: {
      drugName: "Aspirin (81mg) + Warfarin (5mg)",
      mechanism: "Dual antiplatelet (COX-1 inhibition) and anticoagulant (vitamin K antagonism) causes synergistic suppression of hemostasis, dramatically escalating gastrointestinal and intracranial hemorrhage risks.",
      contraindications: "Concurrent use requires urgent physician re-evaluation, INR target recalibration, or gastroprotective co-prescription (e.g., PPI).",
      doctorContact: {
        name: "Dr. Sarah Jenkins, MD",
        role: "Cardiovascular Specialist",
        phone: "+1 (555) 019-2834",
        clinic: "Metro Health Cardiology Suite 402"
      }
    }
  },
  {
    id: "2",
    type: "reminder",
    title: "Medication Reminder",
    message: "Time to take your morning Lisinopril (10mg). Don't forget to take with food.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    actionable: true,
    clinicalDetails: {
      drugName: "Lisinopril",
      dosage: "10mg Tablet (Oral)",
      foodGuide: "Take with a light meal or full glass of water. Maintain consistent daily timing. Avoid potassium-rich salt substitutes to prevent hyperkalemia.",
      mechanism: "ACE inhibitor preventing angiotensin I conversion to angiotensin II, causing systemic vasodilation and lower peripheral vascular resistance."
    }
  },
  {
    id: "3",
    type: "moderate_risk",
    title: "Moderate Risk Interaction",
    message: "Ibuprofen may reduce the effectiveness of your blood pressure medication.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
    actionable: true,
    clinicalDetails: {
      drugName: "Ibuprofen (400mg) + Antihypertensive",
      mechanism: "NSAIDs inhibit renal prostaglandin synthesis, causing sodium and fluid retention while attenuating the vasodilatory action of ACE inhibitors and ARBs.",
      safeAlternative: "Acetaminophen (Paracetamol) 500mg-1000mg as needed (max 3000mg/day) is the preferred analgesic without renal/BP interference."
    }
  },
  {
    id: "4",
    type: "info",
    title: "Health Tip",
    message: "Stay hydrated! Drinking enough water helps your medications work better.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: true,
    actionable: true,
    clinicalDetails: {
      foodGuide: "Optimal renal hydration (2.0L - 2.5L daily) accelerates drug clearance, stabilizes glomerular filtration, and avoids toxic accumulation of active drug metabolites."
    }
  },
  {
    id: "5",
    type: "alert",
    title: "Missed Dose Alert",
    message: "You missed your afternoon Metformin dose. Please take it as soon as possible.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: false,
    actionable: true,
    clinicalDetails: {
      drugName: "Metformin",
      dosage: "500mg Extended Release",
      foodGuide: "Always take with food or dinner to minimize gastrointestinal discomfort. If it is already near your next scheduled dose, skip this dose and resume regular schedule. NEVER take a double dose.",
      mechanism: "Biguanide reducing hepatic glucose output and enhancing peripheral insulin sensitivity."
    }
  }
];

interface PreferencesState {
  highRiskAlerts: boolean;
  medicationReminders: boolean;
  moderateRiskAlerts: boolean;
  healthTips: boolean;
  pushNotifications: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  soundEnabled: boolean;
  advanceMinutes: string;
}

const DEFAULT_PREFERENCES: PreferencesState = {
  highRiskAlerts: true,
  medicationReminders: true,
  moderateRiskAlerts: true,
  healthTips: true,
  pushNotifications: true,
  emailAlerts: false,
  smsAlerts: false,
  soundEnabled: true,
  advanceMinutes: "15"
};

export default function NotificationsCenter() {
  // 1. Persistent Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem("medguard_notifications_v3");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load notifications from localStorage", e);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // 2. Preferences State
  const [preferences, setPreferences] = useState<PreferencesState>(() => {
    try {
      const saved = localStorage.getItem("medguard_notification_prefs");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load preferences from localStorage", e);
    }
    return DEFAULT_PREFERENCES;
  });

  // Filter & Search State
  const [filter, setFilter] = useState<string>("all");

  // Modals State
  const [activeActionNotification, setActiveActionNotification] = useState<NotificationItem | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  // New Reminder Form State
  const [newMedName, setNewMedName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newTime, setNewTime] = useState("08:00 AM");
  const [newInstructions, setNewInstructions] = useState("Take with food and full glass of water");
  const [newType, setNewType] = useState<"reminder" | "high_risk" | "moderate_risk" | "alert">("reminder");

  // Skip dose reason state inside action dialog
  const [skipReason, setSkipReason] = useState<string>("experiencing_nausea");
  const [bloodPressureReading, setBloodPressureReading] = useState("120/80");
  const [isCustomSkipReason, setIsCustomSkipReason] = useState(false);
  const [customSkipText, setCustomSkipText] = useState("");

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("medguard_notifications_v3", JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to persist notifications", e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem("medguard_notification_prefs", JSON.stringify(preferences));
    } catch (e) {
      console.error("Failed to persist preferences", e);
    }
  }, [preferences]);

  // Filtering logic
  const filteredNotifications = notifications.filter(item => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    if (filter === "reminder") return item.type === "reminder" || item.type === "alert";
    if (filter === "interactions") return item.type === "high_risk" || item.type === "moderate_risk";
    if (filter === "tips") return item.type === "info";
    return item.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Notification actions
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    toast({
      title: "Notification Read",
      description: "Marked as read."
    });
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: false } : n))
    );
    toast({
      title: "Marked as Unread",
      description: "Notification moved to unread queue."
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All Caught Up!",
      description: "All notifications have been marked as read."
    });
  };

  const deleteNotification = (id: string) => {
    const target = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification Dismissed",
      description: target ? `"${target.title}" was removed.` : "Removed from list."
    });
  };

  const resetDefaultNotifications = () => {
    setNotifications(DEFAULT_NOTIFICATIONS);
    toast({
      title: "Notifications Restored",
      description: "Demo notifications reset to default state."
    });
  };

  // Action handlers
  const handleOpenAction = (item: NotificationItem) => {
    setActiveActionNotification(item);
  };

  const executeActionTaken = (
    notificationId: string,
    actionStatusText: string,
    toastMessage: string,
    toastDesc?: string
  ) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === notificationId) {
          return {
            ...n,
            read: true,
            statusBadge: actionStatusText,
            actionTaken: actionStatusText
          };
        }
        return n;
      })
    );
    setActiveActionNotification(null);
    toast({
      title: toastMessage,
      description: toastDesc || `Action recorded at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    });
  };

  const handleSnooze = (notificationId: string, minutes: number) => {
    const snoozeTimeStr = `Snoozed (+${minutes}m)`;
    executeActionTaken(
      notificationId,
      snoozeTimeStr,
      `Reminder Snoozed for ${minutes} Minutes`,
      `We will notify you again at ${new Date(Date.now() + minutes * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    );
  };

  const handleSkipDose = (notificationId: string) => {
    const reasonText = isCustomSkipReason && customSkipText ? customSkipText : skipReason.replace(/_/g, " ");
    executeActionTaken(
      notificationId,
      `Skipped: ${reasonText}`,
      "Dose Skipped & Recorded",
      `Reason: "${reasonText}". Recorded in adherence log for physician review.`
    );
  };

  const handleSavePreferences = () => {
    setIsPreferencesOpen(false);
    toast({
      title: "Preferences Saved",
      description: "Notification rules & delivery methods updated."
    });
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) {
      toast({
        title: "Medication Name Required",
        description: "Please enter the medication name and dosage.",
        variant: "destructive"
      });
      return;
    }

    const newNotification: NotificationItem = {
      id: "custom-" + Date.now(),
      type: newType,
      title: newType === "reminder" ? `Medication Reminder: ${newMedName}` : `${newMedName} Alert`,
      message: `Time to take your scheduled ${newMedName} (${newDosage || "dose"}). ${newInstructions}`,
      timestamp: new Date().toISOString(),
      read: false,
      actionable: true,
      clinicalDetails: {
        drugName: newMedName,
        dosage: newDosage || "Scheduled Dose",
        foodGuide: newInstructions
      }
    };

    setNotifications(prev => [newNotification, ...prev]);
    setIsAddReminderOpen(false);
    setNewMedName("");
    setNewDosage("");
    toast({
      title: "Reminder Created",
      description: `New alert for ${newMedName} added to your schedule.`
    });
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    } catch {
      return "Recent";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "high_risk":
        return <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />;
      case "moderate_risk":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "reminder":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-emerald-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationCardStyle = (notification: NotificationItem) => {
    const baseBorder = notification.read ? "border-muted" : "border-l-4";
    switch (notification.type) {
      case "high_risk":
        return notification.read
          ? "border-red-100 bg-red-50/40 dark:bg-red-950/20"
          : `${baseBorder} border-l-red-600 border-red-200 bg-red-50/90 dark:bg-red-950/40`;
      case "moderate_risk":
        return notification.read
          ? "border-amber-100 bg-amber-50/40 dark:bg-amber-950/20"
          : `${baseBorder} border-l-amber-500 border-amber-200 bg-amber-50/90 dark:bg-amber-950/40`;
      case "reminder":
        return notification.read
          ? "border-blue-100 bg-blue-50/40 dark:bg-blue-950/20"
          : `${baseBorder} border-l-blue-600 border-blue-200 bg-blue-50/90 dark:bg-blue-950/40`;
      case "alert":
        return notification.read
          ? "border-yellow-100 bg-yellow-50/40 dark:bg-yellow-950/20"
          : `${baseBorder} border-l-yellow-500 border-yellow-200 bg-yellow-50/90 dark:bg-yellow-950/40`;
      case "info":
        return notification.read
          ? "border-emerald-100 bg-emerald-50/40 dark:bg-emerald-950/20"
          : `${baseBorder} border-l-emerald-500 border-emerald-200 bg-emerald-50/90 dark:bg-emerald-950/40`;
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-900";
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header with Live Controls */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold tracking-tight">
                    Notifications & Medication Alerts
                  </CardTitle>
                  {unreadCount > 0 ? (
                    <Badge variant="destructive" className="font-semibold text-xs px-2 py-0.5">
                      {unreadCount} unread
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">
                      All Caught Up
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs sm:text-sm mt-0.5">
                  Real-time medication schedule reminders, drug interaction alerts, and clinical safety actions
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Selector */}
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue placeholder="Filter alerts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts ({notifications.length})</SelectItem>
                  <SelectItem value="unread">Unread Only ({unreadCount})</SelectItem>
                  <SelectItem value="reminder">Reminders & Doses</SelectItem>
                  <SelectItem value="interactions">Drug Interactions</SelectItem>
                  <SelectItem value="tips">Health Tips</SelectItem>
                </SelectContent>
              </Select>

              {/* Mark All Read Button */}
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Mark All Read
                </Button>
              )}

              {/* New Reminder Button */}
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAddReminderOpen(true)}
                className="h-9 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Reminder
              </Button>

              {/* Preferences Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreferencesOpen(true)}
                className="h-9 w-9 p-0"
                title="Notification Preferences"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Notifications List */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="h-[520px]">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="p-4 bg-muted/40 rounded-full mb-3">
                  <BellOff className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {filter === "unread" ? "No unread notifications" : "No notifications found"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-4">
                  {filter === "unread"
                    ? "You're all caught up with your scheduled doses and interaction warnings."
                    : "There are no notifications matching your active filter."}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFilter("all")} className="text-xs">
                    View All Notifications
                  </Button>
                  <Button variant="ghost" size="sm" onClick={resetDefaultNotifications} className="text-xs">
                    <RotateCcw className="h-3 w-3 mr-1.5" /> Reset Demo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-all duration-150 ${getNotificationCardStyle(notification)}`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`text-sm font-semibold ${
                                !notification.read ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {notification.statusBadge && (
                              <Badge
                                variant="outline"
                                className="text-[11px] font-medium bg-emerald-100/90 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                              >
                                <Check className="h-3 w-3 mr-1 inline" />
                                {notification.statusBadge}
                              </Badge>
                            )}
                          </div>

                          {/* Time & Delete */}
                          <div className="flex items-center space-x-2 shrink-0">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-muted-foreground hover:bg-destructive/15 hover:text-destructive rounded-full"
                              title="Dismiss"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <p
                          className={`text-sm leading-relaxed mb-3 ${
                            !notification.read ? "text-foreground/90 font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {/* Card Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/30">
                          <div className="flex items-center gap-2">
                            {/* Mark as Read / Unread */}
                            {!notification.read ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 text-xs font-medium border-border/70 hover:bg-background/80 shadow-xs"
                              >
                                Mark as Read
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsUnread(notification.id)}
                                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                              >
                                Mark as Unread
                              </Button>
                            )}

                            {/* Take Action Button */}
                            {notification.actionable && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleOpenAction(notification)}
                                className={`h-8 text-xs font-semibold shadow-xs ${
                                  notification.type === "high_risk"
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : notification.type === "reminder"
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                                }`}
                              >
                                Take Action
                                <ArrowRight className="h-3 w-3 ml-1.5" />
                              </Button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[10px] tracking-wide font-mono uppercase bg-background/80">
                              {notification.type.replace("_", " ")}
                            </Badge>
                            {notification.read && (
                              <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                                Read
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 3. Notification Preferences Card */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreferencesOpen(true)}
              className="text-xs"
            >
              <Settings className="h-3.5 w-3.5 mr-1.5" />
              Manage Preferences
            </Button>
          </div>
          <CardDescription>
            Customize which alerts, dosage reminders, and delivery channels are active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Alert Channels</h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                  <span>High-Risk Drug Interactions</span>
                  <Badge variant={preferences.highRiskAlerts ? "destructive" : "secondary"}>
                    {preferences.highRiskAlerts ? "Active (Critical)" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                  <span>Medication Dose Reminders</span>
                  <Badge variant={preferences.medicationReminders ? "default" : "secondary"}>
                    {preferences.medicationReminders ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span>Daily Health Tips & Hydration</span>
                  <Badge variant={preferences.healthTips ? "secondary" : "outline"}>
                    {preferences.healthTips ? "Enabled" : "Muted"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Delivery Modes</h4>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                  <span>In-App Popups & Banners</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                  <span>Sound Audio Chimes</span>
                  <Badge variant={preferences.soundEnabled ? "default" : "secondary"}>
                    {preferences.soundEnabled ? "Chime Active" : "Silent"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm py-1">
                  <span>Advance Warning Schedule</span>
                  <Badge variant="outline">{preferences.advanceMinutes} mins prior</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================
          MODAL 1: CLINICAL "TAKE ACTION" DIALOG
         ======================================================== */}
      <Dialog
        open={Boolean(activeActionNotification)}
        onOpenChange={open => {
          if (!open) setActiveActionNotification(null);
        }}
      >
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {activeActionNotification && (
            <>
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  {getNotificationIcon(activeActionNotification.type)}
                  <Badge
                    variant={
                      activeActionNotification.type === "high_risk"
                        ? "destructive"
                        : activeActionNotification.type === "moderate_risk"
                        ? "secondary"
                        : "default"
                    }
                    className="uppercase text-[10px]"
                  >
                    {activeActionNotification.type.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatTimestamp(activeActionNotification.timestamp)}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold leading-snug">
                  {activeActionNotification.title}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {activeActionNotification.message}
                </DialogDescription>
              </DialogHeader>

              {/* Specific Clinical Action Sections */}
              <div className="my-4 space-y-4">
                {/* 1. If Medication Reminder (Lisinopril or Custom) */}
                {activeActionNotification.type === "reminder" && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900 text-sm">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5 mb-1">
                        <Pill className="h-4 w-4 text-blue-600" />
                        Clinical Administration Guidelines
                      </h4>
                      <p className="text-blue-800 dark:text-blue-300 text-xs leading-relaxed">
                        {activeActionNotification.clinicalDetails?.foodGuide ||
                          "Take this dose with a full glass of water and light food. Maintain consistent daily timing for optimal bioavailability."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Select Your Action
                      </h4>

                      {/* Action 1: Mark Taken Now */}
                      <Button
                        onClick={() =>
                          executeActionTaken(
                            activeActionNotification.id,
                            `Dose Taken (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
                            "Dose Logged as Taken",
                            `Successfully recorded morning Lisinopril. Daily adherence: 100%.`
                          )
                        }
                        className="w-full justify-start h-11 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        I Have Taken This Dose Now (with food)
                      </Button>

                      {/* Action 2: Snooze */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleSnooze(activeActionNotification.id, 15)}
                          className="h-10 text-xs justify-center"
                        >
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                          Snooze 15 Mins
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSnooze(activeActionNotification.id, 30)}
                          className="h-10 text-xs justify-center"
                        >
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                          Snooze 30 Mins
                        </Button>
                      </div>

                      {/* Action 3: Skip Dose Reason */}
                      <div className="p-3 border rounded-lg bg-muted/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium">Skip Dose (Log Reason):</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCustomSkipReason(!isCustomSkipReason)}
                            className="h-6 text-[11px] px-2"
                          >
                            {isCustomSkipReason ? "Choose standard reason" : "Enter custom reason"}
                          </Button>
                        </div>

                        {!isCustomSkipReason ? (
                          <Select value={skipReason} onValueChange={setSkipReason}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nausea_or_upset">Experiencing stomach upset / nausea</SelectItem>
                              <SelectItem value="fasting_for_lab">Fasting for laboratory test</SelectItem>
                              <SelectItem value="doctor_advised_pause">Physician advised temporary hold</SelectItem>
                              <SelectItem value="forgot_took_earlier">Already took it earlier today</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            placeholder="Reason for skipping..."
                            value={customSkipText}
                            onChange={e => setCustomSkipText(e.target.value)}
                            className="h-8 text-xs"
                          />
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSkipDose(activeActionNotification.id)}
                          className="w-full text-xs h-8 text-amber-800 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1.5" />
                          Confirm Skip & Log Note
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. If High Risk Interaction (Aspirin + Warfarin) */}
                {activeActionNotification.type === "high_risk" && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-900 text-xs space-y-2">
                      <div className="font-semibold text-red-900 dark:text-red-200 flex items-center gap-1.5 text-sm">
                        <ShieldAlert className="h-4 w-4 text-red-600" />
                        Urgent Interaction Mechanism
                      </div>
                      <p className="text-red-800 dark:text-red-300 leading-relaxed">
                        {activeActionNotification.clinicalDetails?.mechanism ||
                          "Aspirin and Warfarin have synergistic anticoagulant effects that dangerously heighten major gastrointestinal bleeding and hemorrhage risks."}
                      </p>
                      {activeActionNotification.clinicalDetails?.contraindications && (
                        <p className="text-red-700 dark:text-red-400 font-medium">
                          Protocol: {activeActionNotification.clinicalDetails.contraindications}
                        </p>
                      )}
                    </div>

                    {/* Prescribing Doctor Contact Card */}
                    {activeActionNotification.clinicalDetails?.doctorContact && (
                      <div className="p-3 border rounded-lg bg-card flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold">
                            {activeActionNotification.clinicalDetails.doctorContact.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {activeActionNotification.clinicalDetails.doctorContact.role} &bull;{" "}
                            {activeActionNotification.clinicalDetails.doctorContact.clinic}
                          </div>
                          <div className="text-xs font-mono text-blue-600 font-medium">
                            {activeActionNotification.clinicalDetails.doctorContact.phone}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              activeActionNotification.clinicalDetails?.doctorContact?.phone || ""
                            );
                            toast({
                              title: "Doctor Number Copied",
                              description: activeActionNotification.clinicalDetails?.doctorContact?.phone
                            });
                          }}
                          className="h-8 text-xs shrink-0"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Copy Phone
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        onClick={() =>
                          executeActionTaken(
                            activeActionNotification.id,
                            "Physician Consulted & Logged",
                            "Doctor Alert Logged",
                            "Notified clinical team regarding Aspirin + Warfarin bleeding risk."
                          )
                        }
                        className="w-full h-10 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                      >
                        <Phone className="h-3.5 w-3.5 mr-2" />
                        I Have Notified My Doctor / Clinic
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          executeActionTaken(
                            activeActionNotification.id,
                            "Medication Held Pending Review",
                            "Medication Hold Recorded",
                            "Temporarily withheld Aspirin pending doctor INR review."
                          )
                        }
                        className="w-full h-10 text-xs border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                        Log Temporary Hold on Aspirin
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. If Moderate Risk Interaction (Ibuprofen + BP) */}
                {activeActionNotification.type === "moderate_risk" && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900 text-xs space-y-1.5">
                      <h4 className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Interaction Impact
                      </h4>
                      <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                        {activeActionNotification.clinicalDetails?.mechanism ||
                          "Ibuprofen blunts the antihypertensive action of blood pressure medications and can stress kidney function."}
                      </p>
                      {activeActionNotification.clinicalDetails?.safeAlternative && (
                        <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800/60">
                          <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                            Recommended Safe Alternative:
                          </span>{" "}
                          <span className="text-foreground">
                            {activeActionNotification.clinicalDetails.safeAlternative}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() =>
                          executeActionTaken(
                            activeActionNotification.id,
                            "Switched to Acetaminophen",
                            "Switched to Safe Alternative",
                            "Acetaminophen selected for pain relief without blood pressure interference."
                          )
                        }
                        className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Switch to Recommended Alternative (Acetaminophen)
                      </Button>

                      <div className="flex items-center gap-2 p-2 border rounded-lg">
                        <Label className="text-xs shrink-0">Log BP Reading:</Label>
                        <Input
                          value={bloodPressureReading}
                          onChange={e => setBloodPressureReading(e.target.value)}
                          placeholder="e.g. 120/80"
                          className="h-8 text-xs font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            executeActionTaken(
                              activeActionNotification.id,
                              `BP Monitored: ${bloodPressureReading}`,
                              "Blood Pressure Recorded",
                              `Logged reading of ${bloodPressureReading} mmHg.`
                            )
                          }
                          className="h-8 text-xs shrink-0"
                        >
                          Save BP
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. If Missed Dose Alert (Metformin) */}
                {activeActionNotification.type === "alert" && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/40 rounded-lg border border-yellow-200 dark:border-yellow-900 text-xs">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 flex items-center gap-1.5 text-sm mb-1">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        Missed Dose Safety Instructions
                      </h4>
                      <p className="text-yellow-800 dark:text-yellow-300 leading-relaxed">
                        {activeActionNotification.clinicalDetails?.foodGuide ||
                          "If taking now, take with food. If close to your evening dose, skip this one. Never double up."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() =>
                          executeActionTaken(
                            activeActionNotification.id,
                            "Late Dose Taken (with snack)",
                            "Late Dose Recorded",
                            "Recorded Metformin dose taken with light food."
                          )
                        }
                        className="h-10 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Take Dose Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          executeActionTaken(
                            activeActionNotification.id,
                            "Skipped: Close to Next Dose",
                            "Dose Safely Skipped",
                            "Prevented double dose risk. Next dose as scheduled."
                          )
                        }
                        className="h-10 text-xs"
                      >
                        Skip & Resume Tonight
                      </Button>
                    </div>
                  </div>
                )}

                {/* 5. If Health Tip (Hydration / Water) */}
                {activeActionNotification.type === "info" && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs">
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-sm mb-1">
                        <Droplets className="h-4 w-4 text-emerald-600" />
                        Hydration & Renal Health
                      </h4>
                      <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                        {activeActionNotification.clinicalDetails?.foodGuide ||
                          "Maintaining 2-3 liters of clean water daily helps kidneys clear pharmaceutical metabolites and enhances drug efficacy."}
                      </p>
                    </div>

                    <Button
                      onClick={() =>
                        executeActionTaken(
                          activeActionNotification.id,
                          "Logged 250ml Water Intake",
                          "Hydration Logged",
                          "+250ml water recorded toward your 2.5L daily target."
                        )
                      }
                      className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      <Droplets className="h-4 w-4 mr-2" />
                      Log 250ml Water Intake Now
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveActionNotification(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 2: NOTIFICATION PREFERENCES DIALOG
         ======================================================== */}
      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <DialogTitle className="text-lg">Notification Preferences</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Configure which alerts trigger push notifications and audio alerts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Clinical Alerts
              </h4>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-xs">High-Risk Interactions</div>
                  <div className="text-[11px] text-muted-foreground">Urgent contraindication alerts</div>
                </div>
                <Switch
                  checked={preferences.highRiskAlerts}
                  onCheckedChange={val => setPreferences(p => ({ ...p, highRiskAlerts: val }))}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-xs">Medication Dose Reminders</div>
                  <div className="text-[11px] text-muted-foreground">Morning, afternoon, and evening pills</div>
                </div>
                <Switch
                  checked={preferences.medicationReminders}
                  onCheckedChange={val => setPreferences(p => ({ ...p, medicationReminders: val }))}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-xs">Moderate Risk Warnings</div>
                  <div className="text-[11px] text-muted-foreground">Food interactions & NSAID notices</div>
                </div>
                <Switch
                  checked={preferences.moderateRiskAlerts}
                  onCheckedChange={val => setPreferences(p => ({ ...p, moderateRiskAlerts: val }))}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-xs">Daily Health & Hydration Tips</div>
                  <div className="text-[11px] text-muted-foreground">Kidney safety & wellness advice</div>
                </div>
                <Switch
                  checked={preferences.healthTips}
                  onCheckedChange={val => setPreferences(p => ({ ...p, healthTips: val }))}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Delivery Settings
              </h4>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-xs">In-App Audio Chime</div>
                  <div className="text-[11px] text-muted-foreground">Play soft chime on high-risk alerts</div>
                </div>
                <Switch
                  checked={preferences.soundEnabled}
                  onCheckedChange={val => setPreferences(p => ({ ...p, soundEnabled: val }))}
                />
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <div className="font-medium text-xs">Advance Reminder Timing</div>
                  <div className="text-[11px] text-muted-foreground">Notify prior to scheduled dose</div>
                </div>
                <Select
                  value={preferences.advanceMinutes}
                  onValueChange={val => setPreferences(p => ({ ...p, advanceMinutes: val }))}
                >
                  <SelectTrigger className="w-[110px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 mins prior</SelectItem>
                    <SelectItem value="15">15 mins prior</SelectItem>
                    <SelectItem value="30">30 mins prior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={() => setIsPreferencesOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSavePreferences} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 3: ADD CUSTOM MEDICATION REMINDER
         ======================================================== */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateReminder}>
            <DialogHeader>
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <DialogTitle className="text-lg">Add Medication Reminder</DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                Create a custom reminder for your daily prescription schedule
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor="med-name" className="text-xs font-semibold">
                  Medication Name *
                </Label>
                <Input
                  id="med-name"
                  placeholder="e.g. Amlodipine, Atorvastatin, Metoprolol"
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="dosage" className="text-xs font-semibold">
                    Dosage
                  </Label>
                  <Input
                    id="dosage"
                    placeholder="e.g. 10mg, 500mg"
                    value={newDosage}
                    onChange={e => setNewDosage(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="time" className="text-xs font-semibold">
                    Scheduled Time
                  </Label>
                  <Input
                    id="time"
                    placeholder="e.g. 08:00 AM"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="instructions" className="text-xs font-semibold">
                  Administration Instructions
                </Label>
                <Input
                  id="instructions"
                  placeholder="e.g. Take with breakfast and full glass of water"
                  value={newInstructions}
                  onChange={e => setNewInstructions(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Reminder Category</Label>
                <Select value={newType} onValueChange={(val: any) => setNewType(val)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reminder">Standard Dose Reminder</SelectItem>
                    <SelectItem value="alert">Missed Dose Alert</SelectItem>
                    <SelectItem value="moderate_risk">Interaction / Food Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex flex-row justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddReminderOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                Create Reminder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
