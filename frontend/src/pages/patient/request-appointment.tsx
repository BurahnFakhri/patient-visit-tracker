import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RequestAppointment() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const doctors = [
    { id: "1", name: "Dr. Emily Roberts", specialty: "Cardiology", available: true },
    { id: "2", name: "Dr. Michael Chen", specialty: "Internal Medicine", available: true },
    { id: "3", name: "Dr. Sarah Wilson", specialty: "Dermatology", available: true },
    { id: "4", name: "Dr. James Anderson", specialty: "Orthopedics", available: false },
    { id: "5", name: "Dr. Lisa Thompson", specialty: "Gynecology", available: true },
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];

  const appointmentTypes = [
    "General Consultation",
    "Follow-up Visit",
    "Routine Checkup",
    "Specialist Consultation",
    "Emergency Consultation"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedDoctor || !selectedTime || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Appointment Request Submitted",
      description: "Your appointment request has been sent to the clinic for approval.",
    });
  };

  const handleBackToDashboard = () => {
    navigate("/patient/dashboard");
  };

  const getSelectedDoctor = () => {
    return doctors.find(doc => doc.id === selectedDoctor);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <Header 
          title="Appointment Request"
          userType="patient"
          userName="Sarah Johnson"
        />
        
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="shadow-soft border-border/50 text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted Successfully!</h2>
                <p className="text-muted-foreground">
                  Your appointment request has been sent to the clinic. You'll receive a confirmation within 24 hours.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-3">Request Summary:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span>{getSelectedDoctor()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{selectedDate ? format(selectedDate, "PPP") : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{appointmentType}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleBackToDashboard} className="flex-1">
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => setIsSubmitted(false)} className="flex-1">
                  Request Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header 
        title="Request Appointment"
        userType="patient"
        userName="Sarah Johnson"
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/patient/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h2 className="text-2xl font-bold text-foreground mb-2">Request New Appointment</h2>
          <p className="text-muted-foreground">
            Fill out the form below to request an appointment with one of our healthcare providers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Doctor Selection */}
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Select Doctor
                </CardTitle>
                <CardDescription>Choose your preferred healthcare provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="doctor">Doctor *</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem 
                          key={doctor.id} 
                          value={doctor.id}
                          disabled={!doctor.available}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <span className="font-medium">{doctor.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {doctor.specialty}
                              </span>
                            </div>
                            {!doctor.available && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="appointmentType">Appointment Type *</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Selection */}
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-secondary" />
                  Date & Time
                </CardTitle>
                <CardDescription>Select your preferred appointment slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Preferred Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Preferred Time *</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Additional Information
              </CardTitle>
              <CardDescription>Any additional notes or special requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Please describe your symptoms, concerns, or any special requirements..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-soft"
            >
              Submit Appointment Request
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}