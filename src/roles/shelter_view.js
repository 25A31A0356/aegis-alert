/**
 * AegisAlert Relief Shelter & Hospital Logistics Command
 * Manages bed capacities, drinking water, medical inventory, and family reunification
 */

export class ShelterView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.shelters = [
      {
        id: "CAMP-MEPPADI-01",
        name: "St. Joseph Higher Secondary School Camp",
        location: "Meppadi Hill Ridge (+42m elevation)",
        capacity: 500,
        occupied: 312,
        waterLiters: 12400,
        foodRationDays: 5,
        doctorOnDuty: "Dr. Ananya Nair (Medical Officer)",
        bloodUnits: { "O-": 6, "A+": 18, "B+": 22, "AB+": 8 },
        status: "OPEN_RECEIVING"
      },
      {
        id: "CAMP-VYTHIRI-02",
        name: "Vythiri Community Hall & High School",
        location: "Vythiri Sector (+38m elevation)",
        capacity: 350,
        occupied: 180,
        waterLiters: 8500,
        foodRationDays: 4,
        doctorOnDuty: "Dr. Rajesh Kurup (Pediatrician)",
        bloodUnits: { "O-": 4, "A+": 12, "B+": 15, "AB+": 5 },
        status: "OPEN_RECEIVING"
      }
    ];

    this.missingRegistry = [
      { id: "REG-01", name: "Ramesh Chandran", age: 44, family: "Wife Sunita, Son Rahul", status: "SAFELY_CHECKED_IN", shelter: "St. Joseph Camp" },
      { id: "REG-02", name: "Devaki Amma", age: 72, family: "Looking for daughter Mini", status: "MEDICAL_TREATMENT", shelter: "St. Joseph Camp" },
      { id: "REG-03", name: "Kiran Babu", age: 11, family: "Separated at Chooralmala bridge", status: "UNACCOMPANIED_CHILD", shelter: "Vythiri Community Hall" }
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
                    <span>Bed Occupancy: <strong>${camp.occupied} / ${camp.capacity}</strong></span>
                    <span>Available: <strong style="color:#10b981;">${availableBeds} Beds</strong></span>
                  </div>
                  <div class="camp-progress-track">
                    <div class="camp-progress-fill" style="width: ${occupancyPct}%;"></div>
                  </div>
                </div>

                <!-- Logistics Metrics -->
                <div class="camp-logistics-grid">
                  <div class="logistics-cell">
                    <span>Drinking Water</span>
                    <strong>${camp.waterLiters.toLocaleString("en-IN")} L</strong>
                  </div>
                  <div class="logistics-cell">
                    <span>Food Buffer</span>
                    <strong>${camp.foodRationDays} Days</strong>
                  </div>
                  <div class="logistics-cell">
                    <span>Duty Doctor</span>
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
            <h4>👨‍👩‍👧‍👦 Missing Persons & Family Reunification Portal</h4>
            <input type="text" id="registry-search-input" class="registry-search-bar" placeholder="Search by name or village..." />
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
