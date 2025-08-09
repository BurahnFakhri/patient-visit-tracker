import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClinicDashboard() {
  const clinicName = "Mercy General Medical Center";
  
  const todayStats = {
    appointments: 24,
    completed: 18,
    pending: 6,
    cancelled: 2
  };

  const monthStats = {
    total: 520,
    completed: 480,
    pending: 25,
    cancelled: 15
  };

  const yearStats = {
    total: 6240,
    completed: 5850,
    pending: 195,
    cancelled: 195
  };

  const upcomingAppointments = [
    { id: 1, patient: "Sarah Johnson", doctor: "Dr. Emily Roberts", time: "10:00 AM", type: "Cardiology", status: "confirmed" },
    { id: 2, patient: "Michael Chen", doctor: "Dr. Sarah Wilson", time: "10:30 AM", type: "Dermatology", status: "confirmed" },
    { id: 3, patient: "Emma Davis", doctor: "Dr. Michael Chen", time: "11:00 AM", type: "General", status: "pending" },
    { id: 4, patient: "James Wilson", doctor: "Dr. Emily Roberts", time: "11:30 AM", type: "Follow-up", status: "confirmed" }
  ];

  const pendingRequests = [
    { id: 1, patient: "Lisa Thompson", requestedDate: "March 18, 2024", type: "General Consultation", priority: "normal" },
    { id: 2, patient: "David Martinez", requestedDate: "March 17, 2024", type: "Emergency", priority: "high" },
    { id: 3, patient: "Anna Roberts", requestedDate: "March 19, 2024", type: "Follow-up", priority: "normal" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header 
        title='Dashboard'
        userType="clinic"
        userName="Dr. Admin"
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to your clinic dashboard 🏥
          </h2>
          <p className="text-muted-foreground">
            Here's your clinic overview with today's activities and key metrics.
          </p>
        </div>

        {/* Today's Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Appointments Today"
              value={todayStats.appointments}
              description="Total scheduled"
              icon={Calendar}
              className="bg-gradient-to-br from-primary-lighter to-primary/10"
            />
            <StatCard
              title="Completed"
              value={todayStats.completed}
              description="Successfully finished"
              icon={Activity}
              trend="up"
              trendValue="75% completion rate"
              className="bg-gradient-to-br from-success/20 to-success/5"
            />
            <StatCard
              title="Pending"
              value={todayStats.pending}
              description="Awaiting confirmation"
              icon={Clock}
              className="bg-gradient-to-br from-warning/20 to-warning/5"
            />
            <StatCard
              title="Cancelled"
              value={todayStats.cancelled}
              description="Cancelled today"
              icon={AlertCircle}
              className="bg-gradient-to-br from-destructive/20 to-destructive/5"
            />
          </div>
        </div>

        {/* Monthly and Yearly Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                This Month
              </CardTitle>
              <CardDescription>March 2024 statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-foreground">{monthStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Appointments</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-2xl font-bold text-success">{monthStats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                This Year
              </CardTitle>
              <CardDescription>2024 annual overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold text-foreground">{yearStats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Appointments</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <div className="text-2xl font-bold text-success">{yearStats.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Next appointments scheduled for today</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/clinic/appointments">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.patient}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{appointment.time}</p>
                      <Badge 
                        variant={appointment.status === "confirmed" ? "default" : "outline"}
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Requests */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Pending Requests
                  </CardTitle>
                  <CardDescription>Appointment requests awaiting approval</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/clinic/requests">Manage All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{request.patient}</p>
                        <p className="text-sm text-muted-foreground">{request.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{request.requestedDate}</p>
                      <Badge 
                        variant={request.priority === "high" ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {request.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-soft border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common clinic management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild className="h-auto p-4 flex-col gap-2">
                <Link to="/clinic/appointments">
                  <Calendar className="h-6 w-6" />
                  View Appointments
                </Link>
              </Button>
              {/* <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/clinic/requests">
                  <Clock className="h-6 w-6" />
                  Manage Requests
                </Link>
              </Button> */}
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="/clinician/profile">
                  <Users className="h-6 w-6" />
                  Clinic Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                <Link to="#">
                  <TrendingUp className="h-6 w-6" />
                  Reports
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}