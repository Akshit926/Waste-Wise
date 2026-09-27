# WasteWise

> **Smarter Disposal. Smarter Collection.**  
> *From disposal confusion to smarter collection.*

WasteWise is a modern civic-technology web application built for municipal waste management teams and citizens. It replaces the traditional, chaotic `Request ➔ Assign ➔ Collect` paradigm with an intelligent workflow:

```text
Identify ➔ Understand ➔ Prioritize ➔ Batch ➔ Collect ➔ Process
```

---

## 1. Problem Statement

* **For Citizens:** People frequently do not know how to segregate hazardous, electronic, or bulky waste from general household garbage, leading to improper disposal, chemical contamination, and soil degradation.
* **For Municipal Collectors:** Collection fleets struggle with disorganized, unprioritized pickup requests, dispatching individual trucks for single items and failing to address hazardous or overdue pickups in a timely manner.

---

## 2. Core USP: "Smart Waste Triage + Smart Collection Queue"

Unlike generic CRUD waste-management platforms, WasteWise introduces two tightly coupled intelligence systems:

### A. Smart Waste Triage
Citizens describe what they are disposing of in natural language (e.g., *"Old laptop and two batteries"*). The rule-based classification engine:
1. Segregates items into distinct material streams:
   * 💻 **Laptop** ➔ **E-Waste** (Risk Score: 30)
   * 🔋 **Batteries** ➔ **Hazardous Waste** (Risk Score: 40)
2. Flags mandatory special handling precautions:
   * ⚠️ *Special handling recommended. Toxic heavy metals & lead-acid hazard. Do not dispose with general household waste.*
3. Automatically sets recommended collection routes and pre-populates the multi-step scheduling flow.

### B. Smart Collection Queue & Priority Engine
The operations command center does not display a plain chronological list. Each request is scored transparently:

$$\text{Priority Score} = \text{Waste Risk Score} + \text{Waiting Time Score} + \text{Urgency Score} + \text{Volume Score}$$

| Dimension | Points & Criteria |
| :--- | :--- |
| **Waste Risk** | Hazardous: **+40** · E-Waste: **+30** · Bulk: **+20** · Organic: **+15** · Standard Recyclables: **+10** |
| **Waiting Time** | 3+ days (Overdue): **+30** · 2 days: **+20** · 1 day: **+10** · Today: **+0** |
| **Window Urgency** | Pickup Today: **+30** · Pickup Tomorrow: **+20** · Later: **+10** |
| **Volume / Qty** | Bulk Volume ($\ge 10\text{ kg}$ or $\ge 5\text{ items}$): **+10** · Standard: **+5** |

* **Priority Buckets:**
  * 🔴 **HIGH Priority:** $\ge 61$ points
  * 🟡 **MEDIUM Priority:** $31 - 60$ points
  * 🟢 **NORMAL Priority:** $0 - 30$ points
* **Explainable Rationale:** Every request displays exactly why it was prioritized (e.g., *Hazardous risk (+40) + waiting 2 days (+20) + scheduled tomorrow (+20) = Score 80 [HIGH]*).

### C. Smart Collection Batching
A deterministic grouping algorithm clusters compatible requests by:
1. **Area Zone** (e.g., Wakad, Hinjewadi, Baner, Aundh, Pimple Saudagar)
2. **Pickup Date Window**
3. **Stream Compatibility**

**Example:**
> 💡 *Smart Recommendation: 3 pickups in Wakad (#WW1042, #WW1045, #WW1046) can be combined into one collection run.*

Clicking **"Create Collection Batch"** bundles the requests under Batch `B-003`, assigns the route lead and vehicle (`MH-12-WW-4028`), and updates all linked request statuses to `Assigned`.

---

## 3. Key Features

* **Citizen Portal:**
  * **Editorial Dashboard:** Shows upcoming pickup with linear milestone progress, recent requests, and cumulative environmental impact ($24.5\text{ kg}$ diverted, $9.8\text{ kg CO}_2$ avoided).
  * **Smart Triage Tool:** Natural language keyword parsing + 8 one-click category selectors.
  * **Multi-Step Scheduling:** Category ➔ Item details ➔ Quantity ➔ Pune Area selection ➔ Slot confirmation.
  * **Live Tracking & Waste Journey:** Full downstream chain of custody (Doorstep custody verification ➔ Sorting ➔ Certified circular processing at Chakan GreenTech Park).
* **Municipal Operations Command Center:**
  * **Collection Health Card:** Live schedule compliance ratio ($83\%$ on schedule) and urgent request alerts.
  * **Sector Demand Breakdown:** Sector pickups for Wakad, Hinjewadi, Baner, and Aundh.
  * **Smart Batching Engine:** Real-time clustering opportunities with one-click batch dispatch.
  * **Operations Table & Side Drawer:** Multi-filter by priority, status, category, and area. Clicking any row opens a slide-out drawer with explainable priority scores and quick status updates.
  * **Analytics & Visualizations:** Purposeful Recharts graphs answering stream distribution, sector demand, and operational lifecycle funnel.

---

## 4. Technology Stack

* **Frontend:**
  * **React 19 + Vite** (Fast Single Page Application)
  * **TypeScript** (Strict types for requests, batches, and analytics)
  * **Tailwind CSS v3** (Custom civic-tech color palette: Deep Forest Green `#1B4332`, Muted Emerald, slate surfaces)
  * **Lucide React** (Consistent modern iconography)
  * **Recharts** (Stream distribution donut & sector demand bar charts)
  * **Canvas Confetti** (Micro-interaction celebration on request confirmation)
* **Backend:**
  * **FastAPI** (High-performance Python asynchronous API)
  * **Uvicorn** (ASGI server)
  * **Pydantic v2** (Data validation & API serialization)
  * **Resilient Client Store Fallback:** The frontend seamlessly communicates with the FastAPI backend and maintains a synchronized fallback store for zero-downtime demonstration resilience.

---

## 5. Project Structure

```text
Waste-Wise/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI routes, CORS, and static SPA serving
│   │   ├── models.py          # Pydantic schemas (Requests, Batches, Triage)
│   │   ├── triage.py          # Rule-based NLP classification engine
│   │   ├── priority.py        # Transparent explainable scoring engine
│   │   ├── batching.py        # Deterministic area + date grouping algorithm
│   │   ├── database.py        # Operations state manager and analytics calculator
│   │   └── seed_data.py       # 15+ realistic Pune operational records
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Backend runner
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DemoBanner.tsx           # Role switcher & 2-min demo script modal
│   │   │   ├── Sidebar.tsx              # Clean civic-tech left navigation
│   │   │   ├── PriorityBadge.tsx        # Subtle priority pill
│   │   │   ├── StatusBadge.tsx          # Status indicator tag
│   │   │   ├── RequestDrawer.tsx        # Slide-out inspection & update panel
│   │   │   └── WasteJourneyTimeline.tsx # Downstream recycling chain of custody
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx          # Civic tech landing page
│   │   │   ├── UserDashboard.tsx        # Editorial citizen overview
│   │   │   ├── WasteTriagePage.tsx      # Natural language triage interface
│   │   │   ├── SchedulePickupPage.tsx   # 6-step pickup booking flow
│   │   │   ├── TrackPickupPage.tsx      # Live milestone tracking
│   │   │   ├── UserRequestsPage.tsx     # Citizen requests management
│   │   │   ├── UserHistoryPage.tsx      # Downstream certificates & impact
│   │   │   ├── AdminDashboard.tsx       # Operations command center
│   │   │   ├── SmartQueuePage.tsx       # Priority scoring & batching
│   │   │   ├── AdminRequestsPage.tsx    # Filterable operations table
│   │   │   ├── BatchesPage.tsx          # Vehicle route clusters
│   │   │   └── AnalyticsPage.tsx        # Recharts visualizations
│   │   ├── services/
│   │   │   └── api.ts                   # Dual backend + offline resilient client
│   │   ├── types.ts                     # TypeScript definitions
│   │   ├── index.css                    # Tailwind + Inter font
│   │   └── App.tsx                      # Root application layout
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── Dockerfile                 # Multi-stage production container
├── .dockerignore
└── README.md
```

---

## 6. Quick Start & Local Setup

### Prerequisites
* **Node.js:** v18+ (Node v22 recommended)
* **Python:** 3.10+ (Python 3.13 supported)

### Step 1: Clone and Install Backend
```bash
# Navigate to project directory
cd Waste-Wise

# Install Python requirements
python -m pip install -r backend/requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 3: Run the Application
You can run the application in either of two ways:

#### Option A: Unified Fullstack Mode (FastAPI serves built React frontend)
```bash
# From the project root:
python backend/run.py
```
Open **`http://localhost:8000`** in your browser.

#### Option B: Dual Development Mode (with Hot Reloading)
* **Terminal 1 (Backend API):**
  ```bash
  python backend/run.py
  ```
* **Terminal 2 (Frontend Dev Server):**
  ```bash
  cd frontend
  npm run dev
  ```
Open **`http://localhost:5173`** in your browser (all `/api` calls are automatically proxied to port 8000).

---

## 7. Google Cloud Run Deployment

WasteWise includes a multi-stage `Dockerfile` optimized for Google Cloud Run:
1. **Stage 1 (Node.js):** Builds the React Vite production bundle (`frontend/dist`).
2. **Stage 2 (Python):** Mounts the static assets inside FastAPI and exposes port `8080`.

### Deploy using Google Cloud SDK:
```bash
# 1. Build and submit image to Google Container Registry or Artifact Registry
gcloud builds submit --tag gcr.io/[PROJECT-ID]/wastewise:latest

# 2. Deploy to Google Cloud Run
gcloud run deploy wastewise \
  --image gcr.io/[PROJECT-ID]/wastewise:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1
```

### Deploy using Docker Locally:
```bash
# Build the container
docker build -t wastewise:latest .

# Run container on port 8080
docker run -p 8080:8080 -e PORT=8080 wastewise:latest
```
Visit **`http://localhost:8080`**.

---

## 8. Two-Minute Hackathon Demo Script (Jury Guide)

WasteWise features a sticky **Hackathon Jury Demo Banner** with a one-click role switcher between **Citizen View** and **Operations Admin**, plus an instant **"Reset Demo"** button.

### ⏱️ Minute 1: Citizen Waste Triage
1. Open the application and click **Dispose Waste**.
2. Type into the triage box:
   > *"Old laptop and two batteries"*
3. Click **Identify Waste**.
4. **Observe:** The system segments items into **Laptop (E-Waste)** and **Batteries (Hazardous)**, highlights special handling in amber, and assigns **HIGH Priority**.
5. Click **Schedule Pickup** ➔ Select **Wakad** ➔ Confirm.
6. Observe request confirmation (`#WW1054`) with immediate access to live tracking.

### ⏱️ Minute 2: Operations Command & Smart Batching
1. Switch to **Operations Admin** via the top toggle.
2. Under **Needs Attention**, notice `#WW1042` and the newly submitted Wakad request marked **HIGH Priority** with the exact formula reason.
3. In the **Smart Batch Opportunity** banner, see:
   > *Combine 4 Wakad pickups into one single collection run.*
4. Click **Create Collection Batch**.
5. **Observe:** Batch `B-003` is instantly generated, driver `Pawan Jadhav (MH-12-WW-4028)` is assigned, and linked requests update to `Assigned`.
6. Open any request row to inspect the side drawer, view the transparent scoring breakdown, and update the status to `Out for Pickup` or `Processed`.

---

## 9. Seeded Pune Pilot Data

The application comes pre-loaded with realistic operations data across Pune:
* **Areas:** Wakad, Hinjewadi Phase 1 & 3, Baner, Aundh, Pimple Saudagar
* **Categories:** E-Waste, Hazardous (lead-acid batteries, solvent cans, expired pharma), Plastic (sorted PET), Organic (community wet composting), Bulk Waste (sofa & desk), Metal, Glass.
* **Facilities:** Chakan GreenTech Recovery Complex, Thergaon Polymer Recycling Center.

---

## 10. Solo Developer / Author

* **Project:** WasteWise
* **Developer:** Akshit Sharma
* **License:** MIT License
