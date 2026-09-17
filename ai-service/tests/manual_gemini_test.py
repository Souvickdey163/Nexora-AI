import os
import sys
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env")))

from providers.gemini_provider import GeminiProvider, GeminiQuotaExceededError

def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ GEMINI_API_KEY is not set in environment. Skipping real Gemini API live test.")
        print("To run manual test: add GEMINI_API_KEY=your_key to .env and execute python3 tests/manual_gemini_test.py")
        return

    print("🚀 Testing live Gemini API integration with gemini-2.5-flash model...")
    provider = GeminiProvider()

    sample_message = "What are the top 3 DSA topics I should master for software engineer campus placements?"
    sample_history = []
    sample_context = {
        "targetRole": "Software Engineer",
        "userProfile": {
            "name": "Alex Candidate",
            "skills": ["Python", "JavaScript", "SQL"]
        }
    }

    try:
        res = provider.generate_mentor_response(sample_message, sample_history, sample_context)
        print("✅ LIVE GEMINI RESPONSE RECEIVED!")
        print(f"Provider: {res.get('provider')}")
        print(f"Model: {res.get('model')}")
        print("-" * 50)
        print(res.get("message"))
        print("-" * 50)
    except GeminiQuotaExceededError:
        print("🚨 Gemini free-tier quota (HTTP 429) was reached during live call.")
    except Exception as e:
        print(f"❌ Gemini live request failed: {str(e)}")

if __name__ == "__main__":
    main()
