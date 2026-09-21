import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { History, Search, Download, Filter } from "lucide-react";

interface InteractionRecord {
  id: string;
  date: string;
  drugs: string[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  score: number;
  organs: string[];
  notes?: string;
}

export default function DrugInteractionHistory() {
  const [interactions, setInteractions] = useState<InteractionRecord[]>([
    {
      id: "1",
      date: "2024-03-08",
      drugs: ["Aspirin", "Warfarin"],
      riskLevel: "High",
      score: 85,
      organs: ["Heart", "Blood"],
      notes: "Increased bleeding risk"
    },
    {
      id: "2",
      date: "2024-03-07",
      drugs: ["Metformin", "Lisinopril"],
      riskLevel: "Low",
      score: 25,
      organs: ["Kidney"],
      notes: "Monitor kidney function"
    },
    {
      id: "3",
      date: "2024-03-06",
      drugs: ["Ibuprofen", "Aspirin"],
      riskLevel: "Moderate",
      score: 60,
      organs: ["Stomach", "Heart"],
      notes: "GI bleeding risk"
    },
    {
      id: "4",
      date: "2024-03-05",
      drugs: ["Amoxicillin", "Birth Control"],
      riskLevel: "Moderate",
      score: 55,
      organs: ["Reproductive"],
      notes: "Reduced contraceptive effectiveness"
    }
  ]);

  const [filter, setFilter] = useState<'All' | 'Low' | 'Moderate' | 'High' | 'Critical'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInteractions = interactions.filter(interaction => {
    const matchesFilter = filter === 'All' || interaction.riskLevel === filter;
    const matchesSearch = searchTerm === '' ||
      interaction.drugs.some(drug => drug.toLowerCase().includes(searchTerm.toLowerCase())) ||
      interaction.organs.some(organ => organ.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const csvData = filteredInteractions.map(interaction => ({
      Date: interaction.date,
      Drugs: interaction.drugs.join('; '),
      Risk_Level: interaction.riskLevel,
      Score: interaction.score,
      Affected_Organs: interaction.organs.join('; '),
      Notes: interaction.notes || ''
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drug-interaction-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-500" />
            <CardTitle>Drug Interaction History</CardTitle>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <CardDescription>
          Review your previous drug interaction analyses and risk assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drugs or organs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risk Levels</SelectItem>
              <SelectItem value="Low">Low Risk</SelectItem>
              <SelectItem value="Moderate">Moderate Risk</SelectItem>
              <SelectItem value="High">High Risk</SelectItem>
              <SelectItem value="Critical">Critical Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Drugs</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Affected Organs</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No interaction records found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInteractions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell className="font-medium">
                      {new Date(interaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {interaction.drugs.map((drug, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {drug}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(interaction.riskLevel)}>
                        {interaction.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{interaction.score}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              interaction.riskLevel === 'Low' ? 'bg-green-500' :
                              interaction.riskLevel === 'Moderate' ? 'bg-yellow-500' :
                              interaction.riskLevel === 'High' ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${interaction.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {interaction.organs.map((organ, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {organ}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {interaction.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {filteredInteractions.filter(i => i.riskLevel === 'Low').length}
            </div>
            <div className="text-sm text-muted-foreground">Low Risk</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredInteractions.filter(i => i.riskLevel === 'Moderate').length}
            </div>
            <div className="text-sm text-muted-foreground">Moderate Risk</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {filteredInteractions.filter(i => i.riskLevel === 'High').length}
            </div>
            <div className="text-sm text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {filteredInteractions.filter(i => i.riskLevel === 'Critical').length}
            </div>
            <div className="text-sm text-muted-foreground">Critical Risk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}