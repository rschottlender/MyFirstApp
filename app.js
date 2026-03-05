// Aura Mobile App - Logic & State Management

const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');

// Initial state from localStorage
let tasks = JSON.parse(localStorage.getItem('aura_tasks')) || [
  { id: 1, text: 'Planificar mi día ✨', completed: true },
  { id: 2, text: 'Hacer ejercicio 🏋️', completed: false },
  { id: 3, text: 'Leer 10 páginas 📖', completed: false }
];

// Initialize Lucide Icons
function initIcons() {
  lucide.createIcons();
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';
  
  tasks.sort((a, b) => a.completed - b.completed).forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card fade-in ${task.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})">
        ${task.completed ? '<i data-lucide="check" style="width: 14px; color: white"></i>' : ''}
      </div>
      <div class="task-text" onclick="toggleTask(${task.id})">${task.text}</div>
      <div class="task-delete" onclick="deleteTask(${task.id})" style="color: var(--text-muted); cursor: pointer;">
        <i data-lucide="x" style="width: 18px;"></i>
      </div>
    `;
    taskList.appendChild(card);
  });
  
  initIcons();
  saveTasks();
}

// Actions
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
    
    // Add micro-animation effect to button
    addBtn.style.transform = 'translateY(-50%) scale(0.9)';
    setTimeout(() => addBtn.style.transform = 'translateY(-50%) scale(1)', 100);
  }
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTasks();
}

function deleteTask(id) {
  // Simple fade-out before removal (CSS handled)
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('aura_tasks', JSON.stringify(tasks));
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});
