import { Bell, Settings, LogOut, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import type { RootState } from "../../store";

interface HeaderProps {
  title: string;
  userType: "patient" | "clinic";
  userName?: string;
}

export function Header({ title }: HeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxData = useSelector((state: RootState) => state.auth);
  const userData = JSON.parse(reduxData.user)
  const userName = userData?.name || userData?.firstName || 'Test';
  const userType = reduxData?.role;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <span className="text-xs text-muted-foreground capitalize">{userType} Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-xs text-accent-foreground flex items-center justify-center">
              2
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {userType} Account
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`/${userType}/profile`} className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}