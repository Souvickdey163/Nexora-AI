# Placement Intelligence — Architecture & Engineering Specification

> **MANDATORY DISCLAIMER**  
> *This readiness index is a preparation indicator based on Nexora data. It is not a hiring probability, selection prediction, or guarantee.*

---

## 1. Executive Summary

Placement Intelligence is an explainable, evidence-driven career readiness evaluation platform built directly into Nexora.

### Core Objectives
1. Help a student understand how prepared they currently are for a selected target role and company category.
2. Identify strong preparation dimensions and highlight priority areas needing improvement.
3. Provide evidence-backed explanation based strictly on real activity records across Nexora (Coding Arena, AI Interview Studio, Resume Intelligence, Career Roadmap, GitHub Intelligence).
4. Recommend concrete next actionable steps with direct deep-links into Nexora feature modules.

---

## 2. Product Boundaries & Safety Language

Placement Intelligence **NEVER** predicts hiring outcomes, selection probabilities, or hiring guarantees.

### Prohibited Expressions
- ❌ "You have an 85% chance of getting hired."
- ❌ "You will get selected by Google."
- ❌ "Guaranteed placement."

### Permitted Explainable Terminology
- ✅ "Readiness Index"
- ✅ "Preparation Level"
- ✅ "Strong Evidence" / "Developing" / "Needs Attention"
- ✅ "Priority Areas"
- ✅ "Recommended Next Actions"

---

## 3. Primary Routes & Navigation

Both of the following Next.js routes serve the exact same Placement Intelligence workspace component:
- `/placement`
- `/features/placement`

Both routes preserve the core Nexora design system: `FeatureLayout`, `Navbar`, `Footer`, `AuthContext`, dark/light theme, and responsive mobile layout.

---

## 4. Centralized Readiness Weights & Scoring Engine

The scoring model is centralized in `backend/src/config/placement.config.ts`. Numeric scoring logic is executed deterministically by `PlacementReadinessService` in backend node runtime — **NEVER by AI or client-side code**.

### Centralized Weights Formula
```typescript
PLACEMENT_WEIGHTS = {
  INTERVIEW: 0.40, // 40% Weight
  CODING: 0.30,    // 30% Weight
  RESUME: 0.15,    // 15% Weight
  ROADMAP: 0.15    // 15% Weight
}
```

### Missing Data & Evidence Coverage
If a data dimension is missing (e.g., candidate has not uploaded a resume or completed a mock interview), that dimension's score is set to `null` and its evidence level marked as `INSUFFICIENT`.

Missing dimensions are **NOT** defaulted to 0.

#### Evidence Coverage Formula
$$\text{Evidence Coverage} = \sum_{\text{dimension } d \in \text{Available}} \text{Weight}(d) \times 100\%$$

#### Normalized Overall Score Formula
$$\text{Overall Score} = \min\left(100, \max\left(0, \operatorname{round}\left( \frac{\sum_{d \in \text{Available}} \text{Score}(d) \times \text{Weight}(d)}{\sum_{d \in \text{Available}} \text{Weight}(d)} \right)\right)\right)$$

---

## 5. Preparation Levels

Internal Nexora preparation bands are defined in `placement.config.ts`:

| Score Range | Preparation Level Label | Description |
| :--- | :--- | :--- |
| `0 – 39` | **Needs Attention** | Minimal preparation evidence available. Focus on basic practice milestones. |
| `40 – 59` | **Developing** | Core foundational evidence established; critical technical or interview gaps remain. |
| `60 – 74` | **Progressing** | Solid progress across multiple dimensions. Targeted practice in weaker areas needed. |
| `75 – 89` | **Strong Preparation** | High consistency and evidence level across key areas. |
| `90 – 100` | **Highly Prepared** | Exceptional evidence profile across coding, interviews, resume, and roadmap. |

---

## 6. Primary Dimensions & Evidence Models

### 1. Interview Readiness (40%)
- **Source**: `AI Interview Studio` (`Interview` & `InterviewReport` models)
- **Inputs**: Overall score, technical score, communication score, structure score, session count, performance trend (Improving / Stable / Declining).
- **Evidence Levels**:
  - `0` sessions: `INSUFFICIENT` (`score = null`)
  - `1` session: `LIMITED`
  - `2-3` sessions: `MODERATE`
  - `4+` sessions: `STRONG`

### 2. Coding Readiness (30%)
- **Source**: `Coding Arena` (`CodingProgress` & `CodingSubmission` models)
- **Inputs**: Solved problem counts by difficulty (Easy/Medium/Hard), accuracy percentage, topic coverage breadth, recent activity within 14/30 days.
- **Evidence Levels**:
  - `0` solved: `INSUFFICIENT` (`score = null`)
  - `1-7` solved: `LIMITED`
  - `8-19` solved: `MODERATE`
  - `20+` solved: `STRONG`

### 3. Resume Readiness (15%)
- **Source**: `Resume Intelligence` (`ResumeVersion` & `ResumeAnalysis` models)
- **Inputs**: Latest ATS score, target role keyword alignment, content score, skill coverage.
- **Evidence Levels**:
  - No analysis: `INSUFFICIENT` (`score = null`)
  - ATS < 55: `LIMITED`
  - ATS 55-74: `MODERATE`
  - ATS >= 75: `STRONG`

### 4. Roadmap Progress (15%)
- **Source**: `Career Roadmap` (`CareerRoadmap` & `RoadmapMilestone` models)
- **Inputs**: Percentage of completed milestones vs. total milestones on active roadmap.
- **Evidence Levels**:
  - No active roadmap: `INSUFFICIENT` (`score = null`)
  - Progress < 30%: `LIMITED`
  - Progress 30-69%: `MODERATE`
  - Progress >= 70%: `STRONG`

---

## 7. Role of AI Explanation & Nexus AI Integration

- **FastAPI / Gemini AI Microservice**: Responsible **ONLY** for generating qualitative explanations, strengths, priority improvement areas, and role-specific preparation advice.
- AI **NEVER** calculates or alters trusted numeric readiness scores.
- Output from AI is validated using strict JSON structural parser before returning to Express backend.
- Prompt injection protection ensures user-provided strings (resume/role text) are treated as data, preventing prompt override attacks.

---

## 8. Credit Handling Architecture

Placement Intelligence uses Nexora's centralized credit architecture (`backend/src/config/creditCosts.ts`):
- `PLACEMENT_ASSESSMENT = 2` credits for creating/recalculating an AI-explained assessment (`POST /api/placement/assess`).
- `0 Credits` for reading previously calculated assessment (`GET /api/placement/current` or `/history`).
- If user credit balance is less than required cost, backend throws HTTP status `402 Payment Required` with `code: "INSUFFICIENT_CREDITS"`. The frontend renders `InsufficientCreditsModal`.

---

## 9. API Reference

| Method | Endpoint | Description | Credit Cost |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/placement/assess` | Calculate or recalculate placement assessment | **2 Credits** |
| `GET` | `/api/placement/current` | Retrieve current placement assessment | **0 Credits** |
| `GET` | `/api/placement/history` | Retrieve historical assessments list | **0 Credits** |
| `GET` | `/api/placement/summary` | Retrieve high-level status summary | **0 Credits** |
| `GET` | `/api/placement/:id` | Retrieve specific assessment by ID | **0 Credits** |
| `PATCH` | `/api/placement/:id/recommendations/:recId` | Toggle recommendation completion status | **0 Credits** |
