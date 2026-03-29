let tasks = [];

// LOAD
window.onload = function () {
    let data = localStorage.getItem("tasks");

    if (data) {
        tasks = JSON.parse(data);
        renderTable();
    }
};

// SAVE
function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD
function addTask() {

    let title = document.getElementById("title").value;
    let deadline = document.getElementById("deadline").value;
    let priority = document.getElementById("priority").value;

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

// RENDER
function renderTable() {

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

    tasks.forEach((t, i) => {
        table.innerHTML += `
            <tr>
                <td>${t.title}</td>
                <td>${t.deadline}</td>
                <td>${t.priority}</td>
                <td>
                    <input type="checkbox" 
                    ${t.completed ? "checked" : ""} 
                    onclick="toggleComplete(${i})">
                </td>
                <td>
                    <button onclick="deleteTask(${i})">Delete</button>
                </td>
            </tr>
        `;
    });
}

// SMART SUGGEST (ignores completed)
function suggestTask() {

    let best = null;
    let bestScore = Infinity;

    for (let t of tasks) {

        if (t.completed) continue;

        let days = (new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24);
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

function getPriorityValue(p) {
    if (p.toLowerCase() === "high") return 1;
    if (p.toLowerCase() === "medium") return 2;
    return 3;
}