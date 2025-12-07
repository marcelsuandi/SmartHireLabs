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
  ApplicationStatus,
  CandidateWithDetails,
  ApplicationWithDetails,
  JobWithDetails
} from "@shared/schema";

import {
  demoUsers,
  demoJobs,
  demoDepartments,
  demoPositions,
  demoCandidateProfiles,
  demoEducation,
  demoExperience,
  demoSkills,
  demoTrainings,
  demoLanguages,
  demoApplications,
  demoApplicationHistory
} from "./mockData";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mutable copies for CRUD operations
let users = [...demoUsers];
let jobs = [...demoJobs];
let departments = [...demoDepartments];
let positions = [...demoPositions];
let candidateProfiles = [...demoCandidateProfiles];
let education = [...demoEducation];
let experience = [...demoExperience];
let skills = [...demoSkills];
let trainings = [...demoTrainings];
let languages = [...demoLanguages];
let applications = [...demoApplications];
let applicationHistory = [...demoApplicationHistory];

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    await delay(200);
    return users.map(u => ({ ...u, password: "" }));
  },
  
  getById: async (id: string): Promise<User | undefined> => {
    await delay(100);
    const user = users.find(u => u.id === id);
    return user ? { ...user, password: "" } : undefined;
  },
  
  create: async (data: Omit<User, "id">): Promise<User> => {
    await delay(200);
    const newUser: User = { ...data, id: `user-${Date.now()}` };
    users.push(newUser);
    return { ...newUser, password: "" };
  },
  
  update: async (id: string, data: Partial<User>): Promise<User | undefined> => {
    await delay(200);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      return { ...users[index], password: "" };
    }
    return undefined;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Jobs API
export const jobsApi = {
  getAll: async (): Promise<JobWithDetails[]> => {
    await delay(200);
    return jobs.map(job => ({
      ...job,
      department: departments.find(d => d.id === job.departmentId),
      position: positions.find(p => p.id === job.positionId)
    }));
  },
  
  getActive: async (): Promise<JobWithDetails[]> => {
    await delay(200);
    return jobs
      .filter(j => j.status === "Active")
      .map(job => ({
        ...job,
        department: departments.find(d => d.id === job.departmentId),
        position: positions.find(p => p.id === job.positionId)
      }));
  },
  
  getById: async (id: string): Promise<JobWithDetails | undefined> => {
    await delay(100);
    const job = jobs.find(j => j.id === id);
    if (job) {
      return {
        ...job,
        department: departments.find(d => d.id === job.departmentId),
        position: positions.find(p => p.id === job.positionId)
      };
    }
    return undefined;
  },
  
  create: async (data: Omit<Job, "id">): Promise<Job> => {
    await delay(200);
    const newJob: Job = { ...data, id: `job-${Date.now()}` };
    jobs.push(newJob);
    return newJob;
  },
  
  update: async (id: string, data: Partial<Job>): Promise<Job | undefined> => {
    await delay(200);
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...data };
      return jobs[index];
    }
    return undefined;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      jobs.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Departments API
export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    await delay(200);
    return [...departments];
  },
  
  create: async (data: Omit<Department, "id">): Promise<Department> => {
    await delay(200);
    const newDept: Department = { ...data, id: `dept-${Date.now()}` };
    departments.push(newDept);
    return newDept;
  },
  
  update: async (id: string, data: Partial<Department>): Promise<Department | undefined> => {
    await delay(200);
    const index = departments.findIndex(d => d.id === id);
    if (index !== -1) {
      departments[index] = { ...departments[index], ...data };
      return departments[index];
    }
    return undefined;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = departments.findIndex(d => d.id === id);
    if (index !== -1) {
      departments.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Positions API
export const positionsApi = {
  getAll: async (): Promise<Position[]> => {
    await delay(200);
    return [...positions];
  },
  
  getByDepartment: async (departmentId: string): Promise<Position[]> => {
    await delay(200);
    return positions.filter(p => p.departmentId === departmentId);
  },
  
  create: async (data: Omit<Position, "id">): Promise<Position> => {
    await delay(200);
    const newPos: Position = { ...data, id: `pos-${Date.now()}` };
    positions.push(newPos);
    return newPos;
  },
  
  update: async (id: string, data: Partial<Position>): Promise<Position | undefined> => {
    await delay(200);
    const index = positions.findIndex(p => p.id === id);
    if (index !== -1) {
      positions[index] = { ...positions[index], ...data };
      return positions[index];
    }
    return undefined;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = positions.findIndex(p => p.id === id);
    if (index !== -1) {
      positions.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Candidate Profile API
export const profileApi = {
  getByUserId: async (userId: string): Promise<CandidateProfile | undefined> => {
    await delay(100);
    return candidateProfiles.find(p => p.userId === userId);
  },
  
  upsert: async (userId: string, data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
    await delay(200);
    const index = candidateProfiles.findIndex(p => p.userId === userId);
    if (index !== -1) {
      candidateProfiles[index] = { ...candidateProfiles[index], ...data };
      return candidateProfiles[index];
    }
    const newProfile: CandidateProfile = {
      id: `profile-${Date.now()}`,
      userId,
      ktpNumber: data.ktpNumber || null,
      placeOfBirth: data.placeOfBirth || null,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || null,
      maritalStatus: data.maritalStatus || null,
      religion: data.religion || null,
      nationality: data.nationality || null,
      address: data.address || null,
      cvFileName: data.cvFileName || null,
      cvFileUrl: data.cvFileUrl || null
    };
    candidateProfiles.push(newProfile);
    return newProfile;
  }
};

// Education API
export const educationApi = {
  getByUserId: async (userId: string): Promise<Education[]> => {
    await delay(100);
    return education.filter(e => e.userId === userId);
  },
  
  create: async (data: Omit<Education, "id">): Promise<Education> => {
    await delay(200);
    const newEdu: Education = { ...data, id: `edu-${Date.now()}` };
    education.push(newEdu);
    return newEdu;
  },
  
  update: async (id: string, data: Partial<Education>): Promise<Education | undefined> => {
    await delay(200);
    const index = education.findIndex(e => e.id === id);
    if (index !== -1) {
      education[index] = { ...education[index], ...data };
      return education[index];
    }
    return undefined;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = education.findIndex(e => e.id === id);
    if (index !== -1) {
      education.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Experience API
export const experienceApi = {
  getByUserId: async (userId: string): Promise<Experience[]> => {
    await delay(100);
    return experience.filter(e => e.userId === userId);
  },
  
  create: async (data: Omit<Experience, "id">): Promise<Experience> => {
    await delay(200);
    const newExp: Experience = { ...data, id: `exp-${Date.now()}` };
    experience.push(newExp);
    return newExp;
  },
  
  update: async (id: string, data: Partial<Experience>): Promise<Experience | undefined> => {
    await delay(200);
    const index = experience.findIndex(e => e.id === id);
    if (index !== -1) {
      experience[index] = { ...experience[index], ...data };
      return experience[index];
    }
    return undefined;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = experience.findIndex(e => e.id === id);
    if (index !== -1) {
      experience.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Skills API
export const skillsApi = {
  getByUserId: async (userId: string): Promise<Skill[]> => {
    await delay(100);
    return skills.filter(s => s.userId === userId);
  },
  
  create: async (data: Omit<Skill, "id">): Promise<Skill> => {
    await delay(200);
    const newSkill: Skill = { ...data, id: `skill-${Date.now()}` };
    skills.push(newSkill);
    return newSkill;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = skills.findIndex(s => s.id === id);
    if (index !== -1) {
      skills.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Trainings API
export const trainingsApi = {
  getByUserId: async (userId: string): Promise<Training[]> => {
    await delay(100);
    return trainings.filter(t => t.userId === userId);
  },
  
  create: async (data: Omit<Training, "id">): Promise<Training> => {
    await delay(200);
    const newTraining: Training = { ...data, id: `train-${Date.now()}` };
    trainings.push(newTraining);
    return newTraining;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = trainings.findIndex(t => t.id === id);
    if (index !== -1) {
      trainings.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Languages API
export const languagesApi = {
  getByUserId: async (userId: string): Promise<Language[]> => {
    await delay(100);
    return languages.filter(l => l.userId === userId);
  },
  
  create: async (data: Omit<Language, "id">): Promise<Language> => {
    await delay(200);
    const newLang: Language = { ...data, id: `lang-${Date.now()}` };
    languages.push(newLang);
    return newLang;
  },
  
  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = languages.findIndex(l => l.id === id);
    if (index !== -1) {
      languages.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Applications API
export const applicationsApi = {
  getAll: async (): Promise<ApplicationWithDetails[]> => {
    await delay(200);
    return applications.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      const user = users.find(u => u.id === app.userId);
      const profile = candidateProfiles.find(p => p.userId === app.userId);
      const userEducation = education.filter(e => e.userId === app.userId);
      const userSkills = skills.filter(s => s.userId === app.userId);
      const userTrainings = trainings.filter(t => t.userId === app.userId);
      const userLanguages = languages.filter(l => l.userId === app.userId);
      const history = applicationHistory.filter(h => h.applicationId === app.id);
      
      return {
        ...app,
        job: job ? {
          ...job,
          department: departments.find(d => d.id === job.departmentId),
          position: positions.find(p => p.id === job.positionId)
        } : undefined,
        candidate: user ? {
          ...user,
          password: "",
          profile,
          education: userEducation,
          skills: userSkills,
          trainings: userTrainings,
          languages: userLanguages
        } : undefined,
        history
      };
    });
  },
  
  getByUserId: async (userId: string): Promise<ApplicationWithDetails[]> => {
    await delay(200);
    return applications
      .filter(app => app.userId === userId)
      .map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        const history = applicationHistory.filter(h => h.applicationId === app.id);
        
        return {
          ...app,
          job: job ? {
            ...job,
            department: departments.find(d => d.id === job.departmentId),
            position: positions.find(p => p.id === job.positionId)
          } : undefined,
          history
        };
      });
  },
  
  getByStatus: async (status: ApplicationStatus): Promise<ApplicationWithDetails[]> => {
    await delay(200);
    return applications
      .filter(app => app.status === status)
      .map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        const user = users.find(u => u.id === app.userId);
        const profile = candidateProfiles.find(p => p.userId === app.userId);
        const userEducation = education.filter(e => e.userId === app.userId);
        const userSkills = skills.filter(s => s.userId === app.userId);
        const history = applicationHistory.filter(h => h.applicationId === app.id);
        
        return {
          ...app,
          job: job ? {
            ...job,
            department: departments.find(d => d.id === job.departmentId),
            position: positions.find(p => p.id === job.positionId)
          } : undefined,
          candidate: user ? {
            ...user,
            password: "",
            profile,
            education: userEducation,
            skills: userSkills
          } : undefined,
          history
        };
      });
  },
  
  create: async (jobId: string, userId: string): Promise<Application> => {
    await delay(200);
    
    // Check if already applied
    const existing = applications.find(a => a.jobId === jobId && a.userId === userId);
    if (existing) {
      throw new Error("Already applied to this job");
    }
    
    const user = users.find(u => u.id === userId);
    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId,
      userId,
      status: "Applied",
      appliedAt: new Date().toISOString()
    };
    applications.push(newApp);
    
    // Add history entry
    const historyEntry: ApplicationHistory = {
      id: `hist-${Date.now()}`,
      applicationId: newApp.id,
      status: "Applied",
      timestamp: new Date().toISOString(),
      actor: user?.fullName || "Unknown",
      actorRole: "candidate"
    };
    applicationHistory.push(historyEntry);
    
    return newApp;
  },
  
  updateStatus: async (
    applicationId: string, 
    status: ApplicationStatus, 
    actorName: string, 
    actorRole: "admin" | "client"
  ): Promise<Application | undefined> => {
    await delay(200);
    const index = applications.findIndex(a => a.id === applicationId);
    if (index !== -1) {
      applications[index] = { ...applications[index], status };
      
      // Add history entry
      const historyEntry: ApplicationHistory = {
        id: `hist-${Date.now()}`,
        applicationId,
        status,
        timestamp: new Date().toISOString(),
        actor: actorName,
        actorRole
      };
      applicationHistory.push(historyEntry);
      
      return applications[index];
    }
    return undefined;
  },
  
  getStats: async (): Promise<{
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    pending: number;
    interviews: number;
  }> => {
    await delay(100);
    const stats = {
      total: applications.length,
      byStatus: {
        "Applied": 0,
        "Processing": 0,
        "Passed Selection": 0,
        "Accepted": 0,
        "Rejected": 0
      } as Record<ApplicationStatus, number>,
      pending: 0,
      interviews: 0
    };
    
    applications.forEach(app => {
      stats.byStatus[app.status]++;
      if (app.status === "Applied" || app.status === "Processing") {
        stats.pending++;
      }
      if (app.status === "Passed Selection") {
        stats.interviews++;
      }
    });
    
    return stats;
  }
};

// Get full candidate details
export const getCandidateDetails = async (userId: string): Promise<CandidateWithDetails | undefined> => {
  await delay(100);
  const user = users.find(u => u.id === userId);
  if (!user) return undefined;
  
  return {
    ...user,
    password: "",
    profile: candidateProfiles.find(p => p.userId === userId),
    education: education.filter(e => e.userId === userId),
    experience: experience.filter(e => e.userId === userId),
    skills: skills.filter(s => s.userId === userId),
    trainings: trainings.filter(t => t.userId === userId),
    languages: languages.filter(l => l.userId === userId)
  };
};

// CSV Export helper
export const exportToCSV = (data: ApplicationWithDetails[], filename: string) => {
  const headers = ["Application ID", "Candidate Name", "Email", "Phone", "Job Title", "Department", "Status", "Applied Date"];
  const rows = data.map(app => [
    app.id,
    app.candidate?.fullName || "",
    app.candidate?.email || "",
    app.candidate?.phone || "",
    app.job?.title || "",
    app.job?.department?.name || "",
    app.status,
    new Date(app.appliedAt).toLocaleDateString()
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

// Mock CV extraction (simulates OCR)
export const extractCVData = async (file: File): Promise<{
  fullName?: string;
  email?: string;
  phone?: string;
  education?: Array<{ level: string; schoolName: string; major: string }>;
  skills?: string[];
}> => {
  await delay(1500); // Simulate OCR processing time
  
  // Return mock extracted data
  return {
    fullName: "Extracted Name",
    email: "extracted@email.com",
    phone: "+1234567890",
    education: [
      { level: "Bachelor", schoolName: "Sample University", major: "Computer Science" }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python"]
  };
};
