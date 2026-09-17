"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResumeText = void 0;
const parseResumeText = (rawText) => {
    const text = rawText || '';
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const emailMatch = text.match(emailRegex);
    const email = emailMatch ? emailMatch[1].toLowerCase() : undefined;
    const phoneRegex = /(?:(?:\+|00)?\d{1,3}[\s.-]?)?(?:\(\d{1,4}\)[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}/;
    const phoneMatch = text.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined;
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;
    const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|io|me|com|ai|portfolio)/i;
    const linkedinMatch = text.match(linkedinRegex);
    const githubMatch = text.match(githubRegex);
    const portfolioMatch = text.match(portfolioRegex);
    const knownSkillsList = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin',
        'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'NestJS', 'Django', 'FastAPI', 'Spring Boot',
        'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Redux', 'GraphQL', 'REST API',
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'SQLite', 'Elasticsearch', 'DynamoDB',
        'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git', 'GitHub Actions', 'Terraform',
        'Jest', 'Cypress', 'Playwright', 'Selenium',
        'Data Structures', 'Algorithms', 'System Design', 'Microservices', 'OOP', 'Agile', 'Scrum'
    ];
    const extractedSkills = [];
    knownSkillsList.forEach((skill) => {
        const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(text)) {
            extractedSkills.push(skill);
        }
    });
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    let fullName = undefined;
    if (lines.length > 0 && lines[0].length < 40 && !lines[0].includes('@')) {
        fullName = lines[0];
    }
    let summary = undefined;
    const summaryMatch = text.match(/(?:summary|about me|profile|objective)[\s:]*([\s\S]{50,300}?)(?=\n\s*\n|[A-Z][a-z]+:)/i);
    if (summaryMatch) {
        summary = summaryMatch[1].trim();
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
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
    };
};
exports.parseResumeText = parseResumeText;
