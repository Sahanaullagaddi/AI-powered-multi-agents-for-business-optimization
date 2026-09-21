import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Edit,
  Save,
  X,
  ShieldAlert,
  Pill,
  Activity,
  Heart,
  FileText,
  Plus,
  Scale,
  Droplet,
  Sparkles,
  RotateCcw,
  Stethoscope,
  Phone,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface HealthProfile {
  name: string;
  patientId: string;
  age: string;
  gender: string;
  bloodType: string;
  height: string;
  weight: string;
  kidneyFunction: string;
  liverFunction: string;
  medicalHistory: string;
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const DEFAULT_PROFILE: HealthProfile = {
  name: "John Doe",
  patientId: "PT-8421",
  age: "35",
  gender: "Male",
  bloodType: "O+",
  height: "178",
  weight: "74",
  kidneyFunction: "Normal (eGFR > 90)",
  liverFunction: "Normal Function",
  medicalHistory: "Diagnosed with Stage 1 Essential Hypertension in 2022. No history of major surgeries. Regular annual clinical checkups.",
  allergies: ["Penicillin", "Shellfish", "Sulfa Drugs"],
  chronicDiseases: ["Hypertension", "Mild Hyperlipidemia"],
  currentMedications: ["Lisinopril 10mg (Daily)", "Aspirin 81mg (Morning)", "Atorvastatin 20mg (Night)"],
  emergencyContactName: "Sarah Doe (Spouse)",
  emergencyContactPhone: "+1 (555) 234-5678"
};

export default function PersonalHealthProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage or default
  const [profile, setProfile] = useState<HealthProfile>(() => {
    try {
      const saved = localStorage.getItem("medguard_health_profile");
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [editForm, setEditForm] = useState<HealthProfile>(profile);

  // Input states for adding tags in edit mode
  const [newAllergy, setNewAllergy] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [newMed, setNewMed] = useState("");

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("medguard_health_profile", JSON.stringify(profile));
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  }, [profile]);

  const handleStartEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
    toast({
      title: "Profile Updated ✨",
      description: "Your health profile has been saved successfully for AI analysis.",
    });
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    setProfile(DEFAULT_PROFILE);
    setEditForm(DEFAULT_PROFILE);
    setIsEditing(false);
    toast({
      title: "Profile Reset",
      description: "Restored sample clinical patient profile.",
    });
  };

  const addTag = (field: "allergies" | "chronicDiseases" | "currentMedications", val: string, setVal: (v: string) => void) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (editForm[field].includes(trimmed)) {
      toast({ title: "Item already exists", variant: "destructive" });
      return;
    }
    setEditForm({
      ...editForm,
      [field]: [...editForm[field], trimmed]
    });
    setVal("");
  };

  const removeTag = (field: "allergies" | "chronicDiseases" | "currentMedications", idx: number) => {
    setEditForm({
      ...editForm,
      [field]: editForm[field].filter((_, i) => i !== idx)
    });
  };

  // Calculate BMI
  const heightM = parseFloat(profile.height) / 100;
  const weightKg = parseFloat(profile.weight);
  const bmi = heightM > 0 && weightKg > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : "23.4";

  return (
    <Card className="border shadow-sm overflow-hidden">
      {/* Card Header */}
      <CardHeader className="bg-muted/30 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-100 text-blue-600 shadow-xs">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold">Personal Health Profile</CardTitle>
                <Badge variant="outline" className="text-xs bg-background font-mono">
                  {profile.patientId || "PT-8421"}
                </Badge>
              </div>
              <CardDescription className="text-xs mt-0.5">
                Clinical demographics, organ clearance status, and medication safety baseline
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {!isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleResetToDefault} title="Reset to demo patient">
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Reset
                </Button>
                <Button variant="default" size="sm" onClick={handleStartEdit} className="bg-primary text-primary-foreground gap-1.5 shadow-xs">
                  <Edit className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1.5">
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs">
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {!isEditing ? (
          /* ==================== VIEW MODE ==================== */
          <div className="space-y-6">
            {/* Vitals & Demographics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-muted/40 rounded-xl border space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Patient Name</p>
                <p className="text-sm font-semibold truncate text-foreground">{profile.name}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Age & Gender</p>
                <p className="text-sm font-semibold text-foreground">
                  {profile.age} yrs • {profile.gender}
                </p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Blood Type</p>
                <div className="flex items-center gap-1.5">
                  <Droplet className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                  <span className="text-sm font-semibold text-foreground">{profile.bloodType || "O+"}</span>
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Body Metrics</p>
                <div className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {profile.weight}kg • {profile.height}cm
                  </span>
                </div>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Calculated BMI</p>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-sm font-semibold text-foreground">{bmi} (Normal)</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50/70 border-blue-200 rounded-xl border space-y-1">
                <p className="text-xs text-blue-700 font-medium">AI Risk Profile</p>
                <Badge className="bg-blue-600 hover:bg-blue-600 text-[10px] py-0 px-2">
                  Monitored
                </Badge>
              </div>
            </div>

            {/* Organ Function Metrics (Crucial for DDI) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Renal / Kidney Clearance</p>
                    <p className="text-sm font-semibold text-foreground">{profile.kidneyFunction}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-xs">
                  Optimal Clearance
                </Badge>
              </div>

              <div className="p-4 rounded-xl border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Hepatic / Liver Metabolism</p>
                    <p className="text-sm font-semibold text-foreground">{profile.liverFunction}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  CYP450 Normal
                </Badge>
              </div>
            </div>

            {/* Medical History Section */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText className="h-4 w-4 text-primary" />
                <span>Clinical Notes & Medical History</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.medicalHistory || "No significant medical history documented."}
              </p>
            </div>

            {/* Allergies, Chronic Diseases & Medications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Allergies */}
              <div className="p-4 rounded-xl border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold">Known Allergies</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {profile.allergies.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.allergies.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No known drug/food allergies</span>
                  ) : (
                    profile.allergies.map((allergy, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 text-xs py-1 px-2.5"
                      >
                        ⚠️ {allergy}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Chronic Diseases */}
              <div className="p-4 rounded-xl border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-semibold">Chronic Conditions</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {profile.chronicDiseases.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.chronicDiseases.length === 0 ? (
                    <span className="text-xs text-muted-foreground">None documented</span>
                  ) : (
                    profile.chronicDiseases.map((disease, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100 text-xs py-1 px-2.5 font-medium"
                      >
                        {disease}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Current Medications */}
              <div className="p-4 rounded-xl border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold">Active Prescriptions</span>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {profile.currentMedications.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.currentMedications.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No active medications</span>
                  ) : (
                    profile.currentMedications.map((med, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100 text-xs py-1 px-2.5"
                      >
                        💊 {med}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact & Clinical Safety Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border bg-muted/20 text-xs text-muted-foreground gap-3">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>
                  <strong className="text-foreground">Emergency Contact:</strong> {profile.emergencyContactName} (
                  {profile.emergencyContactPhone})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Synchronized with AI Drug Interaction Engine</span>
              </div>
            </div>
          </div>
        ) : (
          /* ==================== EDIT MODE ==================== */
          <div className="space-y-6">
            {/* Primary Demographics */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="name" className="text-xs font-semibold">Full Name *</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Patient Name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="patientId" className="text-xs font-semibold">Patient ID</Label>
                <Input
                  id="patientId"
                  value={editForm.patientId}
                  onChange={(e) => setEditForm({ ...editForm, patientId: e.target.value })}
                  placeholder="e.g. PT-8421"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-xs font-semibold">Age (Years) *</Label>
                <Input
                  id="age"
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  placeholder="35"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="text-xs font-semibold">Biological Sex</Label>
                <Select
                  value={editForm.gender}
                  onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vitals & Organ Clearance Fields */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="bloodType" className="text-xs font-semibold">Blood Group</Label>
                <Select
                  value={editForm.bloodType}
                  onValueChange={(value) => setEditForm({ ...editForm, bloodType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight" className="text-xs font-semibold">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                  placeholder="70"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="kidney" className="text-xs font-semibold">Renal Function (Kidney)</Label>
                <Select
                  value={editForm.kidneyFunction}
                  onValueChange={(value) => setEditForm({ ...editForm, kidneyFunction: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Kidney clearance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal (eGFR > 90)">Normal (eGFR &gt; 90)</SelectItem>
                    <SelectItem value="Mild Impairment (eGFR 60-89)">Mild Impairment (eGFR 60-89)</SelectItem>
                    <SelectItem value="Moderate Impairment (eGFR 30-59)">Moderate Impairment (eGFR 30-59)</SelectItem>
                    <SelectItem value="Severe Impairment (eGFR < 30)">Severe Impairment (eGFR &lt; 30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="liver" className="text-xs font-semibold">Hepatic Function (Liver)</Label>
                <Select
                  value={editForm.liverFunction}
                  onValueChange={(value) => setEditForm({ ...editForm, liverFunction: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Liver function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal Function">Normal Function</SelectItem>
                    <SelectItem value="Mild Impairment">Mild Impairment</SelectItem>
                    <SelectItem value="Moderate Cirrhosis">Moderate Cirrhosis</SelectItem>
                    <SelectItem value="Severe Failure">Severe Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Medical History */}
            <div>
              <Label htmlFor="history" className="text-xs font-semibold">Medical History & Surgical Notes</Label>
              <Textarea
                id="history"
                value={editForm.medicalHistory}
                onChange={(e) => setEditForm({ ...editForm, medicalHistory: e.target.value })}
                rows={3}
                placeholder="Enter significant medical diagnoses, surgeries, or chronic symptoms..."
                className="mt-1"
              />
            </div>

            {/* Tag Management: Allergies, Chronic Diseases, Medications */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Allergies */}
              <div className="space-y-2 p-3.5 border rounded-xl bg-card">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Allergies
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Aspirin, Peanuts"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("allergies", newAllergy, setNewAllergy);
                      }
                    }}
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() => addTag("allergies", newAllergy, setNewAllergy)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] pt-1">
                  {editForm.allergies.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer bg-amber-50 text-amber-800 border-amber-200 text-xs py-1 px-2 flex items-center gap-1"
                      onClick={() => removeTag("allergies", idx)}
                      title="Click to remove"
                    >
                      {item} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Chronic Diseases */}
              <div className="space-y-2 p-3.5 border rounded-xl bg-card">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> Chronic Conditions
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Asthma, Diabetes"
                    value={newDisease}
                    onChange={(e) => setNewDisease(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("chronicDiseases", newDisease, setNewDisease);
                      }
                    }}
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() => addTag("chronicDiseases", newDisease, setNewDisease)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] pt-1">
                  {editForm.chronicDiseases.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="destructive"
                      className="cursor-pointer bg-rose-50 text-rose-800 border-rose-200 text-xs py-1 px-2 flex items-center gap-1"
                      onClick={() => removeTag("chronicDiseases", idx)}
                      title="Click to remove"
                    >
                      {item} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-2 p-3.5 border rounded-xl bg-card">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Pill className="h-3.5 w-3.5 text-blue-600" /> Active Medications
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Metformin 500mg"
                    value={newMed}
                    onChange={(e) => setNewMed(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag("currentMedications", newMed, setNewMed);
                      }
                    }}
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 px-2.5 text-xs"
                    onClick={() => addTag("currentMedications", newMed, setNewMed)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] pt-1">
                  {editForm.currentMedications.map((item, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer bg-blue-50 text-blue-800 border-blue-200 text-xs py-1 px-2 flex items-center gap-1"
                      onClick={() => removeTag("currentMedications", idx)}
                      title="Click to remove"
                    >
                      {item} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Contact Information */}
            <div className="grid gap-4 md:grid-cols-2 p-3.5 border rounded-xl bg-muted/30">
              <div>
                <Label htmlFor="contactName" className="text-xs font-semibold">Emergency Contact Name</Label>
                <Input
                  id="contactName"
                  value={editForm.emergencyContactName}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContactName: e.target.value })}
                  placeholder="e.g. Jane Doe (Relative)"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone" className="text-xs font-semibold">Emergency Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={editForm.emergencyContactPhone}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContactPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
