const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskPriorityFilter = document.getElementById('task-priority');

// Function to create a new task object
function createTaskObject(taskText, taskPriority, completed) {
  return {
    text: taskText,
    priority: taskPriority,
    completed: completed
  };
}

// Function to save tasks to local storage
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
}

// Function to render tasks from local storage
function renderTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage();
  renderTasks(tasks);
}

// Function to render tasks
function renderTasks(tasks) {
  taskList.innerHTML = '';

  for (const task of tasks) {
    const listItem = createTaskElement(task.text, task.priority, task.completed);
    taskList.appendChild(listItem);
  }
}

// Function to create a new list item
function createTaskElement(taskText, taskPriority, completed) {
  const listItem = document.createElement('li');

  const taskContainer = document.createElement('div');
  taskContainer.className = 'task-container';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', toggleTaskCompletion);

  const taskTextElement = document.createElement('span');
  taskTextElement.innerText = taskText;
  taskTextElement.className = 'task-text';

  const priorityElement = document.createElement('span');
  priorityElement.innerText = taskPriority;
  priorityElement.className = 'priority-badge';

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit';
  editButton.className = 'edit-button';

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.className = 'delete-button';

  taskContainer.appendChild(checkbox);
  taskContainer.appendChild(taskTextElement);
  taskContainer.appendChild(priorityElement);

  listItem.appendChild(taskContainer);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  editButton.addEventListener('click', editTask);
  deleteButton.addEventListener('click', deleteTask);

  return listItem;
}

function addTask(event) {
  event.preventDefault();

  const taskInput = document.getElementById('task-input');
  const taskText = taskInput.value.trim();
  const taskPriority = document.getElementById('task-priority').value;

  if (taskText !== '') {
    const listItem = createTaskElement(taskText, taskPriority, false);

    taskList.appendChild(listItem);

    taskInput.value = '';

    // Save tasks to local storage
    const tasks = getTasksFromLocalStorage();
    tasks.push(createTaskObject(taskText, taskPriority, false));
    saveTasksToLocalStorage(tasks);
  }
}

function editTask(event) {
  const listItem = event.target.parentNode;
  const taskTextElement = listItem.querySelector('.task-text');
  const taskText = taskTextElement.innerText;
  const priorityElement = listItem.querySelector('.priority-badge');
  const taskPriority = priorityElement.innerText;

  const newTaskText = prompt('Edit task:', taskText);
  const newTaskPriority = prompt('Edit priority:', taskPriority);

  if (newTaskText !== null && newTaskText.trim() !== '') {
    taskTextElement.innerText = newTaskText.trim();
  }

  if (newTaskPriority !== null && newTaskPriority.trim() !== '') {
    priorityElement.innerText = newTaskPriority.trim();
  }

  // Update tasks in local storage
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(taskList.children).indexOf(listItem);
  tasks[taskIndex].text = newTaskText.trim();
  tasks[taskIndex].priority = newTaskPriority.trim();
  saveTasksToLocalStorage(tasks);
}

function deleteTask(event) {
  const listItem = event.target.parentNode;
  taskList.removeChild(listItem);

  // Remove task from local storage
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(taskList.children).indexOf(listItem);
  tasks.splice(taskIndex, 1);
  saveTasksToLocalStorage(tasks);
}

function toggleTaskCompletion(event) {
  const listItem = event.target.parentNode.parentNode;
  listItem.classList.toggle('completed');

  // Update completion status in local storage
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(taskList.children).indexOf(listItem);
  tasks[taskIndex].completed = event.target.checked;
  saveTasksToLocalStorage(tasks);
}

// Function to filter tasks by priority
function filterTasksByPriority(tasks, priority) {
  if (priority === 'all') {
    return tasks;
  }

  return tasks.filter(task => task.priority === priority);
}

// Event listener for form submission
taskForm.addEventListener('submit', addTask);

// Event listener for priority filter changes
taskPriorityFilter.addEventListener('change', function() {
  const tasks = getTasksFromLocalStorage();
  const selectedPriority = taskPriorityFilter.value;
  const filteredTasks = filterTasksByPriority(tasks, selectedPriority);
  renderTasks(filteredTasks);
});

// Render tasks from local storage on page load
document.addEventListener('DOMContentLoaded', renderTasksFromLocalStorage);
