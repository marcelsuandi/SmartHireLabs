import type { CandidateWithDetails, Job, JobWithDetails } from "@shared/schema";

export interface MatchResult {
  jobId: string;
  jobTitle: string;
  matchScore: number;
  isGoodFit: boolean;
  breakdown: {
    educationScore: number;
    skillsScore: number;
    experienceScore: number;
    trainingScore: number;
  };
}

const educationLevelOrder = [
  "Elementary",
  "Junior High",
  "Senior High",
  "Diploma",
  "Associate",
  "Bachelor",
  "Master",
  "Doctorate",
  "PhD"
];

function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
}

function getEducationLevel(education: string): number {
  const normalized = normalizeString(education);
  for (let i = educationLevelOrder.length - 1; i >= 0; i--) {
    if (normalized.includes(normalizeString(educationLevelOrder[i]))) {
      return i;
    }
  }
  return 0;
}

function calculateStringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  let matchCount = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.length > 2 && word2.length > 2) {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matchCount++;
          break;
        }
      }
    }
  }
  
  return matchCount / Math.max(words1.length, words2.length);
}

function calculateEducationScore(candidate: CandidateWithDetails, job: Job): number {
  if (!candidate.education || candidate.education.length === 0) {
    return 0;
  }
  
  const minRequired = job.minEducation ? getEducationLevel(job.minEducation) : 0;
  const highestEducation = Math.max(
    ...candidate.education.map(edu => getEducationLevel(edu.level))
  );
  
  let educationLevelScore = highestEducation >= minRequired ? 50 : (highestEducation / Math.max(minRequired, 1)) * 50;
  
  let majorScore = 0;
  if (job.requiredMajors && job.requiredMajors.length > 0) {
    for (const edu of candidate.education) {
      if (edu.major) {
        for (const requiredMajor of job.requiredMajors) {
          const similarity = calculateStringSimilarity(edu.major, requiredMajor);
          majorScore = Math.max(majorScore, similarity * 50);
        }
      }
    }
  } else {
    majorScore = 30;
  }
  
  return Math.min(100, educationLevelScore + majorScore);
}

function calculateSkillsScore(candidate: CandidateWithDetails, job: Job): number {
  if (!candidate.skills || candidate.skills.length === 0) {
    return 0;
  }
  
  const requiredSkills = job.optionalSkills || [];
  if (requiredSkills.length === 0) {
    return candidate.skills.length > 0 ? 60 : 0;
  }
  
  let matchedSkills = 0;
  const candidateSkillNames = candidate.skills.map(s => normalizeString(s.skillName));
  
  for (const requiredSkill of requiredSkills) {
    const normalizedRequired = normalizeString(requiredSkill);
    for (const candidateSkill of candidateSkillNames) {
      if (candidateSkill.includes(normalizedRequired) || normalizedRequired.includes(candidateSkill)) {
        matchedSkills++;
        break;
      }
    }
  }
  
  const matchRatio = matchedSkills / requiredSkills.length;
  
  const proficiencyBonus = candidate.skills.reduce((bonus, skill) => {
    if (skill.proficiencyLevel === "Expert") return bonus + 5;
    if (skill.proficiencyLevel === "Advanced") return bonus + 3;
    return bonus;
  }, 0);
  
  return Math.min(100, (matchRatio * 80) + Math.min(20, proficiencyBonus));
}

function calculateExperienceScore(candidate: CandidateWithDetails, job: Job): number {
  if (!candidate.experience || candidate.experience.length === 0) {
    return 20;
  }
  
  const currentYear = new Date().getFullYear();
  let totalYears = 0;
  let relevanceScore = 0;
  
  for (const exp of candidate.experience) {
    const startYear = exp.yearStart || currentYear;
    const endYear = exp.yearEnd || currentYear;
    totalYears += endYear - startYear;
    
    if (job.title) {
      const positionSimilarity = calculateStringSimilarity(exp.position, job.title);
      relevanceScore = Math.max(relevanceScore, positionSimilarity);
    }
    
    if (exp.description && job.description) {
      const descSimilarity = calculateStringSimilarity(exp.description, job.description);
      relevanceScore = Math.max(relevanceScore, descSimilarity * 0.5);
    }
  }
  
  const yearsScore = Math.min(40, totalYears * 8);
  const relevancePoints = relevanceScore * 60;
  
  return Math.min(100, yearsScore + relevancePoints);
}

function calculateTrainingScore(candidate: CandidateWithDetails, job: Job): number {
  if (!candidate.trainings || candidate.trainings.length === 0) {
    return 30;
  }
  
  let relevanceScore = 0;
  const jobKeywords = [
    ...(job.optionalSkills || []),
    job.title || "",
    job.description || ""
  ].join(" ").toLowerCase();
  
  for (const training of candidate.trainings) {
    const trainingText = `${training.title} ${training.organizer || ""}`.toLowerCase();
    
    const words = trainingText.split(/\s+/);
    for (const word of words) {
      if (word.length > 3 && jobKeywords.includes(word)) {
        relevanceScore += 15;
      }
    }
  }
  
  const baseScore = Math.min(40, candidate.trainings.length * 10);
  
  return Math.min(100, baseScore + Math.min(60, relevanceScore));
}

export function calculateCandidateJobMatch(
  candidate: CandidateWithDetails,
  job: JobWithDetails
): MatchResult {
  const educationScore = calculateEducationScore(candidate, job);
  const skillsScore = calculateSkillsScore(candidate, job);
  const experienceScore = calculateExperienceScore(candidate, job);
  const trainingScore = calculateTrainingScore(candidate, job);
  
  const weights = {
    education: 0.25,
    skills: 0.35,
    experience: 0.25,
    training: 0.15
  };
  
  const matchScore = Math.round(
    educationScore * weights.education +
    skillsScore * weights.skills +
    experienceScore * weights.experience +
    trainingScore * weights.training
  );
  
  return {
    jobId: job.id,
    jobTitle: job.title,
    matchScore,
    isGoodFit: matchScore >= 75,
    breakdown: {
      educationScore: Math.round(educationScore),
      skillsScore: Math.round(skillsScore),
      experienceScore: Math.round(experienceScore),
      trainingScore: Math.round(trainingScore)
    }
  };
}

export function findBestJobMatch(
  candidate: CandidateWithDetails,
  jobs: JobWithDetails[]
): MatchResult | null {
  if (!jobs || jobs.length === 0) {
    return null;
  }
  
  const matches = jobs.map(job => calculateCandidateJobMatch(candidate, job));
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  return matches[0] || null;
}

export function getAllJobMatches(
  candidate: CandidateWithDetails,
  jobs: JobWithDetails[]
): MatchResult[] {
  if (!jobs || jobs.length === 0) {
    return [];
  }
  
  const matches = jobs.map(job => calculateCandidateJobMatch(candidate, job));
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  return matches;
}
