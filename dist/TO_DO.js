let titleInput = document.getElementById("title");
let descriptionInput = document.getElementById("description");
let infoInput = document.getElementById("info");
let statusInput = document.getElementById("status");
let end_dateInput = document.getElementById("end_date");
let popup = document.getElementById("popup");
let todo = document.getElementById("todo");
let doing = document.getElementById("Doing");
let done = document.getElementById("Done");
let stat0 = document.getElementById("stat0");
let stat1 = document.getElementById("stat1");
let stat2 = document.getElementById("stat2");
let contour = document.getElementById("contour");
let allTask = document.getElementById("allTask");
let ticketsArray;


document.addEventListener("DOMContentLoaded", function (event) {
    displayTickets();
});



let contourP1 = 0;
let contourP2 = 0;
let contourP3 = 0;



// data.push(newobj);
function togglePopup() {
    const popup = document.getElementById("popup");
    popup.classList.toggle("hidden");
}

function rigex() {
    const titlePattern = /^[a-zA-Z\s]{3,30}$/;
    const descPattern = /^[a-zA-Z0-9\s.,-]{10,100}$/;

    if (!titlePattern.test(titleInput.value)) {
        showAlert(
            "Le titre doit être entre 3 et 30 caractères, seulement des lettres."
        );
        return false;
    }

    if (!descPattern.test(descriptionInput.value)) {
        showAlert(
            "La description doit être entre 10 et 100 caractères, avec seulement des lettres, chiffres, et ponctuations."
        );
        return false;
    }

    const currentDate = new Date();
    const endDate = new Date(end_dateInput.value);

    if (currentDate >= endDate || end_dateInput.value === '') {
        showAlert(
            "La date de fin doit être dans le futur par rapport à la date actuelle."
        );
        return false;
    }

    return true;
}

function addTask() {
    if (!rigex()) {
        return;
    }

    const task = {
        title: titleInput.value,
        description: descriptionInput.value,
        info: infoInput.value,
        status: statusInput.value,
        endDate: end_dateInput.value,
        id: Math.floor(Math.random() * 100) + 1,
    };

    let ticketsArray = JSON.parse(localStorage.getItem("storeTicket")) || [];
    ticketsArray.push(task);
    localStorage.setItem("storeTicket", JSON.stringify(ticketsArray));
    clearInputFields();
    showSuccessAlert();
    popup.classList.add("hidden");
    location.reload();
    togglePopup();
}

function clearInputFields() {
    titleInput.value = "";
    descriptionInput.value = "";
    infoInput.value = "";
    statusInput.value = "";
    end_dateInput.value = "";
}


function removeTask(button, id) {
    const taskElement = button.closest(".task"); 
    taskElement.classList.add("fade-out"); 

    setTimeout(() => {
        const data = localStorage.getItem("storeTicket");
        let arrayData = [];
        if (data) {
            arrayData = JSON.parse(data);
        }

        arrayData = arrayData.filter((item) => item.id !== id);
        localStorage.setItem("storeTicket", JSON.stringify(arrayData));
        taskElement.remove(); 
        location.reload(); 
    }, 500); 
}

function editTask(button, id) {
    let taskContainer = button.parentElement.parentElement;
    if (taskContainer.querySelector("select")) {
        return; 
    }

    let newSelect = `
          <select  onchange="changeColumn(this , ${id})" id="status" class="w-20 h-8 rounded-lg" name="satuts">
                        <option value="">Select status ID</option>
                        <option value="0">To Do</option>
                        <option value="1">Doing</option>
                        <option value="2">Done</option>
                    </select>
    
    `;

    const status = document.getElementById("changeColumn");
    taskContainer.insertAdjacentHTML("beforeend", newSelect);
}

function changeColumn(select, id) {
    console.log(id);
    let taskContainer = select.parentElement.parentElement;

    const storedTickets = localStorage.getItem("storeTicket");

    let ticketsArray = [];
    if (storedTickets) {
        ticketsArray = JSON.parse(storedTickets);
    }

    const specificTicket = ticketsArray.find((ticket) => ticket.id === id);

    const sv = taskContainer.querySelector("#status").value;

    specificTicket.status = sv;

    localStorage.setItem("storeTicket", JSON.stringify(ticketsArray));
    location.reload();
}

function displayTickets() {
    const dataA = localStorage.getItem("storeTicket");
    let arrayData = dataA ? JSON.parse(dataA) : [];

    arrayData.map((ticket) => {
        let borderClass = "";
        if (ticket.info === "P1") borderClass = "border-red-500";
        else if (ticket.info === "P2") borderClass = "border-orange-500";
        else if (ticket.info === "P3") borderClass = "border-green-500";

        const taskHTML = `
            <div class="task w-80 mt-6 mb-6 p-2 rounded-lg bg-white ${borderClass} border-4">
                <h1 class="font-bold mt-1 mb-3" id="ticket-title">${ticket.title}</h1>
                <p class="mt-1 mb-3 overflow-auto hide-scrollbar" id="ticket-desc">${ticket.description}</p>
                <div class="w-full flex justify-between">
                    <div class="w-10 h-6 flex justify-center items-center rounded-lg">${ticket.info}</div>
                    <div class="w-28 h-6 bg-red-300 flex justify-center items-center rounded-lg">${ticket.endDate}</div>
                </div>
                <div class="flex justify-around mt-4">
                    <button class="bg-blue-300 w-20 rounded-lg ml-2 font-medium" onclick="editTask(this, ${ticket.id})">Edit</button>
                    <button class="bg-red-600 w-20 rounded-lg ml-2 font-medium" onclick="removeTask(this, ${ticket.id})">Delete</button>
                </div>
            </div>
        `;

        if (ticket.status === "0") todo.insertAdjacentHTML("beforeend", taskHTML);
        else if (ticket.status === "1") doing.insertAdjacentHTML("beforeend", taskHTML);
        else if (ticket.status === "2") done.insertAdjacentHTML("beforeend", taskHTML);
    });

    arrayData.forEach((task) => {
        if (task.info == "P1") contourP1++;
        else if (task.info == "P2") contourP2++;
        else if (task.info == "P3") contourP3++;
    });

    stat0.innerHTML = contourP1;
    stat1.innerHTML = contourP2;
    stat2.innerHTML = contourP3;
    contour.innerHTML = arrayData.length;
}


//Animation
function showAlert(message) {
    const alertBox = document.getElementById("alert-box");
    const alertMessage = document.getElementById("alert-message");

    alertMessage.textContent = message;
    alertBox.classList.remove("hidden", "fade-out");
    alertBox.classList.add("fade-in");

    setTimeout(() => {
        alertBox.classList.remove("fade-in");
        alertBox.classList.add("fade-out");

        setTimeout(() => {
            alertBox.classList.add("hidden");
        }, 500);
    }, 3000);
}

function showSuccessAlert() {
    const alertBox = document.getElementById("success-alert");
    alertBox.classList.remove("hidden");
    alertBox.classList.add("fade-in");

    setTimeout(() => {
        alertBox.classList.replace("fade-in", "fade-out");
        setTimeout(() => alertBox.classList.add("hidden"), 500);
    }, 3000);
}
