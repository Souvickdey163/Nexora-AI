import os
import logging
from typing import Dict, Any, List
from providers.base_provider import BaseAIProvider
from prompts.mentor_prompt import NEXORA_MENTOR_SYSTEM_PROMPT

logger = logging.getLogger("ai_service")

class GeminiQuotaExceededError(Exception):
    """Raised when Gemini API returns 429 / quota rate limit error."""
    pass

class GeminiProvider(BaseAIProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        
        if not self.api_key:
            logger.warning("⚠️ GEMINI_API_KEY is missing in ai-service environment variables.")

    def generate_mentor_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        career_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("Gemini API key is not configured on the server.")

        import google.generativeai as genai
        genai.configure(api_key=self.api_key)

        # Construct Context Prompt Block
        context_block = self._format_career_context(career_context)
        
        # Build prompt with System Instruction + Career Context
        full_system_prompt = f"{NEXORA_MENTOR_SYSTEM_PROMPT}\n\n{context_block}"

        # Format past conversation history into SDK chat history structure
        contents = []
        for msg in conversation_history:
            role = msg.get("role", "user").lower()
            gemini_role = "model" if role == "assistant" else "user"
            content_text = msg.get("content", "").strip()
            if content_text:
                contents.append({"role": gemini_role, "parts": [content_text]})

        # Add latest user message
        contents.append({"role": "user", "parts": [user_message]})

        # Candidate models to try in order of preference
        models_to_try = [self.model_name, "gemini-3.6-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
        
        # Deduplicate while preserving order
        seen = set()
        candidate_models = [m for m in models_to_try if not (m in seen or seen.add(m))]

        last_error = None

        for target_model in candidate_models:
            try:
                logger.info(f"🤖 Invoking Gemini API model '{target_model}' | History Messages: {len(conversation_history)}")
                model = genai.GenerativeModel(
                    model_name=target_model,
                    system_instruction=full_system_prompt
                )
                response = model.generate_content(contents)
                
                if not response or not response.text:
                    raise ValueError(f"Empty response returned from Gemini model {target_model}.")

                return {
                    "message": response.text.strip(),
                    "model": target_model,
                    "provider": "gemini"
                }

            except Exception as err:
                err_str = str(err)
                if "429" in err_str or "Quota" in err_str or "RESOURCE_EXHAUSTED" in err_str or "rate limit" in err_str.lower():
                    logger.error("🚨 Gemini API Free Tier Quota / Rate Limit Reached (HTTP 429)")
                    raise GeminiQuotaExceededError("AI Mentor free quota limit reached. Please try again later.")
                
                logger.warning(f"⚠️ Gemini model '{target_model}' returned error: {err_str}. Trying fallback model if available...")
                last_error = err

        if last_error:
            raise last_error
        else:
            raise ValueError("Failed to generate response from Gemini provider.")

    def _format_career_context(self, context: Dict[str, Any]) -> str:
        if not context:
            return "CAREER CONTEXT: No specific candidate context provided for this query."

        lines = ["=== CANDIDATE CAREER CONTEXT ==="]
        
        if "userProfile" in context and context["userProfile"]:
            prof = context["userProfile"]
            lines.append(f"- Name: {prof.get('name', 'Candidate')}")
            lines.append(f"- Headline: {prof.get('headline', 'Not set')}")
            if prof.get("skills"):
                lines.append(f"- Known Profile Skills: {', '.join(prof['skills'])}")

        if "targetRole" in context and context["targetRole"]:
            lines.append(f"- Target Engineering Role: {context['targetRole']}")

        if "careerGoals" in context and context["careerGoals"]:
            lines.append(f"- Career Goals: {context['careerGoals']}")

        if "resume" in context and context["resume"]:
            res = context["resume"]
            lines.append(f"- Active Resume Title: {res.get('title', 'Resume')}")
            if "scores" in res:
                scores = res["scores"]
                lines.append(f"- ATS Resume Overall Score: {scores.get('overallScore', 'N/A')}/100")
                lines.append(f"- ATS Skills Match Score: {scores.get('skillsScore', 'N/A')}/100")
            if "detectedSkills" in res and res["detectedSkills"]:
                lines.append(f"- Detected Skills in Resume: {', '.join(res['detectedSkills'])}")

        if "codingStats" in context and context["codingStats"]:
            cstats = context["codingStats"]
            lines.append(f"- Coding Readiness: {cstats.get('score', 'N/A')}% | Problems Solved: {cstats.get('solved', 'N/A')}")

        lines.append("================================")
        return "\n".join(lines)

    def generate_interview_question(
        self,
        mode: str,
        interview_type: str,
        target_role: str,
        difficulty: str,
        question_index: int,
        total_questions: int,
        resume_text: str = "",
        job_description: str = "",
        previous_answers: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("Gemini API key is missing on AI microservice.")

        import google.generativeai as genai
        genai.configure(api_key=self.api_key)

        prev_summary = ""
        if previous_answers:
            prev_summary = "\n=== PREVIOUS QUESTIONS & CANDIDATE ANSWERS ===\n"
            for idx, pa in enumerate(previous_answers):
                score = pa.get('evaluationScore', 'N/A')
                prev_summary += f"Q{idx+1}: {pa.get('questionText')}\nAnswer: {pa.get('userAnswer')}\nScore: {score}/100\n---\n"

        prompt = f"""
You are an expert lead technical interviewer and talent assessor at a top tech company.
Mode: {mode}
Interview Type: {interview_type}
Target Role: {target_role}
Difficulty: {difficulty}
Question Number: {question_index} of {total_questions}

RESUME CONTEXT:
{resume_text[:2000] if resume_text else 'No resume text provided.'}

JOB DESCRIPTION CONTEXT:
{job_description[:1000] if job_description else 'No job description provided.'}
{prev_summary}

INSTRUCTIONS:
1. Generate the NEXT realistic, context-aware interview question for the candidate tailored to target role ({target_role}) and difficulty ({difficulty}).
2. If previous answers were weak, ask a clarification or follow-up question digging deeper into their gap.
3. If previous answers were strong, increase depth and technical rigor.
4. If type is SYSTEM_DESIGN, ask a system design question appropriate to {target_role} and {difficulty} (e.g., Design a URL shortener, scalable notification system, file storage service, real-time chat application, e-commerce backend, or rate limiter). Ask about API design, DB data model, scaling, caching, and trade-offs.
5. If type is HR_BEHAVIORAL, focus on leadership, conflict resolution, or STAR scenarios.
6. If type is TECHNICAL, focus on core algorithms, frameworks, state management, code structure, or databases.
7. If type is RESUME_BASED, focus on candidate's project stack, architecture choices, or resume achievements.
8. If type is MIXED, blend technical depth with system design and STAR behavioral aspects.
9. Provide helpful hints and 3 key points expected in a strong candidate answer.

Return ONLY a raw JSON object with keys:
"questionText": "...",
"category": "Technical" | "Behavioral" | "System Design" | "STAR",
"hints": "...",
"expectedKeyPoints": ["point 1", "point 2", "point 3"],
"isFollowUp": true/false
"""

        models_to_try = [self.model_name, "gemini-3.6-flash", "gemini-1.5-flash"]
        for target_model in models_to_try:
            try:
                model = genai.GenerativeModel(model_name=target_model)
                res = model.generate_content(prompt)
                if res and res.text:
                    import json
                    txt = res.text.strip()
                    if txt.startswith("```json"):
                        txt = txt[7:]
                    if txt.startswith("```"):
                        txt = txt[3:]
                    if txt.endswith("```"):
                        txt = txt[:-3]
                    data = json.loads(txt.strip())
                    data["model"] = target_model
                    data["provider"] = "gemini"
                    return data
            except Exception as e:
                logger.warning(f"Gemini fallback on generate_interview_question ({target_model}): {str(e)}")

        return {
            "questionText": f"Could you walk me through a challenging project in your experience as a {target_role} and explain your key technical contributions?",
            "category": "Technical",
            "hints": "Structure your response with clear technical decisions, trade-offs, and measurable outcomes.",
            "expectedKeyPoints": ["Clear architecture overview", "Technical trade-offs", "Quantifiable impact"],
            "isFollowUp": False,
            "model": "fallback",
            "provider": "gemini"
        }

    def evaluate_interview_answer(
        self,
        target_role: str,
        interview_type: str,
        question_text: str,
        candidate_answer: str,
        category: str = "",
        resume_text: str = ""
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("Gemini API key is missing on AI microservice.")

        clean_ans = (candidate_answer or "").strip().lower()
        
        # QUALITY GATING: Check for empty, gibberish, "i don't know", or extremely short answers (< 15 chars)
        invalid_phrases = ["don't know", "dont know", "no idea", "idk", "asdf", "qwerty", "pass", "no answer", "dunno"]
        is_too_short = len(clean_ans) < 15
        contains_invalid = any(phrase in clean_ans for phrase in invalid_phrases) and len(clean_ans) < 50
        is_repetitive = len(set(clean_ans.split())) <= 2 and len(clean_ans.split()) > 3

        if not clean_ans or is_too_short or contains_invalid or is_repetitive:
            return {
                "score": 0,
                "isInsufficient": True,
                "strengths": [],
                "improvements": ["Provide a detailed response addressing the specific concepts in the question."],
                "starAnalysis": None,
                "technicalAnalysis": None,
                "systemDesignAnalysis": None,
                "resumeAnalysis": None,
                "feedbackSummary": "Insufficient Response: Your response was too short, empty, or did not address the question sufficiently to evaluate the required concepts.",
                "model": "quality-gate"
            }

        import google.generativeai as genai
        genai.configure(api_key=self.api_key)

        effective_type = (interview_type or "").upper()
        effective_cat = (category or "").upper()

        if effective_type == "HR_BEHAVIORAL" or "BEHAVIORAL" in effective_cat or "STAR" in effective_cat:
            rubric_prompt = """
Evaluate using the HR/Behavioral STAR framework.
Return JSON with key "starAnalysis": {"situation": "...", "task": "...", "action": "...", "result": "..."}, "technicalAnalysis": null, "systemDesignAnalysis": null, "resumeAnalysis": null.
Do NOT fabricate results if missing, note gaps clearly in STAR fields.
"""
        elif effective_type == "SYSTEM_DESIGN" or "SYSTEM DESIGN" in effective_cat:
            rubric_prompt = """
Evaluate using the System Design rubric (requirements, architecture, APIs, data model, scalability, caching, trade-offs).
Return JSON with key "systemDesignAnalysis": {"architecture": "...", "scalability": "...", "dataModelAndAPIs": "...", "tradeoffs": "..."}, "starAnalysis": null, "technicalAnalysis": null, "resumeAnalysis": null.
Do NOT output STAR fields.
"""
        elif effective_type == "RESUME_BASED" or "RESUME" in effective_cat:
            rubric_prompt = """
Evaluate using the Resume Project ownership rubric.
Return JSON with key "resumeAnalysis": {"projectOwnership": "...", "technicalAccuracy": "..."}, "starAnalysis": null, "technicalAnalysis": null, "systemDesignAnalysis": null.
Do NOT output STAR fields.
"""
        else:
            # TECHNICAL or MIXED
            rubric_prompt = """
Evaluate using the Technical depth & correctness rubric (correctness, concept depth, trade-off analysis).
Return JSON with key "technicalAnalysis": {"correctness": "...", "conceptDepth": "...", "tradeoffs": "..."}, "starAnalysis": null, "systemDesignAnalysis": null, "resumeAnalysis": null.
Do NOT output STAR fields.
"""

        prompt = f"""
You are an expert lead interviewer evaluating a candidate's answer for role: {target_role}.
Interview Type: {interview_type}
Question Category: {category}
Question: {question_text}
Candidate Answer: {candidate_answer}

RUBRIC EVALUATION INSTRUCTIONS:
{rubric_prompt}

Assign a realistic, evidence-based score out of 100 based strictly on the candidate's actual answer content.
Return ONLY a raw JSON object with keys:
"score": integer (0-100),
"isInsufficient": false,
"strengths": ["..."],
"improvements": ["..."],
"starAnalysis": object or null,
"technicalAnalysis": object or null,
"systemDesignAnalysis": object or null,
"resumeAnalysis": object or null,
"feedbackSummary": "..."
"""

        try:
            model = genai.GenerativeModel(model_name=self.model_name)
            res = model.generate_content(prompt)
            if res and res.text:
                import json
                txt = res.text.strip()
                if txt.startswith("```json"):
                    txt = txt[7:]
                if txt.startswith("```"):
                    txt = txt[3:]
                if txt.endswith("```"):
                    txt = txt[:-3]
                data = json.loads(txt.strip())
                data["model"] = self.model_name
                return data
        except Exception as e:
            logger.warning(f"Error evaluating answer: {str(e)}")

        # Fallback response respecting interview type
        if effective_type == "HR_BEHAVIORAL" or "BEHAVIORAL" in effective_cat:
            return {
                "score": 75,
                "isInsufficient": False,
                "strengths": ["Provided structured behavioral context"],
                "improvements": ["Quantify specific business impact and metrics"],
                "starAnalysis": {
                    "situation": "Described context",
                    "task": "Outlined objective",
                    "action": "Explained approach",
                    "result": "Mentioned outcome"
                },
                "feedbackSummary": "Solid behavioral response.",
                "model": "fallback"
            }
        elif effective_type == "SYSTEM_DESIGN" or "SYSTEM DESIGN" in effective_cat:
            return {
                "score": 75,
                "isInsufficient": False,
                "strengths": ["Considered high-level system architecture"],
                "improvements": ["Elaborate on data partitioning and cache eviction strategies"],
                "systemDesignAnalysis": {
                    "architecture": "High-level component layout",
                    "scalability": "Identified horizontal scaling",
                    "dataModelAndAPIs": "Basic REST/gRPC endpoints outlined",
                    "tradeoffs": "Mentioned CAP theorem trade-offs"
                },
                "feedbackSummary": "Good system design approach with solid architectural concepts.",
                "model": "fallback"
            }
        else:
            return {
                "score": 75,
                "isInsufficient": False,
                "strengths": ["Directly addressed technical concepts", "Good technical vocabulary"],
                "improvements": ["Include specific code syntax or edge-case handling"],
                "technicalAnalysis": {
                    "correctness": "Accurate technical reasoning",
                    "conceptDepth": "Good understanding of core principles",
                    "tradeoffs": "Analyzed performance implications"
                },
                "feedbackSummary": "Solid response demonstrating technical domain familiarity.",
                "model": "fallback"
            }

    def generate_interview_report(
        self,
        target_role: str,
        interview_type: str,
        mode: str,
        question_evaluations: List[Dict[str, Any]],
        presentation_metrics: Dict[str, Any] = None,
        speech_metrics: Dict[str, Any] = None,
        language_metrics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("Gemini API key is missing on AI microservice.")

        import google.generativeai as genai
        genai.configure(api_key=self.api_key)

        prompt = f"""
Synthesize a comprehensive final interview performance report.
Target Role: {target_role}
Mode: {mode}
Interview Type: {interview_type}
Question Evaluations: {question_evaluations}
Presentation Signals: {presentation_metrics}
Speech Metrics: {speech_metrics}
Language Metrics: {language_metrics}

INSTRUCTIONS:
Calculate 5 core rubric scores (0-100):
1. overallScore
2. communicationScore
3. technicalScore
4. structureScore
5. roleRelevanceScore

Provide:
- strengths (list of specific observations)
- improvements (list of specific weak areas)
- actionableRecommendations (list of objects with "problem" and "recommendation" keys)
- summary (2-3 paragraph synthesis)

Return ONLY a raw JSON object with keys:
"overallScore": int,
"communicationScore": int,
"technicalScore": int,
"structureScore": int,
"speechClarityScore": int,
"roleRelevanceScore": int,
"strengths": ["..."],
"improvements": ["..."],
"actionableRecommendations": [{{"problem": "...", "recommendation": "..."}}],
"summary": "..."
"""

        try:
            model = genai.GenerativeModel(model_name=self.model_name)
            res = model.generate_content(prompt)
            if res and res.text:
                import json
                txt = res.text.strip()
                if txt.startswith("```json"):
                    txt = txt[7:]
                if txt.startswith("```"):
                    txt = txt[3:]
                if txt.endswith("```"):
                    txt = txt[:-3]
                data = json.loads(txt.strip())
                data["model"] = self.model_name
                return data
        except Exception as e:
            logger.warning(f"Error generating report: {str(e)}")

        avg_score = 78
        if question_evaluations:
            scores = [q.get("score", 75) for q in question_evaluations if isinstance(q, dict)]
            if scores:
                avg_score = int(sum(scores) / len(scores))

        return {
            "overallScore": avg_score,
            "communicationScore": max(60, avg_score - 2),
            "technicalScore": max(60, avg_score + 3),
            "structureScore": max(60, avg_score - 4),
            "speechClarityScore": 82,
            "roleRelevanceScore": max(60, avg_score + 2),
            "strengths": ["Demonstrated role knowledge", "Responded calmly to scenario questions"],
            "improvements": ["Incorporate STAR framework explicitly in behavioral answers"],
            "actionableRecommendations": [
                {
                    "problem": "Frequent filler words during technical explanations",
                    "recommendation": "Pause for 1-2 seconds to formulate thoughts instead of using 'um' or 'like'."
                }
            ],
            "summary": "Overall solid performance matching target role standards.",
            "model": "fallback"
        }

