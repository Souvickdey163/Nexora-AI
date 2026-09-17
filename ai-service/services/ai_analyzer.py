import os
import json
import logging
import re
from typing import Dict, Any, List, Set
from schemas.resume_schema import ResumeAnalyzeRequest, ResumeAnalyzeResponse, SuggestedChange

logger = logging.getLogger("ai_service")
logging.basicConfig(level=logging.INFO)

ROLE_REQUIRED_SKILLS: Dict[str, List[str]] = {
    "java": ["Java", "Spring Boot", "PostgreSQL", "REST API", "Microservices", "Docker", "AWS", "Git"],
    "python": ["Python", "Django", "FastAPI", "PostgreSQL", "Docker", "REST API", "Git", "Linux"],
    "machine learning": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Pandas", "NumPy", "Scikit-Learn", "SQL"],
    "data science": ["Python", "Pandas", "NumPy", "SQL", "Machine Learning", "Scikit-Learn", "R", "Tableau"],
    "frontend": ["React", "TypeScript", "JavaScript", "Next.js", "HTML", "CSS", "Tailwind CSS", "Redux"],
    "react": ["React", "TypeScript", "JavaScript", "Next.js", "HTML", "CSS", "Tailwind CSS", "Jest"],
    "backend": ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST API", "Docker", "Redis", "TypeScript"],
    "fullstack": ["JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "Docker", "Git"],
    "devops": ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Git", "Nginx"],
}

class AIAnalyzerService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.provider = os.getenv("AI_PROVIDER", "fallback" if not self.api_key else "gemini")

    def analyze_resume(self, req: ResumeAnalyzeRequest) -> ResumeAnalyzeResponse:
        """
        Provider-agnostic resume analysis controller.
        Attempts Gemini AI execution if configured; falls back to deterministic rule-based analysis.
        """
        text_len = len(req.resumeText)
        parsed_skills = req.parsedResume.get("skills", []) if req.parsedResume else []
        logger.info(f"📊 Processing Analysis Request | Text Length: {text_len} | Parsed Skills Count: {len(parsed_skills)} | Target Role: {req.targetRole}")

        if self.provider == "gemini" and self.api_key:
            try:
                return self._analyze_with_gemini(req)
            except Exception as e:
                logger.error(f"❌ Gemini AI call failed, using dynamic rule-based fallback analyzer: {str(e)}")
                return self._rule_based_fallback(req)
        else:
            logger.info("ℹ️ Using Dynamic Rule-based Deterministic ATS Analyzer Engine.")
            return self._rule_based_fallback(req)

    def _analyze_with_gemini(self, req: ResumeAnalyzeRequest) -> ResumeAnalyzeResponse:
        import google.generativeai as genai
        genai.configure(api_key=self.api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        prompt = f"""
You are Nexora AI's Senior Resume Analyst and ATS Specialist.
Analyze the following resume against the target role and job description.

CRITICAL RESPONSIBLE AI CONSTRAINTS:
1. Extract and assess factual data present in the resume only.
2. NEVER invent experience, education, projects, certifications, or skills not present.
3. Output MUST BE dynamic and tailored strictly to THIS candidate's text.
4. Output must be raw valid JSON matching this exact structure:

{{
  "overallScore": integer (0-100),
  "atsScore": integer (0-100),
  "contentScore": integer (0-100),
  "skillsScore": integer (0-100),
  "experienceScore": integer (0-100),
  "educationScore": integer (0-100),
  "projectsScore": integer (0-100),
  "formattingScore": integer (0-100),
  "keywordScore": integer (0-100),
  "summaryScore": integer (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingKeywords": ["string"],
  "missingSkills": ["string"],
  "recommendations": ["string"],
  "suggestedChanges": [
    {{
      "section": "string",
      "current": "string",
      "suggested": "string",
      "reason": "string"
    }}
  ]
}}

RESUME TEXT:
{req.resumeText[:4000]}

TARGET ROLE: {req.targetRole or "Software Engineer"}
TARGET COMPANY: {req.targetCompany or "Tech Employer"}
JOB DESCRIPTION: {req.jobDescription or "Not provided"}
"""

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )

        raw_json = response.text.strip()
        parsed_data = json.loads(raw_json)

        return ResumeAnalyzeResponse(
            overallScore=min(100, max(0, int(parsed_data.get("overallScore", 75)))),
            atsScore=min(100, max(0, int(parsed_data.get("atsScore", 78)))),
            contentScore=min(100, max(0, int(parsed_data.get("contentScore", 74)))),
            skillsScore=min(100, max(0, int(parsed_data.get("skillsScore", 80)))),
            experienceScore=min(100, max(0, int(parsed_data.get("experienceScore", 70)))),
            educationScore=min(100, max(0, int(parsed_data.get("educationScore", 85)))),
            projectsScore=min(100, max(0, int(parsed_data.get("projectsScore", 75)))),
            formattingScore=min(100, max(0, int(parsed_data.get("formattingScore", 82)))),
            keywordScore=min(100, max(0, int(parsed_data.get("keywordScore", 72)))),
            summaryScore=min(100, max(0, int(parsed_data.get("summaryScore", 70)))),
            strengths=parsed_data.get("strengths", []),
            weaknesses=parsed_data.get("weaknesses", []),
            missingKeywords=parsed_data.get("missingKeywords", []),
            missingSkills=parsed_data.get("missingSkills", []),
            recommendations=parsed_data.get("recommendations", []),
            suggestedChanges=[
                SuggestedChange(**sc) for sc in parsed_data.get("suggestedChanges", [])
            ],
            aiProvider="gemini",
            aiModel="gemini-1.5-flash"
        )

    def _rule_based_fallback(self, req: ResumeAnalyzeRequest) -> ResumeAnalyzeResponse:
        text = req.resumeText.lower()
        parsed_skills: List[str] = req.parsedResume.get("skills", []) if req.parsedResume else []
        
        # 1. Target Role & Required Skills Lookup
        target_role = (req.targetRole or "fullstack").lower()
        required_skills: List[str] = ROLE_REQUIRED_SKILLS.get("fullstack", [])
        for role_key, skill_list in ROLE_REQUIRED_SKILLS.items():
            if role_key in target_role:
                required_skills = skill_list
                break

        # If job description provided, extract extra requirements
        if req.jobDescription:
            jd_text = req.jobDescription.lower()
            jd_extras = [s for s in ["docker", "aws", "kubernetes", "graphql", "redis", "kafka", "ci/cd", "system design"] if s in jd_text]
            if jd_extras:
                required_skills = list(set(required_skills + jd_extras))

        # 2. Extract detected skills from text if parsed_skills is empty
        detected_skills = set([s.lower() for s in parsed_skills])
        if not detected_skills:
            all_known = ["java", "python", "javascript", "typescript", "react", "next.js", "node.js", "express", "spring boot", "django", "fastapi", "postgresql", "mongodb", "docker", "aws", "tensorflow", "pytorch", "pandas"]
            for k in all_known:
                if k in text:
                    detected_skills.add(k)

        # 3. Compute Matching vs Missing Skills
        req_lower = [r.lower() for r in required_skills]
        matched_skills_lower = [r for r in req_lower if r in detected_skills or r in text]
        missing_skills_lower = [r for r in req_lower if r not in matched_skills_lower]

        matched_skills_display = [s.title() for s in matched_skills_lower]
        missing_skills_display = [s.title() for s in missing_skills_lower]

        # 4. Calculate Dynamic Category Scores
        has_summary = any(k in text for k in ["summary", "profile", "objective", "about me"])
        has_experience = any(k in text for k in ["experience", "work history", "employment"])
        has_education = any(k in text for k in ["education", "university", "bachelor", "degree", "college"])
        has_projects = any(k in text for k in ["projects", "personal projects", "portfolio"])

        metrics_count = len(re.findall(r'\b(?:\d+%|\$\d+|\d+\+|\d+x)\b', text))
        action_verbs = ["developed", "engineered", "designed", "implemented", "scaled", "optimized", "built", "managed", "led", "architected"]
        action_verb_count = sum(1 for v in action_verbs if v in text)

        # Score computations based strictly on candidate data
        match_ratio = len(matched_skills_lower) / max(1, len(req_lower))
        keywordScore = min(98, max(35, int(match_ratio * 100)))
        skillsScore = min(98, max(30, int(len(matched_skills_lower) * 15 + len(detected_skills) * 3 + 25)))
        
        atsScore = min(96, max(40, 50 + (10 if has_skills_check(detected_skills) else 0) + (10 if has_experience else 0) + (10 if has_education else 0) + min(15, metrics_count * 3)))
        experienceScore = min(95, max(35, 45 + (20 if has_experience else 0) + min(20, action_verb_count * 4) + min(10, metrics_count * 2)))
        educationScore = min(95, max(40, 85 if has_education else 45))
        projectsScore = min(95, max(35, 80 if has_projects else 40))
        formattingScore = min(95, max(50, 85 if len(text) > 300 else 60))
        summaryScore = 85 if has_summary else 45
        contentScore = int((experienceScore + projectsScore + min(95, 50 + metrics_count * 5)) / 3)

        overallScore = int(
            (atsScore * 0.30) + (skillsScore * 0.25) + (keywordScore * 0.20) +
            (experienceScore * 0.15) + (educationScore * 0.10)
        )
        overallScore = min(98, max(35, overallScore))

        # 5. Build Tailored Strengths & Weaknesses
        strengths = []
        if matched_skills_display:
            strengths.append(f"Strong skill alignment detected for target role: {', '.join(matched_skills_display[:4])}.")
        if metrics_count > 0:
            strengths.append(f"Quantifiable impact highlighted with {metrics_count} metric indicators.")
        if has_education:
            strengths.append("Educational qualifications and degree section clearly documented.")
        if not strengths:
            strengths.append("Document structure is text-extractable for automated screeners.")

        weaknesses = []
        if missing_skills_display:
            cloud_gaps = [s for s in missing_skills_display if s.upper() in ["AWS", "DOCKER", "KUBERNETES", "CI/CD"]]
            fe_gaps = [s for s in missing_skills_display if s.upper() in ["REACT", "NEXT.JS", "TYPESCRIPT", "JAVASCRIPT", "TAILWIND CSS"]]
            be_gaps = [s for s in missing_skills_display if s.upper() in ["NODE.JS", "PYTHON", "JAVA", "POSTGRESQL", "GRAPHQL", "REDIS"]]
            
            cat_gaps = []
            matched_upper = [s.upper() for s in matched_skills_display]
            if cloud_gaps and not any(s in matched_upper for s in ["AWS", "DOCKER", "KUBERNETES"]):
                cat_gaps.extend(cloud_gaps)
            if fe_gaps and not any(s in matched_upper for s in ["REACT", "NEXT.JS", "TYPESCRIPT"]):
                cat_gaps.extend(fe_gaps)
            if be_gaps and not any(s in matched_upper for s in ["NODE.JS", "PYTHON", "JAVA", "POSTGRESQL"]):
                cat_gaps.extend(be_gaps)

            display_gaps = cat_gaps[:4] if cat_gaps else missing_skills_display[:4]
            weaknesses.append(f"Missing key expected keywords for {req.targetRole or 'target role'}: {', '.join(display_gaps)}.")
        if metrics_count == 0:
            weaknesses.append("Work experience bullet points lack measurable performance metrics (%, $, numbers).")
        if not has_summary:
            weaknesses.append("No professional summary section found at top of resume.")

        recommendations = [
            f"Add missing target role skills ({', '.join(missing_skills_display[:3])}) if you possess experience with them.",
            "Use standard ATS section headings (Skills, Experience, Education, Projects).",
            "Quantify project and job achievements with clear outcomes (e.g. 'Improved speed by 30%')."
        ]

        suggestedChanges = []
        if missing_skills_display:
            suggestedChanges.append(
                SuggestedChange(
                    section="Skills",
                    current="Current Skills section",
                    suggested=f"Add {', '.join(missing_skills_display[:3])} to technical skills block.",
                    reason=f"Increases ATS keyword density match for {req.targetRole or 'target role'}."
                )
            )

        return ResumeAnalyzeResponse(
            overallScore=overallScore,
            atsScore=atsScore,
            contentScore=contentScore,
            skillsScore=skillsScore,
            experienceScore=experienceScore,
            educationScore=educationScore,
            projectsScore=projectsScore,
            formattingScore=formattingScore,
            keywordScore=keywordScore,
            summaryScore=summaryScore,
            strengths=strengths,
            weaknesses=weaknesses,
            missingKeywords=missing_skills_display,
            missingSkills=missing_skills_display,
            recommendations=recommendations,
            suggestedChanges=suggestedChanges,
            aiProvider=self.provider,
            aiModel="nexora-ats-engine"
        )

def has_skills_check(skills: Set[str]) -> bool:
    return len(skills) > 0

ai_analyzer = AIAnalyzerService()
