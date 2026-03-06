// Aura Mobile App - Logic & State Management

const taskList = document.getElementById('task-list');
const historyList = document.getElementById('history-list');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const toggleHistoryBtn = document.getElementById('toggle-history');
const mainView = document.getElementById('main-view');
const historyView = document.getElementById('history-view');

let isHistoryVisible = false;

// Initial state from localStorage with migration
let tasks = JSON.parse(localStorage.getItem('aura_tasks')) || [];
tasks = tasks.map(t => ({
  ...t,
  createdAt: t.createdAt || new Date().toISOString(),
  status: t.status || (t.archived ? 'archived' : 'active'),
  completedAt: t.completedAt || null
}));

// Format date and time (Stacks Date over Time)
function formatDateTimeHTML(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `<span>${day}/${month}/${year}</span><span>${time}</span>`;
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = '';
  historyList.innerHTML = '';

  const activeTasks = tasks.filter(t => t.status === 'active');
  const archivedTasks = tasks.filter(t => t.status === 'archived');

  // Sort active: uncompleted first, then by date
  activeTasks.sort((a, b) => a.completed - b.completed || new Date(b.createdAt) - new Date(a.createdAt));
  // Sort archived: by completion date
  archivedTasks.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

  activeTasks.forEach(task => {
    const card = createTaskCard(task, false);
    taskList.appendChild(card);
  });

  archivedTasks.forEach(task => {
    const card = createTaskCard(task, true);
    historyList.appendChild(card);
  });

  lucide.createIcons();
  saveTasks();
}

function createTaskCard(task, isArchived) {
  const card = document.createElement('div');
  card.className = `task-card fade-in ${task.completed ? 'completed' : ''}`;

  card.innerHTML = `
    <div class="timestamp start">${formatDateTimeHTML(task.createdAt)}</div>
    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="event.stopPropagation(); toggleTask(${task.id})">
      ${task.completed ? '<i data-lucide="check" style="width: 12px; color: white"></i>' : ''}
    </div>
    <div class="task-text" onclick="toggleTask(${task.id})">${task.text}</div>
    <div class="timestamp end">${task.completedAt ? formatDateTimeHTML(task.completedAt) : ''}</div>
    <div class="task-actions">
      ${!isArchived ? `
        <button class="btn-icon" onclick="event.stopPropagation(); archiveTask(${task.id})">
          <i data-lucide="archive" style="width: 16px;"></i>
        </button>
      ` : ''}
      <button class="btn-icon" onclick="event.stopPropagation(); deleteTask(${task.id})">
        <i data-lucide="trash-2" style="width: 16px;"></i>
      </button>
    </div>
  `;
  return card;
}

// Actions
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'active'
    };
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();

    addBtn.style.transform = 'translateY(-50%) scale(0.9)';
    setTimeout(() => addBtn.style.transform = 'translateY(-50%) scale(1)', 100);
  }
}

function toggleTask(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      const completed = !t.completed;
      return {
        ...t,
        completed,
        completedAt: completed ? new Date().toISOString() : null
      };
    }
    return t;
  });
  renderTasks();
}

function archiveTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, status: 'archived' } : t);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

function toggleHistoryView() {
  isHistoryVisible = !isHistoryVisible;
  mainView.classList.toggle('hidden', isHistoryVisible);
  historyView.classList.toggle('hidden', !isHistoryVisible);
  toggleHistoryBtn.classList.toggle('active', isHistoryVisible);
  toggleHistoryBtn.querySelector('span').textContent = isHistoryVisible ? 'Volver' : 'Ver Historial';
  lucide.createIcons();
}

function saveTasks() {
  localStorage.setItem('aura_tasks', JSON.stringify(tasks));
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});
toggleHistoryBtn.addEventListener('click', toggleHistoryView);

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});
