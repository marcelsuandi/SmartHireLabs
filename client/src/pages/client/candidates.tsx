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
  FileText,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus, CandidateWithDetails } from "@shared/schema";

export default function ClientCandidatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Passed Selection");
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
      await applicationsApi.updateStatus(appId, newStatus, user.fullName, "client");
      await loadData();
      
      if (selectedApp?.id === appId) {
        const updated = applications.find(a => a.id === appId);
        if (updated) {
          setSelectedApp({ ...updated, status: newStatus });
        }
      }
      
      toast({
        title: `Candidate ${newStatus}`,
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
        <h1 className="text-2xl font-bold mb-2">Candidate Review</h1>
        <p className="text-muted-foreground">
          Make final hiring decisions for candidates who passed selection
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
            <SelectItem value="Passed Selection">Passed Selection</SelectItem>
            <SelectItem value="Accepted">Accepted</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredApplications.length} candidate{filteredApplications.length !== 1 ? "s" : ""}
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
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No candidates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app, index) => (
                    <TableRow key={app.id} data-testid={`row-candidate-${app.id}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{app.job?.title || "N/A"}</TableCell>
                      <TableCell>{app.candidate?.fullName || "N/A"}</TableCell>
                      <TableCell>{app.candidate?.email || "N/A"}</TableCell>
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
                          Review
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
                <DialogTitle>Candidate Review</DialogTitle>
                <DialogDescription>
                  {selectedApp.candidate?.fullName} - {selectedApp.job?.title}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                {/* Left: Candidate Info */}
                <div className="space-y-4">
                  <Tabs defaultValue="profile">
                    <TabsList className="w-full">
                      <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                      <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
                      <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>
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
                              <p className="text-sm text-muted-foreground">{candidateDetails?.phone}</p>
                            </div>
                          </div>
                          {candidateDetails?.profile && (
                            <div className="space-y-2 text-sm">
                              {candidateDetails.profile.dateOfBirth && (
                                <p><span className="text-muted-foreground">DOB:</span> {candidateDetails.profile.dateOfBirth}</p>
                              )}
                              {candidateDetails.profile.address && (
                                <p><span className="text-muted-foreground">Address:</span> {candidateDetails.profile.address}</p>
                              )}
                              {candidateDetails.profile.cvFileName && (
                                <div className="flex items-center gap-2 mt-4 p-2 bg-accent/50 rounded">
                                  <FileText className="w-4 h-4 text-primary" />
                                  <span>{candidateDetails.profile.cvFileName}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Skills */}
                      {candidateDetails?.skills && candidateDetails.skills.length > 0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Skills</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {candidateDetails.skills.map((skill) => (
                                <Badge key={skill.id} variant="secondary">
                                  {skill.skillName} ({skill.proficiencyLevel})
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
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
                    
                    <TabsContent value="experience" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          {candidateDetails?.experience && candidateDetails.experience.length > 0 ? (
                            <div className="space-y-4">
                              {candidateDetails.experience.map((exp) => (
                                <div key={exp.id} className="flex gap-3">
                                  <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-medium">{exp.position}</p>
                                    <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {exp.yearStart} - {exp.yearEnd || "Present"}
                                    </p>
                                    {exp.description && (
                                      <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No experience records</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right: Decision Panel */}
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
                    </CardContent>
                  </Card>

                  {/* Decision Buttons */}
                  {selectedApp.status === "Passed Selection" && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Make Decision</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground mb-4">
                          This candidate has passed the selection process. Please make your final decision.
                        </p>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => setConfirmAction({ status: "Accepted", appId: selectedApp.id })}
                          data-testid="button-accept"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Candidate
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => setConfirmAction({ status: "Rejected", appId: selectedApp.id })}
                          data-testid="button-reject"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Candidate
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Application History */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Application Timeline</CardTitle>
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
            <DialogTitle>
              {confirmAction?.status === "Accepted" ? "Accept Candidate" : "Reject Candidate"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.status === "Accepted" 
                ? "Are you sure you want to accept this candidate? They will be notified of the decision."
                : "Are you sure you want to reject this candidate? This action cannot be undone."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction?.status === "Rejected" ? "destructive" : "default"}
              className={confirmAction?.status === "Accepted" ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => confirmAction && handleStatusChange(confirmAction.appId, confirmAction.status)}
              disabled={isUpdating}
              data-testid="button-confirm-decision"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                confirmAction?.status === "Accepted" ? "Accept" : "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
