import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export type UserRole = "candidate" | "admin" | "manager";

// Application statuses
export type ApplicationStatus = "Applied" | "Processing" | "Passed Selection" | "Accepted" | "Rejected";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").$type<UserRole>().notNull().default("candidate"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Candidate profiles
export const candidateProfiles = pgTable("candidate_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  ktpNumber: text("ktp_number"),
  placeOfBirth: text("place_of_birth"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  maritalStatus: text("marital_status"),
  religion: text("religion"),
  nationality: text("nationality"),
  address: text("address"),
  cvFileName: text("cv_file_name"),
  cvFileUrl: text("cv_file_url"),
});

export const insertCandidateProfileSchema = createInsertSchema(candidateProfiles).omit({ id: true });
export type InsertCandidateProfile = z.infer<typeof insertCandidateProfileSchema>;
export type CandidateProfile = typeof candidateProfiles.$inferSelect;

// Education records
export const educationRecords = pgTable("education_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  level: text("level").notNull(),
  schoolName: text("school_name").notNull(),
  city: text("city"),
  major: text("major"),
  yearStart: integer("year_start"),
  yearEnd: integer("year_end"),
});

export const insertEducationSchema = createInsertSchema(educationRecords).omit({ id: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationRecords.$inferSelect;

// Experience records
export const experienceRecords = pgTable("experience_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  position: text("position").notNull(),
  city: text("city"),
  yearStart: integer("year_start"),
  yearEnd: integer("year_end"),
  description: text("description"),
});

export const insertExperienceSchema = createInsertSchema(experienceRecords).omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceRecords.$inferSelect;

// Skills
export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  skillName: text("skill_name").notNull(),
  proficiencyLevel: text("proficiency_level"),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

// Trainings
export const trainings = pgTable("trainings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  organizer: text("organizer"),
  year: integer("year"),
});

export const insertTrainingSchema = createInsertSchema(trainings).omit({ id: true });
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type Training = typeof trainings.$inferSelect;

// Languages
export const languages = pgTable("languages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  language: text("language").notNull(),
  proficiency: text("proficiency"),
});

export const insertLanguageSchema = createInsertSchema(languages).omit({ id: true });
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languages.$inferSelect;

// Departments
export const departments = pgTable("departments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({ id: true });
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

// Positions
export const positions = pgTable("positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  departmentId: varchar("department_id").references(() => departments.id),
});

export const insertPositionSchema = createInsertSchema(positions).omit({ id: true });
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type Position = typeof positions.$inferSelect;

// Jobs
export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  departmentId: varchar("department_id").references(() => departments.id),
  positionId: varchar("position_id").references(() => positions.id),
  minEducation: text("min_education"),
  requiredMajors: text("required_majors").array(),
  optionalSkills: text("optional_skills").array(),
  salary: text("salary"),
  closeDate: text("close_date"),
  description: text("description"),
  criteria: text("criteria"),
  status: text("status").default("Active"),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Applications
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: text("status").$type<ApplicationStatus>().notNull().default("Applied"),
  appliedAt: text("applied_at").notNull(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Application history
export const applicationHistory = pgTable("application_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id),
  status: text("status").$type<ApplicationStatus>().notNull(),
  timestamp: text("timestamp").notNull(),
  actor: text("actor").notNull(),
  actorRole: text("actor_role").$type<UserRole>().notNull(),
});

export const insertApplicationHistorySchema = createInsertSchema(applicationHistory).omit({ id: true });
export type InsertApplicationHistory = z.infer<typeof insertApplicationHistorySchema>;
export type ApplicationHistory = typeof applicationHistory.$inferSelect;

// Chatbot FAQ dataset
export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: string;
}

export interface FAQItem {
  keywords: string[];
  response: string;
}

// Extended types for frontend
export interface CandidateWithDetails extends User {
  profile?: CandidateProfile;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  trainings?: Training[];
  languages?: Language[];
}

export interface ApplicationWithDetails extends Application {
  job?: Job;
  candidate?: CandidateWithDetails;
  history?: ApplicationHistory[];
}

export interface JobWithDetails extends Job {
  department?: Department;
  position?: Position;
}
