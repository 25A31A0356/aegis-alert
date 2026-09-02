/**
 * AegisAlert First Responder & NDRF Tactical Operations Console
 * Dynamic Triage Priority Scoring, Inflatable Boat Dispatch, and Victim Tracking
 */

export class ResponderView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sosQueue = [
      {
        id: "SOS-KL-9821",
        name: "Meppadi Village Cluster",
        location: "Chooralmala Riverbank, Kerala",
        coordinates: [11.5420, 76.1680],
        triageScore: 96,
        priority: "CRITICAL",
        peopleTrapped: 6,
        category: "Elderly & Infant Trapped on Roof",
        time: "4 mins ago",
        status: "DISPATCHED"
      },
      {
        id: "SOS-KL-9818",
        name: "Tea Estate Quarters #4",
        location: "Mundakkai Slope, Wayanad",
        coordinates: [11.5310, 76.1950],
        triageScore: 88,
        priority: "CRITICAL",
        peopleTrapped: 4,
        category: "Mudflow Blocking Ground Floor",
        time: "12 mins ago",
        status: "EN_ROUTE"
      },
      {
        id: "SOS-KL-9804",
        name: "Govt Lower Primary School",
        location: "Vellarimala Sector",
        coordinates: [11.5210, 76.2100],
        triageScore: 78,
        priority: "HIGH",
        peopleTrapped: 12,
        category: "Rising Water Surrounding Building",
        time: "25 mins ago",
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
            <span>PEOPLE NEEDING RESCUE</span>
            <strong style="color:#f59e0b;">${totalTrapped} Souls</strong>
          </div>
          <div class="kpi-block">
            <span>CRITICAL TRIAGE SCORE (90+)</span>
            <strong style="color:#ef4444;">${criticalCount} High Risk</strong>
          </div>
          <div class="kpi-block">
            <span>NDRF BATTALIONS DEPLOYED</span>
            <strong style="color:#10b981;">3 Teams (24 Zodiacs)</strong>
          </div>
        </div>

        <!-- Live Triage Ticket Queue -->
        <div class="sos-ticket-list">
          <div class="ticket-list-header">
            <h4>🚨 Live SOS Distress Queue (Sorted by AI Triage Vulnerability)</h4>
            <span style="font-size:0.75rem; color:#94a3b8;">Real-Time GPS Pushes</span>
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
                    🚤 Dispatch Zodiac Boat
                  </button>
                  <button class="btn-ticket-action btn-mark-evacuated" data-id="${item.id}">
                    ✅ Mark Evacuated / Safe
                  </button>
                  <button class="btn-ticket-action btn-drone-recon" data-id="${item.id}">
                    🛸 Send Drone Recon
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
