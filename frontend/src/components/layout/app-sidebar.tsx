
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { Calendar, CalendarCheck, LayoutDashboard, Stethoscope, User } from "lucide-react";

const patientItems = [
  { title: "Dashboard", url: "/patient/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/patient/profile", icon: User },
  { title: "Appointments", url: "/patient/appointments", icon: Calendar },
];

const clinicItems = [
  { title: "Dashboard", url: "/clinician/dashboard", icon: LayoutDashboard },
  { title: "Profile", url: "/clinician/profile", icon: User },
  { title: "Appointments", url: "/clinician/appointments", icon: CalendarCheck },
  // { title: "Appointment Requests", url: "/clinic/requests", icon: Clock },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine if we're in patient or clinic section
  const isPatientSection = currentPath.startsWith('/patient');
  const items = isPatientSection ? patientItems : clinicItems;
  const sectionTitle = isPatientSection ? 'Patient Portal' : 'Clinic Portal';
  
  const isActive = (path: string) => currentPath === path;
  const isCollapsed = state === "collapsed";
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent>
        <div className="flex items-center gap-2 p-4 border-b">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            {isCollapsed ? (
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            ) : (
              <span className="text-primary-foreground font-bold text-sm">PVT</span>
            )}
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-semibold text-foreground">Patient Visit Tracker</h2>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            {sectionTitle}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}