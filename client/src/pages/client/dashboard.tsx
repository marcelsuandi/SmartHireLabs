import { useState, useEffect } from "react";
import { Link } from "wouter";
import { applicationsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Calendar
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus } from "@shared/schema";

export default function ClientDashboard() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    interviews: number;
    byStatus: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [appsData, statsData] = await Promise.all([
        applicationsApi.getAll(),
        applicationsApi.getStats()
      ]);
      setApplications(appsData);
      setStats(statsData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const passedSelection = applications.filter(a => a.status === "Passed Selection");

  const summaryCards = [
    { 
      title: "Passed Selection", 
      value: stats?.byStatus["Passed Selection"] || 0, 
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    { 
      title: "Pending Decision", 
      value: passedSelection.length, 
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
    },
    { 
      title: "Total Accepted", 
      value: stats?.byStatus["Accepted"] || 0, 
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      title: "Total Rejected", 
      value: stats?.byStatus["Rejected"] || 0, 
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    }
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalDecisions = (stats?.byStatus["Accepted"] || 0) + (stats?.byStatus["Rejected"] || 0);
  const acceptanceRate = totalDecisions > 0 
    ? Math.round(((stats?.byStatus["Accepted"] || 0) / totalDecisions) * 100) 
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Client Dashboard</h1>
          <p className="text-muted-foreground">
            Review and make final hiring decisions
          </p>
        </div>
        <Link href="/client/candidates">
          <Button data-testid="button-review-candidates">
            Review Candidates
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
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
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acceptance Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{acceptanceRate}%</div>
              <div className="text-sm text-muted-foreground">
                {stats?.byStatus["Accepted"] || 0} accepted / {totalDecisions} total decisions
              </div>
            </div>
            <Progress value={acceptanceRate} className="h-2" />
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats?.byStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge className={`${statusColors[status as ApplicationStatus]?.bg || ""} ${statusColors[status as ApplicationStatus]?.text || ""}`}>
                    {status}
                  </Badge>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Awaiting Decision */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Awaiting Your Decision</CardTitle>
          <Link href="/client/candidates">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {passedSelection.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No candidates awaiting decision</p>
            </div>
          ) : (
            <div className="space-y-4">
              {passedSelection.slice(0, 5).map((app) => (
                <div 
                  key={app.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-accent/50 hover-elevate"
                  data-testid={`candidate-${app.id}`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{app.candidate?.fullName}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{app.job?.title || "N/A"}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(app.appliedAt)}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${statusColors["Passed Selection"].bg} ${statusColors["Passed Selection"].text} shrink-0`}>
                    Passed Selection
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
