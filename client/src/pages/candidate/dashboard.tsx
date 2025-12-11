import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { applicationsApi, profileApi, educationApi, experienceApi, skillsApi, trainingsApi } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Chatbot } from "@/components/chatbot";
import { 
  FileText, 
  CheckCircle, 
  ArrowRight,
  MessageSquare,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Clock,
  Check
} from "lucide-react";
import { Link } from "wouter";
import { statusColors } from "@/lib/mockData";
import type { ApplicationWithDetails, ApplicationStatus } from "@shared/schema";

interface ProfileProgress {
  personalData: boolean;
  education: boolean;
  experience: boolean;
  skills: boolean;
  training: boolean;
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [profileProgress, setProfileProgress] = useState<ProfileProgress>({
    personalData: false,
    education: false,
    experience: false,
    skills: false,
    training: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const [apps, profile, education, experience, skills, trainings] = await Promise.all([
          applicationsApi.getByUserId(user.id),
          profileApi.getByUserId(user.id),
          educationApi.getByUserId(user.id),
          experienceApi.getByUserId(user.id),
          skillsApi.getByUserId(user.id),
          trainingsApi.getByUserId(user.id)
        ]);
        setApplications(apps);
        setProfileProgress({
          personalData: !!profile,
          education: education.length > 0,
          experience: experience.length > 0,
          skills: skills.length > 0,
          training: trainings.length > 0
        });
      }
      setIsLoading(false);
    };
    loadData();
  }, [user]);

  const getCompletionPercentage = () => {
    const steps = Object.values(profileProgress);
    const completed = steps.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();
  const isProfileComplete = completionPercentage === 100;

  const profileSections = [
    { 
      key: "personalData",
      title: "Personal Data", 
      description: "Add your personal information", 
      icon: User, 
      url: "/candidate/personal-data",
      completed: profileProgress.personalData
    },
    { 
      key: "education",
      title: "Education", 
      description: "Add your educational background", 
      icon: GraduationCap, 
      url: "/candidate/education",
      completed: profileProgress.education
    },
    { 
      key: "experience",
      title: "Experience", 
      description: "Add your work experience", 
      icon: Briefcase, 
      url: "/candidate/experience",
      completed: profileProgress.experience
    },
    { 
      key: "skills",
      title: "Skills & Training", 
      description: "Add skills and certifications", 
      icon: Award, 
      url: "/candidate/skills",
      completed: profileProgress.skills || profileProgress.training
    }
  ];

  const recentAssignments = applications
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 3);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 p-6 overflow-auto ${showChatbot ? "lg:mr-80" : ""}`}>
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.fullName?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Complete your profile so administrators can match you with suitable job positions
            </p>
          </div>

          {/* Profile Completion Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">Profile Completion</CardTitle>
                <Badge variant={isProfileComplete ? "default" : "secondary"}>
                  {completionPercentage}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={completionPercentage} className="h-2 mb-4" />
              {isProfileComplete ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Your profile is complete! Administrators will review and match you with positions.</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Complete all sections below to be considered for job positions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Profile Sections */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profileSections.map((section) => (
                  <Link key={section.key} href={section.url}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover-elevate cursor-pointer">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        section.completed 
                          ? "bg-green-100 dark:bg-green-900/30" 
                          : "bg-primary/10"
                      }`}>
                        {section.completed ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <section.icon className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{section.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {section.completed ? "Completed" : section.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Job Assignments</CardTitle>
              <Link href="/candidate/application-status">
                <Button variant="ghost" size="sm" className="gap-1" data-testid="link-view-all-applications">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : recentAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No job assignments yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {isProfileComplete 
                      ? "Administrators are reviewing your profile and will match you with suitable positions soon."
                      : "Complete your profile above and administrators will match you with suitable positions."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAssignments.map((app) => (
                    <div 
                      key={app.id} 
                      className="flex items-center gap-4 p-3 rounded-lg bg-accent/50"
                      data-testid={`assignment-${app.id}`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{app.job?.title || "Unknown Position"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {app.job?.department?.name || "Unknown Department"} • Assigned {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${statusColors[app.status as ApplicationStatus].bg} ${statusColors[app.status as ApplicationStatus].text} shrink-0`}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chatbot Panel - Desktop */}
      {showChatbot && (
        <div className="hidden lg:block fixed right-0 top-0 w-80 h-screen border-l bg-card">
          <Chatbot isPanel onClose={() => setShowChatbot(false)} />
        </div>
      )}

      {/* Chatbot Toggle - Mobile */}
      <Button
        className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setShowChatbot(!showChatbot)}
        data-testid="button-chatbot-toggle"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Mobile Chatbot */}
      {showChatbot && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <Chatbot isPanel onClose={() => setShowChatbot(false)} />
        </div>
      )}
    </div>
  );
}
