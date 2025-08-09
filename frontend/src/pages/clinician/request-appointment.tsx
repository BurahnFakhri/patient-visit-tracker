import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User, FileText, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

// ----------------- Schema -----------------
const appointmentSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  doctorId: z.string().min(1, "Please select a doctor"),
  status: z.string().min(1, "Please select status"),
  appointmentType: z.string().min(1, "Please select appointment type"),
  date: z.date(),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().min(1, "Notes required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface patientsType {
  id: number,
  firstName: string,
  lastName: string,
}

// ----------------- Static Data -----------------
// const patients = [
//   { id: "1", name: "Sarah Johnson", age: 34, relationship: "Self" },
//   { id: "2", name: "John Johnson", age: 36, relationship: "Spouse" },
//   { id: "3", name: "Emma Johnson", age: 8, relationship: "Child" },
//   { id: "4", name: "Michael Johnson", age: 65, relationship: "Father" },
// ];

const doctors = [
  { id: "1", name: "Dr. Emily Roberts", specialty: "Cardiology", available: true },
  { id: "2", name: "Dr. Michael Chen", specialty: "Internal Medicine", available: true },
  { id: "3", name: "Dr. Sarah Wilson", specialty: "Dermatology", available: true },
  { id: "4", name: "Dr. James Anderson", specialty: "Orthopedics", available: false },
  { id: "5", name: "Dr. Lisa Thompson", specialty: "Gynecology", available: true },
];

const timeSlots = [
  { id: "9:00:00", value: "9:00 AM" },
  { id: "9:30:00", value: "9:30 AM" },
  { id: "10:00:00", value: "10:00 AM" },
  { id: "10:30:00", value: "10:30 AM" },
  { id: "11:00:00", value: "11:00 AM" },
  { id: "11:30:00", value: "11:30 AM" },
  { id: "14:00:00", value: "2:00 PM" },
  { id: "14:30:00", value: "2:30 PM" },
  { id: "15:00:00", value: "3:00 PM" },
  { id: "15:30:00", value: "3:30 PM" },
  { id: "16:00:00", value: "4:00 PM" },
  { id: "16:30:00", value: "4:30 PM" },
];

const appointmentTypes = [
  {
    id: "consult",
    value: "General Consultation", 
  },
  {
    id: "followUp",
    value: "Follow-up Visit", 
  },
  {
    id: "checkup",
    value: "Routine Checkup", 
  },
  {
    id: "emergency",
    value: "Emergency Consultation", 
  }
];

export default function RequestAppointment() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patients, setPatients] = useState<[] | patientsType[]>([]);
  const reduxData = useSelector((state: RootState) => state.auth);
  let [searchParams] = useSearchParams();
  const id: string | null =  searchParams.get("id") || null;

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      appointmentType: "",
      date: undefined,
      time: "",
      notes: "",
      status: "confirm"
    },
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const statusData = [
    'pending', 'confirm', 'complete', 'cancel'
  ];

  const fetchPatients = async () => {
    
    try {
      const patientsData = await axios.get(
        `${API_URL}clinician/visit/patients`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reduxData.token}`,
          },
        }
      );
      if(patientsData.data.success === false) {
        throw new Error(patientsData.data.message);
      } 
      setPatients(patientsData.data.data);
      // setAppointments(data?.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAppointment = async () => {
    
    try {
      const visitData = await axios.get(
        `${API_URL}clinician/visit/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reduxData.token}`,
          },
        }
      );
      if(visitData.data.success === false) {
        throw new Error(visitData.data.message);
      } 

      form.reset({
        patientId: String(visitData?.data?.data?.patientId),
        doctorId: String(visitData?.data?.data?.doctorName),
        appointmentType: String(visitData?.data.data?.type),
        date: visitData?.data?.data?.appointmentDate ? new Date(visitData.data.data.appointmentDate) : undefined,
        time: visitData?.data?.data?.appointmentTime,
        notes: visitData?.data?.data?.notes,
        status: visitData?.data?.data?.status,
      });
      // setPatients(patientsData.data.data);
      // setAppointments(data?.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPatients();
    if(id) {
      fetchAppointment();
    }
  }, [])
  

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      // Example API call
      let response = null;
      if(!id) {
        response = await axios.post(`${API_URL}clinician/visit/`, {
          patientId: data.patientId,
          doctorName: data.doctorId,
          type: data.appointmentType,
          appointmentDate: data.date,
          appointmentTime: data.time,
          notes: data.notes,
          status: data.status
        },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reduxData.token}`,
          },
        });
      } else {
        response = await axios.put(`${API_URL}clinician/visit/${id}`, {
          patientId: data.patientId,
          doctorName: data.doctorId,
          type: data.appointmentType,
          appointmentDate: data.date,
          appointmentTime: data.time,
          notes: data.notes,
          status: data.status
        },{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reduxData.token}`,
          },
        });
      }

      if(response.data.success === false) {
        throw new Error(response.data.message);
      }   
      toast({
        title: "Appointment Submitted",
        description: response.data.message,
      });
      navigate("/clinician/appointments");
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error instanceof Error) ? error.message: 'Unable to submit form',
        variant: "destructive",
      });
    }
  };

  // --------------- Form Screen ---------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header title="Request Appointment" userType="patient" userName="Sarah Johnson" />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/clinician/appointments">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Appointments
          </Link>
        </Button>

        <h2 className="text-2xl font-bold mb-2">{id? 'Update': 'New'} Appointment</h2>
        <p className="text-muted-foreground mb-6">
          Fill out the form below to request an appointment with one of our healthcare providers.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Select Patient</CardTitle>
                <CardDescription>Choose the patient for this appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a patient" /></SelectTrigger>
                        <SelectContent>
                          {patients.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>{p.firstName + ' '+ p.lastName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                        <SelectContent>
                          {statusData.map(statusD => (
                            <SelectItem key={statusD} value={statusD}> {statusD}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Doctor Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Select Doctor</CardTitle>
                  <CardDescription>Choose your preferred healthcare provider</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="doctorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select a doctor" /></SelectTrigger>
                          <SelectContent>
                            {doctors.map(doc => (
                              <SelectItem key={doc.id} value={doc.name} disabled={!doc.available}>
                                {doc.name} ({doc.specialty})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="appointmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select appointment type" /></SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map(type => (
                              <SelectItem key={type.id} value={type.id}>{type.value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-secondary" /> Date & Time</CardTitle>
                  <CardDescription>Select your preferred appointment slot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start", !field.value && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time.id} value={time.id}>{time.value}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-accent" /> Additional Information</CardTitle>
                <CardDescription>Any additional notes or special requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes *</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Please describe symptoms or special requirements..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Submit Appointment Request
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
