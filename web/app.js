class TodoApp {
  constructor() {
    this.todos = [];
    this.currentFilter = 'all';
    this.storageKey = 'medai_todos';

    this.todoInput = document.getElementById('todoInput');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.emptyState = document.getElementById('emptyState');
    this.clearBtn = document.getElementById('clearBtn');
    this.deleteAllBtn = document.getElementById('deleteAllBtn');
    this.totalCount = document.getElementById('totalCount');
    this.completedCount = document.getElementById('completedCount');
    this.remainingCount = document.getElementById('remainingCount');
    this.filterBtns = document.querySelectorAll('.filter-btn');

    this.init();
  }

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.addBtn.addEventListener('click', () => this.addTodo());
    this.todoInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.addTodo();
    });

    this.filterBtns.forEach((button) => {
      button.addEventListener('click', () => {
        this.currentFilter = button.dataset.filter;
        this.filterBtns.forEach((btn) => btn.classList.toggle('active', btn === button));
        this.render();
      });
    });

    this.clearBtn.addEventListener('click', () => this.clearCompleted());
    this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
  }

  addTodo() {
    const text = this.todoInput.value.trim();

    if (!text) {
      this.showStatus('Введите текст задачи', 'warning');
      return;
    }

    if (text.length > 200) {
      this.showStatus('Максимум 200 символов', 'warning');
      return;
    }

    this.todos.unshift({
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    });

    this.todoInput.value = '';
    this.saveToStorage();
    this.render();
    this.showStatus('Задача добавлена', 'success');
  }

  toggleTodo(id) {
    const todo = this.todos.find((item) => item.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;
    this.saveToStorage();
    this.render();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((item) => item.id !== id);
    this.saveToStorage();
    this.render();
    this.showStatus('Задача удалена', 'info');
  }

  clearCompleted() {
    const completedCount = this.todos.filter((item) => item.completed).length;
    if (completedCount === 0) {
      this.showStatus('Нет завершённых задач', 'info');
      return;
    }

    if (window.confirm(`Удалить ${completedCount} завершённых задач?`)) {
      this.todos = this.todos.filter((item) => !item.completed);
      this.saveToStorage();
      this.render();
      this.showStatus('Завершённые задачи удалены', 'success');
    }
  }

  deleteAll() {
    if (this.todos.length === 0) {
      this.showStatus('Список уже пуст', 'info');
      return;
    }

    if (window.confirm('Удалить все задачи?')) {
      this.todos = [];
      this.saveToStorage();
      this.render();
      this.showStatus('Все задачи удалены', 'success');
    }
  }

  getFilteredTodos() {
    if (this.currentFilter === 'active') {
      return this.todos.filter((item) => !item.completed);
    }

    if (this.currentFilter === 'completed') {
      return this.todos.filter((item) => item.completed);
    }

    return this.todos;
  }

  render() {
    const filtered = this.getFilteredTodos();
    this.todoList.innerHTML = '';

    if (this.todos.length === 0) {
      this.emptyState.style.display = 'block';
      this.emptyState.querySelector('p:last-child').textContent = 'Добавьте первую задачу для начала работы.';
    } else {
      this.emptyState.style.display = 'none';
    }

    if (filtered.length === 0 && this.todos.length > 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'todo-item empty-item';
      emptyItem.textContent = 'Нет задач в этой категории';
      this.todoList.appendChild(emptyItem);
    }

    filtered.forEach((todo) => {
      const item = document.createElement('li');
      item.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = 'Удалить';
      deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));

      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(deleteButton);
      this.todoList.appendChild(item);
    });

    this.updateStats();
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((item) => item.completed).length;
    const remaining = total - completed;

    this.totalCount.textContent = String(total);
    this.completedCount.textContent = String(completed);
    this.remainingCount.textContent = String(remaining);
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Ошибка сохранения', error);
      this.showStatus('Не удалось сохранить данные', 'warning');
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      this.todos = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Ошибка загрузки', error);
      this.todos = [];
    }
  }

  showStatus(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `toast ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    window.setTimeout(() => notification.remove(), 2600);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.medAIApp = new TodoApp();
});
