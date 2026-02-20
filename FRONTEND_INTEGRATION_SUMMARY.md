# 🎯 Study Recommendation Feature - Frontend Integration Guide

## Quick Summary for Frontend Engineers

This guide shows the APIs to target, what to send, and what you'll receive.

---

## 📡 THREE Main APIs

### 1. **Auto-Recommendation** (Recommended - Uses Historical Data) ⭐
```
POST /api/auto-recommendation
```

**What to Send:**
```javascript
{
  user_id: "user123",           // Required - Student ID
  include_analysis: true        // Optional - Include detailed breakdown
}
```

**What You Get Back:**
```javascript
{
  success: true,
  data_source: "MongoDB (Auto-Aggregated from User History)",
  recommendation: {
    priority_subject: "Mathematics",
    recommended_topic: "Integration",
    recommended_daily_study_minutes: "120",
    reasoning: "Long explanation...",
    motivation_message: "Inspirational message...",
    generated_at: "2026-02-20T10:30:00.123456"
  },
  predictive_insights: {
    quiz_trend: "Improving",
    average_quiz_score: 65.5,
    score_improvement: 5.3,
    study_consistency: "Consistent",
    quizzes_analyzed: 15,
    previous_recommendations_analyzed: 8,
    subjects_enrolled: 3,
    weak_areas_identified: 4
  },
  status: "Generated successfully"
}
```

**Frontend Code Example:**
```typescript
const getRecommendation = async (userId: string) => {
  const response = await fetch('http://localhost:8000/api/auto-recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      include_analysis: true
    })
  });
  const data = await response.json();
  return data;
};
```

---

### 2. **Student Profile** (Get Historical Data & Analysis)
```
GET /api/student-profile/{user_id}
```

**What to Send:**
```
URL Parameter:
- user_id (in URL path)
```

**What You Get Back:**
```javascript
{
  success: true,
  student_profile: {
    user_id: "user123",
    enrolled_subjects: ["Mathematics", "Physics", "Programming"],
    quiz_trends: {
      trend: "Improving",
      average_score: 65.5,
      improvement: 5.3,
      consistency: "Consistent",
      recent_scores: [68, 70, 65, 72, 71],
      subject_breakdown: {
        Mathematics: {
          count: 5,
          average: 52.4,
          latest: 58
        }
      }
    },
    weak_topics: [
      ["Integration", 42.5],
      ["Pointers", 35.8]
    ],
    study_time_pattern: {
      average_daily_study_minutes: 87,
      pattern: "Consistent",
      max_observed: 180,
      min_observed: 30
    },
    upcoming_exams: [
      "Mathematics - 2026-03-10",
      "Physics - 2026-03-15"
    ],
    recommendation_count: 8,
    quiz_history_count: 15,
    generated_at: "2026-02-20T..."
  },
  insights: {
    data_points_analyzed: 23,
    prediction_confidence: "High",
    trend_analysis: "Available",
    weak_areas_identified: 3,
    upcoming_assessments: 2
  }
}
```

**Frontend Code Example:**
```typescript
const getStudentProfile = async (userId: string) => {
  const response = await fetch(`http://localhost:8000/api/student-profile/${userId}`);
  const data = await response.json();
  return data;
};
```

---

### 3. **Manual Recommendation** (User Provides All Data)
```
POST /api/study-recommendation
```

**What to Send:**
```javascript
{
  subjects: ["Mathematics", "Physics", "Programming"],
  quiz_scores: {
    "Mathematics": 45,
    "Physics": 72,
    "Programming": 65
  },
  weak_topics: ["Integration", "Pointers"],
  study_time: 90,
  upcoming_exams: ["Mathematics - 2026-03-10"],
  user_id: "user123"  // Optional
}
```

**What You Get Back:**
```javascript
{
  success: true,
  recommendation: {
    priority_subject: "Mathematics",
    recommended_topic: "Integration",
    recommended_daily_study_minutes: "120",
    reasoning: "...",
    motivation_message: "...",
    generated_at: "2026-02-20T10:30:00.123456",
    user_id: "user123"
  },
  status: "Generated successfully"
}
```

---

## 🔄 Data Flow Summary

```
Frontend             →  Backend              →  MongoDB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Manual Mode:
User Input Data      →  /api/study-recommendation  →  Store recommendation
                              ↓ (Gemini AI)
                        Returns Recommendation

Auto Mode (Better):
{ user_id }          →  /api/auto-recommendation   →  Fetch quiz history
                           ↓ (Auto-aggregate)         Extract trends
                        /api/student-profile        Calculate patterns
                          ↓ (Analyze)                 Identify weak topics
                        (Gemini AI)
                    Returns Recommendation + Insights
```

---

## 📊 Response Variables to Display

### Recommendation Card Component
```javascript
// Use these fields from recommendation object
const {
  priority_subject,              // "Mathematics"
  recommended_topic,             // "Integration"
  recommended_daily_study_minutes, // "120"
  reasoning,                     // Explanation text
  motivation_message,            // Inspirational message
  generated_at                   // Timestamp
} = recommendation;
```

### Insights Card Component
```javascript
// Use these fields from predictive_insights
const {
  quiz_trend,                    // "Improving" or "Declining"
  average_quiz_score,            // 65.5
  score_improvement,             // 5.3
  study_consistency,             // "Consistent"
  quizzes_analyzed,              // 15
  weak_areas_identified          // 4
} = predictive_insights;
```

### Student Profile Card
```javascript
// Use these from student_profile
const {
  enrolled_subjects,             // ["Math", "Physics", ...]
  quiz_trends: {
    trend,                       // "Improving"
    average_score,               // 65.5
    consistency                  // "Consistent"
  },
  weak_topics,                   // [["Integration", 42.5], ...]
  study_time_pattern: {
    average_daily_study_minutes  // 87
  },
  upcoming_exams                 // ["Math - 2026-03-10", ...]
} = student_profile;
```

---

## 🎯 Recommended UI Flow

```
1. User opens Dashboard/Study Page
   ↓
2. Call: GET /api/student-profile/{userId}
   ├─ Display Student Stats
   ├─ Show Recent Scores
   ├─ Display Weak Topics
   └─ Show Upcoming Exams
   ↓
3. Button: "Get Study Recommendation"
   ↓
4. Call: POST /api/auto-recommendation
   ├─ Display Recommendation Card
   │  ├─ Priority Subject
   │  ├─ Topic to Study
   │  ├─ Daily Study Time
   │  └─ Motivation Message
   │
   └─ Display Insights Card
      ├─ Performance Trend
      ├─ Score Improvement
      ├─ Data Analyzed
      └─ Confidence Level
```

---

## 🔌 Integration Checklist

- [ ] Set environment variable: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Create API client (see examples above)
- [ ] Build Student Profile component (displays quiz history)
- [ ] Build Recommendation Card component (displays suggestion)
- [ ] Build Insights Card component (displays metrics)
- [ ] Add loading states for API calls
- [ ] Add error handling for failed requests
- [ ] Test with real student data

---

## ⚡ Quick Start Hook

```typescript
// hooks/useStudyRecommendation.ts

export function useStudyRecommendation(userId: string) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/auto-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, include_analysis: true })
      });
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/student-profile/${userId}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, recommendation, profile, error, fetchRecommendation, fetchProfile };
}
```

---

## 🚨 Error Handling

```javascript
if (response.status === 400) {
  // Bad request - missing required fields
}
if (response.status === 422) {
  // Validation error - check data types
}
if (response.status === 500) {
  // Server error - try again or contact backend
}
```

---

## 📞 Common Scenarios

### Scenario 1: Student wants recommendation
```
1. GET /api/student-profile/{userId}
2. POST /api/auto-recommendation
3. Display both Student Profile + Recommendation
```

### Scenario 2: Show only recommendation
```
1. POST /api/auto-recommendation
2. Display Recommendation Card
```

### Scenario 3: Show historical analysis
```
1. GET /api/student-profile/{userId}
2. Display all quiz trends, weak topics, study patterns
```

### Scenario 4: Manual input (if user needs to override data)
```
1. POST /api/study-recommendation (with custom data)
2. Display Recommendation
```

---

## 🎨 Suggested Component Structure

```
<StudyDashboard>
  <StudentProfileCard>
    - Enrolled Subjects
    - Quiz Trends
    - Weak Topics
    - Study Time Pattern
    - Upcoming Exams
  </StudentProfileCard>

  <RecommendationCard>
    - Priority Subject
    - Recommended Topic
    - Daily Study Minutes
    - Reasoning
    - Motivation Message
  </RecommendationCard>

  <InsightsCard>
    - Quiz Trend
    - Average Score
    - Score Improvement
    - Study Consistency
    - Data Points Analyzed
  </InsightsCard>
</StudyDashboard>
```

---

## 🔗 Links for Backend Team

- Implementation: See `PREDICTIVE_ANALYTICS_GUIDE.md`
- Full API Reference: See `STUDY_RECOMMENDATION_API_REFERENCE.md`
- Architecture: See `STUDY_RECOMMENDATION_IMPLEMENTATION.md`

---

**Ready to code!** Start with the `/api/auto-recommendation` endpoint - it's the most powerful and complete. 🚀
