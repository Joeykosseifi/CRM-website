document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.forms['form1'];
    const taskTable = document.querySelector('.task-table');

    // Load tasks from local storage on page load
    loadTasks();

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;
        const taskDate = document.getElementById('task-date').value;
        const taskPriority = document.getElementById('task-priority').value;
        const taskStatus = document.getElementById('task-status').value;

        const taskData = {
            name: taskName,
            description: taskDesc,
            dueDate: taskDate,
            priority: taskPriority,
            status: taskStatus
        };

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(taskData);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        addTaskToTable(taskData);
        taskForm.reset();
    });

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToTable(task));
    }

    function addTaskToTable(task) {
        const row = taskTable.insertRow();
        row.insertCell(0).textContent = task.name;
        row.insertCell(1).textContent = task.description;
        row.insertCell(2).textContent = task.dueDate;
        row.insertCell(3).textContent = task.priority;
        row.insertCell(4).textContent = task.status;

        const actionsCell = row.insertCell(5);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit';
        actionsCell.appendChild(editButton);
        editButton.addEventListener('click', () => editTask(row, task));

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.className = 'complete';
        actionsCell.appendChild(completeButton);
        completeButton.addEventListener('click', () => completeTask(row, task));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        actionsCell.appendChild(deleteButton);
        deleteButton.addEventListener('click', () => deleteTask(row, task));
    }

    function editTask(row, task) {
        document.getElementById('task-name').value = task.name;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('task-date').value = task.dueDate;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').value = task.status;

        deleteTask(row, task);
    }

    function completeTask(row, task) {
        task.status = 'Completed';
        row.cells[4].textContent = 'Completed';
        updateLocalStorage();
    }

    function deleteTask(row, task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.name !== task.name || t.dueDate !== task.dueDate); // Unique by name and dueDate
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskTable.deleteRow(row.rowIndex);
    }

    function updateLocalStorage() {
        let tasks = [];
        for (let i = 1, row; row = taskTable.rows[i]; i++) {
            let task = {
                name: row.cells[0].textContent,
                description: row.cells[1].textContent,
                dueDate: row.cells[2].textContent,
                priority: row.cells[3].textContent,
                status: row.cells[4].textContent
            };
            tasks.push(task);
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
