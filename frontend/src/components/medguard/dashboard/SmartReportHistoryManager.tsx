import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Search, Filter, FileText, Calendar, TrendingUp } from "lucide-react";

interface Report {
  id: string;
  date: string;
  drugs: string[];
  risk: 'Low' | 'Moderate' | 'High' | 'Critical';
  score: number;
  reportUrl?: string;
  summary: string;
}

export default function SmartReportHistoryManager() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      date: "2024-03-08",
      drugs: ["Aspirin", "Warfarin", "Metformin", "Lisinopril"],
      risk: "High",
      score: 85,
      reportUrl: "#",
      summary: "High bleeding risk detected with Aspirin-Warfarin combination. Monitor closely."
    },
    {
      id: "2",
      date: "2024-03-07",
      drugs: ["Ibuprofen", "Aspirin"],
      risk: "Moderate",
      score: 65,
      reportUrl: "#",
      summary: "GI irritation risk with concurrent NSAID use. Consider alternatives."
    },
    {
      id: "3",
      date: "2024-03-06",
      drugs: ["Amoxicillin", "Birth Control"],
      risk: "Moderate",
      score: 55,
      reportUrl: "#",
      summary: "Antibiotic may reduce contraceptive effectiveness. Use backup protection."
    },
    {
      id: "4",
      date: "2024-03-05",
      drugs: ["Metformin", "Lisinopril"],
      risk: "Low",
      score: 25,
      reportUrl: "#",
      summary: "No significant interactions detected. Continue current regimen."
    },
    {
      id: "5",
      date: "2024-03-04",
      drugs: ["Simvastatin", "Amiodarone"],
      risk: "High",
      score: 90,
      reportUrl: "#",
      summary: "Critical interaction: Increased risk of muscle toxicity and rhabdomyolysis."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Moderate' | 'High' | 'Critical'>('All');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' ||
      report.drugs.some(drug => drug.toLowerCase().includes(searchTerm.toLowerCase())) ||
      report.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || report.risk === riskFilter;
    return matchesSearch && matchesRisk;
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

  const exportAllReports = () => {
    const csvData = filteredReports.map(report => ({
      Date: report.date,
      Drugs: report.drugs.join('; '),
      Risk_Level: report.risk,
      Score: report.score,
      Summary: report.summary
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drug-interaction-reports.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = (report: Report) => {
    // In a real app, this would download the actual PDF report
    alert(`Downloading report for ${report.drugs.join(' + ')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-sm text-muted-foreground">Total Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.risk === 'High' || r.risk === 'Critical').length}
                </div>
                <div className="text-sm text-muted-foreground">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((reports.filter(r => r.risk === 'Low').length / reports.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Safe Combinations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {reports.filter(r => r.reportUrl).length}
                </div>
                <div className="text-sm text-muted-foreground">Downloadable</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Report & History Manager</CardTitle>
          <CardDescription>
            Access and manage your drug interaction analysis reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drugs or reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={riskFilter} onValueChange={(value: any) => setRiskFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Risks</SelectItem>
                <SelectItem value="Low">Low Risk</SelectItem>
                <SelectItem value="Moderate">Moderate Risk</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
                <SelectItem value="Critical">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportAllReports} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Drugs</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No reports found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        {new Date(report.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {report.drugs.map((drug, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {drug}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(report.risk)}>
                          {report.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{report.score}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                report.risk === 'Low' ? 'bg-green-500' :
                                report.risk === 'Moderate' ? 'bg-yellow-500' :
                                report.risk === 'High' ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${report.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate" title={report.summary}>
                          {report.summary}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detailed Report</DialogTitle>
                                <DialogDescription>
                                  Analysis for {report.drugs.join(' + ')} on {new Date(report.date).toLocaleDateString()}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Drugs Analyzed</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {report.drugs.map((drug, index) => (
                                      <Badge key={index} variant="outline">{drug}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Risk Assessment</h4>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getRiskColor(report.risk)}>{report.risk} Risk</Badge>
                                    <span className="text-sm text-muted-foreground">
                                      Score: {report.score}/100
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Analysis Summary</h4>
                                  <p className="text-sm text-muted-foreground">{report.summary}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Recommendations</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Consult with your healthcare provider</li>
                                    <li>• Monitor for side effects</li>
                                    <li>• Consider alternative medications if appropriate</li>
                                  </ul>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {report.reportUrl && (
                            <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Report Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Report Insights</CardTitle>
          <CardDescription>
            Key trends and patterns from your interaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((reports.filter(r => r.risk === 'Low').length / reports.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Safe Combinations</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.risk === 'Moderate').length}
              </div>
              <div className="text-sm text-muted-foreground">Moderate Risk Cases</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.risk === 'High' || r.risk === 'Critical').length}
              </div>
              <div className="text-sm text-muted-foreground">High Risk Cases</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}