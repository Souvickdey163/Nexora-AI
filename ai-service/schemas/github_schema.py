from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GitHubAnalyzeRequest(BaseModel):
    repoName: str
    description: Optional[str] = ""
    techStack: List[str] = []
    readmeExcerpt: Optional[str] = ""
    signals: Optional[Dict[str, Any]] = {}

class InterviewQuestionItem(BaseModel):
    question: str
    category: str
    followUp: str
    expectedAnswerKey: str

class AiCodeReviewSchema(BaseModel):
    maintainability: str
    projectOrganization: str
    documentationQuality: str
    testingCoverage: str
    errorHandlingNotes: str
    keyStrengths: List[str]
    improvementSuggestions: List[str]

class GitHubAnalyzeResponse(BaseModel):
    projectSummary: str
    architectureSummary: str
    engineeringAreas: List[str]
    aiReview: AiCodeReviewSchema
    resumeBullets: List[str]
    interviewQuestions: List[InterviewQuestionItem]
