from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PreviousAnswerItem(BaseModel):
    questionText: str
    userAnswer: str
    evaluationScore: Optional[int] = None
    feedback: Optional[str] = None

class InterviewQuestionRequest(BaseModel):
    mode: str = "MOCK_TEST" # MOCK_TEST | LIVE_INTERVIEW
    type: str = "TECHNICAL" # HR_BEHAVIORAL | TECHNICAL | SYSTEM_DESIGN | MIXED | RESUME_BASED
    targetRole: str = "Software Engineer"
    difficulty: str = "MEDIUM"
    questionIndex: int = 1
    totalQuestions: int = 5
    resumeText: Optional[str] = None
    jobDescription: Optional[str] = None
    previousAnswers: List[PreviousAnswerItem] = []

class InterviewQuestionResponse(BaseModel):
    questionText: str
    category: str
    hints: str
    expectedKeyPoints: List[str] = []
    isFollowUp: bool = False
    model: str = "gemini-2.5-flash"
    provider: str = "gemini"

class InterviewAnswerEvaluateRequest(BaseModel):
    targetRole: str = "Software Engineer"
    interviewType: str = "TECHNICAL"
    questionText: str
    candidateAnswer: str
    category: Optional[str] = None
    resumeText: Optional[str] = None

class StarAnalysis(BaseModel):
    situation: Optional[str] = "Identified context"
    task: Optional[str] = "Identified challenge"
    action: Optional[str] = "Identified candidate action"
    result: Optional[str] = "Identified outcome and metrics"

class InterviewAnswerEvaluateResponse(BaseModel):
    score: int
    isInsufficient: Optional[bool] = False
    strengths: List[str]
    improvements: List[str]
    starAnalysis: Optional[Dict[str, Any]] = None
    technicalAnalysis: Optional[Dict[str, Any]] = None
    systemDesignAnalysis: Optional[Dict[str, Any]] = None
    resumeAnalysis: Optional[Dict[str, Any]] = None
    feedbackSummary: str
    model: str = "gemini-2.5-flash"

class InterviewFinalReportRequest(BaseModel):
    targetRole: str = "Software Engineer"
    interviewType: str = "TECHNICAL"
    mode: str = "LIVE_INTERVIEW"
    questionEvaluations: List[Dict[str, Any]] = []
    presentationMetrics: Optional[Dict[str, Any]] = None
    speechMetrics: Optional[Dict[str, Any]] = None
    languageMetrics: Optional[Dict[str, Any]] = None

class ActionableRecommendation(BaseModel):
    problem: str
    recommendation: str

class InterviewFinalReportResponse(BaseModel):
    overallScore: int
    communicationScore: int
    technicalScore: int
    structureScore: int
    speechClarityScore: int = 80
    roleRelevanceScore: int
    strengths: List[str]
    improvements: List[str]
    actionableRecommendations: List[Dict[str, str]]
    summary: str
    model: str = "gemini-2.5-flash"
