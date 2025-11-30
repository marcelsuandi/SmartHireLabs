import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jobsApi, departmentsApi, positionsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Department, Position } from "@shared/schema";

const jobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  departmentId: z.string().min(1, "Department is required"),
  positionId: z.string().min(1, "Position is required"),
  minEducation: z.string().optional(),
  salary: z.string().optional(),
  closeDate: z.string().optional(),
  description: z.string().optional(),
  criteria: z.string().optional()
});

type JobForm = z.infer<typeof jobSchema>;

const educationLevels = ["High School", "Diploma", "Associate", "Bachelor", "Master", "Doctorate"];

export default function JobFormPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [requiredMajors, setRequiredMajors] = useState<string[]>([]);
  const [optionalSkills, setOptionalSkills] = useState<string[]>([]);
  const [majorInput, setMajorInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      departmentId: "",
      positionId: "",
      minEducation: "",
      salary: "",
      closeDate: "",
      description: "",
      criteria: ""
    }
  });

  useEffect(() => {
    const loadData = async () => {
      const [deptData, posData] = await Promise.all([
        departmentsApi.getAll(),
        positionsApi.getAll()
      ]);
      setDepartments(deptData);
      setPositions(posData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const selectedDepartment = form.watch("departmentId");
  
  useEffect(() => {
    if (selectedDepartment) {
      setFilteredPositions(positions.filter(p => p.departmentId === selectedDepartment));
    } else {
      setFilteredPositions([]);
    }
    form.setValue("positionId", "");
  }, [selectedDepartment, positions, form]);

  const handleAddMajor = () => {
    if (majorInput.trim() && !requiredMajors.includes(majorInput.trim())) {
      setRequiredMajors([...requiredMajors, majorInput.trim()]);
      setMajorInput("");
    }
  };

  const handleRemoveMajor = (major: string) => {
    setRequiredMajors(requiredMajors.filter(m => m !== major));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !optionalSkills.includes(skillInput.trim())) {
      setOptionalSkills([...optionalSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setOptionalSkills(optionalSkills.filter(s => s !== skill));
  };

  const onSubmit = async (data: JobForm) => {
    setIsSaving(true);
    try {
      await jobsApi.create({
        title: data.title,
        departmentId: data.departmentId,
        positionId: data.positionId,
        minEducation: data.minEducation || null,
        requiredMajors: requiredMajors.length > 0 ? requiredMajors : null,
        optionalSkills: optionalSkills.length > 0 ? optionalSkills : null,
        salary: data.salary || null,
        closeDate: data.closeDate || null,
        description: data.description || null,
        criteria: data.criteria || null,
        status: "Active"
      });
      
      toast({
        title: "Job created",
        description: "New job posting has been created successfully."
      });
      navigate("/admin/settings/jobs");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/settings/jobs">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Job</h1>
          <p className="text-muted-foreground">Add a new job posting</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full Stack Developer" data-testid="input-job-title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDepartment}>
                        <FormControl>
                          <SelectTrigger data-testid="select-position">
                            <SelectValue placeholder={selectedDepartment ? "Select position" : "Select department first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPositions.map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Education</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-education">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {educationLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., $80,000 - $120,000" data-testid="input-salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closeDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Close Date</FormLabel>
                      <FormControl>
                        <Input type="date" data-testid="input-close-date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Required Majors */}
              <div>
                <FormLabel>Required Majors</FormLabel>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={majorInput}
                    onChange={(e) => setMajorInput(e.target.value)}
                    placeholder="e.g., Computer Science"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMajor())}
                    data-testid="input-major"
                  />
                  <Button type="button" variant="outline" onClick={handleAddMajor} data-testid="button-add-major">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {requiredMajors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requiredMajors.map((major) => (
                      <Badge key={major} variant="secondary" className="gap-1">
                        {major}
                        <button type="button" onClick={() => handleRemoveMajor(major)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Skills */}
              <div>
                <FormLabel>Desired Skills</FormLabel>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., React, Node.js"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    data-testid="input-skill"
                  />
                  <Button type="button" variant="outline" onClick={handleAddSkill} data-testid="button-add-skill">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {optionalSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {optionalSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the job responsibilities and expectations..."
                        className="min-h-[120px] resize-none"
                        data-testid="input-description"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Criteria */}
              <FormField
                control={form.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements & Criteria</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List the requirements and qualifications..."
                        className="min-h-[120px] resize-none"
                        data-testid="input-criteria"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <Link href="/admin/settings/jobs">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSaving} data-testid="button-save-job">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Job"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
