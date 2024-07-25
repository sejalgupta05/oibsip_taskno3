document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const pendingList = document.getElementById('pendingList');
    const completedList = document.getElementById('completedList');

    function createTaskElement(taskText, createdAt) {
        const li = document.createElement('li');
        const timestamp = new Date(createdAt).toLocaleString();
        li.innerHTML = `
            <span>${taskText} <small>(${timestamp})</small></span>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        return li;
    }

    function addTask(taskText) {
        const createdAt = new Date().toISOString();
        const taskElement = createTaskElement(taskText, createdAt);
        pendingList.appendChild(taskElement);
        saveTasks();
    }

    function handleTaskAction(e) {
        const target = e.target;
        const li = target.closest('li');
        const taskText = li.querySelector('span').textContent;

        if (target.classList.contains('complete-btn')) {
            completedList.appendChild(li);
            li.classList.add('completed');
        } else if (target.classList.contains('edit-btn')) {
            const newTaskText = prompt('Edit task:', taskText);
            if (newTaskText) {
                li.querySelector('span').innerHTML = `${newTaskText} <small>(${new Date().toLocaleString()})</small>`;
                saveTasks();
            }
        } else if (target.classList.contains('delete-btn')) {
            li.remove();
        }
        saveTasks();
    }

    function saveTasks() {
        const pendingTasks = Array.from(pendingList.children).map(li => ({
            text: li.querySelector('span').textContent.trim(),
            completed: false,
            createdAt: li.querySelector('small').textContent.slice(1, -1)
        }));
        const completedTasks = Array.from(completedList.children).map(li => ({
            text: li.querySelector('span').textContent.trim(),
            completed: true,
            createdAt: li.querySelector('small').textContent.slice(1, -1)
        }));
        localStorage.setItem('tasks', JSON.stringify({ pendingTasks, completedTasks }));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || { pendingTasks: [], completedTasks: [] };
        tasks.pendingTasks.forEach(task => {
            const taskElement = createTaskElement(task.text, task.createdAt);
            if (task.completed) {
                taskElement.classList.add('completed');
                completedList.appendChild(taskElement);
            } else {
                pendingList.appendChild(taskElement);
            }
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    document.addEventListener('click', handleTaskAction);

    loadTasks();
});
