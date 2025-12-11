import { useState, useEffect } from "react";
import { Link } from "wouter";
import { jobsApi, applicationsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Briefcase, 
  Users, 
  Clock, 
  ArrowRight,
  Plus,
  Building2
} from "lucide-react";
import type { JobWithDetails } from "@shared/schema";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<JobWithDetails[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    byStatus: Record<string, number>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [jobsData, statsData] = await Promise.all([
        jobsApi.getAll(),
        applicationsApi.getStats()
      ]);
      setJobs(jobsData);
      setStats(statsData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const activeJobs = jobs.filter(j => j.status === "Active");

  const summaryCards = [
    { 
      title: "Active Jobs", 
      value: activeJobs.length, 
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      title: "Total Candidates", 
      value: stats?.total || 0, 
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    { 
      title: "Pending Review", 
      value: stats?.pending || 0, 
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
    }
  ];

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage job postings and review candidates
          </p>
        </div>
        <Link href="/admin/settings/jobs/new">
          <Button data-testid="button-add-job">
            <Plus className="w-4 h-4 mr-2" />
            Add New Job
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      {/* Active Jobs */}
      <div className="mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Active Job Postings</CardTitle>
            <Link href="/admin/settings/jobs">
              <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-jobs">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No active job postings</p>
                <Link href="/admin/settings/jobs/new">
                  <Button data-testid="button-create-first-job">Create Your First Job</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeJobs.slice(0, 4).map((job) => (
                  <div 
                    key={job.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-accent/50 hover-elevate"
                    data-testid={`job-${job.id}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{job.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        {job.department?.name || "N/A"}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Review Candidates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {stats?.pending || 0} candidates pending review
            </p>
            <Link href="/admin/candidates">
              <Button variant="outline" size="sm" data-testid="link-review-candidates">
                Review Now
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Manage Departments</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Organize your company structure
            </p>
            <Link href="/admin/settings/departments">
              <Button variant="outline" size="sm" data-testid="link-manage-departments">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover-elevate">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add and manage system users
            </p>
            <Link href="/admin/settings/users">
              <Button variant="outline" size="sm" data-testid="link-manage-users">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
