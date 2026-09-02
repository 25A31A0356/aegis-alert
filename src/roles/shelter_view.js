/**
 * AegisAlert North East Relief Shelter & Highland Command
 * Manages elevated highland shelters, water filtration, medical supplies, and family reunification
 */

export class ShelterView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.shelters = [
      {
        id: "CAMP-MAJULI-01",
        name: "Garmur Elevated Multi-Purpose Relief Complex",
        location: "Majuli Island, Assam (+28m Elevation Highland)",
        capacity: 1200,
        occupied: 742,
        waterLiters: 28000,
        foodRationDays: 7,
        doctorOnDuty: "Dr. Bhupen Hazarika (Assam Health)",
        bloodUnits: { "O-": 8, "A+": 24, "B+": 32, "AB+": 12 },
        status: "OPEN_RECEIVING"
      },
      {
        id: "CAMP-KL-02",
        name: "Meppadi Elevated Landslide Trauma Camp",
        location: "Wayanad Hills, Kerala (+45m Elevation)",
        capacity: 900,
        occupied: 620,
        waterLiters: 22000,
        foodRationDays: 8,
        doctorOnDuty: "Dr. Radhakrishnan (Kerala Health / Trauma Lead)",
        bloodUnits: { "O-": 12, "A+": 28, "B+": 35, "AB+": 14 },
        status: "OPEN_RECEIVING"
      },
      {
        id: "CAMP-RJ-03",
        name: "Bikaner 24/7 Air-Cooled Hydration Complex",
        location: "Bikaner City Central, Rajasthan (Heatwave Shelter)",
        capacity: 1500,
        occupied: 1040,
        waterLiters: 65000,
        foodRationDays: 10,
        doctorOnDuty: "Dr. Arvind Rathore (Heatstroke & Critical Care)",
        bloodUnits: { "O-": 14, "A+": 30, "B+": 40, "AB+": 18 },
        status: "OPEN_RECEIVING"
      },
      {
        id: "CAMP-OD-04",
        name: "Puri Concrete Multi-Purpose Cyclone Shelter #04",
        location: "Puri Coastal Ridge, Odisha (+15m Elevated Concrete)",
        capacity: 1800,
        occupied: 1350,
        waterLiters: 45000,
        foodRationDays: 12,
        doctorOnDuty: "Dr. Manas Mohapatra (Odisha Health)",
        bloodUnits: { "O-": 10, "A+": 36, "B+": 44, "AB+": 16 },
        status: "OPEN_RECEIVING"
      }
    ];

    this.missingRegistry = [
      { id: "REG-AS-01", name: "Pranab Saikia", age: 52, family: "Wife Anamika, Son Deep", status: "SAFELY_CHECKED_IN", shelter: "Garmur Highland Camp, Majuli" },
      { id: "REG-KL-02", name: "Shaji Varghese", age: 44, family: "Looking for daughter Ananya", status: "MEDICAL_TREATMENT", shelter: "Meppadi Landslide Camp, Wayanad" },
      { id: "REG-RJ-03", name: "Kailash Chand", age: 67, family: "Recovered from severe heat exhaustion", status: "SAFELY_CHECKED_IN", shelter: "Bikaner Hydration Complex, Rajasthan" },
      { id: "REG-OD-04", name: "Pabitra Jena", age: 38, family: "Evacuated from coastal fishing boat", status: "SAFELY_CHECKED_IN", shelter: "Puri Cyclone Shelter #04, Odisha" }
    ];
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="shelter-command-shell">
        
        <!-- Camps Capacity Overview -->
        <div class="camps-grid">
          ${this.shelters.map(camp => {
            const availableBeds = camp.capacity - camp.occupied;
            const occupancyPct = Math.round((camp.occupied / camp.capacity) * 100);

            return `
              <div class="camp-card">
                <div class="camp-card-header">
                  <div>
                    <h4 class="camp-title">🏕️ ${camp.name}</h4>
                    <span class="camp-loc">${camp.location}</span>
                  </div>
                  <span class="camp-status-badge">RECEIVING EVACUEES</span>
                </div>

                <!-- Bed Occupancy Bar -->
                <div class="camp-meter-section">
                  <div class="meter-labels">
                    <span>Highland Shelter Capacity: <strong>${camp.occupied} / ${camp.capacity}</strong></span>
                    <span>Available: <strong style="color:#10b981;">${availableBeds} Highland Beds</strong></span>
                  </div>
                  <div class="camp-progress-track">
                    <div class="camp-progress-fill" style="width: ${occupancyPct}%;"></div>
                  </div>
                </div>

                <!-- Logistics Metrics -->
                <div class="camp-logistics-grid">
                  <div class="logistics-cell">
                    <span>Safe Drinking Water</span>
                    <strong>${camp.waterLiters.toLocaleString("en-IN")} L</strong>
                  </div>
                  <div class="logistics-cell">
                    <span>Food Buffer</span>
                    <strong>${camp.foodRationDays} Days Buffer</strong>
                  </div>
                  <div class="logistics-cell">
                    <span>On-Duty Doctor</span>
                    <strong style="font-size:0.75rem;">${camp.doctorOnDuty}</strong>
                  </div>
                  <div class="logistics-cell">
                    <span>Emergency O- Blood</span>
                    <strong style="color:#ef4444;">${camp.bloodUnits["O-"]} Units</strong>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- Family Reunification Registry -->
        <div class="registry-box">
          <div class="registry-header">
            <h4>👨‍👩‍👧‍👦 North East Missing Persons & Family Reunification Portal</h4>
            <input type="text" id="registry-search-input" class="registry-search-bar" placeholder="Search by citizen name, village, or camp..." />
          </div>

          <table class="registry-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Citizen Name</th>
                <th>Age</th>
                <th>Family Contact / Note</th>
                <th>Current Status</th>
                <th>Relief Location</th>
              </tr>
            </thead>
            <tbody id="registry-table-body">
              ${this.missingRegistry.map(m => `
                <tr>
                  <td><code>${m.id}</code></td>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.age}</td>
                  <td>${m.family}</td>
                  <td><span class="reg-status-pill status-${m.status.toLowerCase()}">${m.status.replace(/_/g, " ")}</span></td>
                  <td>${m.shelter}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

      </div>
    `;

    this.bindSearch();
  }

  bindSearch() {
    const searchInput = document.getElementById("registry-search-input");
    const tbody = document.getElementById("registry-table-body");

    if (searchInput && tbody) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = this.missingRegistry.filter(m => 
          m.name.toLowerCase().includes(query) || 
          m.family.toLowerCase().includes(query) ||
          m.shelter.toLowerCase().includes(query)
        );

        tbody.innerHTML = filtered.map(m => `
          <tr>
            <td><code>${m.id}</code></td>
            <td><strong>${m.name}</strong></td>
            <td>${m.age}</td>
            <td>${m.family}</td>
            <td><span class="reg-status-pill status-${m.status.toLowerCase()}">${m.status.replace(/_/g, " ")}</span></td>
            <td>${m.shelter}</td>
          </tr>
        `).join("");
      });
    }
  }
}
