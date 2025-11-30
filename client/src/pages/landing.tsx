import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Briefcase, Users, Zap, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Briefcase,
      title: "Job Management",
      description: "Post, manage, and track job openings with ease"
    },
    {
      icon: Users,
      title: "Candidate Tracking",
      description: "Organize and review candidate applications efficiently"
    },
    {
      icon: Zap,
      title: "Smart Matching",
      description: "AI-powered candidate matching for better hires"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Gain insights into your recruitment pipeline"
    }
  ];

  const benefits = [
    "Streamline your hiring process",
    "Reduce time-to-hire significantly",
    "Improve candidate experience",
    "Make data-driven hiring decisions",
    "Collaborate with your team seamlessly",
    "Track hiring metrics in real-time"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/10">
      {/* Navigation Header */}
      <header className="border-b backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">SmartHire</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              data-testid="button-header-signin"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate("/signup")}
              data-testid="button-header-signup"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
              Smart Recruitment for Modern Teams
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              SmartHire streamlines your entire hiring process. From job posting to candidate selection, manage everything in one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/signup")}
                data-testid="button-hero-signup"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/login")}
                data-testid="button-hero-login"
              >
                Login
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full h-80">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-card rounded-2xl p-8 border shadow-lg">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h3>
          <p className="text-lg text-muted-foreground">Everything you need to hire the right talent</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-lg border bg-card hover-elevate transition-all">
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold mb-8">Why Choose SmartHire?</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border">
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm font-semibold text-primary mb-2">For Candidates</div>
                <p className="text-sm text-muted-foreground">Find your dream job and apply with your complete profile</p>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm font-semibold text-primary mb-2">For Managers</div>
                <p className="text-sm text-muted-foreground">Review candidates and make informed hiring decisions</p>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm font-semibold text-primary mb-2">For Admins</div>
                <p className="text-sm text-muted-foreground">Manage the entire recruitment process and team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center border">
          <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-primary-foreground">Ready to Transform Your Hiring?</h3>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies using SmartHire to find and hire top talent
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate("/signup")}
            data-testid="button-cta-signup"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 SmartHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
