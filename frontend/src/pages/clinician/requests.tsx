import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, Search, Filter, Clock, CheckCircle, XCircle, Calendar, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AppointmentRequests() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const [requests, setRequests] = useState([
    {
      id: 1,
      patient: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phone: "+1 (555) 567-8901",
      requestedDate: "2024-03-18",
      preferredTime: "2:00 PM",
      alternativeTime: "3:00 PM",
      type: "General Consultation",
      priority: "normal",
      notes: "Experiencing persistent headaches for the past week. Would like to schedule a consultation to discuss symptoms and potential causes.",
      requestDate: "2024-03-15",
      status: "pending"
    },
    {
      id: 2,
      patient: "David Martinez",
      email: "david.martinez@email.com",
      phone: "+1 (555) 678-9012",
      requestedDate: "2024-03-17",
      preferredTime: "10:00 AM",
      alternativeTime: "11:00 AM",
      type: "Emergency Consultation",
      priority: "high",
      notes: "Severe chest pain that started this morning. Need urgent medical attention.",
      requestDate: "2024-03-15",
      status: "pending"
    },
    {
      id: 3,
      patient: "Anna Roberts",
      email: "anna.roberts@email.com",
      phone: "+1 (555) 789-0123",
      requestedDate: "2024-03-19",
      preferredTime: "9:30 AM",
      alternativeTime: "10:30 AM",
      type: "Follow-up Visit",
      priority: "normal",
      notes: "Follow-up appointment for blood test results from last week's visit with Dr. Chen.",
      requestDate: "2024-03-14",
      status: "pending"
    },
    {
      id: 4,
      patient: "Robert Johnson",
      email: "robert.johnson@email.com",
      phone: "+1 (555) 890-1234",
      requestedDate: "2024-03-20",
      preferredTime: "3:30 PM",
      alternativeTime: "4:00 PM",
      type: "Specialist Consultation",
      priority: "normal",
      notes: "Referral from primary care physician for dermatology consultation regarding skin condition.",
      requestDate: "2024-03-15",
      status: "pending"
    },
    {
      id: 5,
      patient: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1 (555) 901-2345",
      requestedDate: "2024-03-16",
      preferredTime: "11:00 AM",
      alternativeTime: "2:00 PM",
      type: "Routine Checkup",
      priority: "low",
      notes: "Annual physical examination and routine lab work.",
      requestDate: "2024-03-13",
      status: "approved"
    }
  ]);

  const appointmentTypes = [
    "General Consultation",
    "Emergency Consultation",
    "Follow-up Visit",
    "Specialist Consultation",
    "Routine Checkup"
  ];

  const handleApprove = (requestId: number) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "approved" } : req
    ));
    toast({
      title: "Request Approved",
      description: "The appointment request has been approved and the patient will be notified.",
    });
  };

  const handleReject = (requestId: number) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: "rejected" } : req
    ));
    toast({
      title: "Request Rejected",
      description: "The appointment request has been rejected and the patient will be notified.",
      variant: "destructive",
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    
    return matchesSearch && matchesPriority && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header 
        title="Appointment Requests"
        userType="clinic"
        userName="Dr. Admin"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Appointment Request Management
            </h2>
            <p className="text-muted-foreground">
              Review and manage incoming appointment requests from patients.
            </p>
          </div>

          {/* Filters */}
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by patient name, email, or appointment type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Pending Requests
              </CardTitle>
              <CardDescription>
                {filteredRequests.filter(r => r.status === "pending").length} requests awaiting your review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{request.patient}</p>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                            <p className="text-sm text-muted-foreground">{request.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.requestedDate}</p>
                            <p className="text-sm text-muted-foreground">
                              Preferred: {request.preferredTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Alternative: {request.alternativeTime}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(request.priority)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className="capitalize text-sm">{request.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Appointment Request Details</DialogTitle>
                                  <DialogDescription>
                                    Review the complete information for this appointment request
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                          <User className="h-4 w-4" />
                                          Patient Information
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                          <p><strong>Name:</strong> {selectedRequest.patient}</p>
                                          <p><strong>Email:</strong> {selectedRequest.email}</p>
                                          <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                          <Calendar className="h-4 w-4" />
                                          Appointment Details
                                        </h4>
                                        <div className="space-y-1 text-sm">
                                          <p><strong>Type:</strong> {selectedRequest.type}</p>
                                          <p><strong>Date:</strong> {selectedRequest.requestedDate}</p>
                                          <p><strong>Preferred Time:</strong> {selectedRequest.preferredTime}</p>
                                          <p><strong>Alternative:</strong> {selectedRequest.alternativeTime}</p>
                                          <div className="mt-2">
                                            {getPriorityBadge(selectedRequest.priority)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Patient Notes
                                      </h4>
                                      <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm">{selectedRequest.notes}</p>
                                      </div>
                                    </div>

                                    {selectedRequest.status === "pending" && (
                                      <div className="flex gap-3 pt-4">
                                        <Button 
                                          onClick={() => handleApprove(selectedRequest.id)}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve Request
                                        </Button>
                                        <Button 
                                          variant="destructive"
                                          onClick={() => handleReject(selectedRequest.id)}
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject Request
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {request.status === "pending" && (
                              <>
                                <Button 
                                  size="sm"
                                  onClick={() => handleApprove(request.id)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleReject(request.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}