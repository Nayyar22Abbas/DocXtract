# Smart Study Recommendation System

## Overview
This is an AI-powered study recommendation system that uses Google's Gemini API to provide personalized study guidance to students.

## Features
- **Automatic Data Aggregation**: Pulls quiz history from MongoDB automatically
- **Predictive Analytics**: Analyzes historical data to identify trends and weak areas  
- **Personalized Recommendations**: Uses Gemini 2.5 Flash to generate customized study plans
- **Student Profiling**: Builds comprehensive profiles with quiz trends and study patterns
- **Progress Tracking**: Monitors improvement over time and stores recommendation history

## API Endpoints

### 1. Auto-Recommendation (Predictive Analytics)
```
POST /api/auto-recommendation
```
Automatically pulls user data from MongoDB and generates a recommendation.

**Request:**
```json
{
  "user_id": "user123",
  "include_analysis": true
}
```

**Response:**
```json
{
  "success": true,
  "data_source": "MongoDB (Auto-Aggregated from User History)",
  "recommendation": {
    "priority_subject": "Mathematics",
    "recommended_topic": "Integration",
    "recommended_daily_study_minutes": "120",
    "reasoning": "...",
    "motivation_message": "...",
    "generated_at": "2026-02-20T..."
  },
  "predictive_insights": {
    "quiz_trend": "Improving",
    "average_quiz_score": 65.5,
    "score_improvement": 5.3,
    "study_consistency": "Consistent",
    "quizzes_analyzed": 15,
    "weak_areas_identified": 4
  }
}
```

### 2. Student Profile
```
GET /api/student-profile/{user_id}
```
Returns comprehensive student profile with all predictive analytics.

### 3. Manual Recommendation  
```
POST /api/study-recommendation
```
Generate recommendation from manually provided data.

## Database Integration
- **quiz_collection**: Stores quiz attempts with scores and topics
- **recommendations_collection**: Stores all generated recommendations
- **users_collection**: Student profile information

## Architecture
```
MongoDB (Historical Data)
    ↓
UserDataAggregator (Service)
    ├─ Fetch quiz history
    ├─ Analyze trends
    ├─ Identify weak topics
    └─ Build student profile
    ↓
Gemini 2.5 Flash
    ↓
Personalized Recommendation (API)
    ↓
Frontend Application
```

## Setup
1. Ensure MongoDB is running with collections: users, quiz_scores, recommendations
2. Set GEMINI_API_KEY environment variable
3. Install dependencies: `pip install google-generativeai`
4. Start backend: `uvicorn index:app --reload`

## Testing
Run the test suite:
```bash
pytest backend/tests/test_study_recommendation.py
```

## Performance
- Recommendation generation: < 30 seconds
- Recommendation retrieval: < 5 seconds
- Auto-aggregation: < 10 seconds

## Why This is True Predictive Analytics
✅ Data-driven (uses MongoDB history)
✅ Pattern recognition (analyzes trends)
✅ Temporal analysis (compares over time)
✅ Predictive (forecasts study needs)
✅ Adaptive (changes with new data)
✅ Confidence metrics (tracks data points)

---

See PREDICTIVE_ANALYTICS_GUIDE.md for detailed technical documentation.
