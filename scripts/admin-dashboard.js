const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "../../pages/user authorization/2_sign_in_admin_account.html";
}

function getPets() {
    return JSON.parse(localStorage.getItem("pets")) || [];
}

function savePets(pets) {
    localStorage.setItem("pets", JSON.stringify(pets));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

const path = window.location.pathname;

const overviewPage = path.includes("1_overview.html");
const userPage = path.includes("2_user_management.html");
const petPage = path.includes("3_pet_records.html");

if (overviewPage) {
    const pets = getPets();

    let dogs = 0, cats = 0, others = 0;

    pets.forEach(p => {
        const s = p.species.toLowerCase();
        if (s.includes("dog")) dogs++;
        else if (s.includes("cat")) cats++;
        else others++;
    });

    document.getElementById("dog-count").textContent = dogs;
    document.getElementById("cat-count").textContent = cats;
    document.getElementById("others-count").textContent = others;

  const pendingList = document.getElementById("pending-list");

    const pendingPets = pets.filter(p => p.registrationStatus === "Pending");

    pendingList.innerHTML = "";

    pendingPets.slice(0, 5).forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} (${p.species}) - ${p.registrationID}`;
        pendingList.appendChild(li);
    });

  const overdueList = document.getElementById("overdue-list");

    const now = new Date();

    const overduePets = pets.filter(p => {
        const regDate = new Date(p.registeredAt);
        regDate.setFullYear(regDate.getFullYear() + 1);
        return regDate < now;
    });

    overdueList.innerHTML = "";

    overduePets.slice(0, 5).forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - OVERDUE`;
        overdueList.appendChild(li);
    });
}

if (userPage) {
    const users = getUsers();
    const pets = getPets();

    const tbody = document.getElementById("userTableBody");

    tbody.innerHTML = "";

    users.forEach(user => {
        const userPets = pets.filter(p => p.ownerID === user.userID);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${user.lastName}, ${user.firstName}</td>
            <td>${user.userID}</td>
            <td>${user.email}</td>
            <td>${user.contactNumber || ""}</td>
            <td>${userPets.length}</td>
            <td><button onclick="selectUser('${user.userID}')">View</button></td>
        `;

        tbody.appendChild(tr);
    });

    window.selectUser = function(userID) {
        const user = users.find(u => u.userID === userID);
        const userPets = pets.filter(p => p.ownerID === userID);

        document.getElementById("userid").textContent = user.userID;
        document.getElementById("useremail").textContent = user.email;
        document.getElementById("usercontact").textContent = user.contactNumber;

        const petList = document.getElementById("userpets");
        petList.innerHTML = "";

        userPets.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} (${p.registrationStatus})`;
            petList.appendChild(li);
        });

        if (userPets[0]) {
            document.getElementById("petregid").textContent = userPets[0].registrationID;
            document.getElementById("petstatus").textContent = userPets[0].registrationStatus;
        }
    };
}

if (petPage) {
    const pets = getPets();

    const tbody = document.getElementById("petTableBody");

    tbody.innerHTML = "";

    pets.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.ownerID}</td>
            <td>${p.registrationID}</td>
            <td>${p.name}</td>
            <td>${p.species}</td>
            <td>${p.registrationStatus}</td>
            <td>
                <button onclick="viewPet('${p.petID}')">View</button>
                <button onclick="approvePet('${p.petID}')">Approve</button>
                <button onclick="deletePet('${p.petID}')">Delete</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    window.viewPet = function(petID) {
        const pet = pets.find(p => p.petID === petID);

        document.getElementById("petage").textContent = pet.age;
        document.getElementById("petspecies").textContent = pet.species;
        document.getElementById("petbreed").textContent = pet.breed;
        document.getElementById("petbirthday").textContent = pet.birthday;

        document.getElementById("petregid").textContent = pet.registrationID;
        document.getElementById("petstatus").textContent = pet.registrationStatus;
        document.getElementById("petnotes").textContent = pet.notes;

        document.getElementById("petmedical").textContent = pet.vaccinated;
        document.getElementById("petmore").textContent = pet.neutered;
    };

  window.approvePet = function(petID) {
        const updated = pets.map(p => {
            if (p.petID === petID) {
                p.registrationStatus = "Approved";
            }
            return p;
        });

        savePets(updated);
        alert("Pet approved!");
        location.reload();
    };

    window.deletePet = function(petID) {
        if (!confirm("Delete this pet?")) return;

        const updated = pets.filter(p => p.petID !== petID);
        savePets(updated);

        alert("Pet deleted!");
        location.reload();
    };
}

const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "../../pages/user authorization/2_sign_in_admin_account.html";
    });
}

/* PENDING APPROVAL JS */

<script>
  
  function logout() {
    window.location.href = "../index.html";
  }
  const data = {
    "new-reg": [
      { date: "MM-DD-YYYY", uid: "UID", name: "PET'S NAME", mf: "F", species: "CAT", breed: "PET'S BREED", birthday: "N/A", age: 1 },
      { date: "MM-DD-YYYY", uid: "UID", name: "PET'S NAME", mf: "M", species: "DOG", breed: "PET'S BREED", birthday: "N/A", age: 2 },
    ],
    "for-renewal": [
      { date: "MM-DD-YYYY", uid: "UID", name: "PET'S NAME", mf: "F", species: "CAT", breed: "PET'S BREED", birthday: "N/A", age: 1 },
      { date: "MM-DD-YYYY", uid: "UID", name: "PET'S NAME", mf: "M", species: "DOG", breed: "PET'S BREED", birthday: "N/A", age: 2 },
    ],
    "pet-info": [
      { date: "MM-DD-YYYY", uid: "UID", name: "PET'S NAME", mf: "F", species: "CAT", breed: "PET'S BREED", birthday: "N/A", age: 1 },
      { date: "MM-DD-YYYY", uid: "UID", name: "PET'S NAME", mf: "M", species: "DOG", breed: "PET'S BREED", birthday: "N/A", age: 2 },
    ]
  };

  function renderRows(tabId) {
    const tbody = document.getElementById(tabId + "-body");
    const rows = data[tabId];
    tbody.innerHTML = rows.map((pet, index) => `
      <tr>
        <td>${pet.date}</td>
        <td>${pet.uid}</td>
        <td><span class="view-link">VIEW</span></td>
        <td>${pet.name}</td>
        <td>${pet.mf}</td>
        <td>${pet.species}</td>
        <td>${pet.breed}</td>
        <td>${pet.birthday}</td>
        <td>${pet.age}</td>
        <td><span class="view-link">VIEW</span></td>
        <td><span class="view-link">VIEW</span></td>
        <td><button class="btn-reject" onclick="handleAction('${tabId}', ${index}, 'reject')">REJECT</button></td>
        <td><button class="btn-approve" onclick="handleAction('${tabId}', ${index}, 'approve')">APPROVE</button></td>
      </tr>
    `).join("");
  }

  function handleAction(tabId, index, action) {
    const pet = data[tabId][index];
    if (action === "approve") {
      alert(`Approved: ${pet.name} (${pet.species})`);
    } else {
      alert(`Rejected: ${pet.name} (${pet.species})`);
    }
    data[tabId].splice(index, 1);
    renderRows(tabId);
  }
  
  function switchTab(id, clickedTab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    clickedTab.classList.add('active');
  }

  renderRows("new-reg");
  renderRows("for-renewal");
  renderRows("pet-info");
</script>
