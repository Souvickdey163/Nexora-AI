import { parseResumeText } from '../utils/resumeParser';
import { aiClient } from '../services/ai.client';
import crypto from 'crypto';

describe('AI Resume Intelligence - 3 Synthetic Resume Differentiation Test', () => {
  jest.setTimeout(30000);

  // Resume A: Enterprise Java Backend Engineer
  const resumeAText = `
Alice Smith - Senior Java Backend Engineer
Email: alice.smith@example.com | Phone: +1-555-0192 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/alicesmith | GitHub: github.com/alicesmith

PROFESSIONAL SUMMARY
Results-driven Senior Java Engineer with 6 years of experience building high-throughput microservices using Java, Spring Boot, PostgreSQL, and AWS.

SKILLS
Programming: Java, SQL, C++
Frameworks: Spring Boot, Microservices, REST API
Databases: PostgreSQL, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git

EXPERIENCE
Senior Backend Developer | CloudTech Solutions (2021 - Present)
- Engineered scalable microservices in Java and Spring Boot, serving 2M daily API requests.
- Optimized PostgreSQL database queries, reducing average P99 latency by 35%.
- Deployed containerized applications to AWS ECS with Docker and GitHub Actions CI/CD pipelines.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley (2015 - 2019)
  `.trim();

  // Resume B: Python Machine Learning & Data Science Specialist
  const resumeBText = `
Bob Jones - Machine Learning & Data Science Specialist
Email: bob.jones@example.com | Phone: +1-555-0183 | Location: New York, NY
LinkedIn: linkedin.com/in/bobjones | GitHub: github.com/bobjones

PROFESSIONAL SUMMARY
Data Scientist and Machine Learning Engineer specializing in deep learning, predictive analytics, and computer vision with Python, TensorFlow, PyTorch, and Pandas.

SKILLS
Languages: Python, R, SQL
ML & AI: Machine Learning, TensorFlow, PyTorch, Pandas, NumPy, Scikit-Learn, Keras, Computer Vision, NLP
Databases: MySQL, SQLite
Tools: Git, Jupyter Notebooks, Linux

EXPERIENCE
Machine Learning Engineer | AI Research Lab (2020 - Present)
- Trained deep neural network models in Python and TensorFlow, achieving 94.2% classification accuracy.
- Processed 500GB+ tabular datasets using Pandas and NumPy for predictive model pipelines.
- Deployed computer vision models to cloud endpoints with 40ms inference latency.

EDUCATION
Master of Science in Data Science | Columbia University (2018 - 2020)
  `.trim();

  // Resume C: React & TypeScript Frontend Architect
  const resumeCText = `
Charlie Davis - Senior Frontend Developer & UI Architect
Email: charlie.davis@example.com | Phone: +1-555-0174 | Location: Austin, TX
LinkedIn: linkedin.com/in/charliedavis | Portfolio: charliedavis.dev

PROFESSIONAL SUMMARY
Frontend UI Architect with 5+ years of experience designing web interfaces using React, Next.js, TypeScript, HTML, CSS, and Tailwind CSS.

SKILLS
Frontend: React, Next.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Redux, Sass
Testing: Jest, Cypress, Playwright
Tools: Git, Webpack, Vercel

EXPERIENCE
Senior Frontend Engineer | WebExperience Studio (2022 - Present)
- Architected responsive micro-frontend applications using React, Next.js, and TypeScript.
- Improved Google Lighthouse performance scores from 65 to 98 across 15 high-traffic marketing portals.
- Implemented comprehensive E2E test suites with Cypress and Playwright, achieving 90% code coverage.

EDUCATION
Bachelor of Science in Software Engineering | University of Texas at Austin (2017 - 2021)
  `.trim();

  const targetRole = 'Senior Full-Stack & Cloud Architect';
  const jobDescription = 'Looking for a Senior Tech Lead proficient in React, Next.js, TypeScript, Node.js, Python, PostgreSQL, GraphQL, Docker, and AWS.';

  test('1. Verify Extracted Text & Hashes differ for all 3 resumes', () => {
    const hashA = crypto.createHash('sha256').update(resumeAText).digest('hex');
    const hashB = crypto.createHash('sha256').update(resumeBText).digest('hex');
    const hashC = crypto.createHash('sha256').update(resumeCText).digest('hex');

    expect(resumeAText).not.toEqual(resumeBText);
    expect(resumeBText).not.toEqual(resumeCText);

    expect(hashA).not.toEqual(hashB);
    expect(hashB).not.toEqual(hashC);
  });

  test('2. Verify Resume Parser extracts distinct skills & metadata for each resume', () => {
    const parsedA = parseResumeText(resumeAText);
    const parsedB = parseResumeText(resumeBText);
    const parsedC = parseResumeText(resumeCText);

    // Resume A skills: Java, Spring Boot, PostgreSQL, AWS...
    expect(parsedA.skills).toContain('Java');
    expect(parsedA.skills).toContain('Spring Boot');
    expect(parsedA.skills).not.toContain('TensorFlow');
    expect(parsedA.skills).not.toContain('React');

    // Resume B skills: Python, TensorFlow, PyTorch, Pandas...
    expect(parsedB.skills).toContain('Python');
    expect(parsedB.skills).toContain('TensorFlow');
    expect(parsedB.skills).toContain('Pandas');
    expect(parsedB.skills).not.toContain('Java');

    // Resume C skills: React, Next.js, TypeScript, Tailwind CSS...
    expect(parsedC.skills).toContain('React');
    expect(parsedC.skills).toContain('TypeScript');
    expect(parsedC.skills).toContain('Next.js');
    expect(parsedC.skills).not.toContain('TensorFlow');

    expect(parsedA.skills).not.toEqual(parsedB.skills);
    expect(parsedB.skills).not.toEqual(parsedC.skills);
  });

  test('3. Verify AI Analysis Engine produces distinct, content-driven scores & feedback for each resume', async () => {
    const parsedA = parseResumeText(resumeAText);
    const parsedB = parseResumeText(resumeBText);
    const parsedC = parseResumeText(resumeCText);

    const analysisA = await aiClient.analyzeResume(resumeAText, parsedA, targetRole, 'TechCorp', jobDescription);
    const analysisB = await aiClient.analyzeResume(resumeBText, parsedB, targetRole, 'TechCorp', jobDescription);
    const analysisC = await aiClient.analyzeResume(resumeCText, parsedC, targetRole, 'TechCorp', jobDescription);

    // 1. Missing skills differ across candidate backgrounds
    expect(analysisA.missingSkills).not.toEqual(analysisB.missingSkills);
    expect(analysisB.missingSkills).not.toEqual(analysisC.missingSkills);

    // 2. Strengths and weaknesses differ
    expect(analysisA.strengths).not.toEqual(analysisB.strengths);
    expect(analysisB.strengths).not.toEqual(analysisC.strengths);

    expect(analysisA.weaknesses).not.toEqual(analysisB.weaknesses);
    expect(analysisB.weaknesses).not.toEqual(analysisC.weaknesses);

    // 3. Sub-scores differ based on tech stack match
    expect(analysisC.skillsScore).not.toEqual(analysisB.skillsScore);

    // 4. Detailed output objects are completely distinct
    expect(analysisA).not.toEqual(analysisB);
    expect(analysisB).not.toEqual(analysisC);
  });
});
