export interface ParsedEducation {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface ParsedExperience {
  company?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ParsedProject {
  name?: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

export interface ParsedResumeData {
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  skills: string[];
  education: ParsedEducation[];
  experience: ParsedExperience[];
  projects: ParsedProject[];
  certifications: string[];
  achievements: string[];
  languages: string[];
}

export const parseResumeText = (rawText: string): ParsedResumeData => {
  const text = rawText || '';

  // 1. Email Extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[1].toLowerCase() : undefined;

  // 2. Phone Extraction
  const phoneRegex = /(?:(?:\+|00)?\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : undefined;

  // 3. Social / Portfolio Links
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|io|me|com|ai|portfolio)/i;

  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);
  const portfolioMatch = text.match(portfolioRegex);

  // 4. Comprehensive Technical & Professional Skills List
  const knownSkillsList = [
    // Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'R',
    // Frontend
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Redux', 'Zustand', 'GraphQL',
    // Backend & Microservices
    'Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Flask', 'Spring Boot', 'Spring', 'Ruby on Rails', 'REST API', 'gRPC',
    // Data Science & AI / ML
    'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Pandas', 'NumPy', 'Scikit-Learn', 'Keras', 'OpenCV', 'NLP', 'Computer Vision',
    // Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'SQLite', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Oracle',
    // DevOps, Cloud & Tools
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git', 'GitHub Actions', 'Terraform', 'Ansible', 'Linux', 'Nginx',
    // Testing & QA
    'Jest', 'Cypress', 'Playwright', 'Selenium', 'Mocha', 'Chai', 'JUnit', 'PyTest',
    // Core Computer Science & Methodologies
    'Data Structures', 'Algorithms', 'System Design', 'Microservices', 'OOP', 'Agile', 'Scrum', 'TDD'
  ];

  const extractedSkills: string[] = [];
  knownSkillsList.forEach((skill) => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      extractedSkills.push(skill);
    }
  });

  // 5. Basic Full Name (First non-empty line heuristic)
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  let fullName: string | undefined = undefined;
  if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes('@')) {
    fullName = lines[0];
  }

  // 6. Summary Extraction
  let summary: string | undefined = undefined;
  const summaryMatch = text.match(/(?:summary|about me|profile|objective)[\s:]*([\s\S]{40,350}?)(?=\n\s*\n|[A-Z][a-z]+:)/i);
  if (summaryMatch) {
    summary = summaryMatch[1].trim();
  }

  // 7. Simple Heuristics for Education & Certifications
  const education: ParsedEducation[] = [];
  if (/bachelor|b\.s\.|b\.e\.|master|m\.s\.|phd|degree|computer science/i.test(text)) {
    education.push({
      degree: text.match(/(bachelor|master|phd|b\.s\.|b\.e\.|m\.s\.)[^\n,.]*/i)?.[0] || 'Degree',
      fieldOfStudy: text.match(/(computer science|software engineering|data science|information technology)/i)?.[0] || 'Tech Field',
    });
  }

  const certifications: string[] = [];
  const certMatches = text.match(/(?:aws certified|google cloud certified|certified kubernetes|oracle certified|hashicorp certified)[^\n,.]*/gi);
  if (certMatches) {
    certifications.push(...certMatches.map((c) => c.trim()));
  }

  return {
    personalInfo: {
      fullName,
      email,
      phone,
    },
    links: {
      linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
      github: githubMatch ? githubMatch[0] : undefined,
      portfolio: portfolioMatch ? portfolioMatch[0] : undefined,
    },
    summary,
    skills: Array.from(new Set(extractedSkills)),
    education,
    experience: [],
    projects: [],
    certifications: Array.from(new Set(certifications)),
    achievements: [],
    languages: [],
  };
};
