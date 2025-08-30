document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');

  let dragSrcEl = null;

  // Load saved todos from localStorage
  let todos = [];
  if (localStorage.getItem('todos')) {
    try {
      todos = JSON.parse(localStorage.getItem('todos'));
      todos.forEach(todo => {
        createTodoElement(todo.text);
      });
    } catch(e) {
      localStorage.removeItem('todos');
    }
  }

  // Save todos to localStorage
  function saveTodos() {
    const currentTodos = [];
    todoList.querySelectorAll('.todo-item').forEach(item => {
      currentTodos.push({ text: item.querySelector('.todo-text').textContent });
    });
    localStorage.setItem('todos', JSON.stringify(currentTodos));
  }

  // Create a todo list item
  function createTodoElement(text) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.setAttribute('draggable', 'true');
    li.setAttribute('tabindex', '0');

    const span = document.createElement('span');
    span.classList.add('todo-text');
    span.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.classList.add('delete-btn');
    delBtn.setAttribute('aria-label', 'Supprimer la tâche');
    delBtn.textContent = '×';

    delBtn.addEventListener('click', () => {
      li.remove();
      saveTodos();
    });

    li.appendChild(span);
    li.appendChild(delBtn);

    // Drag & Drop events
    li.addEventListener('dragstart', (e) => {
      dragSrcEl = li;
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', li.outerHTML);
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    li.addEventListener('drop', (e) => {
      e.stopPropagation();
      if (dragSrcEl !== li) {
        todoList.removeChild(dragSrcEl);
        const dropHTML = e.dataTransfer.getData('text/html');
        li.insertAdjacentHTML('beforebegin', dropHTML);
        const dropElem = li.previousSibling;
        addDnDHandlers(dropElem);
        saveTodos();
      }
      return false;
    });

    todoList.appendChild(li);
  }

  function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', (e) => {
      dragSrcEl = elem;
      elem.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', elem.outerHTML);
    });

    elem.addEventListener('dragend', () => {
      elem.classList.remove('dragging');
    });

    elem.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    elem.addEventListener('drop', (e) => {
      e.stopPropagation();
      if (dragSrcEl !== elem) {
        todoList.removeChild(dragSrcEl);
        const dropHTML = e.dataTransfer.getData('text/html');
        elem.insertAdjacentHTML('beforebegin', dropHTML);
        const dropElem = elem.previousSibling;
        addDnDHandlers(dropElem);
        saveTodos();
      }
      return false;
    });

    // Delete button handler
    const deleteBtn = elem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      elem.remove();
      saveTodos();
    });
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text.length > 0) {
      createTodoElement(text);
      saveTodos();
      todoInput.value = '';
      todoInput.focus();
    }
  });

});