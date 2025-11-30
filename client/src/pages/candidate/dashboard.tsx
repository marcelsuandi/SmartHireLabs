import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { applicationsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Chatbot } from "@/components/chatbot";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus } from "@shared/schema";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const apps = await applicationsApi.getByUserId(user.id);
        setApplications(apps);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      total: applications.length,
      pending: 0,
      inProgress: 0,
      accepted: 0,
      rejected: 0
    };

    applications.forEach((app) => {
      if (app.status === "Applied") counts.pending++;
      else if (app.status === "Processing" || app.status === "Passed Selection") counts.inProgress++;
      else if (app.status === "Accepted") counts.accepted++;
      else if (app.status === "Rejected") counts.rejected++;
    });

    return counts;
  };

  const counts = getStatusCounts();

  const summaryCards = [
    { 
      title: "Total Applications", 
      value: counts.total, 
      icon: FileText, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      title: "Pending Review", 
      value: counts.pending, 
      icon: Clock, 
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    { 
      title: "In Progress", 
      value: counts.inProgress, 
      icon: Clock, 
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      title: "Accepted", 
      value: counts.accepted, 
      icon: CheckCircle, 
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    }
  ];

  const recentApplications = applications
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-auto ${showChatbot ? "lg:mr-80" : ""}`}>
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.fullName?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Track your job applications and manage your profile
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : (
              summaryCards.map((card, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div className="text-3xl font-bold mb-1" data-testid={`stat-${card.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      {card.value}
                    </div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Recent Applications</CardTitle>
              <Link href="/candidate/my-applications">
                <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-applications">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Link href="/candidate/search-jobs">
                    <Button data-testid="button-browse-jobs">Browse Jobs</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div 
                      key={app.id} 
                      className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 hover-elevate"
                      data-testid={`application-${app.id}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{app.job?.title || "Unknown Job"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {app.job?.department?.name || "Unknown Department"} • Applied {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${statusColors[app.status as ApplicationStatus].bg} ${statusColors[app.status as ApplicationStatus].text} shrink-0`}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A complete profile increases your chances of getting hired
                </p>
                <Link href="/candidate/personal-data">
                  <Button variant="outline" size="sm" data-testid="link-complete-profile">
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Find Your Dream Job</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse through our latest job openings
                </p>
                <Link href="/candidate/search-jobs">
                  <Button variant="outline" size="sm" data-testid="link-search-jobs">
                    Search Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot Panel - Desktop */}
      {showChatbot && (
        <div className="hidden lg:block fixed right-0 top-0 w-80 h-screen border-l bg-card">
          <Chatbot isPanel onClose={() => setShowChatbot(false)} />
        </div>
      )}

      {/* Chatbot Toggle - Mobile */}
      <Button
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setShowChatbot(!showChatbot)}
        data-testid="button-chatbot-toggle"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Mobile Chatbot */}
      {showChatbot && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <Chatbot isPanel onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </div>
  );
}
