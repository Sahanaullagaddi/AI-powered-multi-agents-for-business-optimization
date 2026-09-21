import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "@/components/medguard/dashboard/DashboardOverview";
import PersonalHealthProfile from "@/components/medguard/dashboard/PersonalHealthProfile";
import MedicationManagement from "@/components/medguard/dashboard/MedicationManagement";
import MedicationReminderPlanner from "@/components/medguard/dashboard/MedicationReminderPlanner";
import DrugInteractionHistory from "@/components/medguard/dashboard/DrugInteractionHistory";
import HealthReportsAnalytics from "@/components/medguard/dashboard/HealthReportsAnalytics";
import LanguageAccessibilitySettings from "@/components/medguard/dashboard/LanguageAccessibilitySettings";
import EmergencyAssistance from "@/components/medguard/dashboard/EmergencyAssistance";
import NotificationsCenter from "@/components/medguard/dashboard/NotificationsCenter";
import SmartReportHistoryManager from "@/components/medguard/dashboard/SmartReportHistoryManager";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AppLayout>
      <main className="container py-10">
        <header className="max-w-5xl mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Clinical Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Research-grade polypharmacy safety review: risk timeline, patient profile, optimization suggestions, explainability, and alerts.
                (Demo/mock)
              </p>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Profile</TabsTrigger>
            <TabsTrigger value="medication">Medications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <DashboardOverview />
            <NotificationsCenter />
            <EmergencyAssistance />
          </TabsContent>

          <TabsContent value="health" className="space-y-8">
            <PersonalHealthProfile />
            <DrugInteractionHistory />
            <SmartReportHistoryManager />
          </TabsContent>

          <TabsContent value="medication" className="space-y-8">
            <MedicationManagement />
            <MedicationReminderPlanner />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <HealthReportsAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <LanguageAccessibilitySettings />
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
}
