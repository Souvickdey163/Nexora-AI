from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging
from dotenv import load_dotenv

load_dotenv()

from schemas.resume_schema import ResumeAnalyzeRequest, ResumeAnalyzeResponse
from schemas.mentor_schema import MentorChatRequest, MentorChatResponse
from services.ai_analyzer import ai_analyzer
from providers.gemini_provider import GeminiProvider, GeminiQuotaExceededError

logger = logging.getLogger("ai_service")

app = FastAPI(
    title="Nexora AI Microservice",
    description="Provider-agnostic Python FastAPI Microservice for AI Resume Intelligence & AI Career Mentor",
    version="1.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate AI Mentor Provider
gemini_provider = GeminiProvider()

@app.get("/")
def read_root():
    return {
        "service": "Nexora AI Microservice",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Nexora AI Microservice",
        "resume_provider": ai_analyzer.provider,
        "mentor_provider": "gemini",
        "model": os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        "has_gemini_key": bool(os.getenv("GEMINI_API_KEY"))
    }

@app.post("/api/ai/resume/analyze", response_model=ResumeAnalyzeResponse)
def analyze_resume(request: ResumeAnalyzeRequest):
    try:
        if not request.resumeText or len(request.resumeText.strip()) < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume text is empty or too short for analysis."
            )
        
        result = ai_analyzer.analyze_resume(request)
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Analysis processing failure: {str(e)}"
        )

@app.post("/api/ai/mentor/chat", response_model=MentorChatResponse)
def mentor_chat(request: MentorChatRequest):
    try:
        if not request.userMessage or not request.userMessage.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User message cannot be empty."
            )

        history_dicts = [
            {"role": msg.role, "content": msg.content}
            for msg in request.conversationHistory
        ]

        result = gemini_provider.generate_mentor_response(
            user_message=request.userMessage.strip(),
            conversation_history=history_dicts,
            career_context=request.careerContext
        )

        return MentorChatResponse(
            message=result["message"],
            model=result["model"],
            provider=result["provider"]
        )

    except GeminiQuotaExceededError as qe:
        logger.warning(f"⚠️ 429 Quota Exceeded reported by Gemini Provider: {str(qe)}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="AI Mentor is temporarily unavailable because the free AI quota has been reached. Please try again later."
        )
    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "Quota" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI Mentor is temporarily unavailable because the free AI quota has been reached. Please try again later."
            )
        logger.error(f"❌ Unhandled AI Mentor Chat Error: {err_msg}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Mentor service failure: {err_msg}"
        )

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

