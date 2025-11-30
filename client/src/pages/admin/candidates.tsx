import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { applicationsApi, getCandidateDetails } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter,
  Eye,
  User,
  Mail,
  Phone,
  FileText,
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus, CandidateWithDetails } from "@shared/schema";

export default function AdminCandidatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
  const [candidateDetails, setCandidateDetails] = useState<CandidateWithDetails | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ status: ApplicationStatus; appId: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const apps = await applicationsApi.getAll();
    setApplications(apps);
    setIsLoading(false);
  };

  const handleViewDetails = async (app: ApplicationWithDetails) => {
    setSelectedApp(app);
    if (app.userId) {
      const details = await getCandidateDetails(app.userId);
      setCandidateDetails(details || null);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await applicationsApi.updateStatus(appId, newStatus, user.fullName, "admin");
      await loadData();
      
      // Update selected app if it's the one being updated
      if (selectedApp?.id === appId) {
        const updated = applications.find(a => a.id === appId);
        if (updated) {
          setSelectedApp({ ...updated, status: newStatus });
        }
      }
      
      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
      setConfirmAction(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.candidate?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidate?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusActions = (currentStatus: ApplicationStatus) => {
    const actions: ApplicationStatus[] = [];
    if (currentStatus === "Applied") {
      actions.push("Processing");
    }
    if (currentStatus === "Processing") {
      actions.push("Passed Selection", "Rejected");
    }
    return actions;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Candidate Management</h1>
        <p className="text-muted-foreground">
          Review and manage job applications
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-candidates"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48" data-testid="select-status-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Passed Selection">Passed Selection</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
      </p>

      {/* Candidates Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app, index) => (
                    <TableRow key={app.id} data-testid={`row-candidate-${app.id}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{app.job?.title || "N/A"}</TableCell>
                      <TableCell>{app.candidate?.fullName || "N/A"}</TableCell>
                      <TableCell>{app.candidate?.email || "N/A"}</TableCell>
                      <TableCell>{app.candidate?.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[app.status].bg} ${statusColors[app.status].text}`}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(app.appliedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(app)}
                          data-testid={`button-view-${app.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => { setSelectedApp(null); setCandidateDetails(null); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>Candidate Details</DialogTitle>
                <DialogDescription>
                  Application for {selectedApp.job?.title}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                {/* Left: Candidate Info */}
                <div className="space-y-4">
                  <Tabs defaultValue="profile">
                    <TabsList className="w-full">
                      <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                      <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
                      <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="mt-4 space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{candidateDetails?.fullName}</h3>
                              <p className="text-muted-foreground">{candidateDetails?.email}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{candidateDetails?.phone || "N/A"}</span>
                            </div>
                            {candidateDetails?.profile && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">KTP:</span>
                                  <span>{candidateDetails.profile.ktpNumber || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">DOB:</span>
                                  <span>{candidateDetails.profile.dateOfBirth || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Address:</span>
                                  <span>{candidateDetails.profile.address || "N/A"}</span>
                                </div>
                                {candidateDetails.profile.cvFileName && (
                                  <div className="flex items-center gap-2 mt-4">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-primary">{candidateDetails.profile.cvFileName}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="education" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          {candidateDetails?.education && candidateDetails.education.length > 0 ? (
                            <div className="space-y-4">
                              {candidateDetails.education.map((edu) => (
                                <div key={edu.id} className="flex gap-3">
                                  <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-medium">{edu.level}</p>
                                    <p className="text-sm text-muted-foreground">{edu.schoolName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {edu.major} • {edu.yearStart} - {edu.yearEnd || "Present"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No education records</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          {candidateDetails?.skills && candidateDetails.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {candidateDetails.skills.map((skill) => (
                                <Badge key={skill.id} variant="secondary">
                                  {skill.skillName} ({skill.proficiencyLevel})
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No skills listed</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right: Status & History */}
                <div className="space-y-4">
                  {/* Current Status */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Current Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className={`${statusColors[selectedApp.status].bg} ${statusColors[selectedApp.status].text} text-sm px-3 py-1`}>
                        {selectedApp.status}
                      </Badge>
                      
                      {/* Status Actions */}
                      {getStatusActions(selectedApp.status).length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-muted-foreground">Change status to:</p>
                          <div className="flex flex-wrap gap-2">
                            {getStatusActions(selectedApp.status).map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={status === "Rejected" ? "destructive" : "outline"}
                                onClick={() => setConfirmAction({ status, appId: selectedApp.id })}
                                data-testid={`button-status-${status.toLowerCase().replace(/\s+/g, "-")}`}
                              >
                                {status === "Processing" && <Clock className="w-3 h-3 mr-1" />}
                                {status === "Passed Selection" && <CheckCircle className="w-3 h-3 mr-1" />}
                                {status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                {status}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Application History */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Application History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedApp.history && selectedApp.history.length > 0 ? (
                          selectedApp.history
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((hist, index) => (
                              <div key={hist.id} className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}>
                                  {hist.status === "Accepted" ? <CheckCircle className="w-4 h-4" /> :
                                   hist.status === "Rejected" ? <XCircle className="w-4 h-4" /> :
                                   <Clock className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <Badge className={`${statusColors[hist.status].bg} ${statusColors[hist.status].text} text-xs`}>
                                      {hist.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(hist.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    By {hist.actor} ({hist.actorRole})
                                  </p>
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-muted-foreground text-center py-4">No history available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to "{confirmAction?.status}"?
              This action will be recorded in the application history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction?.status === "Rejected" ? "destructive" : "default"}
              onClick={() => confirmAction && handleStatusChange(confirmAction.appId, confirmAction.status)}
              disabled={isUpdating}
              data-testid="button-confirm-status"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
