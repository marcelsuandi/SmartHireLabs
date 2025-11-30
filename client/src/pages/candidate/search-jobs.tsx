import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { jobsApi, applicationsApi, departmentsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Briefcase, 
  Building2, 
  GraduationCap,
  DollarSign,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle,
  Filter
} from "lucide-react";
import type { JobWithDetails, Department, Application } from "@shared/schema";

export default function SearchJobsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobWithDetails[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [educationFilter, setEducationFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<JobWithDetails | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [jobsData, deptData] = await Promise.all([
        jobsApi.getActive(),
        departmentsApi.getAll()
      ]);
      setJobs(jobsData);
      setDepartments(deptData);
      
      if (user) {
        const userApps = await applicationsApi.getByUserId(user.id);
        setApplications(userApps);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || job.departmentId === departmentFilter;
    const matchesEducation = educationFilter === "all" || job.minEducation === educationFilter;
    
    return matchesSearch && matchesDepartment && matchesEducation;
  });

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId);
  };

  const handleApply = async () => {
    if (!user || !selectedJob) return;
    
    setIsApplying(true);
    try {
      const newApp = await applicationsApi.create(selectedJob.id, user.id);
      setApplications(prev => [...prev, newApp]);
      toast({
        title: "Application submitted!",
        description: `You have successfully applied for ${selectedJob.title}`
      });
      setSelectedJob(null);
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.message || "Could not submit application",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const educationLevels = ["High School", "Diploma", "Associate", "Bachelor", "Master", "Doctorate"];

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Search Jobs</h1>
        <p className="text-muted-foreground">
          Find your perfect job opportunity
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, department, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-jobs"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-48" data-testid="select-department-filter">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={educationFilter} onValueChange={setEducationFilter}>
          <SelectTrigger className="w-full md:w-48" data-testid="select-education-filter">
            <GraduationCap className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Education" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {educationLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
      </p>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No jobs found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const applied = hasApplied(job.id);
            return (
              <Card 
                key={job.id} 
                className="hover-elevate cursor-pointer"
                onClick={() => setSelectedJob(job)}
                data-testid={`job-card-${job.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {job.department?.name || "Unknown Department"}
                      </p>
                    </div>
                    {applied && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Applied
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.minEducation && (
                      <Badge variant="outline" className="gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {job.minEducation}
                      </Badge>
                    )}
                    {job.salary && (
                      <Badge variant="outline" className="gap-1">
                        <DollarSign className="w-3 h-3" />
                        {job.salary}
                      </Badge>
                    )}
                    {job.closeDate && (
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="w-3 h-3" />
                        Until {new Date(job.closeDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {job.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {selectedJob.department?.name} • {selectedJob.position?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Quick Info */}
                <div className="flex flex-wrap gap-3">
                  {selectedJob.minEducation && (
                    <Badge variant="secondary" className="gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Min: {selectedJob.minEducation}
                    </Badge>
                  )}
                  {selectedJob.salary && (
                    <Badge variant="secondary" className="gap-1">
                      <DollarSign className="w-3 h-3" />
                      {selectedJob.salary}
                    </Badge>
                  )}
                  {selectedJob.closeDate && (
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      Closes: {new Date(selectedJob.closeDate).toLocaleDateString()}
                    </Badge>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements */}
                {selectedJob.criteria && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements & Criteria</h4>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {selectedJob.criteria}
                    </p>
                  </div>
                )}

                {/* Required Majors */}
                {selectedJob.requiredMajors && selectedJob.requiredMajors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Preferred Majors</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.requiredMajors.map((major, i) => (
                        <Badge key={i} variant="outline">{major}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Skills */}
                {selectedJob.optionalSkills && selectedJob.optionalSkills.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Desired Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.optionalSkills.map((skill, i) => (
                        <Badge key={i} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
                {hasApplied(selectedJob.id) ? (
                  <Button disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Already Applied
                  </Button>
                ) : (
                  <Button onClick={handleApply} disabled={isApplying} data-testid="button-apply-job">
                    {isApplying ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      "Apply Now"
                    )}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
