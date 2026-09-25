import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AIAnalysisResult } from '../types/resume.types';
import { ParsedResumeData } from '../utils/resumeParser';
import crypto from 'crypto';

export class AIClientService {
  private serviceUrl: string;

  constructor() {
    this.serviceUrl = env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  public async analyzeResume(
    resumeText: string,
    parsedResume?: ParsedResumeData,
    targetRole?: string,
    targetCompany?: string,
    jobDescription?: string
  ): Promise<AIAnalysisResult> {
    const textLength = (resumeText || '').length;
    const textHash = crypto.createHash('sha256').update(resumeText || '').digest('hex').substring(0, 12);
    const skillCount = parsedResume?.skills?.length || 0;
    const jdLength = (jobDescription || '').length;

    logger.info(
      `🤖 Dispatching AI Analysis Request | Service: ${this.serviceUrl} | Text Length: ${textLength} | Hash: ${textHash} | Skills: ${skillCount} | Target Role: "${targetRole || 'Software Engineer'}" | JD Length: ${jdLength}`
    );

    try {
      const response = await fetch(`${this.serviceUrl}/api/ai/resume/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          resumeText,
          parsedResume,
          targetRole,
          targetCompany,
          jobDescription,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Service returned HTTP ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as AIAnalysisResult;
      logger.info(`✅ AI Analysis completed. Overall Score: ${data.overallScore} | Provider: ${data.aiProvider}`);
      return data;
    } catch (err: any) {
      logger.warn(`⚠️ FastAPI AI service request failed (${err.message}). Using local dynamic ATS scoring engine.`);
      return this.getLocalFallbackAnalysis(resumeText, parsedResume, targetRole, jobDescription);
    }
  }

  public async sendMentorChat(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    careerContext: Record<string, any> = {}
  ): Promise<{ message: string; model: string; provider: string }> {
    logger.info(`🤖 Dispatching Nexus AI Chat Request`);

    // 1. Direct Google Gemini API Call if API Key configured
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const directGeminiResult = await this.callDirectGeminiApi(apiKey, userMessage, conversationHistory, careerContext);
        if (directGeminiResult) {
          logger.info(`✅ Nexus AI response generated via direct Gemini API (${directGeminiResult.model})`);
          return directGeminiResult;
        }
      } catch (err: any) {
        logger.warn(`⚠️ Direct Gemini API call failed (${err.message}). Trying microservice or local fallback.`);
      }
    }

    // 2. Try FastAPI Microservice if running
    try {
      const response = await fetch(`${this.serviceUrl}/api/ai/mentor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          userMessage,
          conversationHistory,
          careerContext,
        }),
      });

      if (response.status === 429) {
        throw new Error('AI Mentor is temporarily unavailable because the free AI quota has been reached. Please try again later.');
      }

      if (response.ok) {
        const data = (await response.json()) as { message: string; model: string; provider: string };
        return data;
      }
    } catch (err: any) {
      if (err.message && err.message.includes('quota has been reached')) {
        throw err;
      }
    }

    // 3. Intelligent Local Fallback Engine
    return this.getLocalFallbackMentorChat(userMessage, careerContext);
  }

  private async callDirectGeminiApi(
    apiKey: string,
    userMessage: string,
    history: Array<{ role: string; content: string }> = [],
    context: Record<string, any> = {}
  ): Promise<{ message: string; model: string; provider: string } | null> {
    const systemPrompt = `You are Nexus AI — an elite, highly intelligent, friendly, and empowering AI Career Copilot for software engineers, computer science students, and technology professionals, built directly into the Nexora platform.

Your Persona & Tone:
- Name: Nexus AI
- Identity: Nexora ("Your AI Career Copilot")
- Tone: Warm, empathetic, professional, clear, structured, and deeply encouraging.

Core Capabilities:
1. Provide personalized, high-impact career guidance, software engineering growth pathways, ATS resume optimization, and technical interview strategies.
2. Explain Data Structures & Algorithms (DSA), System Design patterns, Computer Science core concepts (DBMS, Operating Systems, Computer Networks, OOP), and full-stack software development.
3. Be natural and conversational. If the user greets you (e.g. "hello", "hi", "how are you", "what's up"), respond warmly and naturally first before asking how you can help them excel today.
4. Format all responses using rich GitHub-flavored Markdown:
   - Use bold section titles and headers.
   - Use structured bullet points and numbered steps.
   - Use fenced code blocks with language specifiers (e.g. \`\`\`typescript, \`\`\`python, \`\`\`sql) for any code snippets.

Candidate Context:
${JSON.stringify(context, null, 2)}`;

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Bounded history (last 10 messages)
    const recentHistory = history.slice(-10);
    for (const item of recentHistory) {
      const gRole = item.role.toLowerCase() === 'user' ? 'user' : 'model';
      contents.push({
        role: gRole,
        parts: [{ text: item.content }],
      });
    }

    // Append current user input
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const modelsToTry = [env.GEMINI_MODEL || 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemPrompt }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        });

        if (response.ok) {
          const resJson = (await response.json()) as any;
          const responseText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText && responseText.trim()) {
            return {
              message: responseText.trim(),
              model,
              provider: 'google-gemini',
            };
          }
        } else {
          const errBody = await response.text();
          logger.warn(`Gemini API call model ${model} HTTP ${response.status}: ${errBody}`);
        }
      } catch (err: any) {
        logger.warn(`Gemini API call error for model ${model}: ${err.message}`);
      }
    }

    return null;
  }

  public getLocalFallbackMentorChat(
    userMessage: string,
    careerContext: Record<string, any> = {}
  ): { message: string; model: string; provider: string } {
    const msg = (userMessage || '').trim().toLowerCase();
    const problemTitle = careerContext.problemTitle || '';
    const difficulty = careerContext.difficulty || '';
    const topic = careerContext.topic || '';
    const language = careerContext.language || 'code';

    let fallbackReply = '';

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('how are you')) {
      fallbackReply = `Hello! I'm doing great, thank you for asking! 😊 I'm **Nexus AI** — your personal AI career copilot on Nexora.\n\nWhether you need help preparing for technical interviews, solving DSA challenges, optimizing your ATS resume score, or building a personalized placement roadmap, I'm here to guide you.\n\nWhat would you like to focus on today?`;
    } else if (msg.includes('hint')) {
      fallbackReply = `Here is a structured hint for solving **${problemTitle || 'this challenge'}** (${difficulty} - ${topic}):\n\n1. **Identify the Core Pattern:** Consider data structures like Hash Maps, Two Pointers, or Sliding Window that minimize lookups.\n2. **Hand Tracing:** Work through a simple array example step-by-step to spot repetitive operations before writing code.\n3. **Edge Cases:** Think about empty inputs, duplicates, or boundary limits.`;
    } else if (msg.includes('explain_problem') || msg.includes('explain problem')) {
      fallbackReply = `### Problem Breakdown: ${problemTitle || 'Algorithmic Challenge'}\n\n- **Category:** ${topic || 'Data Structures & Algorithms'}\n- **Difficulty:** ${difficulty || 'Medium'}\n- **Goal:** Understand input structure, identify constraints, and design an optimal solution in ${language}.\n\nNeed a step-by-step breakdown or hint? Let me know!`;
    } else if (msg.includes('error') || msg.includes('debug')) {
      fallbackReply = `### Debugging Checklist for ${language}:\n\n- **Bounds & Off-by-One:** Check loop limits and array indexing.\n- **Null / Undefined Handles:** Verify non-null references before accessing object properties.\n- **Return Types:** Ensure expected return signatures match function contract.`;
    } else if (msg.includes('resume') || msg.includes('ats')) {
      fallbackReply = `### ATS Resume Optimization Strategy:\n\n1. **Quantifiable Bullet Points:** Use numbers (e.g. *Reduced latency by 40%*, *Scaled API to 10k users*).\n2. **Target Keyword Density:** Match tech stack keywords explicitly from job descriptions.\n3. **Formatting:** Use single-column standard section headers (Skills, Experience, Projects, Education).`;
    } else if (msg.includes('roadmap') || msg.includes('placement')) {
      fallbackReply = `### Recommended 4-Week Placement Pathway:\n\n- **Week 1 (DSA):** Arrays, Strings, Sliding Window & Two Pointers.\n- **Week 2 (Core CS):** DBMS Transaction Isolation, PostgreSQL, B-Tree Indexes.\n- **Week 3 (System Design):** Rate Limiters, Load Balancing & Caching.\n- **Week 4 (Interviews):** STAR Method Behavioral Practice & Full Mock Sessions.`;
    } else {
      fallbackReply = `Hello! I'm **Nexus AI**, your personal AI career copilot.\n\nRegarding your question about "${userMessage}":\n\nTo give you the most accurate advice, could you share a bit more context? For example:\n- Are you focusing on **DSA & Problem Solving**?\n- Preparing for **System Design & Mock Interviews**?\n- Optimizing your **ATS Resume & GitHub Portfolio**?\n\nI'm ready to dive into details with you!`;
    }

    return {
      message: fallbackReply,
      model: 'nexus-ai-engine-v1',
      provider: 'nexus-local',
    };
  }

  public getLocalFallbackAnalysis(
    resumeText: string,
    parsedResume?: ParsedResumeData,
    targetRole?: string,
    jobDescription?: string
  ): AIAnalysisResult {
    const text = (resumeText || '').toLowerCase();
    const skills = parsedResume?.skills || [];
    const role = (targetRole || 'software engineer').toLowerCase();

    const roleSkillRequirements: Record<string, string[]> = {
      java: ['Java', 'Spring Boot', 'PostgreSQL', 'REST API', 'Microservices', 'Docker', 'AWS'],
      python: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker', 'REST API', 'Git'],
      machine: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL'],
      data: ['Python', 'Pandas', 'NumPy', 'SQL', 'Machine Learning', 'Scikit-Learn', 'Tableau'],
      frontend: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Redux'],
      react: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Jest'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Redis', 'TypeScript'],
      fullstack: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git'],
      devops: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Git', 'Nginx'],
    };

    let targetSkills = roleSkillRequirements['fullstack'];
    for (const key of Object.keys(roleSkillRequirements)) {
      if (role.includes(key)) {
        targetSkills = roleSkillRequirements[key];
        break;
      }
    }

    if (jobDescription) {
      const jdLower = jobDescription.toLowerCase();
      const extras = ['docker', 'aws', 'kubernetes', 'graphql', 'redis', 'ci/cd', 'system design'].filter((k) =>
        jdLower.includes(k)
      );
      if (extras.length > 0) {
        targetSkills = Array.from(new Set([...targetSkills, ...extras.map((e) => e.toUpperCase())]));
      }
    }

    const detectedLower = new Set(skills.map((s) => s.toLowerCase()));
    if (detectedLower.size === 0) {
      ['java', 'python', 'javascript', 'typescript', 'react', 'next.js', 'node.js', 'postgresql', 'docker', 'aws', 'tensorflow'].forEach((k) => {
        if (text.includes(k)) detectedLower.add(k);
      });
    }

    const matchedSkills = targetSkills.filter((ts) => detectedLower.has(ts.toLowerCase()) || text.includes(ts.toLowerCase()));
    const missingSkills = targetSkills.filter((ts) => !matchedSkills.includes(ts));

    const hasSummary = text.includes('summary') || text.includes('profile');
    const hasExperience = text.includes('experience') || text.includes('work');
    const hasEducation = text.includes('education') || text.includes('degree');
    const hasProjects = text.includes('projects') || text.includes('portfolio');

    const metricsCount = (text.match(/\b(?:\d+%|\$\d+|\d+\+|\d+x)\b/g) || []).length;
    const actionVerbs = ['developed', 'engineered', 'designed', 'implemented', 'scaled', 'optimized', 'built', 'architected'];
    const actionVerbCount = actionVerbs.filter((v) => text.includes(v)).length;

    const keywordScore = Math.min(98, Math.max(35, Math.round((matchedSkills.length / Math.max(1, targetSkills.length)) * 100)));
    const skillsScore = Math.min(98, Math.max(30, Math.round(matchedSkills.length * 15 + detectedLower.size * 3 + 25)));
    const atsScore = Math.min(96, Math.max(40, 50 + (detectedLower.size > 0 ? 10 : 0) + (hasExperience ? 10 : 0) + (hasEducation ? 10 : 0) + Math.min(15, metricsCount * 3)));
    const experienceScore = Math.min(95, Math.max(35, 45 + (hasExperience ? 20 : 0) + Math.min(20, actionVerbCount * 4) + Math.min(10, metricsCount * 2)));
    const educationScore = Math.min(95, Math.max(40, hasEducation ? 85 : 45));
    const projectsScore = Math.min(95, Math.max(35, hasProjects ? 80 : 40));
    const formattingScore = Math.min(95, Math.max(50, text.length > 300 ? 85 : 60));
    const summaryScore = hasSummary ? 85 : 45;
    const contentScore = Math.round((experienceScore + projectsScore + Math.min(95, 50 + metricsCount * 5)) / 3);

    const overallScore = Math.min(
      98,
      Math.max(
        35,
        Math.round(atsScore * 0.30 + skillsScore * 0.25 + keywordScore * 0.20 + experienceScore * 0.15 + educationScore * 0.10)
      )
    );

    const strengths: string[] = [];
    if (matchedSkills.length > 0) {
      strengths.push(`Matched core technical skills for target role: ${matchedSkills.slice(0, 4).join(', ')}.`);
    }
    if (metricsCount > 0) {
      strengths.push(`Included ${metricsCount} quantifiable performance indicators.`);
    }
    if (hasEducation) {
      strengths.push('Educational background clearly formatted.');
    }
    if (strengths.length === 0) {
      strengths.push('Document text is clear and readable for ATS parsers.');
    }

    const weaknesses: string[] = [];
    if (missingSkills.length > 0) {
      const cloudGaps = missingSkills.filter((s) => ['AWS', 'DOCKER', 'KUBERNETES', 'CI/CD'].includes(s.toUpperCase()));
      const feGaps = missingSkills.filter((s) => ['REACT', 'NEXT.JS', 'TYPESCRIPT', 'JAVASCRIPT', 'TAILWIND CSS'].includes(s.toUpperCase()));
      const beGaps = missingSkills.filter((s) => ['NODE.JS', 'PYTHON', 'JAVA', 'POSTGRESQL', 'GRAPHQL', 'REDIS'].includes(s.toUpperCase()));

      const categorizedGaps: string[] = [];
      const matchedUpper = matchedSkills.map((s) => s.toUpperCase());
      if (cloudGaps.length > 0 && !matchedUpper.some((s) => ['AWS', 'DOCKER', 'KUBERNETES'].includes(s))) {
        categorizedGaps.push(...cloudGaps);
      }
      if (feGaps.length > 0 && !matchedUpper.some((s) => ['REACT', 'NEXT.JS', 'TYPESCRIPT'].includes(s))) {
        categorizedGaps.push(...feGaps);
      }
      if (beGaps.length > 0 && !matchedUpper.some((s) => ['NODE.JS', 'PYTHON', 'JAVA', 'POSTGRESQL'].includes(s))) {
        categorizedGaps.push(...beGaps);
      }

      const displayGaps = categorizedGaps.length > 0 ? categorizedGaps.slice(0, 4) : missingSkills.slice(0, 4);
      weaknesses.push(`Missing key keywords for ${targetRole || 'target role'}: ${displayGaps.join(', ')}.`);
    }
    if (metricsCount === 0) {
      weaknesses.push('Work experience bullet points lack measurable outcome metrics (%, $, numbers).');
    }
    if (!hasSummary) {
      weaknesses.push('Missing professional summary at the top of the resume.');
    }

    const recommendations = [
      `Add missing target role skills (${missingSkills.slice(0, 3).join(', ')}) to your skills section if applicable.`,
      'Use standard ATS section headings (Skills, Experience, Education, Projects).',
      'Quantify job achievements with clear metric outcomes.',
    ];

    const suggestedChanges = missingSkills.length > 0 ? [
      {
        section: 'Skills',
        current: 'Current Skills block',
        suggested: `Add ${missingSkills.slice(0, 3).join(', ')} to technical skills list.`,
        reason: `Increases ATS keyword density match for ${targetRole || 'target role'}.`,
      },
    ] : [];

    return {
      overallScore,
      atsScore,
      contentScore,
      skillsScore,
      experienceScore,
      educationScore,
      projectsScore,
      formattingScore,
      keywordScore,
      summaryScore,
      strengths,
      weaknesses,
      missingKeywords: missingSkills,
      missingSkills,
      recommendations,
      suggestedChanges,
      aiProvider: 'fallback-local',
      aiModel: 'nexora-dynamic-ats-engine',
    };
  }

  public async analyzeGitHubRepository(
    repoName: string,
    description: string,
    techStack: string[],
    readmeExcerpt: string,
    signals: any
  ): Promise<{
    projectSummary: string;
    architectureSummary: string;
    engineeringAreas: string[];
    aiReview: any;
    resumeBullets: string[];
    interviewQuestions: any[];
  }> {
    logger.info(`🤖 Dispatching GitHub Repository AI Analysis Request | Repo: ${repoName}`);

    try {
      const response = await fetch(`${this.serviceUrl}/api/ai/github/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        body: JSON.stringify({
          repoName,
          description,
          techStack,
          readmeExcerpt,
          signals,
        }),
      });

      if (response.ok) {
        return (await response.json()) as any;
      }
    } catch (err: any) {
      logger.warn(`⚠️ FastAPI AI service request failed for GitHub analysis (${err.message}). Using local dynamic engine.`);
    }

    // Local Dynamic Fallback Engine
    const stackStr = techStack.join(', ') || 'TypeScript, React, Node.js';
    return {
      projectSummary: description || `${repoName} is a modular full-stack application built with ${stackStr}. It implements clean component isolation and RESTful API data flows.`,
      architectureSummary: signals.detectedArchitecture || `Layered Architecture utilizing ${stackStr} with client-side state management and database abstraction.`,
      engineeringAreas: ['Full-stack Development', 'REST API Design', 'State Management', 'Software Architecture'],
      aiReview: {
        maintainability: 'High modularity with clear file structure and component separation.',
        projectOrganization: `Organized into logical modules with ${signals.fileCount || 15} source files.`,
        documentationQuality: signals.hasReadme ? 'Structured README with installation and setup instructions.' : 'Basic documentation detected.',
        testingCoverage: signals.hasTests ? `Automated test suite present (${signals.testFrameworks.join(', ') || 'Unit tests'}).` : 'Consider adding automated unit and integration tests.',
        errorHandlingNotes: 'Clean try-catch blocks and request error boundaries implemented.',
        keyStrengths: [
          `Strong implementation of ${stackStr}.`,
          signals.hasCiCd ? 'Automated CI/CD workflow configured.' : 'Clear directory structure and component hierarchy.',
          'Clean REST API service integration.',
        ],
        improvementSuggestions: [
          signals.hasTests ? 'Expand test coverage for core business logic.' : 'Set up automated unit testing framework.',
          'Add environment variable documentation in .env.example.',
        ],
      },
      resumeBullets: [
        `Engineered ${repoName}, a ${stackStr} web platform implementing modular component architecture and REST APIs.`,
        `Integrated ${techStack[0] || 'TypeScript'} data validation and state management, improving API response reliability.`,
        `Configured ${signals.hasCiCd ? 'GitHub Actions CI/CD workflows' : 'modular project structure'} for scalable application deployment.`,
      ],
      interviewQuestions: [
        {
          question: `Explain how you designed the architecture and state flow in ${repoName} using ${techStack[0] || 'TypeScript'} and ${techStack[1] || 'React'}.`,
          category: 'Technical Architecture',
          followUp: 'How would you refactor this service to handle 10x concurrent traffic?',
          expectedAnswerKey: 'Key points: Component decoupling, REST API error handling, asynchronous data fetching, and database indexing.',
        },
        {
          question: `Walk me through your database layer and API design decisions in ${repoName}.`,
          category: 'System Design',
          followUp: 'What strategies did you use to prevent N+1 query bottlenecks?',
          expectedAnswerKey: 'Key points: Relational schema design, ORM caching, query pagination, and payload optimization.',
        },
      ],
    };
  }
}

export const aiClient = new AIClientService();
