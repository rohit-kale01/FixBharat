# BharatFix

### Report once. BharatFix takes it from there.

An autonomous AI workforce that turns civic complaints into verified resolutions.

Built for the **Build With Bharat 2.0** national hackathon at NIT Delhi.

---

## Problem Statement

Reporting a civic problem is easy to start but difficult to finish. A citizen reports a pothole, but the system still depends on humans to understand it, identify the right department, prioritize it, follow up, and verify the repair. Most complaint portals stop at filing — citizens are left waiting with no visibility.

## Solution

BharatFix uses an **autonomous AI workforce** of 8 specialized agents that handle the entire complaint lifecycle:

1. **Vision Agent** — Analyzes images to detect civic issues
2. **Location Agent** — Identifies geographic context from coordinates
3. **Duplicate Detection Agent** — Finds similar nearby complaints
4. **Priority Agent** — Calculates urgency and risk score
5. **Routing Agent** — Assigns the correct municipal department
6. **Action Agent** — Creates and updates complaint tickets
7. **Follow-up Agent** — Monitors SLA deadlines and escalations
8. **Resolution Verification Agent** — Verifies whether issues were actually fixed

**We don't just help citizens report problems. We make the complaint move.**

## Key Features

- **Citizen Portal** — Upload photo, share location, describe problem, watch AI process it
- **AI Processing Screen** — Real-time visualization of all 8 agents working together
- **Complaint Lifecycle** — Full timeline from report to verified resolution
- **AI Workforce Dashboard** — Charts, stats, and live agent activity feed
- **Interactive City Map** — Leaflet/OpenStreetMap with complaint markers and filters
- **Agent Command Center** — Status, tools, and activity for each AI agent
- **Resolution Verification** — Before/after image comparison with AI confidence scoring
- **Admin Dashboard** — Department workload, SLA breaches, and city-wide overview
- **Demo/Presentation Mode** — Automated 11-step walkthrough for judges
- **Multi-language Support** — English, Hindi, Gujarati, Marathi
- **Responsive Design** — Optimized for mobile, tablet, and desktop

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Routing | React Router v7 |
| Backend (planned) | Spring Boot, PostgreSQL, Redis |
| AI (planned) | LLM API, Vision model, Agent orchestration |

## System Architecture

```
Citizen Report → AI Workforce (8 Agents) → Department Action → AI Verification → Resolution
```

The frontend includes a clean service layer (`src/services/`) that abstracts all business logic.
In production, this layer connects to a Spring Boot REST API. In the prototype, it simulates
AI analysis with realistic delays and predefined demo data.

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd bharatfix

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Supabase (for future data persistence)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI APIs (for production AI integration - not required for demo)
VITE_VISION_API_URL=your-vision-api-url
VITE_VISION_API_KEY=your-vision-api-key
VITE_LLM_API_URL=your-llm-api-url
VITE_LLM_API_KEY=your-llm-api-key
```

## Demo Instructions

1. **Landing Page** (`/`) — Overview of the product and AI workflow
2. **Report a Problem** (`/report`) — Upload image, set location, describe, submit
3. **AI Processing** — Watch 8 agents process the complaint in real-time
4. **Complaint Detail** (`/complaint/BF-1024`) — Full lifecycle, timeline, AI reasoning
5. **Dashboard** (`/dashboard`) — Charts, stats, live activity feed
6. **City Map** (`/map`) — Interactive map with complaint markers
7. **AI Workforce** (`/agents`) — Agent command center with tool calls
8. **Admin** (`/admin`) — Department workload, SLA breaches
9. **Demo Mode** (`/demo`) — Automated presentation walkthrough

### Main Demo Flow

```
Landing → Report → Upload Image → Location → Describe → AI Processing →
Complaint Created → Dashboard → Map → Admin → Resolution Evidence →
AI Verification → Resolved
```

## API Documentation (Planned Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports` | Submit a new complaint |
| GET | `/api/reports/{id}` | Get complaint details |
| GET | `/api/reports` | List all complaints |
| POST | `/api/reports/{id}/analyze` | Trigger AI analysis |
| POST | `/api/reports/{id}/assign` | Assign department |
| POST | `/api/reports/{id}/follow-up` | Schedule SLA monitoring |
| POST | `/api/reports/{id}/verify-resolution` | Verify resolution |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/map` | Map data |
| GET | `/api/agents` | List AI agents |
| GET | `/api/agents/activity` | Agent activity feed |
| POST | `/api/reports/{id}/resolution-evidence` | Upload evidence |

## What is Simulated vs. Implemented

| Feature | Status |
|---------|--------|
| UI/UX | Fully implemented |
| Navigation & Routing | Fully implemented |
| Demo data & state management | Fully implemented |
| AI agent workflow visualization | Simulated with realistic delays |
| Image analysis (Vision Agent) | Simulated |
| Duplicate detection | Simulated |
| Risk score calculation | Simulated |
| Department routing | Simulated (rule-based) |
| Resolution verification | Simulated |
| Map (Leaflet) | Real (OpenStreetMap) |
| Charts (Recharts) | Real |
| Multi-language | Implemented (EN + HI fully, GU + MR partial) |
| Backend REST API | Not implemented (service layer ready) |
| Database persistence | Not implemented (in-memory state) |

## Future Scope

- **Spring Boot backend** with PostgreSQL and Redis
- **Real AI vision model** for image analysis
- **Real LLM integration** for natural language understanding
- **Government API integration** for actual complaint routing
- **Multi-city deployment** with configurable workflows
- **Mobile app** for citizen reporting
- **SMS/WhatsApp notifications** for citizens without smartphones
- **Analytics dashboard** for policy makers

## Responsible AI

AI assists decisions; humans remain accountable. BharatFix recommends classification, priority, routing, and resolution verification — but authorities retain final control for real-world actions. The AI does not guarantee correct decisions; it augments human judgment with speed and consistency.

## Team

- Team Member 1 — [Role]
- Team Member 2 — [Role]
- Team Member 3 — [Role]

_Built for Build With Bharat 2.0 at NIT Delhi._

---

**BharatFix — Report once. We take it from there.**
