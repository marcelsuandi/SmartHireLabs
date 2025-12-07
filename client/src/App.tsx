import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/authContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import CandidateDashboard from "@/pages/candidate/dashboard";
import PersonalDataPage from "@/pages/candidate/personal-data";
import EducationPage from "@/pages/candidate/education";
import ExperiencePage from "@/pages/candidate/experience";
import SkillsPage from "@/pages/candidate/skills";
import SearchJobsPage from "@/pages/candidate/search-jobs";
import MyApplicationsPage from "@/pages/candidate/my-applications";

import AdminDashboard from "@/pages/admin/dashboard";
import AdminCandidatesPage from "@/pages/admin/candidates";
import AdminSettingsPage from "@/pages/admin/settings";
import JobFormPage from "@/pages/admin/job-form";

import ClientDashboard from "@/pages/client/dashboard";
import ClientCandidatesPage from "@/pages/client/candidates";

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === "candidate" ? "/candidate" : 
                        user.role === "admin" ? "/admin" : "/client";
    return <Redirect to={defaultPath} />;
  }

  return <>{children}</>;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <>{children}</>;
  }

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center h-14 px-4 border-b bg-background shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppRouter() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && location !== "/login" && location !== "/signup") {
    return <Redirect to="/login" />;
  }

  if (user && (location === "/login" || location === "/signup" || location === "/")) {
    const defaultPath = user.role === "candidate" ? "/candidate" : 
                        user.role === "admin" ? "/admin" : "/client";
    return <Redirect to={defaultPath} />;
  }

  return (
    <AuthLayout>
      <Switch>
        <Route path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />

        {/* Candidate Routes */}
        <Route path="/candidate">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <CandidateDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/candidate/personal-data">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <PersonalDataPage />
          </ProtectedRoute>
        </Route>
        <Route path="/candidate/education">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <EducationPage />
          </ProtectedRoute>
        </Route>
        <Route path="/candidate/experience">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <ExperiencePage />
          </ProtectedRoute>
        </Route>
        <Route path="/candidate/skills">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <SkillsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/candidate/search-jobs">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <SearchJobsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/candidate/my-applications">
          <ProtectedRoute allowedRoles={["candidate"]}>
            <MyApplicationsPage />
          </ProtectedRoute>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin">
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/candidates">
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCandidatesPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/settings/:tab?">
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminSettingsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/admin/settings/jobs/new">
          <ProtectedRoute allowedRoles={["admin"]}>
            <JobFormPage />
          </ProtectedRoute>
        </Route>

        {/* Client Routes */}
        <Route path="/client">
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientDashboard />
          </ProtectedRoute>
        </Route>
        <Route path="/client/candidates">
          <ProtectedRoute allowedRoles={["client"]}>
            <ClientCandidatesPage />
          </ProtectedRoute>
        </Route>

        {/* Fallback */}
        <Route component={NotFound} />
      </Switch>
    </AuthLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
