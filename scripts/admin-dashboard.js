// 🔐 AUTH CHECK
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
  window.location.href = "../../pages/user authorization/2_sign_in_admin_account.html";
}

// 📦 STORAGE HELPERS
function getPets() {
  return JSON.parse(localStorage.getItem("pets")) || [];
}

function savePets(pets) {
  localStorage.setItem("pets", JSON.stringify(pets));
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// ==========================
// 📊 OVERVIEW DASHBOARD
// ==========================
function renderOverview() {
  const pets = getPets();

  let dogs = 0, cats = 0, others = 0;
  let newReg = 0, renewal = 0, overdue = 0;

  const today = new Date();

  pets.forEach(pet => {
    // species
    if (pet.species === "Dog") dogs++;
    else if (pet.species === "Cat") cats++;
    else others++;

    // type
    if (pet.registrationType === "New") newReg++;
    if (pet.registrationType === "Renewal") renewal++;

    // overdue
    const regDate = new Date(pet.dateRegistered);
    const diff = (today - regDate) / (1000 * 60 * 60 * 24);
    if (diff > 365) overdue++;
  });

  // update UI safely
  setText("dog-count", dogs);
  setText("cat-count", cats);
  setText("others-count", others);
  setText("newreg-count", newReg);
  setText("renewal-count", renewal);
  setText("overdue-count", overdue);
}

// ==========================
// 📋 PENDING LIST (RIGHT PANEL)
// ==========================
function renderPending() {
  const list = document.getElementById("pending-list");
  if (!list) return;

  const pets = getPets().filter(p => p.registrationStatus === "Pending");

  list.innerHTML = "";

  pets.slice(0, 5).forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.petName} (${p.ownerName})`;
    list.appendChild(li);
  });
}

// ==========================
// ⏰ OVERDUE LIST
// ==========================
function renderOverdue() {
  const list = document.getElementById("overdue-list");
  if (!list) return;

  const today = new Date();

  const pets = getPets().filter(p => {
    const d = new Date(p.dateRegistered);
    return (today - d) / (1000 * 60 * 60 * 24) > 365;
  });

  list.innerHTML = "";

  pets.slice(0, 5).forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.petName} (${p.ownerName})`;
    list.appendChild(li);
  });
}

// ==========================
// 📄 PET RECORDS TABLE
// ==========================
function renderPetRecords() {
  const tbody = document.getElementById("petTableBody");
  if (!tbody) return;

  const pets = getPets();
  tbody.innerHTML = "";

  pets.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.ownerID}</td>
        <td>${p.petID}</td>
        <td>${p.petName}</td>
        <td>${p.species}</td>
        <td>${p.registrationStatus}</td>
        <td>VIEW</td>
      </tr>
    `;
  });
}

// ==========================
// 👥 USER MANAGEMENT
// ==========================
function renderUserTable() {
  const tbody = document.getElementById("userTableBody");
  if (!tbody) return;

  const users = getUsers();
  tbody.innerHTML = "";

  users.forEach(u => {
    tbody.innerHTML += `
      <tr>
        <td>${u.userID}</td>
        <td>${u.email}</td>
        <td>${u.role || "user"}</td>
      </tr>
    `;
  });
}

// ==========================
// 📋 PENDING TABLE PAGE
// ==========================
function renderPendingTable() {
  const tbody = document.getElementById("new-registration-tbody");
  if (!tbody) return;

  const pets = getPets().filter(p => p.registrationStatus === "Pending");

  tbody.innerHTML = "";

  pets.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.dateRegistered}</td>
        <td>${p.ownerID}</td>
        <td>${p.petName}</td>
        <td>${p.gender}</td>
        <td>${p.species}</td>
        <td>${p.breed}</td>
        <td>${p.birthday}</td>
        <td>${p.age}</td>
        <td>
          <button class="approve-btn" data-id="${p.petID}">✔</button>
          <button class="reject-btn" data-id="${p.petID}">✖</button>
        </td>
      </tr>
    `;
  });
}

// ==========================
// ✅ APPROVE / REJECT
// ==========================
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("approve-btn")) {
    updatePetStatus(e.target.dataset.id, "Approved");
  }

  if (e.target.classList.contains("reject-btn")) {
    updatePetStatus(e.target.dataset.id, "Rejected");
  }
});

function updatePetStatus(id, status) {
  let pets = getPets();

  pets = pets.map(p => {
    if (p.petID === id) {
      p.registrationStatus = status;
    }
    return p;
  });

  savePets(pets);

  renderPendingTable();
  renderOverview();
  renderPending();
}

// ==========================
// 🔍 SEARCH (WORKS ON TABLES)
// ==========================
function setupSearch(inputId, tableId) {
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);

  if (!input || !table) return;

  input.addEventListener("keyup", () => {
    const val = input.value.toLowerCase();
    const rows = table.getElementsByTagName("tr");

    Array.from(rows).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(val)
        ? ""
        : "none";
    });
  });
}

// ==========================
// 🔃 SIMPLE SORT
// ==========================
function sortTable(tableId, colIndex) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = Array.from(table.rows).slice(1);

  rows.sort((a, b) => {
    return a.cells[colIndex].innerText.localeCompare(
      b.cells[colIndex].innerText
    );
  });

  rows.forEach(row => table.appendChild(row));
}

// ==========================
// 🧠 HELPER
// ==========================
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// ==========================
// 🚀 PAGE ROUTER (CLEAN)
// ==========================
const page = window.location.pathname;

if (page.includes("1_overview.html")) {
  renderOverview();
  renderPending();
  renderOverdue();
}

if (page.includes("2_user_management.html")) {
  renderUserTable();
}

if (page.includes("3_pet_records.html")) {
  renderPetRecords();
}

if (page.includes("pending")) {
  renderPendingTable();
}
