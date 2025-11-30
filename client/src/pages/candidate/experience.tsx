import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { experienceApi } from "@/lib/mockApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Briefcase, 
  Pencil, 
  Trash2, 
  Loader2,
  Building,
  Calendar
} from "lucide-react";
import type { Experience } from "@shared/schema";

const experienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  city: z.string().optional(),
  yearStart: z.coerce.number().min(1950).max(2030).optional(),
  yearEnd: z.coerce.number().min(1950).max(2030).optional(),
  description: z.string().optional()
});

type ExperienceForm = z.infer<typeof experienceSchema>;

export default function ExperiencePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      companyName: "",
      position: "",
      city: "",
      yearStart: undefined,
      yearEnd: undefined,
      description: ""
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const data = await experienceApi.getByUserId(user.id);
        setExperienceList(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const openAddDialog = () => {
    setEditingId(null);
    form.reset({
      companyName: "",
      position: "",
      city: "",
      yearStart: undefined,
      yearEnd: undefined,
      description: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (exp: Experience) => {
    setEditingId(exp.id);
    form.reset({
      companyName: exp.companyName,
      position: exp.position,
      city: exp.city || "",
      yearStart: exp.yearStart || undefined,
      yearEnd: exp.yearEnd || undefined,
      description: exp.description || ""
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ExperienceForm) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await experienceApi.update(editingId, data);
        if (updated) {
          setExperienceList(prev => prev.map(e => e.id === editingId ? updated : e));
          toast({
            title: "Experience updated",
            description: "Your work experience has been updated."
          });
        }
      } else {
        const newExp = await experienceApi.create({
          userId: user.id,
          companyName: data.companyName,
          position: data.position,
          city: data.city || null,
          yearStart: data.yearStart || null,
          yearEnd: data.yearEnd || null,
          description: data.description || null
        });
        setExperienceList(prev => [...prev, newExp]);
        toast({
          title: "Experience added",
          description: "Your work experience has been added."
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await experienceApi.delete(id);
      setExperienceList(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Experience removed",
        description: "Your work experience has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="space-y-4">
          {Array(2).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Work Experience</h1>
          <p className="text-muted-foreground">
            Add your professional experience
          </p>
        </div>
        <Button onClick={openAddDialog} data-testid="button-add-experience">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      {experienceList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No experience records yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your work experience to strengthen your profile
            </p>
            <Button onClick={openAddDialog} data-testid="button-add-first-experience">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experienceList.map((exp) => (
            <Card key={exp.id} className="hover-elevate" data-testid={`experience-${exp.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{exp.position}</h3>
                        <p className="text-muted-foreground">{exp.companyName}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          {exp.city && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {exp.city}
                            </span>
                          )}
                          {exp.yearStart && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {exp.yearStart} - {exp.yearEnd || "Present"}
                            </span>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(exp)}
                          data-testid={`button-edit-experience-${exp.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(exp.id)}
                          data-testid={`button-delete-experience-${exp.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter company name" 
                        data-testid="input-company-name"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your position" 
                        data-testid="input-position"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter city" 
                        data-testid="input-experience-city"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="yearStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Start</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2020"
                          data-testid="input-exp-year-start"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year End</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2024"
                          data-testid="input-exp-year-end"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your responsibilities and achievements"
                        className="resize-none"
                        data-testid="input-exp-description"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} data-testid="button-save-experience">
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    editingId ? "Update" : "Add"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
