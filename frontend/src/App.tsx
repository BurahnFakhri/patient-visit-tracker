import {  Routes, Route, BrowserRouter, useLocation } from "react-router-dom";

import './App.css'
import Login from './pages/login';
import ClinicDashboard from "./pages/clinician/dashboard";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/layout/app-sidebar";
import ClinicProfile from "./pages/clinician/profile";
import ClinicAppointments from "./pages/clinician/appointments";
import AppointmentRequests from "./pages/clinician/requests";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import RequestAppointment from "./pages/clinician/request-appointment";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboard from "./pages/patient/dashboard";
import PatientProfile from "./pages/patient/profile";
import PatientAppointments from "./pages/patient/appointments";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  
  if (isLoginPage) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <Routes>
            {/* Patient Routes */}
            {/* <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfile />} />
            <Route path="/patient/request-appointment" element={<RequestAppointment />} /> */}
            
            {/* Clinic Routes */}
            <Route element={<ProtectedRoute role="clinician" />}>
              
              <Route 
                path="/clinician/dashboard" 
                element={<ClinicDashboard />} 
              />
              <Route 
                path="/clinician/profile"
                element={<ClinicProfile />} 
              />
              <Route 
                path="/clinician/appointments"
                element={<ClinicAppointments />} 
              />
              <Route 
                path="/clinician/requests" 
                element={<AppointmentRequests />} 
              />
              <Route 
                path="/clinician/request-appointment"
                element={<RequestAppointment />} 
              />
            </Route>

            <Route element={<ProtectedRoute role="patient" />}>
              
              <Route 
                path="/patient/dashboard" 
                element={<PatientDashboard />} 
              />
              <Route 
                path="/patient/profile"
                element={<PatientProfile />} 
              />
              <Route 
                path="/patient/appointments"
                element={<PatientAppointments />} 
              />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <>
      <Toaster />
        <Sonner />
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<AppContent />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
