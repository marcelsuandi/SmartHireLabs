import type { 
  User, 
  Job, 
  Department, 
  Position, 
  CandidateProfile,
  Education,
  Experience,
  Skill,
  Training,
  Language,
  Application,
  ApplicationHistory,
  FAQItem,
  ApplicationStatus
} from "@shared/schema";

// Demo accounts
export const demoUsers: User[] = [
  {
    id: "user-candidate-1",
    email: "candidate@smarthire.com",
    password: "password123",
    fullName: "John Doe",
    phone: "+1234567890",
    role: "candidate"
  },
  {
    id: "user-admin-1",
    email: "admin@smarthire.com",
    password: "password123",
    fullName: "Admin User",
    phone: "+1234567891",
    role: "admin"
  },
  {
    id: "user-manager-1",
    email: "manager@smarthire.com",
    password: "password123",
    fullName: "Manager User",
    phone: "+1234567892",
    role: "manager"
  },
  {
    id: "user-candidate-2",
    email: "jane@example.com",
    password: "password123",
    fullName: "Jane Smith",
    phone: "+1987654321",
    role: "candidate"
  },
  {
    id: "user-candidate-3",
    email: "bob@example.com",
    password: "password123",
    fullName: "Bob Johnson",
    phone: "+1555555555",
    role: "candidate"
  }
];

// Departments
export const demoDepartments: Department[] = [
  { id: "dept-1", name: "Engineering" },
  { id: "dept-2", name: "Human Resources" },
  { id: "dept-3", name: "Marketing" },
  { id: "dept-4", name: "Finance" },
  { id: "dept-5", name: "Operations" }
];

// Positions
export const demoPositions: Position[] = [
  { id: "pos-1", name: "Software Engineer", departmentId: "dept-1" },
  { id: "pos-2", name: "Senior Developer", departmentId: "dept-1" },
  { id: "pos-3", name: "HR Manager", departmentId: "dept-2" },
  { id: "pos-4", name: "Recruiter", departmentId: "dept-2" },
  { id: "pos-5", name: "Marketing Specialist", departmentId: "dept-3" },
  { id: "pos-6", name: "Financial Analyst", departmentId: "dept-4" },
  { id: "pos-7", name: "Operations Manager", departmentId: "dept-5" }
];

// Jobs
export const demoJobs: Job[] = [
  {
    id: "job-1",
    title: "Full Stack Developer",
    departmentId: "dept-1",
    positionId: "pos-1",
    minEducation: "Bachelor",
    requiredMajors: ["Computer Science", "Information Technology", "Software Engineering"],
    optionalSkills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    salary: "$80,000 - $120,000",
    closeDate: "2025-02-28",
    description: "We are looking for a talented Full Stack Developer to join our engineering team. You will be responsible for developing and maintaining web applications using modern technologies.",
    criteria: "3+ years of experience in web development. Strong problem-solving skills. Excellent communication abilities.",
    status: "Active"
  },
  {
    id: "job-2",
    title: "Senior React Developer",
    departmentId: "dept-1",
    positionId: "pos-2",
    minEducation: "Bachelor",
    requiredMajors: ["Computer Science", "Information Technology"],
    optionalSkills: ["React", "Redux", "TypeScript", "GraphQL"],
    salary: "$100,000 - $150,000",
    closeDate: "2025-03-15",
    description: "Join our frontend team as a Senior React Developer. Lead the development of our customer-facing applications.",
    criteria: "5+ years of React experience. Experience with state management. Leadership skills.",
    status: "Active"
  },
  {
    id: "job-3",
    title: "HR Coordinator",
    departmentId: "dept-2",
    positionId: "pos-4",
    minEducation: "Bachelor",
    requiredMajors: ["Human Resources", "Business Administration", "Psychology"],
    optionalSkills: ["HRIS Systems", "Recruiting", "Employee Relations"],
    salary: "$50,000 - $70,000",
    closeDate: "2025-02-15",
    description: "Support our HR team in various administrative and coordination tasks.",
    criteria: "2+ years of HR experience. Strong organizational skills. Attention to detail.",
    status: "Active"
  },
  {
    id: "job-4",
    title: "Digital Marketing Manager",
    departmentId: "dept-3",
    positionId: "pos-5",
    minEducation: "Bachelor",
    requiredMajors: ["Marketing", "Business", "Communications"],
    optionalSkills: ["SEO", "Google Analytics", "Social Media", "Content Marketing"],
    salary: "$70,000 - $90,000",
    closeDate: "2025-01-31",
    description: "Lead our digital marketing initiatives and grow our online presence.",
    criteria: "4+ years of digital marketing experience. Proven track record of successful campaigns.",
    status: "Closed"
  }
];

// Candidate profiles
export const demoCandidateProfiles: CandidateProfile[] = [
  {
    id: "profile-1",
    userId: "user-candidate-1",
    ktpNumber: "1234567890123456",
    placeOfBirth: "New York",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    maritalStatus: "Single",
    religion: "Christian",
    nationality: "American",
    address: "123 Main Street, New York, NY 10001",
    cvFileName: "john_doe_resume.pdf",
    cvFileUrl: "/uploads/john_doe_resume.pdf"
  },
  {
    id: "profile-2",
    userId: "user-candidate-2",
    ktpNumber: "9876543210987654",
    placeOfBirth: "Los Angeles",
    dateOfBirth: "1992-08-22",
    gender: "Female",
    maritalStatus: "Married",
    religion: "Catholic",
    nationality: "American",
    address: "456 Oak Avenue, Los Angeles, CA 90001",
    cvFileName: "jane_smith_cv.pdf",
    cvFileUrl: "/uploads/jane_smith_cv.pdf"
  }
];

// Education
export const demoEducation: Education[] = [
  {
    id: "edu-1",
    userId: "user-candidate-1",
    level: "Bachelor",
    schoolName: "MIT",
    city: "Cambridge",
    major: "Computer Science",
    yearStart: 2008,
    yearEnd: 2012
  },
  {
    id: "edu-2",
    userId: "user-candidate-1",
    level: "Master",
    schoolName: "Stanford University",
    city: "Stanford",
    major: "Software Engineering",
    yearStart: 2012,
    yearEnd: 2014
  },
  {
    id: "edu-3",
    userId: "user-candidate-2",
    level: "Bachelor",
    schoolName: "UCLA",
    city: "Los Angeles",
    major: "Information Technology",
    yearStart: 2010,
    yearEnd: 2014
  }
];

// Experience
export const demoExperience: Experience[] = [
  {
    id: "exp-1",
    userId: "user-candidate-1",
    companyName: "Google",
    position: "Software Engineer",
    city: "Mountain View",
    yearStart: 2014,
    yearEnd: 2018,
    description: "Developed and maintained large-scale web applications"
  },
  {
    id: "exp-2",
    userId: "user-candidate-1",
    companyName: "Meta",
    position: "Senior Developer",
    city: "Menlo Park",
    yearStart: 2018,
    yearEnd: 2023,
    description: "Led frontend development team for React-based projects"
  }
];

// Skills
export const demoSkills: Skill[] = [
  { id: "skill-1", userId: "user-candidate-1", skillName: "JavaScript", proficiencyLevel: "Expert" },
  { id: "skill-2", userId: "user-candidate-1", skillName: "React", proficiencyLevel: "Expert" },
  { id: "skill-3", userId: "user-candidate-1", skillName: "Node.js", proficiencyLevel: "Advanced" },
  { id: "skill-4", userId: "user-candidate-1", skillName: "TypeScript", proficiencyLevel: "Advanced" },
  { id: "skill-5", userId: "user-candidate-2", skillName: "Python", proficiencyLevel: "Intermediate" },
  { id: "skill-6", userId: "user-candidate-2", skillName: "SQL", proficiencyLevel: "Advanced" }
];

// Trainings
export const demoTrainings: Training[] = [
  { id: "train-1", userId: "user-candidate-1", title: "AWS Certified Developer", organizer: "Amazon Web Services", year: 2020 },
  { id: "train-2", userId: "user-candidate-1", title: "React Advanced Patterns", organizer: "Frontend Masters", year: 2021 },
  { id: "train-3", userId: "user-candidate-2", title: "Data Science Bootcamp", organizer: "Coursera", year: 2022 }
];

// Languages
export const demoLanguages: Language[] = [
  { id: "lang-1", userId: "user-candidate-1", language: "English", proficiency: "Native" },
  { id: "lang-2", userId: "user-candidate-1", language: "Spanish", proficiency: "Intermediate" },
  { id: "lang-3", userId: "user-candidate-2", language: "English", proficiency: "Native" },
  { id: "lang-4", userId: "user-candidate-2", language: "French", proficiency: "Basic" }
];

// Applications
export const demoApplications: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    userId: "user-candidate-1",
    status: "Passed Selection",
    appliedAt: "2024-11-15T10:30:00Z"
  },
  {
    id: "app-2",
    jobId: "job-2",
    userId: "user-candidate-1",
    status: "Applied",
    appliedAt: "2024-11-20T14:00:00Z"
  },
  {
    id: "app-3",
    jobId: "job-1",
    userId: "user-candidate-2",
    status: "Processing",
    appliedAt: "2024-11-18T09:15:00Z"
  },
  {
    id: "app-4",
    jobId: "job-3",
    userId: "user-candidate-2",
    status: "Rejected",
    appliedAt: "2024-10-01T11:00:00Z"
  }
];

// Application history
export const demoApplicationHistory: ApplicationHistory[] = [
  {
    id: "hist-1",
    applicationId: "app-1",
    status: "Applied",
    timestamp: "2024-11-15T10:30:00Z",
    actor: "John Doe",
    actorRole: "candidate"
  },
  {
    id: "hist-2",
    applicationId: "app-1",
    status: "Processing",
    timestamp: "2024-11-16T09:00:00Z",
    actor: "Admin User",
    actorRole: "admin"
  },
  {
    id: "hist-3",
    applicationId: "app-1",
    status: "Passed Selection",
    timestamp: "2024-11-18T14:30:00Z",
    actor: "Admin User",
    actorRole: "admin"
  },
  {
    id: "hist-4",
    applicationId: "app-2",
    status: "Applied",
    timestamp: "2024-11-20T14:00:00Z",
    actor: "John Doe",
    actorRole: "candidate"
  },
  {
    id: "hist-5",
    applicationId: "app-3",
    status: "Applied",
    timestamp: "2024-11-18T09:15:00Z",
    actor: "Jane Smith",
    actorRole: "candidate"
  },
  {
    id: "hist-6",
    applicationId: "app-3",
    status: "Processing",
    timestamp: "2024-11-19T10:00:00Z",
    actor: "Admin User",
    actorRole: "admin"
  },
  {
    id: "hist-7",
    applicationId: "app-4",
    status: "Applied",
    timestamp: "2024-10-01T11:00:00Z",
    actor: "Jane Smith",
    actorRole: "candidate"
  },
  {
    id: "hist-8",
    applicationId: "app-4",
    status: "Processing",
    timestamp: "2024-10-02T09:00:00Z",
    actor: "Admin User",
    actorRole: "admin"
  },
  {
    id: "hist-9",
    applicationId: "app-4",
    status: "Rejected",
    timestamp: "2024-10-05T15:00:00Z",
    actor: "Manager User",
    actorRole: "manager"
  }
];

// Chatbot FAQ
export const chatbotFAQ: FAQItem[] = [
  {
    keywords: ["status", "application status", "where is my application", "check status"],
    response: "You can check your application status in the 'My Applications' section. Each application shows its current status: Applied, Processing, Passed Selection, Accepted, or Rejected."
  },
  {
    keywords: ["apply", "how to apply", "submit application", "application process"],
    response: "To apply for a job: 1) Go to 'Search Jobs' 2) Find a job you're interested in 3) Click on the job to view details 4) Click the 'Apply' button. Make sure your profile is complete before applying!"
  },
  {
    keywords: ["cv", "resume", "upload cv", "upload resume"],
    response: "You can upload your CV in the 'Personal Data' section. We accept PDF, DOC, and DOCX files up to 5MB. You can also use our CV extraction feature to auto-fill your profile!"
  },
  {
    keywords: ["profile", "update profile", "edit profile", "personal data"],
    response: "To update your profile, go to 'Personal Data' from the sidebar. You can edit your personal information, contact details, and upload your CV there."
  },
  {
    keywords: ["education", "add education", "school", "university"],
    response: "You can add your educational background in the 'Education' section. Include your degree level, institution name, major, and graduation year."
  },
  {
    keywords: ["skills", "add skills", "training", "certifications"],
    response: "Add your skills and training in the 'Skills & Training' section. You can list your technical skills, language proficiencies, and professional certifications."
  },
  {
    keywords: ["interview", "next steps", "what happens next"],
    response: "After you apply, our team reviews your application. If selected, you'll move to 'Processing' status. Candidates who pass initial screening will be marked as 'Passed Selection' and may be contacted for interviews."
  },
  {
    keywords: ["contact", "support", "help", "assistance"],
    response: "For additional support, please email our HR team at hr@smarthire.com or call our support line at +1-800-SMARTHIRE."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello! I'm SmartHire's virtual assistant. I can help you with questions about applications, your profile, job searches, and more. What would you like to know?"
  },
  {
    keywords: ["thank", "thanks", "appreciate"],
    response: "You're welcome! Is there anything else I can help you with?"
  }
];

// Helper function to find chatbot response
export function findChatbotResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const faq of chatbotFAQ) {
    if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return faq.response;
    }
  }
  
  return "I'm sorry, I didn't quite understand that. You can ask me about application status, how to apply, uploading your CV, or updating your profile. For more specific questions, please contact our HR team.";
}

// Status badge colors
export const statusColors: Record<ApplicationStatus, { bg: string; text: string }> = {
  "Applied": { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "Processing": { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-700 dark:text-blue-300" },
  "Passed Selection": { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-700 dark:text-yellow-300" },
  "Accepted": { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300" },
  "Rejected": { bg: "bg-red-100 dark:bg-red-900", text: "text-red-700 dark:text-red-300" }
};
