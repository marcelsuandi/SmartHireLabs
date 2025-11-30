import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { applicationsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Search, 
  Building2, 
  Calendar,
  Clock,
  ChevronRight,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus, ApplicationHistory } from "@shared/schema";

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);

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

  const filteredApplications = applications.filter(app =>
    app.job?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job?.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "Passed Selection":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage your job applications
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by job title or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-applications"
        />
      </div>

      {/* Applications Table */}
      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No applications yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start applying to jobs to see them here
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow 
                      key={app.id} 
                      className="cursor-pointer hover-elevate"
                      onClick={() => setSelectedApp(app)}
                      data-testid={`row-application-${app.id}`}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <span>{app.job?.title || "Unknown Job"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Building2 className="w-3 h-3" />
                          {app.job?.department?.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(app.appliedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[app.status].bg} ${statusColors[app.status].text}`}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" data-testid={`button-view-application-${app.id}`}>
                          View
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>Application Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Job Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{selectedApp.job?.title}</h3>
                        <p className="text-muted-foreground">
                          {selectedApp.job?.department?.name} • {selectedApp.job?.position?.name}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className={`${statusColors[selectedApp.status].bg} ${statusColors[selectedApp.status].text}`}>
                            {selectedApp.status}
                          </Badge>
                          <Badge variant="outline">
                            Applied: {formatDate(selectedApp.appliedAt)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Status History */}
                <div>
                  <h4 className="font-semibold mb-4">Application History</h4>
                  <div className="space-y-4">
                    {selectedApp.history && selectedApp.history.length > 0 ? (
                      selectedApp.history
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((hist, index) => (
                          <div 
                            key={hist.id} 
                            className="flex gap-4"
                            data-testid={`history-${hist.id}`}
                          >
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}>
                                {getStatusIcon(hist.status)}
                              </div>
                              {index < (selectedApp.history?.length || 0) - 1 && (
                                <div className="w-0.5 h-12 bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center justify-between">
                                <Badge className={`${statusColors[hist.status].bg} ${statusColors[hist.status].text}`}>
                                  {hist.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatDateTime(hist.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                By {hist.actor} ({hist.actorRole})
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No history available</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
