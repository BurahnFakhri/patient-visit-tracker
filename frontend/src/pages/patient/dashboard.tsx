import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, User, Activity, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const patientName = "Sarah Johnson";
  const visitCount = 12;
  
  const upcomingAppointment = {
    doctor: "Dr. Emily Roberts",
    specialty: "Cardiology",
    date: "March 15, 2024",
    time: "2:30 PM",
    location: "Room 205"
  };

  const recentVisits = [
    { date: "Feb 28, 2024", doctor: "Dr. Michael Chen", type: "General Checkup", status: "completed" },
    { date: "Feb 15, 2024", doctor: "Dr. Sarah Wilson", type: "Blood Test", status: "completed" },
    { date: "Jan 20, 2024", doctor: "Dr. Emily Roberts", type: "Cardiology", status: "completed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header 
        title={`Welcome, ${patientName}`}
        userType="patient"
        userName={patientName}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Good morning, {patientName.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's your health dashboard with the latest updates.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Doctor Visits"
            value={visitCount}
            description="All-time appointments"
            icon={Activity}
            trend="up"
            trendValue="2 this month"
          />
          <StatCard
            title="Next Appointment"
            value="3 days"
            description="Until your next visit"
            icon={Clock}
            className="bg-gradient-to-br from-secondary-lighter to-secondary/10"
          />
          <StatCard
            title="Health Score"
            value="92%"
            description="Based on recent checkups"
            icon={User}
            trend="up"
            trendValue="+5% from last month"
            className="bg-gradient-to-br from-accent-lighter to-accent/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointment */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Appointment
                  </CardTitle>
                  <CardDescription>Your next scheduled visit</CardDescription>
                </div>
                <Badge className="bg-secondary text-secondary-foreground">Confirmed</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-primary-lighter to-secondary-lighter p-4 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{upcomingAppointment.doctor}</h4>
                    <p className="text-sm text-muted-foreground">{upcomingAppointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{upcomingAppointment.date}</p>
                    <p className="text-sm text-muted-foreground">{upcomingAppointment.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {upcomingAppointment.location}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your healthcare easily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild size="lg" className="w-full justify-start bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary">
                <Link to="#">
                  <Plus className="h-5 w-5 mr-3" />
                  Request New Appointment
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full justify-start">
                <Link to="/patient/profile">
                  <User className="h-5 w-5 mr-3" />
                  Update Profile
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full justify-start">
                <Link to="/patient/appointments">
                  <Activity className="h-5 w-5 mr-3" />
                  View Visit History
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visits */}
        <Card className="mt-8 shadow-soft border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Visits</CardTitle>
                <CardDescription>Your latest medical appointments</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/patient/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisits.map((visit, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{visit.doctor}</p>
                      <p className="text-sm text-muted-foreground">{visit.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{visit.date}</p>
                    <Badge variant="outline" className="text-xs">
                      {visit.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}