const API_URL = "http://localhost:3000/todo";
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

// 1. Fetch all todos from backend
async function fetchTodos() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTodos(data.todo || data.todos || []);
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

// 2. Render todos on screen
function renderTodos(todos) {
    todoList.innerHTML = "";
    todos.forEach(todo => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${todo.title}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="editTodo(${todo.id}, '${todo.title}')">Edit</button>
                <button onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// 3. Add new todo
async function addTodo() {
    const title = todoInput.value.trim();
    if (!title) return alert("Kuch likho to sahi!");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            todoInput.value = "";
            fetchTodos(); 
        }
    } catch (error) {
        console.error("Error adding todo:", error);
    }
}

// 4. Delete  todo
async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) fetchTodos();
    } catch (error) {
        console.error("Error deleting todo:", error);
    }
}

// 5. Edit  todo
async function editTodo(id, currentTitle) {
    const newTitle = prompt("Edit your todo:", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim() })
        });
        if (response.ok) fetchTodos();
    } catch (error) {
        console.error("Error editing todo:", error);
    }
}

// Event Listeners
addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

// Load todos on start
window.addEventListener("DOMContentLoaded", fetchTodos);