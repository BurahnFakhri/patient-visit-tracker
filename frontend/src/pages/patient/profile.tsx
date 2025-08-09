"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Save,
  X,
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import axios from "axios";
import { updateAuthUser } from "../../store/slices/authSlice";

// ------------------ ZOD SCHEMA ------------------
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10).max(10).regex(/^\d+$/),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
  emergencyMobile: z.string().min(1, "Emergency contact is required"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  medicalHistory: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PatientProfile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const redux = useSelector((state: RootState) => state.auth);
  const userData = JSON.parse(redux.user);
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      mobile: String(userData?.mobile || '') ,
      dob: userData?.dob || undefined,
      address: userData?.address,
      emergencyMobile: userData?.emergencyMobile,
      allergies: userData?.allergies || '',
      currentMedication: userData?.currentMedication || '',
      medicalHistory: userData?.medicalHistory || ''
    }
  });

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName[0]}${lastName[0]}`.toUpperCase();

  const handleSave = async (data: ProfileFormValues) => {
    try {
      const res = await axios.put(
        API_URL + "patient/profile",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${redux.token}`,
          },
        }
      );
      if( res?.data?.success === false) {
        throw new Error(res?.data?.message);
      }
      dispatch(updateAuthUser({
        user: JSON.stringify(res.data.data),
      }));
      toast({
        title: "Profile Updated",
        description: "Patient profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header
        title="Profile"
        userType="patient"
        userName={`${form.getValues("firstName")} ${form.getValues("lastName")}`}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="space-y-8"
          >
            {/* Profile Header */}
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" alt="avatar" />
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {getInitials(
                          form.getValues("firstName"),
                          form.getValues("lastName")
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-2xl font-bold text-foreground">
                      {form.getValues("firstName")}{" "}
                      {form.getValues("lastName")}
                    </h2>
                    <p className="text-muted-foreground mb-2">
                      {form.getValues("email")}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge variant="outline">Patient ID: P-2024-001</Badge>
                      <Badge className="bg-success text-success-foreground">
                        Active
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button type="submit" className="gap-2">
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            form.reset();
                          }}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <Card className="shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your basic demographic information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    inputMode="numeric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>mobile</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Medical Information */}
              <Card className="shadow-soft border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-secondary" />
                    Medical Information
                  </CardTitle>
                  <CardDescription>
                    Important health and emergency details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emergencyMobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentMedication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medicalHistory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical History</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!isEditing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
