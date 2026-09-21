import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import type { PredictionRow } from "@/components/medguard/dashboard/types";

type Notification = {
  id: string;
  type: "alert" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

export default function RealTimeNotificationsCard({ rows }: { rows: PredictionRow[] }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Generate notifications based on data changes
    const criticalRows = rows.filter(r => r.risk === "Critical");
    const newNotifications: Notification[] = [];

    if (criticalRows.length > 0) {
      newNotifications.push({
        id: `critical-${Date.now()}`,
        type: "alert",
        title: "Critical Risk Detected",
        message: `${criticalRows.length} critical risk prescriptions require immediate attention.`,
        timestamp: new Date(),
        read: false,
      });
    }

    const highRiskRows = rows.filter(r => r.risk === "High");
    if (highRiskRows.length > 5) {
      newNotifications.push({
        id: `high-${Date.now()}`,
        type: "warning",
        title: "High Risk Alert",
        message: `${highRiskRows.length} high-risk cases detected. Review recommended.`,
        timestamp: new Date(),
        read: false,
      });
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 10)); // Keep last 10
    }
  }, [rows]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="shadow-card">
      <CardHeader className="gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Real-Time Notifications
          </CardTitle>
          <CardDescription>Live alerts and updates from the AI system</CardDescription>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {unreadCount} new
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        {!notifications.length ? (
          <p className="text-sm text-muted-foreground">No notifications at this time.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-3 transition-all ${
                  notification.read ? "bg-muted/50" : "bg-background border-l-4 border-l-destructive"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          notification.type === "alert" ? "destructive" :
                          notification.type === "warning" ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {notification.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        ✓
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}