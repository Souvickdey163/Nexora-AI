from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_assessment_explain_result_fallback():
    payload = {
        "category": "DBMS & SQL",
        "difficulty": "INTERMEDIATE",
        "score": 80,
        "correctCount": 8,
        "totalQuestions": 10,
        "strengths": ["SQL Joins", "ACID Properties"],
        "weaknesses": ["Transactions"],
        "topicAnalysis": {
            "SQL Joins": {"total": 4, "correct": 4, "accuracyPct": 100, "status": "STRONG"}
        },
        "timingAnalysis": {
            "avgTimePerQuestionSeconds": 18
        }
    }
    response = client.post("/api/ai/assessment/explain-result", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert isinstance(data["strengths"], list)
    assert isinstance(data["weaknesses"], list)
