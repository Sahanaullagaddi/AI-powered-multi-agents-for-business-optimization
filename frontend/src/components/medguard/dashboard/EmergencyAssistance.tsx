import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, MapPin, Ambulance, Pill, Stethoscope, AlertTriangle, Clock } from "lucide-react";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface Hospital {
  name: string;
  address: string;
  phone: string;
  distance: string;
  emergency: boolean;
}

export default function EmergencyAssistance() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "Dr. Sarah Johnson", phone: "+1-555-0123", relationship: "Primary Care Physician" },
    { name: "John Doe (Spouse)", phone: "+1-555-0456", relationship: "Family" }
  ]);

  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({});
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const nearbyHospitals: Hospital[] = [
    {
      name: "City General Hospital",
      address: "123 Medical Center Dr, Downtown",
      phone: "+1-555-1000",
      distance: "2.3 km",
      emergency: true
    },
    {
      name: "Regional Medical Center",
      address: "456 Health Blvd, Midtown",
      phone: "+1-555-2000",
      distance: "4.1 km",
      emergency: true
    },
    {
      name: "Community Clinic",
      address: "789 Care Street, Uptown",
      phone: "+1-555-3000",
      distance: "1.8 km",
      emergency: false
    }
  ];

  const emergencyDrugs = [
    { name: "Epinephrine Auto-Injector", dosage: "0.3mg", indication: "Severe allergic reaction" },
    { name: "Aspirin", dosage: "325mg", indication: "Heart attack symptoms" },
    { name: "Nitroglycerin", dosage: "0.4mg", indication: "Chest pain" },
    { name: "Glucagon", dosage: "1mg", indication: "Severe hypoglycemia" }
  ];

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([...emergencyContacts, newContact as EmergencyContact]);
      setNewContact({});
      setIsAddContactOpen(false);
    }
  };

  const callEmergency = (number: string) => {
    window.open(`tel:${number}`);
  };

  const getDirections = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Emergency Services:</strong> If you are experiencing a medical emergency, call emergency services immediately (911 in US).
        </AlertDescription>
      </Alert>

      {/* Quick Emergency Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => callEmergency("911")}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Ambulance className="h-12 w-12 text-red-500 mb-2" />
            <h3 className="font-semibold text-red-700">Call Emergency</h3>
            <p className="text-sm text-muted-foreground">911</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => callEmergency(emergencyContacts[0]?.phone)}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Phone className="h-12 w-12 text-blue-500 mb-2" />
            <h3 className="font-semibold text-blue-700">Call Doctor</h3>
            <p className="text-sm text-muted-foreground">Primary Physician</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => getDirections(nearbyHospitals[0].address)}>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <MapPin className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="font-semibold text-green-700">Find Hospital</h3>
            <p className="text-sm text-muted-foreground">Nearest Emergency</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-blue-500" />
              <CardTitle>Emergency Contacts</CardTitle>
            </div>
            <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
              <DialogTrigger asChild>
                <Button>Add Contact</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add someone to contact in case of emergency.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-name" className="text-right">Name</Label>
                    <Input
                      id="contact-name"
                      value={newContact.name || ""}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact-phone" className="text-right">Phone</Label>
                    <Input
                      id="contact-phone"
                      value={newContact.phone || ""}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="relationship" className="text-right">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newContact.relationship || ""}
                      onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddContact}>Add Contact</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Important contacts for emergency situations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => callEmergency(contact.phone)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Hospitals */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-500" />
            <CardTitle>Nearby Hospitals & Clinics</CardTitle>
          </div>
          <CardDescription>
            Medical facilities in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nearbyHospitals.map((hospital, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{hospital.name}</span>
                    {hospital.emergency && (
                      <Badge variant="destructive" className="text-xs">
                        <Ambulance className="h-3 w-3 mr-1" />
                        Emergency
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{hospital.address}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{hospital.distance} away</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => callEmergency(hospital.phone)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getDirections(hospital.address)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Drug Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Pill className="h-5 w-5 text-purple-500" />
            <CardTitle>Emergency Drug Information</CardTitle>
          </div>
          <CardDescription>
            Important medications to have on hand for emergencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyDrugs.map((drug, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{drug.name}</h4>
                  <Badge variant="outline">{drug.dosage}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{drug.indication}</p>
                <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Keep in emergency kit</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Preparedness Tips */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-indigo-500" />
            <CardTitle>Emergency Preparedness</CardTitle>
          </div>
          <CardDescription>
            Tips to stay prepared for medical emergencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Emergency Kit Essentials</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• First aid supplies</li>
                <li>• Emergency medications</li>
                <li>• Medical history documents</li>
                <li>• Emergency contact list</li>
                <li>• Flashlight and batteries</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">When to Seek Emergency Care</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chest pain or pressure</li>
                <li>• Difficulty breathing</li>
                <li>• Severe allergic reactions</li>
                <li>• Sudden confusion or weakness</li>
                <li>• Heavy bleeding</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}