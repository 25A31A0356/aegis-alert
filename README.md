# 🛡️ AEGISALERT — Disaster Management & Emergency Response Platform

**AegisAlert** is a high-resilience emergency response and disaster mitigation web platform engineered for citizens before, during, and after severe hazard events (Floods, Cyclones, Earthquakes, Lightning, and Industrial Hazards).

---

## 🏗️ Architecture & Technology Stack

### 1. Frontend (`/client`)
- **Core**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Design Tokens & CSS Variables (`design-tokens.css`)
- **Theme**: Full Dual-Theme Support (Dark Emergency Tactical Command Mode + High-Contrast Daylight Mode)
- **Icons**: Lucide React
- **Architecture**: Responsive Three-Zone Layout (Left Navigation/Action, Central Ask Aegis, Right Safety/Community) + Adaptive Mobile PWA Navigation.

### 2. Backend (`/server`)
- **Runtime**: Node.js + Express + TypeScript
- **Database**: SQLite with `sqlite3` + Type-Safe Query Manager (PostgreSQL Migration-Ready Schema)
- **Security**: Helmet, CORS, Input Validation, Rate Limiting for emergency endpoints (`/api/sos`, `/api/safe-beacon`)
- **AI Triage Layer**: Offline Rule-Based Emergency Knowledge Base + Pluggable Online AI Integration Layer

### 3. Shared Contracts (`/shared`)
- Single source of truth for TypeScript interfaces, Enums, DTOs, and API response envelopes across both frontend and backend.

---

## 📂 Project Structure

```
Aegis-alert/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/         # Reusable emergency UI components
│   │   │   └── common/         # Header, SidebarMenu, Notifications, Settings
│   │   ├── layouts/            # AppLayout (Three-Zone & Mobile Responsive)
│   │   ├── stores/             # ThemeContext, EmergencyContext, SettingsContext
│   │   ├── services/           # api.ts (Typed API Service with Fallbacks)
│   │   ├── styles/             # design-tokens.css, index.css
│   │   ├── types/              # Client-specific UI state types
│   │   ├── App.tsx             # Root Application Shell
│   │   └── main.tsx            # DOM Bootstrap
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── server/                     # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/             # env.ts (Strict environment variables)
│   │   ├── database/           # schema.sql, db.ts, seed.ts
│   │   ├── middleware/         # errorHandler.ts, rateLimiter.ts
│   │   ├── routes/             # alerts, disasters, shelters, sos, safeBeacon, chat, etc.
│   │   ├── utils/              # response.ts (Standardized JSON envelopes)
│   │   ├── app.ts              # Express App Factory
│   │   └── server.ts           # Server Bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── shared/                     # Shared Data Models & Types
│   └── index.ts                # TypeScript Interfaces & Contracts
├── package.json                # Root orchestration
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄️ Database Design (`server/src/database/schema.sql`)

| Table | Purpose |
| :--- | :--- |
| `users` | Citizen profiles, medical conditions, blood group, emergency contacts. |
| `alerts` | CAP-compliant disaster warnings (Red, Orange, Yellow, Green severity tiers). |
| `disaster_events` | Active & historical disaster incidents across Indian regions. |
| `sos_requests` | Distress beacons, trapped count, water level, medical emergencies. |
| `safe_beacons` | "I Am Safe" lightweight (<1KB) family location pings. |
| `community_reports`| Crowdsourced damage reports (Flooding, fallen trees, blocked roads). |
| `shelters` | High-ground shelters, bed/food capacity, drinking water, medical station. |
| `evacuation_routes`| Elevation-aware route waypoints with safety classification. |
| `notifications` | System warnings, shelter status updates, and broadcast sirens. |
| `history_events` | User action logs (SOS triggered, pings sent, reports filed). |
| `chat_messages` | Ask Aegis emergency assistant conversational history. |
| `downloads` | Cached offline guides, checklists, and local map tiles. |

---

## 📡 API Architecture

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service health status & uptime |
| `/api/alerts` | `GET` | List active emergency alerts |
| `/api/disasters` | `GET` | Recent disaster events feed |
| `/api/shelters` | `GET` | Verified evacuation shelters with live capacity |
| `/api/routes` | `GET` | Evacuation routes with hazard avoidance |
| `/api/sos` | `POST` | Trigger emergency SOS beacon (Rate limited) |
| `/api/sos/:id` | `GET` | Real-time rescue status tracking |
| `/api/safe-beacon` | `POST` | Send "I Am Safe" location status |
| `/api/community-reports` | `GET`, `POST` | List and submit crowdsourced hazard reports |
| `/api/chat` | `POST` | Query Ask Aegis Emergency AI (Offline KB & Online) |
| `/api/notifications` | `GET`, `PATCH` | Notification center & read status |
| `/api/profile` | `GET`, `PUT` | User emergency profile & contacts |
| `/api/downloads` | `GET`, `POST` | Offline resource cache manager |

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Run Development Servers
```bash
# In terminal 1 (Backend API on http://localhost:5000):
cd server
npm run dev

# In terminal 2 (Frontend on http://localhost:5173):
cd client
npm run dev
```

### 3. Build for Production
```bash
# Build both Server and Client
npm run build
```

---

## 📋 Incremental Development Phases
- [x] **Phase 0**: Architecture, Project Structure, Design Tokens, SQLite Schema & API Base.
- [ ] **Phase 1**: Core UI Shell & Navigation.
- [ ] **Phase 2**: Home Dashboard.
- [ ] **Phase 3**: Ask Aegis Offline AI Assistant.
- [ ] **Phase 4**: Safe Evacuation & Shelters.
- [ ] **Phase 5**: SOS Emergency Beacon.
- [ ] **Phase 6**: Survival Guide & NDMA Protocols.
- [ ] **Phase 7**: Community Crowdsourced Reports.
- [ ] **Phase 8**: Safe Beacon ("I Am Safe").
- [ ] **Phase 9**: Hamburger Drawer Features (Offline Maps, Recent Events, History, Downloads, Roadmap).
- [ ] **Phase 10**: Notifications & Settings.
- [ ] **Phase 11**: Full Backend & Database Integration.
- [ ] **Phase 12**: Frontend-to-Backend Connection.
- [ ] **Phase 13**: Offline Caching & Service Worker.
- [ ] **Phase 14**: QA & Automated Verification.
- [ ] **Phase 15**: UI Polish & Mobile/Tablet Optimization.
