/**
 * AegisAlert First Responder & NDRF Tactical Operations Console
 * Tailored for NDRF 1st Battalion (Guwahati) & 12th Battalion (Arunachal Pradesh)
 * Specialized in Riverine Brahmaputra Flood Rescue & Himalayan Mountain Debris Flows
 */

export class ResponderView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sosQueue = [
      {
        id: "SOS-AS-1042",
        name: "Kamalabari Ferry Ghat Cluster",
        location: "Majuli River Island, Assam",
        coordinates: [26.9450, 94.2100],
        triageScore: 98,
        priority: "CRITICAL",
        peopleTrapped: 8,
        category: "Embankment Breach / Island Isolation",
        time: "3 mins ago",
        status: "DISPATCHED"
      },
      {
        id: "SOS-SK-2019",
        name: "Chungthang Hydel Quarters",
        location: "Teesta Basin, Sikkim (GLOF Surge)",
        coordinates: [27.6040, 88.6470],
        triageScore: 94,
        priority: "CRITICAL",
        peopleTrapped: 5,
        category: "Glacial Surge Dam Washout",
        time: "11 mins ago",
        status: "EN_ROUTE"
      },
      {
        id: "SOS-ML-3041",
        name: "Mawsynram Valley Hamlet",
        location: "East Khasi Hills, Meghalaya",
        coordinates: [25.3050, 91.5850],
        triageScore: 82,
        priority: "HIGH",
        peopleTrapped: 14,
        category: "Landslide Cutoff on NH-6",
        time: "22 mins ago",
        status: "PENDING"
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
        
        <!-- Responder Metrics Strip -->
        <div class="responder-kpi-bar">
          <div class="kpi-block">
            <span>ACTIVE RESCUE TICKETS</span>
            <strong style="color:#ef4444;">${this.sosQueue.length} Active</strong>
          </div>
          <div class="kpi-block">
            <span>CITIZENS NEEDING RESCUE</span>
            <strong style="color:#f59e0b;">${totalTrapped} Souls</strong>
          </div>
          <div class="kpi-block">
            <span>CRITICAL TRIAGE SCORE (90+)</span>
            <strong style="color:#ef4444;">${criticalCount} High Risk</strong>
          </div>
          <div class="kpi-block">
            <span>NDRF BATTALIONS ACTIVE</span>
            <strong style="color:#10b981;">1st Bn (Guwahati) & 12th Bn (Itanagar)</strong>
          </div>
        </div>

        <!-- Live Triage Ticket Queue -->
        <div class="sos-ticket-list">
          <div class="ticket-list-header">
            <h4>🚨 North East Emergency Distress Queue (Sorted by AI Triage Vulnerability)</h4>
            <span style="font-size:0.75rem; color:#94a3b8;">ISRO NESAC GPS Coordinates</span>
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
                    <span>TRIAGE SCORE:</span>
                    <strong>${item.triageScore}/100</strong>
                  </div>
                </div>

                <div class="ticket-mid-row">
                  <div class="ticket-meta-col">
                    <div>📍 <strong>${item.location}</strong> (${item.coordinates[0].toFixed(4)}°N, ${item.coordinates[1].toFixed(4)}°E)</div>
                    <div>⚠️ Hazard: <span style="color:#f87171;">${item.category}</span></div>
                    <div>👥 Trapped: <strong>${item.peopleTrapped} Citizens</strong> • Reported: <em>${item.time}</em></div>
                  </div>
                  <div class="ticket-status-col">
                    <span class="status-indicator status-${item.status.toLowerCase()}">${item.status}</span>
                  </div>
                </div>

                <div class="ticket-actions-row">
                  <button class="btn-ticket-action btn-dispatch-boat" data-id="${item.id}">
                    🚤 Dispatch Inflatable Zodiac (1st Bn)
                  </button>
                  <button class="btn-ticket-action btn-mark-evacuated" data-id="${item.id}">
                    ✅ Mark Evacuated to Highland
                  </button>
                  <button class="btn-ticket-action btn-drone-recon" data-id="${item.id}">
                    🛸 Task NESAC Satellite / Drone Recon
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
          ticket.name += " (Safely Relocated)";
          this.render();
        }
      });
    });

    this.container.querySelectorAll(".btn-dispatch-boat").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const ticket = this.sosQueue.find(s => s.id === id);
        if (ticket) {
          ticket.status = "BOAT_EN_ROUTE";
          this.render();
        }
      });
    });
  }
}
