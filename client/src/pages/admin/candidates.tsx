import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { applicationsApi, getCandidateDetails, jobsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  Phone,
  FileText,
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Target,
  Briefcase,
  BookOpen,
  Sparkles
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import { findBestJobMatch, getAllJobMatches, type MatchResult } from "@/lib/matchingAlgorithm";
import type { ApplicationWithDetails, ApplicationStatus, CandidateWithDetails, JobWithDetails } from "@shared/schema";

export default function AdminCandidatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [allJobs, setAllJobs] = useState<JobWithDetails[]>([]);
  const [candidateMatches, setCandidateMatches] = useState<Map<string, MatchResult | null>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
  const [candidateDetails, setCandidateDetails] = useState<CandidateWithDetails | null>(null);
  const [candidateJobMatches, setCandidateJobMatches] = useState<MatchResult[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ status: ApplicationStatus; appId: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [apps, jobs] = await Promise.all([
      applicationsApi.getAll(),
      jobsApi.getActive()
    ]);
    setApplications(apps);
    setAllJobs(jobs);
    
    const matches = new Map<string, MatchResult | null>();
    for (const app of apps) {
      if (app.candidate) {
        const bestMatch = findBestJobMatch(app.candidate, jobs);
        matches.set(app.userId, bestMatch);
      }
    }
    setCandidateMatches(matches);
    setIsLoading(false);
  };

  const handleViewDetails = async (app: ApplicationWithDetails) => {
    setSelectedApp(app);
    if (app.userId) {
      const details = await getCandidateDetails(app.userId);
      setCandidateDetails(details || null);
      
      if (details) {
        const allMatches = getAllJobMatches(details, allJobs);
        setCandidateJobMatches(allMatches);
      }
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await applicationsApi.updateStatus(appId, newStatus, user.fullName, "admin");
      await loadData();
      
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

  const getMatchScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getMatchBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 75) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
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
          Review and manage job applications with ML-powered matching
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
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Best Match
                    </div>
                  </TableHead>
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
                  filteredApplications.map((app, index) => {
                    const bestMatch = candidateMatches.get(app.userId);
                    return (
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
                        <TableCell>
                          {bestMatch ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-col gap-1 cursor-help">
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant={getMatchBadgeVariant(bestMatch.matchScore)}
                                      className="gap-1"
                                      data-testid={`match-score-${app.id}`}
                                    >
                                      <Target className="w-3 h-3" />
                                      {bestMatch.matchScore}%
                                    </Badge>
                                    {bestMatch.isGoodFit && (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                    {bestMatch.jobTitle}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-2">
                                  <p className="font-semibold">Best Match: {bestMatch.jobTitle}</p>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span>Education:</span>
                                      <span>{bestMatch.breakdown.educationScore}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Skills:</span>
                                      <span>{bestMatch.breakdown.skillsScore}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Experience:</span>
                                      <span>{bestMatch.breakdown.experienceScore}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Training:</span>
                                      <span>{bestMatch.breakdown.trainingScore}%</span>
                                    </div>
                                  </div>
                                  {bestMatch.isGoodFit && (
                                    <p className="text-green-500 font-medium">Good Fit!</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-muted-foreground text-sm">No data</span>
                          )}
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => { setSelectedApp(null); setCandidateDetails(null); setCandidateJobMatches([]); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
                      <TabsTrigger value="matching" className="flex-1">Matching</TabsTrigger>
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
                                      {edu.major} {edu.yearStart && `(${edu.yearStart} - ${edu.yearEnd || "Present"})`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No education records</p>
                          )}
                          
                          {/* Experience Section */}
                          {candidateDetails?.experience && candidateDetails.experience.length > 0 && (
                            <div className="mt-6 pt-4 border-t">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Work Experience
                              </h4>
                              <div className="space-y-4">
                                {candidateDetails.experience.map((exp) => (
                                  <div key={exp.id} className="flex gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                                    <div>
                                      <p className="font-medium">{exp.position}</p>
                                      <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {exp.yearStart && `${exp.yearStart} - ${exp.yearEnd || "Present"}`}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-4">
                      <Card>
                        <CardContent className="p-4">
                          {candidateDetails?.skills && candidateDetails.skills.length > 0 ? (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Technical Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {candidateDetails.skills.map((skill) => (
                                    <Badge key={skill.id} variant="secondary">
                                      {skill.skillName} ({skill.proficiencyLevel})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No skills listed</p>
                          )}
                          
                          {/* Training Section */}
                          {candidateDetails?.trainings && candidateDetails.trainings.length > 0 && (
                            <div className="mt-6 pt-4 border-t">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Training & Certifications
                              </h4>
                              <div className="space-y-2">
                                {candidateDetails.trainings.map((training) => (
                                  <div key={training.id} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                                    <div>
                                      <p className="font-medium text-sm">{training.title}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {training.organizer} {training.year && `(${training.year})`}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* ML Matching Tab */}
                    <TabsContent value="matching" className="mt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            ML Job Matching Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          {candidateJobMatches.length > 0 ? (
                            <div className="space-y-4">
                              {candidateJobMatches.slice(0, 5).map((match, idx) => (
                                <div 
                                  key={match.jobId} 
                                  className={`p-3 rounded-lg border ${idx === 0 ? "border-primary bg-primary/5" : ""}`}
                                  data-testid={`job-match-${match.jobId}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {idx === 0 && <Badge variant="default">Best Match</Badge>}
                                      <span className="font-medium">{match.jobTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-bold ${getMatchScoreColor(match.matchScore)}`}>
                                        {match.matchScore}%
                                      </span>
                                      {match.isGoodFit && (
                                        <Badge variant="default" className="bg-green-500">
                                          Good Fit
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <Progress value={match.matchScore} className="h-2 mb-3" />
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Education:</span>
                                      <span className={getMatchScoreColor(match.breakdown.educationScore)}>
                                        {match.breakdown.educationScore}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Skills:</span>
                                      <span className={getMatchScoreColor(match.breakdown.skillsScore)}>
                                        {match.breakdown.skillsScore}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Experience:</span>
                                      <span className={getMatchScoreColor(match.breakdown.experienceScore)}>
                                        {match.breakdown.experienceScore}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Training:</span>
                                      <span className={getMatchScoreColor(match.breakdown.trainingScore)}>
                                        {match.breakdown.trainingScore}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">
                              No matching data available
                            </p>
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
