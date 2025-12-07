import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/authContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Search,
  FileText,
  Users,
  Settings,
  LogOut
} from "lucide-react";

// Menu items for different roles
const candidateMenu = [
  { title: "Dashboard", url: "/candidate", icon: LayoutDashboard },
  { title: "Personal Data", url: "/candidate/personal-data", icon: User },
  { title: "Education", url: "/candidate/education", icon: GraduationCap },
  { title: "Experience", url: "/candidate/experience", icon: Briefcase },
  { title: "Skills & Training", url: "/candidate/skills", icon: Award },
  { title: "Search Jobs", url: "/candidate/search-jobs", icon: Search },
  { title: "My Applications", url: "/candidate/my-applications", icon: FileText }
];

const adminMenu = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Candidates", url: "/admin/candidates", icon: Users },
  { title: "Settings", url: "/admin/settings/users", icon: Settings }
];

const clientMenu = [
  { title: "Dashboard", url: "/client", icon: LayoutDashboard },
  { title: "Candidates", url: "/client/candidates", icon: Users }
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.role) {
      case "candidate":
        return candidateMenu;
      case "admin":
        return adminMenu;
      case "client":
        return clientMenu;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case "candidate":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "admin":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "client":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">SmartHire</h1>
            <Badge className={`text-xs ${getRoleBadgeColor()}`} data-testid="badge-role">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== "/" && location.startsWith(item.url));
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="text-username">
              {user.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2" 
          onClick={logout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
