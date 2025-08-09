import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Search, Filter, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface appointmentType {
  id: number;
  clinicianId: number;
  patientId: number;
  doctorName: string;
  type: string;
  notes: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Clinician: {
      id: number;
      name: string;
  },
  Patient: {
      id: number;
      firstName: string;
      lastName: string;
      mobile: string;
  },
  time: string;
  phone: string;
  patient: string;
  doctor: string;

};

export default function ClinicAppointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [selectedDateModal, setSelectedDateModal] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const reduxData = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<appointmentType[] | []>([]);
  const [activeTab, setActiveTab] = useState("table");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;
  
  const allMonth = {
    '1': 'January',
    '2': 'Febuary',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  }
  const allYear = [];
  for(let i=currentYear; i>=2000; i-- ) {
    allYear.push(i);
  }

  // Generate dates for current month
  const formatDate = (day: number) => `${currentYear}-${currentMonthNum.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  const fetchAppointments = async ({
    month,
    year,
    search = "",
    status = "all",
    doctor = "all"
  }: {
    month?: number;
    year?: number;
    search?: string;
    status?: string;
    doctor?: string;
  }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
      const { data } = await axios.post(
        `${API_URL}clinician/visits`,
        {
          month,
          year,
          search,
          status: status !== "all" ? status : undefined,
          doctor: doctor !== "all" ? doctor : undefined
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reduxData.token}`,
          },
        }
      );
      setAppointments(data?.data);
    } catch (error: any) {
      console.log("Failed to load appointments", error.message);
    }
  };


  useEffect(() => {
    if (activeTab === "calendar") {
      fetchAppointments({
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
        search: searchTerm,
        status: statusFilter,
        doctor: doctorFilter
      });
    } else {
      fetchAppointments({
        search: searchTerm,
        status: statusFilter,
        doctor: doctorFilter,
        month: monthFilter == 'all' ? undefined : Number(monthFilter),
        year: yearFilter == 'all' ? undefined : Number(yearFilter)
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "calendar") {
      fetchAppointments({
        month: currentMonth.getMonth() + 1,
        year: currentMonth.getFullYear(),
        search: searchTerm,
        status: statusFilter,
        doctor: doctorFilter
      });
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchAppointments({
      month: activeTab === "calendar" ? currentMonth.getMonth() + 1 : Number(monthFilter),
      year: activeTab === "calendar" ? currentMonth.getFullYear() : Number(yearFilter),
      search: searchTerm,
      status: statusFilter,
      doctor: doctorFilter
    });
  }, [searchTerm, statusFilter, doctorFilter, monthFilter, yearFilter]);

  const doctors = [
    "Dr. Emily Roberts",
    "Dr. Michael Chen", 
    "Dr. Sarah Wilson",
    "Dr. James Anderson",
    "Dr. Lisa Thompson"
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirm":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "complete":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "cancel":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "outline";
      case "complete":
        return "secondary";
      case "cancel":
        return "destructive";
      default:
        return "outline";
    }
  };

  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    const date = appointment.appointmentDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(appointment);
    return acc;
  }, {} as Record<string, typeof appointments>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirm":
        return "green";
      case "pending":
        return "yellow";
      case "complete":
        return "blue";
      case "cancel":
        return "red";
      default:
        return "gray";
    }
  };

  const generateCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const weeks = [];
    let currentDate = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayAppointments = appointmentsByDate[dateStr] || [];
        const isCurrentMonth = currentDate.getMonth() === month;
        
        days.push({
          date: new Date(currentDate),
          dateStr,
          appointments: dayAppointments,
          isCurrentMonth
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(days);
      
      // Stop if we've filled the month and started next month
      if (currentDate.getMonth() !== month && week >= 4) break;
    }
    
    return weeks;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header 
        title="Appointments"
        userType="clinic"
        userName="Dr. Admin"
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Appointment Management
            </h2>
            <p className="text-muted-foreground">
              View and manage all patient appointments in tabular and calendar formats.
            </p>
          </div>

      
          {/* Tabs for Different Views */}
          <Tabs defaultValue="table" onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-96">
              <TabsTrigger value="table">Tabular View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            {/* Tabular View */}
            <TabsContent value="table">
              {/* Filters */}
              <Card className="shadow-soft border-border/50 mb-3">
                <CardContent className="p-1">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by patient name, doctor, or appointment type..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div> */}
                    <div className="ml-2 flex gap-4">
                      <Select value={monthFilter} onValueChange={setMonthFilter} >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Month</SelectItem>
                          {
                            Object.keys(allMonth).map(m => {
                              return (
                                <SelectItem key={m} value={m}>
                                  {allMonth[m]}
                                </SelectItem>
                              );
                            })
                          }
                        </SelectContent>
                      </Select>
                      <Select value={yearFilter} onValueChange={setYearFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Year</SelectItem>
                          {
                            allYear.map((y) => {
                              return (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                              )
                            })
                          }
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="confirm">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="complete">Completed</SelectItem>
                          <SelectItem value="cancel">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Doctors</SelectItem>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor} value={doctor}>
                              {doctor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" >
                        <Link to="/clinician/request-appointment">
                          Add Appointment
                        </Link>
                      </Button>

                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Appointments Table
                  </CardTitle>
                  <CardDescription>
                    All appointments with detailed information and actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appointment) => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                              <div>
                                <p className="font-semibold">
                                  {appointment.Patient.firstName + ' ' + appointment.Patient.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {appointment.notes}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{appointment.doctorName}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{appointment.appointmentDate}</p>
                                <p className="text-sm text-muted-foreground">{appointment.time}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{appointment.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(appointment.status)}
                                <Badge variant={getStatusVariant(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{appointment.Patient.mobile}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Link to={`/clinician/request-appointment?id=${appointment.id}`}>
                                    Edit
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calendar View */}
            <TabsContent value="calendar">
              <Card className="shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-secondary" />
                      Calendar View
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                      >
                        ←
                      </Button>
                      <span className="text-sm font-medium min-w-[120px] text-center">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigateMonth('next')}
                      >
                        →
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>Click on dates to view appointment details</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="bg-white rounded-lg border">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 border-b">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    {generateCalendarGrid().map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                        {week.map((day, dayIndex) => {
                          const appointmentsForDay = day.appointments.slice(0, 3);
                          const hasMoreAppointments = day.appointments.length > 3;
                          
                          return (
                            <Dialog key={dayIndex}>
                              <DialogTrigger asChild>
                                <div 
                                  className={`min-h-[120px] p-2 border-r last:border-r-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                                    !day.isCurrentMonth ? 'text-muted-foreground bg-muted/20' : ''
                                  }`}
                                  onClick={() => setSelectedDateModal(day.dateStr)}
                                >
                                  {/* Date Number and Badge */}
                                  <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-medium ${
                                      day.date.toDateString() === new Date().toDateString() 
                                        ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs' 
                                        : ''
                                    }`}>
                                      {day.date.getDate()}
                                    </span>
                                    {day.appointments.length > 0 && (
                                      <Badge variant="secondary" className="text-xs h-5 px-1.5">
                                        {day.appointments.length}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Appointments Preview */}
                                  <div className="space-y-1">
                                    {appointmentsForDay.map((appointment) => (
                                      <div 
                                        key={appointment.id} 
                                        className="text-xs p-1.5 rounded border-l-2 bg-muted/50"
                                        style={{ borderLeftColor: `${getStatusColor(appointment.status)}` }}
                                      >
                                        <div className="font-medium truncate">
                                          {appointment.Patient.firstName + ' ' + appointment.Patient.lastName}
                                        </div>
                                        <div className="text-muted-foreground">{appointment.time}</div>
                                      </div>
                                    ))}
                                    
                                    {hasMoreAppointments && (
                                      <button className="text-xs text-primary hover:underline w-full text-left">
                                        View All ({day.appointments.length})
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </DialogTrigger>
                              
                              {/* Appointment Details Modal */}
                              <DialogContent className="max-w-2xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>
                                    Appointments for {day.date.toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </DialogTitle>
                                </DialogHeader>
                                
                                <ScrollArea className="max-h-[60vh]">
                                  {day.appointments.length > 0 ? (
                                    <div className="space-y-4">
                                      {day.appointments
                                        .sort((a, b) => a.time.localeCompare(b.time))
                                        .map((appointment) => (
                                        <div key={appointment.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                          <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                              <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(appointment.status)}`} />
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                  <h4 className="font-semibold">
                                                    {appointment.Patient.firstName + ' ' + appointment.Patient.lastName}
                                                  </h4>
                                                  <Badge variant={getStatusVariant(appointment.status)} className="text-xs">
                                                    {appointment.status}
                                                  </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-1">{appointment.time}</p>
                                                <p className="text-sm text-muted-foreground mb-1">{appointment.doctorName}</p>
                                                <p className="text-sm text-muted-foreground mb-2">{appointment.type}</p>
                                                {appointment.notes && (
                                                  <p className="text-sm bg-muted p-2 rounded">{appointment.notes}</p>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button size="sm" variant="outline">
                                                <Link to={`/clinician/request-appointment?id=${appointment.id}`}>
                                                  Edit
                                                </Link>
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                      <p className="text-muted-foreground">No appointments scheduled for this date</p>
                                    </div>
                                  )}
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}