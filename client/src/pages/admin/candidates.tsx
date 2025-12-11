import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { usersApi, applicationsApi, getCandidateDetails, jobsApi } from "@/lib/mockApi";
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
  History,
  Loader2,
  Target,
  Briefcase,
  BookOpen,
  Sparkles,
  UserPlus,
  AlertCircle
} from "lucide-react";
import { statusColors } from "@/lib/mockData";
import { findBestJobMatch, getAllJobMatches, type MatchResult } from "@/lib/matchingAlgorithm";
import type { User as UserType, ApplicationWithDetails, ApplicationStatus, CandidateWithDetails, JobWithDetails, ApplicationHistory } from "@shared/schema";

interface CandidateRow {
  user: UserType;
  details: CandidateWithDetails | null;
  bestMatch: MatchResult | null;
  applications: ApplicationWithDetails[];
}

export default function AdminCandidatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [allJobs, setAllJobs] = useState<JobWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileFilter, setProfileFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRow | null>(null);
  const [candidateJobMatches, setCandidateJobMatches] = useState<MatchResult[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<string>("");
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{ appId: string; status: ApplicationStatus; jobTitle: string } | null>(null);
  const [applicationHistories, setApplicationHistories] = useState<Map<string, ApplicationHistory[]>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [allCandidates, jobs, allApplications] = await Promise.all([
      usersApi.getAllCandidates(),
      jobsApi.getActive(),
      applicationsApi.getAll()
    ]);
    setAllJobs(jobs);

    // Build candidate rows with details
    const rows: CandidateRow[] = [];
    for (const candidate of allCandidates) {
      const details = await getCandidateDetails(candidate.id);
      const userApps = allApplications.filter(a => a.userId === candidate.id);
      const bestMatch = details ? findBestJobMatch(details, jobs) : null;
      rows.push({
        user: candidate,
        details: details || null,
        bestMatch,
        applications: userApps
      });
    }
    
    setCandidates(rows);
    setIsLoading(false);
  };

  const handleViewDetails = async (row: CandidateRow) => {
    setSelectedCandidate(row);
    if (row.details) {
      const allMatches = getAllJobMatches(row.details, allJobs);
      setCandidateJobMatches(allMatches);
    } else {
      setCandidateJobMatches([]);
    }
    
    // Load history for all applications
    const histories = new Map<string, ApplicationHistory[]>();
    for (const app of row.applications) {
      const history = await applicationsApi.getHistory(app.id);
      histories.set(app.id, history);
    }
    setApplicationHistories(histories);
  };

  const handleAssignJob = async () => {
    if (!selectedCandidate || !selectedJobForAssign || !user) return;
    
    setIsAssigning(true);
    try {
      await applicationsApi.create(selectedJobForAssign, selectedCandidate.user.id);
      
      toast({
        title: "Job Assigned",
        description: `Successfully assigned candidate to the position.`
      });
      
      setShowAssignDialog(false);
      setSelectedJobForAssign("");
      setSelectedCandidate(null);
      await loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign job",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const getProfileStatus = (row: CandidateRow) => {
    if (!row.details) return "incomplete";
    const hasEducation = row.details.education && row.details.education.length > 0;
    const hasExperience = row.details.experience && row.details.experience.length > 0;
    const hasSkills = row.details.skills && row.details.skills.length > 0;
    const hasProfile = row.details.profile;
    
    if (hasProfile && hasEducation && hasExperience && hasSkills) return "complete";
    if (hasProfile || hasEducation || hasExperience || hasSkills) return "partial";
    return "incomplete";
  };

  const filteredCandidates = candidates.filter(row => {
    const matchesSearch = 
      row.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (profileFilter === "all") return matchesSearch;
    
    const status = getProfileStatus(row);
    return matchesSearch && status === profileFilter;
  });

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

  const getProfileBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Complete</Badge>;
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">Partial</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Incomplete</Badge>;
    }
  };

  // Get jobs not already assigned to this candidate
  const getAvailableJobs = (row: CandidateRow) => {
    const assignedJobIds = row.applications.map(a => a.jobId);
    return allJobs.filter(j => !assignedJobIds.includes(j.id));
  };

  // Get next available statuses based on current status
  const getNextStatuses = (currentStatus: ApplicationStatus): ApplicationStatus[] => {
    switch (currentStatus) {
      case "Applied":
        return ["Processing"];
      case "Processing":
        return ["Passed Selection", "Rejected"];
      case "Passed Selection":
        return ["Accepted", "Rejected"];
      default:
        return [];
    }
  };

  // Confirm and handle status update
  const handleConfirmStatusUpdate = async () => {
    if (!user || !confirmStatusChange) return;
    setIsUpdatingStatus(true);
    try {
      await applicationsApi.updateStatus(
        confirmStatusChange.appId, 
        confirmStatusChange.status, 
        user.fullName, 
        "admin"
      );
      toast({
        title: "Status Updated",
        description: `Application for "${confirmStatusChange.jobTitle}" changed to ${confirmStatusChange.status}`
      });
      await loadData();
      // Refresh the selected candidate's applications and history
      if (selectedCandidate) {
        const updatedApps = await applicationsApi.getAll();
        const userApps = updatedApps.filter(a => a.userId === selectedCandidate.user.id);
        setSelectedCandidate({
          ...selectedCandidate,
          applications: userApps
        });
        
        // Refresh history
        const histories = new Map<string, ApplicationHistory[]>();
        for (const app of userApps) {
          const history = await applicationsApi.getHistory(app.id);
          histories.set(app.id, history);
        }
        setApplicationHistories(histories);
      }
      setConfirmStatusChange(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
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
          Review all registered candidates and assign them to suitable job positions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-candidates"
          />
        </div>
        <Select value={profileFilter} onValueChange={setProfileFilter}>
          <SelectTrigger className="w-full md:w-48" data-testid="select-profile-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Profile Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Profiles</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""}
      </p>

      {/* Candidates Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Profile Status</TableHead>
                  <TableHead>Assigned Jobs</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Best Match
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No candidates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((row, index) => (
                    <TableRow key={row.user.id} data-testid={`row-candidate-${row.user.id}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{row.user.fullName}</TableCell>
                      <TableCell>{row.user.email}</TableCell>
                      <TableCell>{getProfileBadge(getProfileStatus(row))}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.applications.length}</Badge>
                      </TableCell>
                      <TableCell>
                        {row.bestMatch ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col gap-1 cursor-help">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={getMatchBadgeVariant(row.bestMatch.matchScore)}
                                    className="gap-1"
                                    data-testid={`match-score-${row.user.id}`}
                                  >
                                    <Target className="w-3 h-3" />
                                    {row.bestMatch.matchScore}%
                                  </Badge>
                                  {row.bestMatch.isGoodFit && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {row.bestMatch.jobTitle}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="space-y-2">
                                <p className="font-semibold">Best Match: {row.bestMatch.jobTitle}</p>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span>Education:</span>
                                    <span>{row.bestMatch.breakdown.educationScore}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Skills:</span>
                                    <span>{row.bestMatch.breakdown.skillsScore}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Experience:</span>
                                    <span>{row.bestMatch.breakdown.experienceScore}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Training:</span>
                                    <span>{row.bestMatch.breakdown.trainingScore}%</span>
                                  </div>
                                </div>
                                {row.bestMatch.isGoodFit && (
                                  <p className="text-green-500 font-medium">Good Fit!</p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground text-sm">No data</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(row)}
                            data-testid={`button-view-${row.user.id}`}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setSelectedCandidate(row);
                              setShowAssignDialog(true);
                            }}
                            disabled={getAvailableJobs(row).length === 0}
                            data-testid={`button-assign-${row.user.id}`}
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </Button>
                        </div>
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
      <Dialog open={!!selectedCandidate && !showAssignDialog} onOpenChange={() => { setSelectedCandidate(null); setCandidateJobMatches([]); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle>Candidate Details</DialogTitle>
                <DialogDescription>
                  {selectedCandidate.user.fullName} - {selectedCandidate.user.email}
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
                              <h3 className="font-semibold text-lg">{selectedCandidate.user.fullName}</h3>
                              <p className="text-muted-foreground">{selectedCandidate.user.email}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{selectedCandidate.user.phone || "N/A"}</span>
                            </div>
                            {selectedCandidate.details?.profile && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">KTP:</span>
                                  <span>{selectedCandidate.details.profile.ktpNumber || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">DOB:</span>
                                  <span>{selectedCandidate.details.profile.dateOfBirth || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Address:</span>
                                  <span>{selectedCandidate.details.profile.address || "N/A"}</span>
                                </div>
                                {selectedCandidate.details.profile.cvFileName && (
                                  <div className="flex items-center gap-2 mt-4">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-primary">{selectedCandidate.details.profile.cvFileName}</span>
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
                          {selectedCandidate.details?.education && selectedCandidate.details.education.length > 0 ? (
                            <div className="space-y-4">
                              {selectedCandidate.details.education.map((edu) => (
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
                          {selectedCandidate.details?.experience && selectedCandidate.details.experience.length > 0 && (
                            <div className="mt-6 pt-4 border-t">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Work Experience
                              </h4>
                              <div className="space-y-4">
                                {selectedCandidate.details.experience.map((exp) => (
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
                          {selectedCandidate.details?.skills && selectedCandidate.details.skills.length > 0 ? (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Award className="w-4 h-4" />
                                  Technical Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedCandidate.details.skills.map((skill) => (
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
                          {selectedCandidate.details?.trainings && selectedCandidate.details.trainings.length > 0 && (
                            <div className="mt-6 pt-4 border-t">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Training & Certifications
                              </h4>
                              <div className="space-y-2">
                                {selectedCandidate.details.trainings.map((training) => (
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
                            Job Matching Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {candidateJobMatches.length > 0 ? (
                            <div className="space-y-3">
                              {candidateJobMatches.slice(0, 5).map((match) => (
                                <div key={match.jobId} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                                  <div>
                                    <p className="font-medium">{match.jobTitle}</p>
                                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                                      <span>Edu: {match.breakdown.educationScore}%</span>
                                      <span>Skills: {match.breakdown.skillsScore}%</span>
                                      <span>Exp: {match.breakdown.experienceScore}%</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={getMatchBadgeVariant(match.matchScore)}>
                                      {match.matchScore}%
                                    </Badge>
                                    {match.isGoodFit && (
                                      <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-center py-4">
                              No matching data available. Candidate may need to complete their profile.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right: Assigned Jobs */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Assigned Positions ({selectedCandidate.applications.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedCandidate.applications.length > 0 ? (
                        <div className="space-y-3">
                          {selectedCandidate.applications.map((app) => {
                            const nextStatuses = getNextStatuses(app.status as ApplicationStatus);
                            return (
                              <div key={app.id} className="p-3 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium">{app.job?.title || "Unknown"}</p>
                                  <Badge className={`${statusColors[app.status as ApplicationStatus].bg} ${statusColors[app.status as ApplicationStatus].text}`}>
                                    {app.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Assigned: {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                                
                                {/* History Timeline */}
                                {applicationHistories.get(app.id) && applicationHistories.get(app.id)!.length > 0 && (
                                  <div className="mb-3 pt-2 border-t">
                                    <p className="text-xs font-medium mb-2 flex items-center gap-1">
                                      <History className="w-3 h-3" />
                                      Status History
                                    </p>
                                    <div className="space-y-1">
                                      {applicationHistories.get(app.id)!.slice(0, 3).map((h) => (
                                        <div key={h.id} className="flex items-center justify-between text-xs">
                                          <span className="text-muted-foreground">
                                            {new Date(h.timestamp).toLocaleDateString()} - {h.actor}
                                          </span>
                                          <Badge variant="outline" className="text-xs py-0">
                                            {h.status}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {nextStatuses.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                                    {nextStatuses.map((status) => (
                                      <Button
                                        key={status}
                                        size="sm"
                                        variant={status === "Rejected" ? "destructive" : status === "Accepted" ? "default" : "outline"}
                                        onClick={() => setConfirmStatusChange({ appId: app.id, status, jobTitle: app.job?.title || "Unknown" })}
                                        disabled={isUpdatingStatus}
                                        data-testid={`button-status-${status.toLowerCase().replace(" ", "-")}-${app.id}`}
                                      >
                                        {isUpdatingStatus ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : status === "Passed Selection" ? (
                                          <>
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Pass
                                          </>
                                        ) : status === "Rejected" ? (
                                          <>
                                            <XCircle className="w-3 h-3 mr-1" />
                                            Reject
                                          </>
                                        ) : status === "Accepted" ? (
                                          <>
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Accept
                                          </>
                                        ) : (
                                          <>
                                            <Clock className="w-3 h-3 mr-1" />
                                            {status}
                                          </>
                                        )}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground text-sm">No jobs assigned yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    setShowAssignDialog(true);
                  }}
                  disabled={getAvailableJobs(selectedCandidate).length === 0}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign to Job
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Job Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={(open) => { 
        setShowAssignDialog(open); 
        if (!open) {
          setSelectedJobForAssign("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Job to Candidate</DialogTitle>
            <DialogDescription>
              Select a job position to assign to {selectedCandidate?.user.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedJobForAssign} onValueChange={setSelectedJobForAssign}>
              <SelectTrigger data-testid="select-job-assign">
                <SelectValue placeholder="Select a job position" />
              </SelectTrigger>
              <SelectContent>
                {selectedCandidate && getAvailableJobs(selectedCandidate).map((job) => {
                  const match = candidateJobMatches.find(m => m.jobId === job.id);
                  return (
                    <SelectItem key={job.id} value={job.id}>
                      <div className="flex items-center gap-2">
                        <span>{job.title}</span>
                        {match && (
                          <Badge variant={getMatchBadgeVariant(match.matchScore)} className="ml-2">
                            {match.matchScore}%
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignJob} 
              disabled={!selectedJobForAssign || isAssigning}
              data-testid="button-confirm-assign"
            >
              {isAssigning ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Assigning...</>
              ) : (
                <>Assign Position</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={!!confirmStatusChange} onOpenChange={(open) => { if (!open) setConfirmStatusChange(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status to "{confirmStatusChange?.status}"?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="p-4 rounded-lg bg-accent/50">
              <p className="font-medium">{confirmStatusChange?.jobTitle}</p>
              <p className="text-sm text-muted-foreground mt-1">
                New Status: <Badge className={confirmStatusChange ? `${statusColors[confirmStatusChange.status].bg} ${statusColors[confirmStatusChange.status].text}` : ""}>{confirmStatusChange?.status}</Badge>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmStatusChange(null)} disabled={isUpdatingStatus}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmStatusUpdate} 
              disabled={isUpdatingStatus}
              variant={confirmStatusChange?.status === "Rejected" ? "destructive" : "default"}
              data-testid="button-confirm-status-change"
            >
              {isUpdatingStatus ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
              ) : (
                <>Confirm</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
