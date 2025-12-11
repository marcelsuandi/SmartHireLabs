import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { applicationsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Building2, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus } from "@shared/schema";

export default function ApplicationStatusPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "Passed Selection":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Application Status</h1>
        <p className="text-muted-foreground">
          View job positions assigned to you by SmartHire administrators
        </p>
      </div>

      {/* Job Assignments */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No job assignments yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Complete your profile (personal data, education, experience, skills, and training) 
              and our administrators will match you with suitable positions based on your qualifications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} data-testid={`assignment-${app.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {getStatusIcon(app.status as ApplicationStatus)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{app.job?.title || "Unknown Position"}</h3>
                      <Badge className={`${statusColors[app.status].bg} ${statusColors[app.status].text} shrink-0`}>
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {app.job?.department?.name || "N/A"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Assigned: {formatDate(app.appliedAt)}
                      </div>
                    </div>
                    {app.job?.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {app.job.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Card */}
      <Card className="mt-6 bg-accent/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">How it works</p>
              <p className="text-sm text-muted-foreground">
                SmartHire administrators review your profile and match you with job positions 
                that best fit your qualifications. You will see updates here when your 
                application status changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
