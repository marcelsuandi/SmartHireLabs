import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { educationApi } from "@/lib/mockApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  GraduationCap, 
  Pencil, 
  Trash2, 
  Loader2,
  Building
} from "lucide-react";
import type { Education } from "@shared/schema";

const educationSchema = z.object({
  level: z.string().min(1, "Education level is required"),
  schoolName: z.string().min(1, "School name is required"),
  city: z.string().optional(),
  major: z.string().optional(),
  yearStart: z.coerce.number().min(1950).max(2030).optional(),
  yearEnd: z.coerce.number().min(1950).max(2030).optional()
});

type EducationForm = z.infer<typeof educationSchema>;

const educationLevels = [
  "High School",
  "Diploma",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate",
  "Professional"
];

export default function EducationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EducationForm>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      level: "",
      schoolName: "",
      city: "",
      major: "",
      yearStart: undefined,
      yearEnd: undefined
    }
  });

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const data = await educationApi.getByUserId(user.id);
        setEducationList(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const openAddDialog = () => {
    setEditingId(null);
    form.reset({
      level: "",
      schoolName: "",
      city: "",
      major: "",
      yearStart: undefined,
      yearEnd: undefined
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (edu: Education) => {
    setEditingId(edu.id);
    form.reset({
      level: edu.level,
      schoolName: edu.schoolName,
      city: edu.city || "",
      major: edu.major || "",
      yearStart: edu.yearStart || undefined,
      yearEnd: edu.yearEnd || undefined
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: EducationForm) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await educationApi.update(editingId, data);
        if (updated) {
          setEducationList(prev => prev.map(e => e.id === editingId ? updated : e));
          toast({
            title: "Education updated",
            description: "Your education record has been updated."
          });
        }
      } else {
        const newEdu = await educationApi.create({
          userId: user.id,
          level: data.level,
          schoolName: data.schoolName,
          city: data.city || null,
          major: data.major || null,
          yearStart: data.yearStart || null,
          yearEnd: data.yearEnd || null
        });
        setEducationList(prev => [...prev, newEdu]);
        toast({
          title: "Education added",
          description: "Your education record has been added."
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save education record",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await educationApi.delete(id);
      setEducationList(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Education removed",
        description: "Your education record has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete education record",
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
          <h1 className="text-2xl font-bold mb-2">Education</h1>
          <p className="text-muted-foreground">
            Add your educational background
          </p>
        </div>
        <Button onClick={openAddDialog} data-testid="button-add-education">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {/* Education List */}
      {educationList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No education records yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your educational background to improve your profile
            </p>
            <Button onClick={openAddDialog} data-testid="button-add-first-education">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu) => (
            <Card key={edu.id} className="hover-elevate" data-testid={`education-${edu.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{edu.level}</h3>
                        <p className="text-muted-foreground">{edu.schoolName}</p>
                        {edu.major && (
                          <p className="text-sm text-muted-foreground">Major: {edu.major}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          {edu.city && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {edu.city}
                            </span>
                          )}
                          {edu.yearStart && (
                            <span>
                              {edu.yearStart} - {edu.yearEnd || "Present"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(edu)}
                          data-testid={`button-edit-education-${edu.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(edu.id)}
                          data-testid={`button-delete-education-${edu.id}`}
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
              {editingId ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-education-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School/University Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter school name" 
                        data-testid="input-school-name"
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
                        data-testid="input-education-city"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major/Field of Study</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter major" 
                        data-testid="input-major"
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
                          data-testid="input-year-start"
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
                          data-testid="input-year-end"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} data-testid="button-save-education">
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
