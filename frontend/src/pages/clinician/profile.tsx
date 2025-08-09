"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  Save,
  X,
  Camera,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  Globe,
} from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { updateAuthUser } from "../../store/slices/authSlice";
import axios from "axios";

const clinicProfileSchema = z.object({
  name: z.string().min(1, "Clinic name is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10).max(10).regex(/^\d+$/),
  address: z.string().min(1, "Address is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().optional(),
  specialties: z.string().optional(),
  operatingHours: z.string().optional(),
  emergencyMobile: z.string(),
  licenseNumber: z.string().min(1, "License number is required"),
  totalStaff: z.string().regex(/^\d+$/, { message: "Mobile number must contain only digits" }).optional(),
  totalDoctor: z.string().regex(/^\d+$/).optional(),
});

type ClinicProfileFormValues = z.infer<typeof clinicProfileSchema>;

export default function ClinicProfile() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const reduxData = useSelector((state: RootState) => state.auth);
  const userData = JSON.parse(reduxData.user);
  const API_URL = import.meta.env.VITE_API_URL;
  

  const form = useForm<ClinicProfileFormValues>({
    resolver: zodResolver(clinicProfileSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      mobile: String(userData?.mobile || ""),
      address: userData?.address || "",
      website: userData?.website || "",
      description: userData?.description || "",
      specialties: userData?.specialties || "",
      operatingHours: userData?.operatingHours || "",
      emergencyMobile: userData?.emergencyMobile || "",
      licenseNumber: userData?.licenseNumber || "",
      totalStaff: String(userData?.totalStaff || ""),
      totalDoctor: String(userData?.totalDoctor || ""),
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const onSubmit = async (data: ClinicProfileFormValues) => {
    try {
      // Example API call
      const res = await axios.put(
        API_URL + "clinician/profile",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reduxData.token}`,
          },
        }
      );

      if( res?.data?.success === false) {
        throw new Error(res?.data?.message);
      }
      console.log(res.data)
      dispatch(updateAuthUser({
        user: JSON.stringify(res.data.data),
      }));


      toast({
        title: "Profile Updated",
        description: "Clinic profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header title="Clinician Profile" />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              {/* Profile Header */}
              <Card className="shadow-soft border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="" alt={form.watch("name")} />
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {getInitials(form.watch("name"))}
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
                        {form.watch("name")}
                      </h2>
                      <p className="text-muted-foreground mb-2">
                        {form.watch("email")}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <Badge variant="outline">
                          License: {form.watch("licenseNumber")}
                        </Badge>
                        <Badge className="bg-success text-success-foreground">
                          Active
                        </Badge>
                        <Badge variant="outline">
                          Est. {form.watch("establishedYear")}
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
                              form.reset();
                              setIsEditing(false);
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

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-soft border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Core clinic details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clinic Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              disabled={!isEditing}
                              // className="pl-9"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} disabled={!isEditing} 
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
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
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

                {/* Operational Details */}
                <Card className="shadow-soft border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-secondary" />
                      Operational Details
                    </CardTitle>
                    <CardDescription>
                      Operating hours and staff information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="operatingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Hours</FormLabel>
                          <FormControl>
                            <Textarea {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="totalDoctor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Doctors</FormLabel>
                            <FormControl>
                              <Input  {...field} disabled={!isEditing} 
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
                        name="totalStaff"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Staff</FormLabel>
                            <FormControl>
                              <Input  {...field} disabled={!isEditing} 
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
                    </div>

                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Number</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Services and Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-soft border-border/50">
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                    <CardDescription>
                      About your healthcare facility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-border/50">
                  <CardHeader>
                    <CardTitle>Medical Specialties</CardTitle>
                    <CardDescription>
                      Services and specializations offered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
