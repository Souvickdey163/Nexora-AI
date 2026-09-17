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
