let tasks = [];

// LOAD DATA
window.onload = function () {
    let data = localStorage.getItem("tasks");

    if (data) {
        tasks = JSON.parse(data);
        renderTable();
    }
};

// SAVE DATA
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
function addTask() {

    let title = document.getElementById("title").value;
    let deadline = document.getElementById("deadline").value;
    let priority = document.getElementById("priority").value;

    if (!title || !deadline) {
        alert("Please fill all fields!");
        return;
    }

    let task = {
        title,
        deadline,
        priority,
        completed: false
    };

    tasks.push(task);

    saveData();
    renderTable();
}

// DELETE
function deleteTask(index) {
    tasks.splice(index, 1);

    saveData();
    renderTable();
}

// TOGGLE COMPLETE
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;

    saveData();
    renderTable();
}

function renderTable(data = tasks) {

    let table = document.getElementById("table");

    table.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Completed</th>
            <th>Action</th>
        </tr>
    `;

    data.forEach((t, i) => {

        let priorityClass = t.priority.toLowerCase();

        // 🔥 Deadline logic (FIXED)
        let days = (new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24);

        let warning = "";
        if (days < 0) {
            warning = " 🔴 Overdue";
        } else if (days <= 2) {
            warning = " ⚠️ Due Soon";
        }

        table.innerHTML += `
            <tr>
                <td>${t.title}</td>
                <td>${t.deadline} ${warning}</td>
                <td class="${priorityClass}">${t.priority}</td>
                <td>
                    <input type="checkbox" 
                    ${t.completed ? "checked" : ""} 
                    onclick="toggleComplete(${i})">
                </td>
                <td>
                    <button onclick="editTask(${i})">Edit</button>
                    <button onclick="deleteTask(${i})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// FILTERS
function showAll() {
    renderTable(tasks);
}

function showCompleted() {
    let filtered = tasks.filter(t => t.completed);
    renderTable(filtered);
}

function showPending() {
    let filtered = tasks.filter(t => !t.completed);
    renderTable(filtered);
}

// SMART SUGGEST
function suggestTask() {

    let best = null;
    let bestScore = Infinity;

    for (let t of tasks) {

        if (t.completed) continue;

        let days = Math.floor((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        let priority = getPriorityValue(t.priority);

        let score = priority * 10 + days;

        if (score < bestScore) {
            bestScore = score;
            best = t;
        }
    }

    if (best) {
        alert("👉 Study: " + best.title);
    } else {
        alert("No pending tasks!");
    }
}

// PRIORITY VALUE
function getPriorityValue(p) {
    if (p.toLowerCase() === "high") return 1;
    if (p.toLowerCase() === "medium") return 2;
    return 3;
}
function searchTask() {

    let keyword = document.getElementById("search").value.toLowerCase();

    let filtered = tasks.filter(t =>
        t.title.toLowerCase().includes(keyword)
    );

    renderTable(filtered);
}
function editTask(index) {

    let t = tasks[index];

    let newTitle = prompt("Edit title:", t.title);
    let newDeadline = prompt("Edit deadline (YYYY-MM-DD):", t.deadline);
    let newPriority = prompt("Edit priority (High/Medium/Low):", t.priority);

    if (newTitle && newDeadline && newPriority) {
        tasks[index] = {
            ...t,
            title: newTitle,
            deadline: newDeadline,
            priority: newPriority
        };

        saveData();
        renderTable();
    }
}