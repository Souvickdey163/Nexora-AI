from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ConversationMessage(BaseModel):
    role: str = Field(..., description="Role of message sender: user, assistant, or system")
    content: str = Field(..., description="Content of the message")

class MentorChatRequest(BaseModel):
    userMessage: str = Field(..., min_length=1, description="Latest message from the candidate")
    conversationHistory: List[ConversationMessage] = Field(default_factory=list, description="Recent conversation messages")
    careerContext: Dict[str, Any] = Field(default_factory=dict, description="Selective career context details")

class MentorChatResponse(BaseModel):
    message: str = Field(..., description="AI Mentor response text")
    model: str = Field(..., description="AI model used for response generation")
    provider: str = Field(..., description="AI provider name")
