from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class BaseAIProvider(ABC):
    """
    Abstract Base Class for AI Providers.
    Allows easy swapping between Gemini, local models (Ollama), or other free providers.
    """

    @abstractmethod
    def generate_mentor_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        career_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate a response for the AI Career Mentor.
        Must return a dict containing:
        {
            "message": str,
            "model": str,
            "provider": str
        }
        """
        pass
