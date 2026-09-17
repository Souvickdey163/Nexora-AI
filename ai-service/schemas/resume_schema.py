from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict

class ResumeAnalyzeRequest(BaseModel):
    resumeText: str = Field(..., description="Plain extracted text from PDF resume")
    parsedResume: Optional[Dict[str, Any]] = Field(default=None, description="Pre-parsed structured resume object")
    targetRole: Optional[str] = Field(default=None, description="Target job title / role")
    targetCompany: Optional[str] = Field(default=None, description="Target company name")
    jobDescription: Optional[str] = Field(default=None, description="Job description text")

class SuggestedChange(BaseModel):
    section: str
    current: str
    suggested: str
    reason: str

class ResumeAnalyzeResponse(BaseModel):
    overallScore: int = Field(..., ge=0, le=100)
    atsScore: int = Field(..., ge=0, le=100)
    contentScore: int = Field(..., ge=0, le=100)
    skillsScore: int = Field(..., ge=0, le=100)
    experienceScore: int = Field(..., ge=0, le=100)
    educationScore: int = Field(..., ge=0, le=100)
    projectsScore: int = Field(..., ge=0, le=100)
    formattingScore: int = Field(..., ge=0, le=100)
    keywordScore: int = Field(..., ge=0, le=100)
    summaryScore: int = Field(..., ge=0, le=100)

    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missingKeywords: List[str] = Field(default_factory=list)
    missingSkills: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    suggestedChanges: List[SuggestedChange] = Field(default_factory=list)

    aiProvider: str = Field(default="gemini")
    aiModel: str = Field(default="gemini-1.5-flash")
