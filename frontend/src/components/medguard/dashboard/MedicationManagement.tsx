import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pill, Plus, Edit, Trash2, Clock } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
}

export default function MedicationManagement() {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timing: ["Morning"],
      startDate: "2024-01-15",
      notes: "Take with food"
    },
    {
      id: "2",
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      timing: ["Morning"],
      startDate: "2024-02-01"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [newMed, setNewMed] = useState<Partial<Medication>>({
    timing: []
  });

  const handleAddMedication = () => {
    if (newMed.name && newMed.dosage) {
      const med: Medication = {
        id: Date.now().toString(),
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency || "Once daily",
        timing: newMed.timing || [],
        startDate: newMed.startDate || new Date().toISOString().split('T')[0],
        endDate: newMed.endDate,
        notes: newMed.notes
      };
      setMedications([...medications, med]);
      setNewMed({ timing: [] });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditMedication = (med: Medication) => {
    setEditingMed(med);
    setNewMed(med);
  };

  const handleUpdateMedication = () => {
    if (editingMed && newMed.name && newMed.dosage) {
      setMedications(medications.map(m => m.id === editingMed.id ? { ...newMed, id: editingMed.id } as Medication : m));
      setEditingMed(null);
      setNewMed({ timing: [] });
    }
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const toggleTiming = (time: string) => {
    const currentTiming = newMed.timing || [];
    const newTiming = currentTiming.includes(time)
      ? currentTiming.filter(t => t !== time)
      : [...currentTiming, time];
    setNewMed({ ...newMed, timing: newTiming });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="h-5 w-5 text-blue-500" />
            <CardTitle>Medication Management</CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details of your medication.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newMed.name || ""}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dosage" className="text-right">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMed.dosage || ""}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">Frequency</Label>
                  <Select value={newMed.frequency || "Once daily"} onValueChange={(value) => setNewMed({ ...newMed, frequency: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Timing</Label>
                  <div className="col-span-3 flex gap-2">
                    {["Morning", "Afternoon", "Evening", "Night"].map(time => (
                      <Button
                        key={time}
                        variant={(newMed.timing || []).includes(time) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTiming(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newMed.startDate || ""}
                    onChange={(e) => setNewMed({ ...newMed, startDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMedication}>Add Medication</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Track and manage your current medications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.id}>
                <TableCell className="font-medium">{med.name}</TableCell>
                <TableCell>{med.dosage}</TableCell>
                <TableCell>{med.frequency}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {med.timing.map(time => (
                      <Badge key={time} variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditMedication(med)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteMedication(med.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}