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
    email: "candidate1@smarthire.com",
    password: "candidate123",
    fullName: "John Doe",
    phone: "+1234567890",
    role: "candidate"
  },
  {
    id: "user-candidate-2",
    email: "candidate2@smarthire.com",
    password: "candidate123",
    fullName: "Jane Smith",
    phone: "+1987654321",
    role: "candidate"
  },
  {
    id: "user-candidate-3",
    email: "candidate3@smarthire.com",
    password: "candidate123",
    fullName: "Bob Johnson",
    phone: "+1555555555",
    role: "candidate"
  },
  {
    id: "user-candidate-4",
    email: "candidate4@smarthire.com",
    password: "candidate123",
    fullName: "Alice Williams",
    phone: "+1666666666",
    role: "candidate"
  },
  {
    id: "user-candidate-5",
    email: "candidate5@smarthire.com",
    password: "candidate123",
    fullName: "Michael Brown",
    phone: "+1777777777",
    role: "candidate"
  },
  {
    id: "user-candidate-6",
    email: "candidate6@smarthire.com",
    password: "candidate123",
    fullName: "Emily Davis",
    phone: "+1888888888",
    role: "candidate"
  },
  {
    id: "user-candidate-7",
    email: "candidate7@smarthire.com",
    password: "candidate123",
    fullName: "David Wilson",
    phone: "+1999999999",
    role: "candidate"
  },
  {
    id: "user-candidate-8",
    email: "candidate8@smarthire.com",
    password: "candidate123",
    fullName: "Sarah Martinez",
    phone: "+1444444444",
    role: "candidate"
  },
  {
    id: "user-candidate-9",
    email: "candidate9@smarthire.com",
    password: "candidate123",
    fullName: "James Anderson",
    phone: "+1333333333",
    role: "candidate"
  },
  {
    id: "user-candidate-10",
    email: "candidate10@smarthire.com",
    password: "candidate123",
    fullName: "Lisa Taylor",
    phone: "+1222222222",
    role: "candidate"
  },
  {
    id: "user-admin-1",
    email: "admin@smarthire.com",
    password: "admin123",
    fullName: "Admin User",
    phone: "+1234567891",
    role: "admin"
  },
  {
    id: "user-client-1",
    email: "client@smarthire.com",
    password: "client123",
    fullName: "Client User",
    phone: "+1234567892",
    role: "client"
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
    closeDate: "2025-03-31",
    description: "Lead our digital marketing initiatives and grow our online presence.",
    criteria: "4+ years of digital marketing experience. Proven track record of successful campaigns.",
    status: "Active"
  },
  {
    id: "job-5",
    title: "Financial Analyst",
    departmentId: "dept-4",
    positionId: "pos-6",
    minEducation: "Bachelor",
    requiredMajors: ["Finance", "Accounting", "Economics", "Business Administration"],
    optionalSkills: ["Excel", "Financial Modeling", "Data Analysis", "SAP"],
    salary: "$65,000 - $85,000",
    closeDate: "2025-04-15",
    description: "Analyze financial data and provide insights to support business decisions.",
    criteria: "3+ years of financial analysis experience. Strong analytical and Excel skills.",
    status: "Active"
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
  },
  {
    id: "profile-3",
    userId: "user-candidate-3",
    ktpNumber: "1111222233334444",
    placeOfBirth: "Chicago",
    dateOfBirth: "1988-03-10",
    gender: "Male",
    maritalStatus: "Single",
    religion: "Protestant",
    nationality: "American",
    address: "789 Lake Drive, Chicago, IL 60601",
    cvFileName: "bob_johnson_cv.pdf",
    cvFileUrl: "/uploads/bob_johnson_cv.pdf"
  },
  {
    id: "profile-4",
    userId: "user-candidate-4",
    ktpNumber: "5555666677778888",
    placeOfBirth: "Houston",
    dateOfBirth: "1995-11-25",
    gender: "Female",
    maritalStatus: "Single",
    religion: "Buddhist",
    nationality: "American",
    address: "321 Texas Avenue, Houston, TX 77001",
    cvFileName: "alice_williams_cv.pdf",
    cvFileUrl: "/uploads/alice_williams_cv.pdf"
  },
  {
    id: "profile-5",
    userId: "user-candidate-5",
    ktpNumber: "9999000011112222",
    placeOfBirth: "Phoenix",
    dateOfBirth: "1991-07-08",
    gender: "Male",
    maritalStatus: "Married",
    religion: "Christian",
    nationality: "American",
    address: "654 Desert Road, Phoenix, AZ 85001",
    cvFileName: "michael_brown_cv.pdf",
    cvFileUrl: "/uploads/michael_brown_cv.pdf"
  },
  {
    id: "profile-6",
    userId: "user-candidate-6",
    ktpNumber: "3333444455556666",
    placeOfBirth: "Philadelphia",
    dateOfBirth: "1993-02-14",
    gender: "Female",
    maritalStatus: "Single",
    religion: "Jewish",
    nationality: "American",
    address: "987 Liberty Street, Philadelphia, PA 19101",
    cvFileName: "emily_davis_cv.pdf",
    cvFileUrl: "/uploads/emily_davis_cv.pdf"
  },
  {
    id: "profile-7",
    userId: "user-candidate-7",
    ktpNumber: "7777888899990000",
    placeOfBirth: "San Antonio",
    dateOfBirth: "1989-09-30",
    gender: "Male",
    maritalStatus: "Married",
    religion: "Catholic",
    nationality: "American",
    address: "246 River Walk, San Antonio, TX 78201",
    cvFileName: "david_wilson_cv.pdf",
    cvFileUrl: "/uploads/david_wilson_cv.pdf"
  },
  {
    id: "profile-8",
    userId: "user-candidate-8",
    ktpNumber: "1212343456567878",
    placeOfBirth: "San Diego",
    dateOfBirth: "1994-06-18",
    gender: "Female",
    maritalStatus: "Single",
    religion: "Hindu",
    nationality: "American",
    address: "135 Pacific Coast Highway, San Diego, CA 92101",
    cvFileName: "sarah_martinez_cv.pdf",
    cvFileUrl: "/uploads/sarah_martinez_cv.pdf"
  },
  {
    id: "profile-9",
    userId: "user-candidate-9",
    ktpNumber: "9090808070706060",
    placeOfBirth: "Dallas",
    dateOfBirth: "1987-12-05",
    gender: "Male",
    maritalStatus: "Divorced",
    religion: "Christian",
    nationality: "American",
    address: "468 Commerce Street, Dallas, TX 75201",
    cvFileName: "james_anderson_cv.pdf",
    cvFileUrl: "/uploads/james_anderson_cv.pdf"
  },
  {
    id: "profile-10",
    userId: "user-candidate-10",
    ktpNumber: "5050404030302020",
    placeOfBirth: "San Jose",
    dateOfBirth: "1996-04-22",
    gender: "Female",
    maritalStatus: "Single",
    religion: "Muslim",
    nationality: "American",
    address: "579 Silicon Valley Blvd, San Jose, CA 95101",
    cvFileName: "lisa_taylor_cv.pdf",
    cvFileUrl: "/uploads/lisa_taylor_cv.pdf"
  }
];

// Education
export const demoEducation: Education[] = [
  { id: "edu-1", userId: "user-candidate-1", level: "Bachelor", schoolName: "MIT", city: "Cambridge", major: "Computer Science", yearStart: 2008, yearEnd: 2012 },
  { id: "edu-2", userId: "user-candidate-1", level: "Master", schoolName: "Stanford University", city: "Stanford", major: "Software Engineering", yearStart: 2012, yearEnd: 2014 },
  { id: "edu-3", userId: "user-candidate-2", level: "Bachelor", schoolName: "UCLA", city: "Los Angeles", major: "Information Technology", yearStart: 2010, yearEnd: 2014 },
  { id: "edu-4", userId: "user-candidate-3", level: "Bachelor", schoolName: "University of Chicago", city: "Chicago", major: "Computer Science", yearStart: 2006, yearEnd: 2010 },
  { id: "edu-5", userId: "user-candidate-4", level: "Bachelor", schoolName: "Rice University", city: "Houston", major: "Marketing", yearStart: 2013, yearEnd: 2017 },
  { id: "edu-6", userId: "user-candidate-5", level: "Bachelor", schoolName: "Arizona State University", city: "Phoenix", major: "Finance", yearStart: 2009, yearEnd: 2013 },
  { id: "edu-7", userId: "user-candidate-6", level: "Bachelor", schoolName: "University of Pennsylvania", city: "Philadelphia", major: "Human Resources", yearStart: 2011, yearEnd: 2015 },
  { id: "edu-8", userId: "user-candidate-7", level: "Bachelor", schoolName: "University of Texas", city: "Austin", major: "Business Administration", yearStart: 2007, yearEnd: 2011 },
  { id: "edu-9", userId: "user-candidate-8", level: "Bachelor", schoolName: "UC San Diego", city: "San Diego", major: "Computer Science", yearStart: 2012, yearEnd: 2016 },
  { id: "edu-10", userId: "user-candidate-9", level: "Bachelor", schoolName: "Southern Methodist University", city: "Dallas", major: "Accounting", yearStart: 2005, yearEnd: 2009 },
  { id: "edu-11", userId: "user-candidate-10", level: "Bachelor", schoolName: "San Jose State University", city: "San Jose", major: "Software Engineering", yearStart: 2014, yearEnd: 2018 }
];

// Experience
export const demoExperience: Experience[] = [
  { id: "exp-1", userId: "user-candidate-1", companyName: "Google", position: "Software Engineer", city: "Mountain View", yearStart: 2014, yearEnd: 2018, description: "Developed and maintained large-scale web applications" },
  { id: "exp-2", userId: "user-candidate-1", companyName: "Meta", position: "Senior Developer", city: "Menlo Park", yearStart: 2018, yearEnd: 2023, description: "Led frontend development team for React-based projects" },
  { id: "exp-3", userId: "user-candidate-2", companyName: "Amazon", position: "IT Specialist", city: "Seattle", yearStart: 2014, yearEnd: 2019, description: "Managed IT infrastructure and support" },
  { id: "exp-4", userId: "user-candidate-3", companyName: "Microsoft", position: "Developer", city: "Redmond", yearStart: 2010, yearEnd: 2015, description: "Built enterprise software solutions" },
  { id: "exp-5", userId: "user-candidate-4", companyName: "Nike", position: "Marketing Coordinator", city: "Portland", yearStart: 2017, yearEnd: 2021, description: "Managed digital marketing campaigns" },
  { id: "exp-6", userId: "user-candidate-5", companyName: "JPMorgan", position: "Financial Analyst", city: "New York", yearStart: 2013, yearEnd: 2018, description: "Analyzed financial data and prepared reports" },
  { id: "exp-7", userId: "user-candidate-6", companyName: "Deloitte", position: "HR Consultant", city: "Philadelphia", yearStart: 2015, yearEnd: 2020, description: "Provided HR consulting services to clients" },
  { id: "exp-8", userId: "user-candidate-7", companyName: "IBM", position: "Project Manager", city: "Austin", yearStart: 2011, yearEnd: 2016, description: "Managed software development projects" },
  { id: "exp-9", userId: "user-candidate-8", companyName: "Apple", position: "iOS Developer", city: "Cupertino", yearStart: 2016, yearEnd: 2021, description: "Developed mobile applications for iOS" },
  { id: "exp-10", userId: "user-candidate-9", companyName: "EY", position: "Senior Accountant", city: "Dallas", yearStart: 2009, yearEnd: 2015, description: "Handled financial audits and accounting" },
  { id: "exp-11", userId: "user-candidate-10", companyName: "Salesforce", position: "Junior Developer", city: "San Francisco", yearStart: 2018, yearEnd: 2022, description: "Built CRM integrations and features" }
];

// Skills
export const demoSkills: Skill[] = [
  { id: "skill-1", userId: "user-candidate-1", skillName: "JavaScript", proficiencyLevel: "Expert" },
  { id: "skill-2", userId: "user-candidate-1", skillName: "React", proficiencyLevel: "Expert" },
  { id: "skill-3", userId: "user-candidate-1", skillName: "Node.js", proficiencyLevel: "Advanced" },
  { id: "skill-4", userId: "user-candidate-1", skillName: "TypeScript", proficiencyLevel: "Advanced" },
  { id: "skill-5", userId: "user-candidate-2", skillName: "Python", proficiencyLevel: "Intermediate" },
  { id: "skill-6", userId: "user-candidate-2", skillName: "SQL", proficiencyLevel: "Advanced" },
  { id: "skill-7", userId: "user-candidate-3", skillName: "Java", proficiencyLevel: "Expert" },
  { id: "skill-8", userId: "user-candidate-3", skillName: "C++", proficiencyLevel: "Advanced" },
  { id: "skill-9", userId: "user-candidate-4", skillName: "SEO", proficiencyLevel: "Expert" },
  { id: "skill-10", userId: "user-candidate-4", skillName: "Google Analytics", proficiencyLevel: "Advanced" },
  { id: "skill-11", userId: "user-candidate-5", skillName: "Excel", proficiencyLevel: "Expert" },
  { id: "skill-12", userId: "user-candidate-5", skillName: "Financial Modeling", proficiencyLevel: "Advanced" },
  { id: "skill-13", userId: "user-candidate-6", skillName: "Recruiting", proficiencyLevel: "Expert" },
  { id: "skill-14", userId: "user-candidate-6", skillName: "HRIS Systems", proficiencyLevel: "Advanced" },
  { id: "skill-15", userId: "user-candidate-7", skillName: "Project Management", proficiencyLevel: "Expert" },
  { id: "skill-16", userId: "user-candidate-7", skillName: "Agile", proficiencyLevel: "Advanced" },
  { id: "skill-17", userId: "user-candidate-8", skillName: "Swift", proficiencyLevel: "Expert" },
  { id: "skill-18", userId: "user-candidate-8", skillName: "React Native", proficiencyLevel: "Advanced" },
  { id: "skill-19", userId: "user-candidate-9", skillName: "SAP", proficiencyLevel: "Expert" },
  { id: "skill-20", userId: "user-candidate-9", skillName: "Data Analysis", proficiencyLevel: "Advanced" },
  { id: "skill-21", userId: "user-candidate-10", skillName: "React", proficiencyLevel: "Advanced" },
  { id: "skill-22", userId: "user-candidate-10", skillName: "TypeScript", proficiencyLevel: "Intermediate" }
];

// Trainings
export const demoTrainings: Training[] = [
  { id: "train-1", userId: "user-candidate-1", title: "AWS Certified Developer", organizer: "Amazon Web Services", year: 2020 },
  { id: "train-2", userId: "user-candidate-1", title: "React Advanced Patterns", organizer: "Frontend Masters", year: 2021 },
  { id: "train-3", userId: "user-candidate-2", title: "Data Science Bootcamp", organizer: "Coursera", year: 2022 },
  { id: "train-4", userId: "user-candidate-3", title: "Azure Fundamentals", organizer: "Microsoft", year: 2019 },
  { id: "train-5", userId: "user-candidate-4", title: "Digital Marketing Certification", organizer: "Google", year: 2020 },
  { id: "train-6", userId: "user-candidate-5", title: "CFA Level 1", organizer: "CFA Institute", year: 2018 },
  { id: "train-7", userId: "user-candidate-6", title: "SHRM-CP Certification", organizer: "SHRM", year: 2019 },
  { id: "train-8", userId: "user-candidate-7", title: "PMP Certification", organizer: "PMI", year: 2017 },
  { id: "train-9", userId: "user-candidate-8", title: "iOS Development Bootcamp", organizer: "Udacity", year: 2020 },
  { id: "train-10", userId: "user-candidate-9", title: "CPA Certification", organizer: "AICPA", year: 2014 },
  { id: "train-11", userId: "user-candidate-10", title: "Full Stack Web Development", organizer: "Codecademy", year: 2021 }
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
    actor: "Client User",
    actorRole: "client"
  }
];

// Chatbot FAQ
export const chatbotFAQ: FAQItem[] = [
  {
    keywords: ["how", "works", "process", "smarthire", "system"],
    response: "SmartHire works differently from traditional job boards. Here's how it works: 1) You complete your profile with personal data, education, experience, skills, and training. 2) Our administrators review your profile and use ML-based matching to find suitable positions. 3) When matched, you'll see the position in your 'Application Status' page. You don't search or apply for jobs directly - we match you with the best opportunities!"
  },
  {
    keywords: ["status", "application status", "where is my application", "check status", "assigned", "assignment"],
    response: "You can check your job assignments in the 'Application Status' section. This shows positions that SmartHire administrators have matched you with based on your profile. Each assignment shows its current status: Applied, Processing, Passed Selection, Accepted, or Rejected."
  },
  {
    keywords: ["apply", "how to apply", "submit application", "application process", "find job", "search job"],
    response: "At SmartHire, you don't apply for jobs directly. Instead, complete your profile with all your information (personal data, education, experience, skills, and training), and our administrators will review your qualifications and match you with suitable positions. The better your profile, the better the match!"
  },
  {
    keywords: ["cv", "resume", "upload cv", "upload resume"],
    response: "You can upload your CV in the 'Personal Data' section. We accept PDF, DOC, and DOCX files up to 5MB. Your CV helps our administrators better understand your background when matching you with positions."
  },
  {
    keywords: ["profile", "update profile", "edit profile", "personal data", "complete"],
    response: "To complete your profile, fill out all 5 sections: 1) Personal Data - your basic info and CV, 2) Education - your academic background, 3) Experience - your work history, 4) Skills - your technical abilities, 5) Training - certifications and courses. A complete profile increases your chances of being matched with great positions!"
  },
  {
    keywords: ["education", "add education", "school", "university"],
    response: "Add your educational background in the 'Education' section. Include your degree level (Bachelor, Master, etc.), institution name, major, and graduation year. This helps us match you with positions that fit your qualifications."
  },
  {
    keywords: ["skills", "add skills", "training", "certifications"],
    response: "Add your skills and training in the 'Skills' section. List your technical skills with proficiency levels, plus any professional certifications or training courses. Skills are heavily weighted in our matching algorithm!"
  },
  {
    keywords: ["interview", "next steps", "what happens next"],
    response: "After being matched with a position, your status will progress: Applied (newly matched) -> Processing (under review) -> Passed Selection (qualified for interview) -> Accepted or Rejected. If you pass selection, our team will contact you to schedule interviews."
  },
  {
    keywords: ["match", "matching", "algorithm", "score"],
    response: "Our ML-based matching algorithm analyzes your profile against job requirements. We consider: Education (25%), Skills (35%), Experience (25%), and Training (15%). Candidates with 75% or higher match scores are flagged as 'Good Fits' for positions."
  },
  {
    keywords: ["contact", "support", "help", "assistance"],
    response: "For additional support, please email our HR team at hr@smarthire.com or call our support line at +1-800-SMARTHIRE."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello! I'm SmartHire's virtual assistant. I can help you understand how SmartHire works, complete your profile, and track your job assignments. What would you like to know?"
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
  
  return "I'm sorry, I didn't quite understand that. You can ask me about how SmartHire works, completing your profile, checking your application status, or uploading your CV. For more specific questions, please contact our HR team.";
}

// Status badge colors
export const statusColors: Record<ApplicationStatus, { bg: string; text: string }> = {
  "Applied": { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  "Processing": { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-700 dark:text-blue-300" },
  "Passed Selection": { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-700 dark:text-yellow-300" },
  "Accepted": { bg: "bg-green-100 dark:bg-green-900", text: "text-green-700 dark:text-green-300" },
  "Rejected": { bg: "bg-red-100 dark:bg-red-900", text: "text-red-700 dark:text-red-300" }
};
