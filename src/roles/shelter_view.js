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
        doctorOnDuty: "Dr. Bhupen Hazarika (Medical Officer, Assam Health)",
        bloodUnits: { "O-": 8, "A+": 24, "B+": 32, "AB+": 12 },
        status: "OPEN_RECEIVING"
      },
      {
        id: "CAMP-SIKKIM-02",
        name: "Mangan District Administrative Safe Shelter",
        location: "Mangan Hill Ridge, Sikkim (+120m Elevation Above Teesta)",
        capacity: 650,
        occupied: 380,
        waterLiters: 14500,
        foodRationDays: 6,
        doctorOnDuty: "Dr. Tenzing Norbu (Senior Surgeon, STNM Gangtok)",
        bloodUnits: { "O-": 6, "A+": 16, "B+": 20, "AB+": 8 },
        status: "OPEN_RECEIVING"
      }
    ];

    this.missingRegistry = [
      { id: "REG-AS-01", name: "Pranab Saikia", age: 52, family: "Wife Anamika, Son Deep", status: "SAFELY_CHECKED_IN", shelter: "Garmur Highland Camp, Majuli" },
      { id: "REG-SK-02", name: "Sonam Lepcha", age: 68, family: "Looking for grandson Tashi", status: "MEDICAL_TREATMENT", shelter: "Mangan Administrative Camp, Sikkim" },
      { id: "REG-ML-03", name: "Mary Lyngdoh", age: 29, family: "Separated at Shillong-Silchar NH-6 landslide", status: "SAFELY_CHECKED_IN", shelter: "Cherrapunji Safe Shelter" }
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
