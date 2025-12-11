import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { skillsApi, trainingsApi } from "@/lib/mockApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Award, 
  Trash2, 
  Loader2,
  GraduationCap
} from "lucide-react";
import type { Skill, Training } from "@shared/schema";

const skillSchema = z.object({
  skillName: z.string().min(1, "Skill name is required"),
  proficiencyLevel: z.string().min(1, "Proficiency level is required")
});

const trainingSchema = z.object({
  title: z.string().min(1, "Training title is required"),
  organizer: z.string().optional(),
  year: z.coerce.number().min(1990).max(2030).optional()
});

type SkillForm = z.infer<typeof skillSchema>;
type TrainingForm = z.infer<typeof trainingSchema>;

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function SkillsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");
  
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const skillForm = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
    defaultValues: { skillName: "", proficiencyLevel: "" }
  });

  const trainingForm = useForm<TrainingForm>({
    resolver: zodResolver(trainingSchema),
    defaultValues: { title: "", organizer: "", year: undefined }
  });

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const [skillsData, trainingsData] = await Promise.all([
          skillsApi.getByUserId(user.id),
          trainingsApi.getByUserId(user.id)
        ]);
        setSkills(skillsData);
        setTrainings(trainingsData);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const handleAddSkill = async (data: SkillForm) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const newSkill = await skillsApi.create({
        userId: user.id,
        skillName: data.skillName,
        proficiencyLevel: data.proficiencyLevel
      });
      setSkills(prev => [...prev, newSkill]);
      setSkillDialogOpen(false);
      skillForm.reset();
      toast({ title: "Skill added", description: "Your skill has been added." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add skill", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await skillsApi.delete(id);
      setSkills(prev => prev.filter(s => s.id !== id));
      toast({ title: "Skill removed", description: "Your skill has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
    }
  };

  const handleAddTraining = async (data: TrainingForm) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const newTraining = await trainingsApi.create({
        userId: user.id,
        title: data.title,
        organizer: data.organizer || null,
        year: data.year || null
      });
      setTrainings(prev => [...prev, newTraining]);
      setTrainingDialogOpen(false);
      trainingForm.reset();
      toast({ title: "Training added", description: "Your training has been added." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add training", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTraining = async (id: string) => {
    try {
      await trainingsApi.delete(id);
      setTrainings(prev => prev.filter(t => t.id !== id));
      toast({ title: "Training removed", description: "Your training has been removed." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete training", variant: "destructive" });
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "advanced":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-10 w-full mb-6" />
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Skills & Training</h1>
        <p className="text-muted-foreground">
          Manage your skills and certifications
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills" data-testid="tab-skills">
            Skills ({skills.length})
          </TabsTrigger>
          <TabsTrigger value="trainings" data-testid="tab-trainings">
            Training ({trainings.length})
          </TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Technical Skills</CardTitle>
                <CardDescription>Add your professional skills</CardDescription>
              </div>
              <Button onClick={() => setSkillDialogOpen(true)} data-testid="button-add-skill">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No skills added yet</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge 
                      key={skill.id} 
                      className={`${getProficiencyColor(skill.proficiencyLevel || "")} px-3 py-1.5 text-sm gap-2`}
                      data-testid={`skill-${skill.id}`}
                    >
                      {skill.skillName}
                      <span className="opacity-70">({skill.proficiencyLevel})</span>
                      <button 
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="ml-1 hover:text-destructive"
                        data-testid={`button-delete-skill-${skill.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trainings Tab */}
        <TabsContent value="trainings" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Certifications & Training</CardTitle>
                <CardDescription>Add your professional certifications</CardDescription>
              </div>
              <Button onClick={() => setTrainingDialogOpen(true)} data-testid="button-add-training">
                <Plus className="w-4 h-4 mr-2" />
                Add Training
              </Button>
            </CardHeader>
            <CardContent>
              {trainings.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No training records yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trainings.map((training) => (
                    <div 
                      key={training.id} 
                      className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                      data-testid={`training-${training.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{training.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {training.organizer}{training.year && ` - ${training.year}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTraining(training.id)}
                        data-testid={`button-delete-training-${training.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Skill Dialog */}
      <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <Form {...skillForm}>
            <form onSubmit={skillForm.handleSubmit(handleAddSkill)} className="space-y-4">
              <FormField
                control={skillForm.control}
                name="skillName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript, Python" data-testid="input-skill-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={skillForm.control}
                name="proficiencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-skill-proficiency">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {proficiencyLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSkillDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving} data-testid="button-save-skill">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Training Dialog */}
      <Dialog open={trainingDialogOpen} onOpenChange={setTrainingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Training/Certification</DialogTitle>
          </DialogHeader>
          <Form {...trainingForm}>
            <form onSubmit={trainingForm.handleSubmit(handleAddTraining)} className="space-y-4">
              <FormField
                control={trainingForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AWS Certified Developer" data-testid="input-training-title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={trainingForm.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizer/Issuer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Amazon Web Services" data-testid="input-training-organizer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={trainingForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2024" data-testid="input-training-year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTrainingDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving} data-testid="button-save-training">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
