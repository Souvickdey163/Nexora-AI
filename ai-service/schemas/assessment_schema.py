from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AssessmentQuestionItem(BaseModel):
    category: str
    topic: str
    difficulty: str
    questionText: str
    options: List[str]
    correctOptionIndex: int
    explanation: str

class AssessmentGenerateRequest(BaseModel):
    category: str = Field(..., description="DSA, DBMS, OS, NETWORKS, SYSTEM_DESIGN")
    difficulty: str = Field("INTERMEDIATE", description="BEGINNER, INTERMEDIATE, ADVANCED")
    count: int = Field(10, description="Number of questions to generate")
    previousTopics: Optional[List[str]] = Field(default=[], description="User previous topics for context variation")

class AssessmentGenerateResponse(BaseModel):
    questions: List[AssessmentQuestionItem]
    provider: str = "gemini"
    model: str = "gemini-2.5-flash"

class AssessmentExplainRequest(BaseModel):
    category: str
    difficulty: str
    score: int
    correctCount: int
    totalQuestions: int
    strengths: List[str] = []
    weaknesses: List[str] = []
    topicAnalysis: Optional[Dict[str, Any]] = None
    timingAnalysis: Optional[Dict[str, Any]] = None

class AssessmentExplainResponse(BaseModel):
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendedNextSteps: List[str]
    suggestedStudyTopics: List[str]
    model: str = "gemini-2.5-flash"
