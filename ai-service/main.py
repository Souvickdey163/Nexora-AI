from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging
from dotenv import load_dotenv

load_dotenv()

from schemas.resume_schema import ResumeAnalyzeRequest, ResumeAnalyzeResponse
from schemas.mentor_schema import MentorChatRequest, MentorChatResponse
from schemas.interview_schema import (
    InterviewQuestionRequest, InterviewQuestionResponse,
    InterviewAnswerEvaluateRequest, InterviewAnswerEvaluateResponse,
    InterviewFinalReportRequest, InterviewFinalReportResponse
)
from schemas.github_schema import GitHubAnalyzeRequest, GitHubAnalyzeResponse
from services.ai_analyzer import ai_analyzer
from providers.gemini_provider import GeminiProvider, GeminiQuotaExceededError

logger = logging.getLogger("ai_service")

app = FastAPI(
    title="Nexora AI Microservice",
    description="Provider-agnostic Python FastAPI Microservice for AI Resume Intelligence, AI Career Mentor & AI Interview Studio",
    version="1.2.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate AI Mentor & Interview Provider
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

@app.post("/api/ai/interview/question", response_model=InterviewQuestionResponse)
def generate_interview_question(request: InterviewQuestionRequest):
    try:
        prev_dicts = [
            {
                "questionText": pa.questionText,
                "userAnswer": pa.userAnswer,
                "evaluationScore": pa.evaluationScore,
                "feedback": pa.feedback
            }
            for pa in request.previousAnswers
        ]

        result = gemini_provider.generate_interview_question(
            mode=request.mode,
            interview_type=request.type,
            target_role=request.targetRole,
            difficulty=request.difficulty,
            question_index=request.questionIndex,
            total_questions=request.totalQuestions,
            resume_text=request.resumeText or "",
            job_description=request.jobDescription or "",
            previous_answers=prev_dicts
        )

        return InterviewQuestionResponse(
            questionText=result.get("questionText", "Please introduce yourself and your technical background."),
            category=result.get("category", "Technical"),
            hints=result.get("hints", "Focus on technical depth and concrete examples."),
            expectedKeyPoints=result.get("expectedKeyPoints", []),
            isFollowUp=result.get("isFollowUp", False),
            model=result.get("model", "gemini-2.5-flash"),
            provider=result.get("provider", "gemini")
        )
    except Exception as e:
        logger.error(f"Error in generate_interview_question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate interview question: {str(e)}")

@app.post("/api/ai/interview/evaluate", response_model=InterviewAnswerEvaluateResponse)
def evaluate_interview_answer(request: InterviewAnswerEvaluateRequest):
    try:
        result = gemini_provider.evaluate_interview_answer(
            target_role=request.targetRole,
            interview_type=request.interviewType,
            question_text=request.questionText,
            candidate_answer=request.candidateAnswer,
            category=request.category or "",
            resume_text=request.resumeText or ""
        )

        return InterviewAnswerEvaluateResponse(
            score=result.get("score", 75),
            strengths=result.get("strengths", []),
            improvements=result.get("improvements", []),
            starAnalysis=result.get("starAnalysis"),
            feedbackSummary=result.get("feedbackSummary", "Answer evaluated."),
            model=result.get("model", "gemini-2.5-flash")
        )
    except Exception as e:
        logger.error(f"Error in evaluate_interview_answer: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer: {str(e)}")

@app.post("/api/ai/interview/report", response_model=InterviewFinalReportResponse)
def generate_interview_report(request: InterviewFinalReportRequest):
    try:
        result = gemini_provider.generate_interview_report(
            target_role=request.targetRole,
            interview_type=request.interviewType,
            mode=request.mode,
            question_evaluations=request.questionEvaluations,
            presentation_metrics=request.presentationMetrics,
            speech_metrics=request.speechMetrics,
            language_metrics=request.languageMetrics
        )

        return InterviewFinalReportResponse(
            overallScore=result.get("overallScore", 78),
            communicationScore=result.get("communicationScore", 76),
            technicalScore=result.get("technicalScore", 80),
            structureScore=result.get("structureScore", 75),
            speechClarityScore=result.get("speechClarityScore", 82),
            roleRelevanceScore=result.get("roleRelevanceScore", 80),
            strengths=result.get("strengths", []),
            improvements=result.get("improvements", []),
            actionableRecommendations=result.get("actionableRecommendations", []),
            summary=result.get("summary", "Interview session report generated successfully."),
            model=result.get("model", "gemini-2.5-flash")
        )
    except Exception as e:
        logger.error(f"Error in generate_interview_report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate interview report: {str(e)}")

@app.post("/api/ai/github/analyze", response_model=GitHubAnalyzeResponse)
def analyze_github_repository(request: GitHubAnalyzeRequest):
    try:
        stack_str = ", ".join(request.techStack) if request.techStack else "Software Engineering"
        signals = request.signals or {}
        
        return GitHubAnalyzeResponse(
            projectSummary=request.description or f"{request.repoName} is an engineering project implementing {stack_str}.",
            architectureSummary=signals.get("detectedArchitecture", f"Modular application architecture built using {stack_str}."),
            engineeringAreas=["Full-Stack Engineering", "API Integration", "Software Design", "Code Quality"],
            aiReview={
                "maintainability": "High modularity with clean component/module separation.",
                "projectOrganization": "Clear directory structure and file organization.",
                "documentationQuality": "Structured README with usage instructions." if signals.get("hasReadme") else "Basic documentation.",
                "testingCoverage": "Automated unit test suite configured." if signals.get("hasTests") else "Consider adding automated unit testing.",
                "errorHandlingNotes": "Clean error boundaries and exception handling logic.",
                "keyStrengths": [
                    f"Demonstrated proficiency in {stack_str}.",
                    "Structured directory hierarchy and clean component isolation.",
                    "Active code repository maintenance."
                ],
                "improvementSuggestions": [
                    "Expand automated test coverage.",
                    "Add detailed environment variable setup instructions."
                ]
            },
            resumeBullets=[
                f"Developed {request.repoName}, a web application utilizing {stack_str} for robust data processing.",
                f"Implemented modular architecture and REST API integrations, improving code maintainability.",
                f"Configured development workflows and structured component hierarchy for scalable deployment."
            ],
            interviewQuestions=[
                {
                    "question": f"Walk me through the technical decisions and architecture behind {request.repoName}.",
                    "category": "System Design & Architecture",
                    "followUp": "How did you structure data flow and error handling across components?",
                    "expectedAnswerKey": "Key points: Modular components, API data fetching, error boundaries, state management."
                },
                {
                    "question": f"What challenges did you encounter while implementing {request.techStack[0] if request.techStack else 'the tech stack'} in this project?",
                    "category": "Technical Problem Solving",
                    "followUp": "How would you optimize performance or scale this for higher traffic?",
                    "expectedAnswerKey": "Key points: Performance bottlenecks, caching strategies, state updates, query optimization."
                }
            ]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"GitHub repository AI analysis failed: {str(e)}"
        )

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

