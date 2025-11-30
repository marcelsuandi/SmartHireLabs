import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Briefcase
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">SmartHire</h1>
            </div>
            
            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Intelligent Recruitment
              <span className="block text-primary mt-2">Made Simple</span>
            </h2>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Streamline your hiring process with AI-powered screening, intelligent chatbot assistance, 
              and comprehensive dashboards for candidates, admins, and managers.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 px-8" data-testid="button-signup">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8" data-testid="button-login">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SmartHire?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design 
              to revolutionize your recruitment process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1: Chatbot */}
            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3">AI Chatbot Assistant</h4>
                <p className="text-muted-foreground">
                  Get instant answers to your questions about applications, 
                  job requirements, and hiring process with our intelligent chatbot.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2: Fast Screening */}
            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Fast Screening</h4>
                <p className="text-muted-foreground">
                  Automated CV parsing and intelligent matching to quickly 
                  identify the best candidates for your positions.
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3: Dashboards */}
            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-3">Powerful Dashboards</h4>
                <p className="text-muted-foreground">
                  Role-specific dashboards for candidates, admins, and managers 
                  with real-time insights and actionable data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A streamlined process from application to hire
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Apply", desc: "Submit your application and CV" },
                { step: "2", title: "Review", desc: "Admin reviews and screens candidates" },
                { step: "3", title: "Select", desc: "Manager makes final decisions" },
                { step: "4", title: "Hire", desc: "Welcome aboard!" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h4 className="font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Jobs" },
              { value: "50K+", label: "Candidates" },
              { value: "95%", label: "Satisfaction Rate" },
              { value: "48h", label: "Avg. Response Time" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Built for Everyone in the Hiring Process
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Users, text: "Job seekers can easily manage profiles and track applications" },
                    { icon: CheckCircle2, text: "Admins can efficiently screen and organize candidates" },
                    { icon: BarChart3, text: "Managers can make informed decisions with detailed reports" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-muted-foreground pt-2">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl p-8 border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Application Received</p>
                      <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Under Review</p>
                      <p className="text-sm text-muted-foreground">Senior React Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Interview Scheduled</p>
                      <p className="text-sm text-muted-foreground">HR Coordinator</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Hiring?
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join thousands of companies and candidates using SmartHire to streamline recruitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2 px-8" data-testid="button-cta-signup">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="px-8" data-testid="button-cta-login">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="font-semibold">SmartHire</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 SmartHire. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
