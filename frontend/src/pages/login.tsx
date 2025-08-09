import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Building2, User, Mail, Lock, ArrowRight } from "lucide-react";
import medicalHero from "@/assets/medical-hero.jpg";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useToast } from "../hooks/use-toast";

// ✅ Zod schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone is required")
    .refine((val) => /\S+@\S+\.\S+/.test(val) || /^\d{10,}$/.test(val), {
      message: "Enter a valid email or phone number",
    }),
  password: z.string().min(8, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState<"clinician" | "patient" | null>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!selectedType) return;
    try {
      const res = await axios.post(API_URL+'login', {
        email: data.email,
        password: data.password,
        type: selectedType
      });
      if(res.data.success === false) {
        throw new Error(res.data.message);
      }
      dispatch(setAuth({
        token: res.data.token,
        user: JSON.stringify(res.data.data),
        role: selectedType
      }));

      // Example: redirect to dashboard
      navigate(`/${selectedType}/dashboard`);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err .message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="lg:flex-1 bg-gradient-to-br from-primary-lighter to-secondary-lighter relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-center">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4 shadow-medium">
                <span className="text-primary-foreground font-bold text-xl">PVT</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Patient Visit Tracker
              </h1>
              <p className="text-lg text-muted-foreground">
                Streamline healthcare appointments with our modern, intuitive platform
              </p>
            </div>
            <img
              src={medicalHero}
              alt="Healthcare professionals managing appointments"
              className="w-full h-64 object-cover rounded-xl shadow-medium"
            />
          </div>
        </div>
      </div>

      {/* Login Section */}
      <div className="lg:flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground mt-1">Sign in to access your account</p>
          </div>

          {/* User Type Selection */}
          {!selectedType && (
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-base font-medium">I am a...</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer transition-all hover:shadow-medium hover:border-primary/50 group"
                  onClick={() => setSelectedType("clinician")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg mb-2">Healthcare Provider</CardTitle>
                    <CardDescription>
                      Manage appointments, view patient requests, and oversee clinic operations
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:shadow-medium hover:border-secondary/50 group"
                  onClick={() => setSelectedType("patient")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 mx-auto rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                      <User className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg mb-2">Patient</CardTitle>
                    <CardDescription>
                      Book appointments, view visit history, and manage your healthcare journey
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Login Form */}
          {selectedType && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="gap-1">
                  {selectedType === "clinician" ? (
                    <Building2 className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {selectedType === "patient" ? "Healthcare Provider" : "Patient"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
                  Change
                </Button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Phone</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="Enter your email or phone"
                      {...register("email")}
                      className="pl-9"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...register("password")}
                      className="pl-9"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-soft"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <Separator />

              <div className="text-center space-y-2">
                <Button variant="link" className="text-muted-foreground">
                  Forgot password?
                </Button>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Sign up here
                  </Button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
