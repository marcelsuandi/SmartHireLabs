import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { profileApi, extractCVData } from "@/lib/mockApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Loader2, 
  Wand2,
  User,
  Check
} from "lucide-react";
import type { CandidateProfile } from "@shared/schema";

const profileSchema = z.object({
  ktpNumber: z.string().optional(),
  placeOfBirth: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional()
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function PersonalDataPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ktpNumber: "",
      placeOfBirth: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      religion: "",
      nationality: "",
      address: ""
    }
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const data = await profileApi.getByUserId(user.id);
        if (data) {
          setProfile(data);
          form.reset({
            ktpNumber: data.ktpNumber || "",
            placeOfBirth: data.placeOfBirth || "",
            dateOfBirth: data.dateOfBirth || "",
            gender: data.gender || "",
            maritalStatus: data.maritalStatus || "",
            religion: data.religion || "",
            nationality: data.nationality || "",
            address: data.address || ""
          });
        }
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [user, form]);

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updated = await profileApi.upsert(user.id, {
        ...data,
        cvFileName: profile?.cvFileName,
        cvFileUrl: profile?.cvFileUrl
      });
      setProfile(updated);
      toast({
        title: "Profile updated",
        description: "Your personal data has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setCvFile(file);

    try {
      // In a real app, upload to server/storage here
      // For mock, we just save the file name
      if (user) {
        const updated = await profileApi.upsert(user.id, {
          ...profile,
          cvFileName: file.name,
          cvFileUrl: `/uploads/${file.name}`
        });
        setProfile(updated);
        toast({
          title: "CV uploaded",
          description: "Your CV has been uploaded successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload CV",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCV = async () => {
    if (!user) return;
    
    try {
      const updated = await profileApi.upsert(user.id, {
        ...profile,
        cvFileName: null,
        cvFileUrl: null
      });
      setProfile(updated);
      setCvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast({
        title: "CV removed",
        description: "Your CV has been removed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove CV",
        variant: "destructive"
      });
    }
  };

  const handleExtractCV = async () => {
    if (!cvFile && !profile?.cvFileName) {
      toast({
        title: "No CV found",
        description: "Please upload a CV first",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    try {
      // Mock extraction - in real app, would call OCR API
      const extracted = await extractCVData(cvFile || new File([], "dummy.pdf"));
      
      toast({
        title: "CV Extracted",
        description: "Data extracted from your CV. Review and save changes.",
      });

      // You could auto-fill some fields here if needed
    } catch (error) {
      toast({
        title: "Extraction failed",
        description: "Failed to extract data from CV",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(8).fill(0).map((_, i) => (
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Personal Data</h1>
        <p className="text-muted-foreground">
          Manage your personal information and CV
        </p>
      </div>

      {/* Basic Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>{user?.fullName}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* CV Upload Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">CV / Resume</CardTitle>
          <CardDescription>
            Upload your CV in PDF, DOC, or DOCX format (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="input-cv-upload"
          />

          {profile?.cvFileName ? (
            <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" data-testid="text-cv-filename">
                  {profile.cvFileName}
                </p>
                <p className="text-sm text-muted-foreground">Uploaded CV</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExtractCV}
                  disabled={isExtracting}
                  data-testid="button-extract-cv"
                >
                  {isExtracting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-1" />
                      Extract
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-replace-cv"
                >
                  Replace
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRemoveCV}
                  data-testid="button-remove-cv"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              data-testid="dropzone-cv"
            >
              {isUploading ? (
                <Loader2 className="w-10 h-10 mx-auto mb-4 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
              )}
              <p className="font-medium mb-1">
                {isUploading ? "Uploading..." : "Click to upload your CV"}
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, DOC, or DOCX up to 5MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
          <CardDescription>
            Fill in your personal details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ktpNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KTP Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter KTP number" data-testid="input-ktp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Birth</FormLabel>
                      <FormControl>
                        <Input placeholder="City" data-testid="input-birthplace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" data-testid="input-dob" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-marital">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="religion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Religion</FormLabel>
                      <FormControl>
                        <Input placeholder="Your religion" data-testid="input-religion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="Your nationality" data-testid="input-nationality" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your full address" 
                        className="resize-none"
                        data-testid="input-address"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} data-testid="button-save-profile">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
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
