/**
 * MedAI - Medical Task Management System
 * Web Application JavaScript Logic
 * Author: Landser
 * License: MIT
 */

// ========================================
// 📦 Application State Management
// ========================================

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'medai_todos';
        
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.clearBtn = document.getElementById('clearBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.remainingCount = document.getElementById('remainingCount');
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
        console.log('✅ MedAI application initialized');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Actions
        this.clearBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());

        // Input focus
        this.todoInput.addEventListener('focus', () => {
            this.todoInput.parentElement.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        });

        this.todoInput.addEventListener('blur', () => {
            this.todoInput.parentElement.style.boxShadow = 'none';
        });
    }

    /**
     * Add new todo
     */
    addTodo() {
        const text = this.todoInput.value.trim();

        if (!text) {
            this.showNotification('⚠️ Введите текст задачи', 'warning');
            return;
        }

        if (text.length > 200) {
            this.showNotification('⚠️ Максимум 200 символов', 'warning');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: 'normal'
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.todoInput.focus();
        this.saveToStorage();
        this.render();
        this.showNotification('✅ Задача добавлена', 'success');
    }

    /**
     * Toggle todo completion status
     */
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    /**
     * Delete todo
     */
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        this.showNotification('🗑️ Задача удалена', 'info');
    }

    /**
     * Clear all completed todos
     */
    clearCompleted() {
        const completed = this.todos.filter(t => t.completed).length;
        if (completed === 0) {
            this.showNotification('ℹ️ Нет завершённых задач', 'info');
            return;
        }

        if (confirm(`🤔 Удалить ${completed} завершённую задачу?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
            this.showNotification(`✅ Удалено ${completed} задач`, 'success');
        }
    }

    /**
     * Delete all todos
     */
    deleteAll() {
        if (this.todos.length === 0) {
            this.showNotification('ℹ️ Список уже пуст', 'info');
            return;
        }

        if (confirm('⚠️ Это удалит ВСЕ задачи! Вы уверены?')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
            this.showNotification('✅ Все задачи удалены', 'success');
        }
    }

    /**
     * Set active filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    /**
     * Get filtered todos based on current filter
     */
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    /**
     * Update statistics
     */
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        this.totalCount.textContent = total;
        this.completedCount.textContent = completed;
        this.remainingCount.textContent = remaining;

        // Update remaining counter visibility
        if (remaining > 0) {
            this.remainingCount.parentElement.style.color = '#ef4444';
        } else if (total > 0) {
            this.remainingCount.parentElement.style.color = '#22c55e';
        }
    }

    /**
     * Main render function
     */
    render() {
        this.updateStats();
        
        const filtered = this.getFilteredTodos();
        
        // Clear list
        this.todoList.innerHTML = '';

        // Show/hide empty state
        if (this.todos.length === 0) {
            this.emptyState.classList.add('show');
            return;
        } else {
            this.emptyState.classList.remove('show');
        }

        // Show filtered empty state
        if (filtered.length === 0) {
            const emptyMsg = document.createElement('li');
            emptyMsg.className = 'todo-item';
            emptyMsg.innerHTML = `
                <p style="text-align: center; width: 100%; color: #6b7280;">
                    📭 Нет задач в этой категории
                </p>
            `;
            this.todoList.appendChild(emptyMsg);
            return;
        }

        // Render todos
        filtered.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.id = `todo-${todo.id}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">Удалить</button>
            `;

            // Add event listeners
            const checkbox = li.querySelector('.todo-checkbox');
            const deleteBtn = li.querySelector('.delete-btn');

            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });
    }

    /**
     * Save todos to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
            console.log('💾 Данные сохранены в localStorage');
        } catch (error) {
            console.error('❌ Ошибка при сохранении:', error);
            this.showNotification('❌ Ошибка при сохранении данных', 'error');
        }
    }

    /**
     * Load todos from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.todos = JSON.parse(stored);
                console.log(`📂 Загружено ${this.todos.length} задач из localStorage`);
            }
        } catch (error) {
            console.error('❌ Ошибка при загрузке:', error);
            this.todos = [];
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#2563eb'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Export todos as JSON
     */
    exportData() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `medai-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        this.showNotification('📥 Данные экспортированы', 'success');
    }

    /**
     * Import todos from JSON
     */
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.todos = imported;
                    this.saveToStorage();
                    this.render();
                    this.showNotification('📤 Данные импортированы', 'success');
                }
            } catch (error) {
                console.error('❌ Ошибка при импорте:', error);
                this.showNotification('❌ Ошибка при импорте файла', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// ========================================
// 🚀 Application Initialization
// ========================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
    
    // Add keyboard shortcuts info
    console.log(`
    🏥 MedAI - Медицинское приложение для управления задачами
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    ⌨️  Сочетания клавиш:
    • Enter - добавить новую задачу
    • Ctrl/Cmd + E - экспортировать данные
    
    📚 Версия: 1.0.0
    👨‍💻 Автор: Landser
    📝 Лицензия: MIT
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

// ========================================
// 🎨 CSS Animations
// ========================================

const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(animationStyles);

// ========================================
// 🔧 Service Worker Registration (PWA)
// ========================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('✅ Service Worker зарегистрирован'))
        .catch(err => console.log('ℹ️ Service Worker не требуется:', err));
}
