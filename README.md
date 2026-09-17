# JanSeva Dashboard (जनसेवा डैशबोर्ड)
## AI-Powered Digital Constituency Intelligence, Public Communication and Political Media Management Platform
**Constituency:** Etawah Assembly (200), Uttar Pradesh  
**Representative:** Smt. Sarita Bhadauria (विधायक, इटावा विधानसभा)  
**Motto:** *"सेवा ही संकल्प, विकास ही लक्ष्य" • "जनता का विश्वास, हमारी ज़िम्मेदारी"*

---

## 🌟 Executive Overview
JanSeva Dashboard is a full-stack political media management, digital report card, and constituency intelligence system engineered to connect citizens, political workers, and administrative teams with elected representatives.

### Core Systems Built:
1. **Public Website & Citizen Portal** (Matches Mockup 4):
   - Hero banner with Smt. Sarita Bhadauria folded hands portrait, Etawah constituency badge, and Hindi slogans.
   - 5 Floating Live Metric Counters (125+ Works, 80+ Villages, 350+ Jan Samvad, 2,000+ Social Posts, 50,000+ Citizens).
   - Filterable Latest Updates grid with full modal article preview and 1-click WhatsApp share virality tracking.
   - Interactive Geo-Spatial Leaflet Map of Etawah (200) with color-coded pins across Saifai, Bakewar, Rampur, Takroi, Pilkhar, Jaswantnagar, Bharthana, Chakarnagar, and Udi.
   - 4-Year Development Journey Timeline (2026, 2025, 2024, 2023).
   - Popular 8 Department Categories with direct project filters.
   - Citizen Connect QR Card with direct membership registration and duplicate phone detection.
   - Festival Campaign Greeting Overlay (Ganesh Chaturthi, Diwali, Holi, Independence Day).
   - Dedicated Interactive Smartphone Simulator frame with native mobile app bottom navigation (*होम, विकास, मीडिया, जुड़े, और*).
2. **Admin Panel - SaaS CMS Website Builder** (Matches Mockup 1):
   - Hero section banner and copy editor with live preview.
   - 5 Pre-built Homepage Templates with 1-click activation:
     1. Development Focus
     2. Public Connect
     3. Media & News
     4. Political Leadership
     5. Complete Intelligence Dashboard
   - Drag & Drop Section Reordering & ON/OFF Toggle Switches for all 11 modules.
   - Festival Page Campaign Manager with scheduled dates and auto-reversion.
   - Split live desktop and smartphone preview.
3. **Admin Dashboard & Social Media Hub** (Matches Mockups 2 & 3):
   - Leaders card: PM Narendra Modi, CM Yogi Adityanath, MLA Sarita Bhadauria.
   - Social Media Overview: Facebook (12.4k), Instagram (8.9k), YouTube (25.3k), X/Twitter (4.8k) with real-time "Sync Now" button.
   - AI Auto-Classifier tagging posts into Village, Department, and Category.
   - 1-Click "Convert Social Post to Development Timeline Work".
   - Donut Chart breakdown of 125 works (Completed 36%, In Progress 38%, Approved 16%, Not Started 10%).
   - Quick Action buttons: Add New Work, Create Event, Send Notification, Import Citizens, Upload Members, AI Generate Article.
   - Citizen Registrations Table, Team Members Roster, and Upcoming Events.
4. **Regional News RSS Intelligence & Blog System**:
   - Newspaper feed aggregator (Amar Ujala, Dainik Jagran, Hindustan).
   - 1-Click "Convert News to AI Blog Draft" workflow.
   - Blog Manager with status controls: Published, Hidden, Archived, Scheduled.
5. **Citizen CRM & Duplicate Detection Engine**:
   - Search by name, phone, village, booth.
   - Bulk Excel/CSV import & simulated OCR voter slip photo extractor.
   - Duplicate prevention preventing duplicate registrations.
6. **AI Development & Speech Assistant**:
   - Natural language constituency chatbot answering questions on works, budgets, and villages.
   - Automatic press note and article generator.
7. **Audit Trail & Database Migration**:
   - Full user activity audit logging tracking logins, template switches, and section toggles.
   - 1-Click export to MongoDB JSON dump and PostgreSQL SQL DDL schema.

---

## 🚀 How to Run the Platform

### Prerequisites:
- Node.js (v18 or v20+ recommended; tested on v24)
- npm

### 1. Launch Full-Stack Application (Single Command):
From the project root:
```bash
node server/server.js
```
The server serves both the REST API on port `5000` and the built client on `http://localhost:5000`.

### 2. Development Mode (Hot Reloading):
In one terminal:
```bash
node server/server.js
```
In a second terminal:
```bash
cd client
npm run dev
```
- Frontend Dev Server: `http://localhost:5173`
- Backend API Server: `http://localhost:5000`

---

## 📁 Architecture & File Layout
```
d:/AI WEBSITES/aapkaneta/
├── client/                     # Vite + React 18 + Tailwind CSS Frontend
│   ├── public/images/          # Official portrait photos and mock assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminSidebar, AdminHeader
│   │   │   └── public/         # Navbar, HeroSection, MetricsBar, LatestUpdates,
│   │   │                       # ConstituencyMap, DevelopmentTimeline, PopularCategories,
│   │   │                       # CitizenConnectQR, FooterPanorama, MobileSimulator, FestivalBanner
│   │   ├── pages/
│   │   │   ├── PublicHome.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminWebsiteBuilder.jsx
│   │   │   ├── AdminDevelopmentWorks.jsx
│   │   │   ├── AdminSocialMedia.jsx
│   │   │   ├── AdminNewsRSS.jsx
│   │   │   ├── AdminBlogManager.jsx
│   │   │   ├── AdminCitizenCRM.jsx
│   │   │   ├── AdminTeamManagement.jsx
│   │   │   ├── AdminAIAssistant.jsx
│   │   │   ├── AdminAnalytics.jsx
│   │   │   └── AdminAuditLogs.jsx
│   │   ├── context/AppContext.jsx
│   │   └── services/api.js
│   └── vite.config.js
├── server/                     # Node.js Express REST API
│   ├── data/
│   │   └── db.json             # Seed database with authentic Etawah 200 MLA data
│   ├── routes/
│   │   ├── settings.js         # Templates, hero, section toggles, festival
│   │   ├── development.js      # CRUD, filters, statistics
│   │   ├── citizens.js         # CRM, duplicate detection, CSV import
│   │   ├── social.js           # Feeds sync, post-to-work converter
│   │   ├── news.js             # RSS feeds, news-to-blog workflow
│   │   ├── blogs.js            # Published, hidden, archived, scheduled
│   │   ├── leaders.js          # PM, CM, MLA, mentions
│   │   ├── team.js             # MLA organization & RBAC
│   │   ├── events.js           # Public visits, inspections
│   │   ├── ai.js               # Natural language Q&A, article generator
│   │   ├── analytics.js        # Reach, visits, share counters
│   │   ├── audit.js            # User activity logs
│   │   └── export.js           # Database migration to MongoDB & PostgreSQL
│   ├── utils/
│   │   ├── db.js               # Persistent JSON storage engine with audit logging
│   │   └── aiClassifier.js     # Post classification & blog generator
│   └── server.js               # Express entry point
├── package.json
└── README.md
```

---

## 🛡️ Future Database Migration
This platform uses a high-performance JavaScript file storage architecture with atomic writes. To migrate to an external database at scale:
- **MongoDB**: Visit `/api/export/mongodb` to download the structured JSON collections.
- **PostgreSQL**: Visit `/api/export/postgresql` to download ready-to-execute SQL DDL and INSERT statements.
