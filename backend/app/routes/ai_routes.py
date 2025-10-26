from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Optional

from app.models.user_model import User
from app.models.healthlog_model import HealthLog
from app.utils.role_utils import get_current_user
from app.services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Insights"])


class SymptomRequest(BaseModel):
    symptom: str
    severity: str = "mild"


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = None


@router.get("/insights")
async def get_health_insights(
    days: int = 30,
    current_user: User = Depends(get_current_user)
):
    """
    Get AI-powered health insights based on recent health logs
    
    - **days**: Number of days to analyze (default: 30)
    """
    # Get recent logs
    logs = await HealthLog.find(
        HealthLog.user_id == str(current_user.id)
    ).sort("-log_date").limit(days).to_list()
    
    if not logs:
        return {
            "message": "No health data available. Start logging your daily health to get insights!",
            "logs_count": 0
        }
    
    # Generate insights
    insights = await AIService.analyze_health_trends(current_user, logs)
    
    return {
        "user_name": current_user.full_name,
        "logs_analyzed": len(logs),
        "analysis_period_days": days,
        **insights
    }


@router.post("/symptom-advice")
async def get_symptom_advice(
    request: SymptomRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Get AI advice for a specific symptom
    
    - **symptom**: The symptom you're experiencing (e.g., "headache", "fever")
    - **severity**: mild, moderate, or severe
    """
    advice = await AIService.get_symptom_advice(
        symptom=request.symptom,
        severity=request.severity
    )
    
    return advice


@router.post("/chat")
async def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Chat with AI health assistant
    
    - **message**: Your question or message
    - **conversation_history**: Previous messages (optional)
    """
    response = await AIService.chat_with_health_assistant(
        user=current_user,
        message=request.message,
        conversation_history=request.conversation_history
    )
    
    return response


@router.get("/sleep-analysis")
async def analyze_sleep_patterns(
    current_user: User = Depends(get_current_user)
):
    """Analyze sleep patterns and provide recommendations"""
    
    # Get logs with sleep data
    logs = await HealthLog.find(
        HealthLog.user_id == str(current_user.id),
        HealthLog.sleep_hours != None
    ).sort("-log_date").limit(30).to_list()
    
    if not logs:
        return {"message": "No sleep data available"}
    
    # Calculate averages
    avg_sleep = sum(log.sleep_hours for log in logs) / len(logs)
    avg_quality = sum(log.sleep_quality for log in logs) / len(logs)
    
    return {
        "average_sleep_hours": round(avg_sleep, 1),
        "average_sleep_quality": round(avg_quality, 1),
        "total_nights_tracked": len(logs),
        "recommendation": "Adults should aim for 7-9 hours of quality sleep per night." if avg_sleep < 7 else "Your sleep duration looks good!",
        "insights": f"You're averaging {avg_sleep:.1f} hours of sleep with a quality rating of {avg_quality:.1f}/10."
    }
