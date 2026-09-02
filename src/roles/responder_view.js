/**
 * AegisAlert National First Responder & Armed Forces Tactical Command
 * Integrates:
 * 1. National Disaster Response Force (NDRF 16 Battalions nationwide)
 * 2. Tri-Services HADR: Indian Army, Navy, Air Force (IAF Mi-17/Chinook), and Coast Guard
 * 3. State Disaster Response Forces (SDRF) of all 28 States & 8 UTs
 */

export class ResponderView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sosQueue = [
      {
        id: "SOS-NAT-01",
        name: "Kamalabari Ferry Ghat Cluster",
        location: "Majuli Island, Assam (Eastern Theater)",
        coordinates: [26.9450, 94.2100],
        triageScore: 98,
        priority: "CRITICAL",
        peopleTrapped: 18,
        category: "Major River Embankment Breach",
        forcesRequired: "NDRF 1st Bn + IAF Tezpur Air Base",
        time: "2 mins ago",
        status: "DISPATCHED"
      },
      {
        id: "SOS-NAT-02",
        name: "Mandakini River Valley Pilgrim Camp",
        location: "Kedarnath Route, Uttarakhand (Northern Theater)",
        coordinates: [30.7310, 78.4410],
        triageScore: 95,
        priority: "CRITICAL",
        peopleTrapped: 24,
        category: "Cloudburst Debris Flow / Highway Cutoff",
        forcesRequired: "Indian Army Central Command + SDRF",
        time: "8 mins ago",
        status: "EN_ROUTE"
      },
      {
        id: "SOS-NAT-03",
        name: "Arakhakuda Coastal Fishing Hamlet",
        location: "Chilika / Puri Coast, Odisha (Southern Theater)",
        coordinates: [19.7983, 85.8249],
        triageScore: 91,
        priority: "CRITICAL",
        peopleTrapped: 32,
        category: "4.2m Storm Surge Cyclone Inundation",
        forcesRequired: "Indian Coast Guard + NDRF 3rd Bn",
        time: "15 mins ago",
        status: "DISPATCHED"
      },
      {
        id: "SOS-NAT-04",
        name: "Mithi River Low Causeway",
        location: "Kurla / Bandra, Mumbai (Western Theater)",
        coordinates: [19.0760, 72.8777],
        triageScore: 84,
        priority: "HIGH",
        peopleTrapped: 45,
        category: "High-Tide Estuary Backflow",
        forcesRequired: "NDRF 5th Bn (Pune) + Mumbai Fire Brigade",
        time: "20 mins ago",
        status: "PENDING"
      },
      {
        id: "SOS-NAT-05",
        name: "Chooralmala Tea Plantation Ridge",
        location: "Wayanad, Kerala (Southern Ghats)",
        coordinates: [11.5540, 76.1265],
        triageScore: 99,
        priority: "CRITICAL",
        peopleTrapped: 28,
        category: "Massive Slope Failure & Mudflow (Landslide)",
        forcesRequired: "NDRF 4th Bn + Army Madras Regt (Canines & Excavators)",
        time: "4 mins ago",
        status: "DISPATCHED"
      },
      {
        id: "SOS-NAT-06",
        name: "Burdwan Rural High School Compound",
        location: "Purba Bardhaman, West Bengal",
        coordinates: [23.2324, 87.8615],
        triageScore: 92,
        priority: "CRITICAL",
        peopleTrapped: 16,
        category: "Kalbaishakhi Tornado Squall & Tin Roof Collapse",
        forcesRequired: "West Bengal SDRF + Civil Defense",
        time: "12 mins ago",
        status: "EN_ROUTE"
      },
      {
        id: "SOS-NAT-07",
        name: "Bikaner Rural Brick Kiln Cluster",
        location: "Thar Desert Outskirts, Rajasthan",
        coordinates: [28.0229, 73.3119],
        triageScore: 88,
        priority: "HIGH",
        peopleTrapped: 35,
        category: "49.4°C Extreme Heatwave / Severe Heatstroke Cluster",
        forcesRequired: "District Health Emergency Mobile Unit + Water Tankers",
        time: "18 mins ago",
        status: "DISPATCHED"
      }
    ];
  }

  addSOS(sosItem) {
    this.sosQueue.unshift(sosItem);
    this.render();
  }

  render() {
    if (!this.container) return;

    const totalTrapped = this.sosQueue.reduce((acc, curr) => acc + (curr.status !== "SAVED" ? curr.peopleTrapped : 0), 0);
    const criticalCount = this.sosQueue.filter(s => s.priority === "CRITICAL" && s.status !== "SAVED").length;

    this.container.innerHTML = `
      <div class="responder-shell">
        
        <!-- National Defense & HADR Metrics Strip -->
        <div class="responder-kpi-bar">
          <div class="kpi-block">
            <span>PAN-INDIA ACTIVE TICKETS</span>
            <strong style="color:#ef4444;">${this.sosQueue.length} Incidents</strong>
          </div>
          <div class="kpi-block">
            <span>CITIZENS UNDER RESCUE</span>
            <strong style="color:#f59e0b;">${totalTrapped} Souls</strong>
          </div>
          <div class="kpi-block">
            <span>CRITICAL NATIONAL TRIAGE (90+)</span>
            <strong style="color:#ef4444;">${criticalCount} High Risk</strong>
          </div>
          <div class="kpi-block">
            <span>ARMED FORCES & NDRF MOBILIZED</span>
            <strong style="color:#10b981;">16 NDRF Bns • IAF Air Command</strong>
          </div>
        </div>

        <!-- Live Triage Ticket Queue -->
        <div class="sos-ticket-list">
          <div class="ticket-list-header">
            <h4>🚨 National Emergency Operations Center (NEOC) Triage Queue</h4>
            <span style="font-size:0.75rem; color:#94a3b8;">Real-Time GPS & Satellite Coordinates</span>
          </div>

          <div class="tickets-container">
            ${this.sosQueue.map((item, idx) => `
              <div class="sos-ticket-card priority-${item.priority.toLowerCase()}">
                <div class="ticket-top-row">
                  <div class="ticket-id-box">
                    <span class="ticket-badge">${item.id}</span>
                    <strong class="ticket-name">${item.name}</strong>
                  </div>
                  <div class="ticket-triage-badge">
                    <span>NATIONAL TRIAGE:</span>
                    <strong>${item.triageScore}/100 [CRITICAL]</strong>
                  </div>
                </div>

                <div class="ticket-mid-row">
                  <div class="ticket-meta-col">
                    <div>📍 <strong>${item.location}</strong> (${item.coordinates[0].toFixed(4)}°N, ${item.coordinates[1].toFixed(4)}°E)</div>
                    <div>⚠️ Threat: <span style="color:#f87171;">${item.category}</span></div>
                    <div>🎖️ Tasked Forces: <span style="color:#38bdf8; font-weight:600;">${item.forcesRequired}</span></div>
                    <div>👥 Trapped: <strong>${item.peopleTrapped} Citizens</strong> • Reported: <em>${item.time}</em></div>
                  </div>
                  <div class="ticket-status-col">
                    <span class="status-indicator status-${item.status.toLowerCase()}">${item.status}</span>
                  </div>
                </div>

                <div class="ticket-actions-row">
                  <button class="btn-ticket-action btn-iaf-airlift" data-id="${item.id}">
                    🚁 Authorize IAF Helicopter Sortie
                  </button>
                  <button class="btn-ticket-action btn-dispatch-boat" data-id="${item.id}">
                    🚤 Dispatch NDRF Zodiac Boat
                  </button>
                  <button class="btn-ticket-action btn-army-eng" data-id="${item.id}">
                    🎖️ Deploy Army Engineers (Bridge)
                  </button>
                  <button class="btn-ticket-action btn-mark-evacuated" data-id="${item.id}">
                    ✅ Mark Evacuated / Safe
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelectorAll(".btn-mark-evacuated").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const ticket = this.sosQueue.find(s => s.id === id);
        if (ticket) {
          ticket.status = "SAVED";
          ticket.name += " (Successfully Relocated to Camp)";
          this.render();
        }
      });
    });

    this.container.querySelectorAll(".btn-iaf-airlift").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const ticket = this.sosQueue.find(s => s.id === id);
        if (ticket) {
          ticket.status = "IAF_AIRLIFT_AIRBORNE";
          this.render();
        }
      });
    });

    this.container.querySelectorAll(".btn-dispatch-boat").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const ticket = this.sosQueue.find(s => s.id === id);
        if (ticket) {
          ticket.status = "NDRF_BOAT_EN_ROUTE";
          this.render();
        }
      });
    });
  }
}
