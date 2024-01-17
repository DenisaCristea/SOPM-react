// ToDoPage.js
import React, { useContext, useState, useEffect } from 'react';
import { TasksContext } from './TasksContext';
import './ToDoPage.css';
import { useSearchParams } from 'react-router-dom';

function ToDoPage() {
  const { tasks, setTasks, closedTasks, setClosedTasks } = useContext(TasksContext);
  const [currentCategory, setCurrentCategory] = useState('todo');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDetails, setEditedTaskDetails] = useState('');
  const [editedTaskDateTime, setEditedTaskDateTime] = useState('');
  const [editedTaskColor, setEditedTaskColor] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDetails, setNewTaskDetails] = useState('');
  const [newTaskDateTime, setNewTaskDateTime] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [searchParams] = useSearchParams();
  const acquiredSearchParam = searchParams.get('category');
  const category = acquiredSearchParam ?? currentCategory;

  useEffect(() => {
    setCurrentCategory(category);
  }, [category]);

  useEffect(() => {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission", permission);
    });
  }, []);

  const scheduleNotification = (task) => {
    const time = new Date(task.dateTime).getTime() - 15 * 60 * 1000; // 15 minute în milisecunde
    const now = new Date().getTime();

    if (time > now) {
      const timeout = time - now;
      setTimeout(() => {
        new Notification(`Reminder: ${task.title}`, {
          body: `Your task is due in 15 minutes.`,
          // Adaugă alte opțiuni aici, dacă este necesar
        });
      }, timeout);
    }
  };


  const toggleImportant = (id, isClosedTask = false) => {
    const updatedTasks = isClosedTask
      ? closedTasks.map(task => (task.id === id ? { ...task, isImportant: !task.isImportant } : task))
      : tasks.map(task => (task.id === id ? { ...task, isImportant: !task.isImportant } : task));

    isClosedTask ? setClosedTasks(updatedTasks) : setTasks(updatedTasks);
  };

  const removeTask = (id, isClosedTask = false) => {
    const updatedTasks = isClosedTask
      ? closedTasks.filter(task => task.id !== id)
      : tasks.filter(task => task.id !== id);

    isClosedTask ? setClosedTasks(updatedTasks) : setTasks(updatedTasks);
  };

  const toggleComplete = (id) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (taskToToggle) {
      setClosedTasks([...closedTasks, { ...taskToToggle, isComplete: true }]);
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const reopenTask = (id) => {
    const taskToReopen = closedTasks.find(task => task.id === id);
    if (taskToReopen) {
      setTasks([...tasks, { ...taskToReopen, isComplete: false }]);
      setClosedTasks(closedTasks.filter(task => task.id !== id));
    }
  };

  const startAddingTask = () => {
    setIsAddingTask(true);
  };

  const finishAddingTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        details: newTaskDetails,
        dateTime: newTaskDateTime,
        color: newTaskColor,
        isImportant: currentCategory === 'important',
        isComplete: false
      };

      setTasks([...tasks, newTask]);

      scheduleNotification(newTask); // Aici se adaugă notificarea
    }

    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDetails('');
    setNewTaskDateTime('');
    setNewTaskColor('');
  };


  const cancelAddingTask = () => {
    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDetails('');
    setNewTaskDateTime('');
    setNewTaskColor('');
  };

  const startEditing = (id, title, details, dateTime, color) => {
    setEditingTaskId(id);
    setEditedTaskTitle(title);
    setEditedTaskDetails(details);
    setEditedTaskDateTime(dateTime);
    setEditedTaskColor(color);
  };

  const finishEditing = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id
        ? { ...task, title: editedTaskTitle, details: editedTaskDetails, dateTime: editedTaskDateTime, color: editedTaskColor }
        : task
    );

    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find(task => task.id === id);
    if (updatedTask) {
      scheduleNotification(updatedTask); // Aici se adaugă notificarea
    }

    setEditingTaskId(null);
    setEditedTaskTitle('');
    setEditedTaskDetails('');
    setEditedTaskDateTime('');
    setEditedTaskColor('');
  };


  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedTaskTitle('');
    setEditedTaskDetails('');
    setEditedTaskDateTime('');
    setEditedTaskColor('');
  };

  const updateTaskStatus = () => {
    const today = new Date();
    const updatedTasks = tasks.map(task => {
      const taskDate = new Date(task.dateTime);
      const isOverdue = taskDate < today;
      const isUpcoming = taskDate > today;
      return { ...task, isOverdue, isUpcoming };
    });

    setTasks(updatedTasks);

    // Actualizăm și starea task-urilor închise
    const updatedClosedTasks = closedTasks.map(task => {
      const taskDate = new Date(task.dateTime);
      const isOverdue = taskDate < today;
      const isUpcoming = taskDate > today;
      return { ...task, isOverdue, isUpcoming };
    });

    setClosedTasks(updatedClosedTasks);
  };

  // Efect secundar pentru a inițializa și actualiza periodic starea task-urilor
  useEffect(() => {
    // Inițializăm starea la început
    updateTaskStatus();

    // Setăm un interval pentru a actualiza periodic starea task-urilor
    const intervalId = setInterval(updateTaskStatus, 60000); // Actualizăm la fiecare minut

    // Curățăm intervalul când componenta se dezactivează
    return () => clearInterval(intervalId);
    // ...

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, closedTasks]);

  // ...

  const getFilteredTasks = () => {
    // Filtrare după categorie
    let filteredTasks = [];
    switch (currentCategory) {
      case 'todo':
        filteredTasks = tasks.filter(task => !task.isComplete);
        break;
      case 'important':
        filteredTasks = tasks.filter(task => task.isImportant && !task.isComplete);
        break;
      case 'closed':
        filteredTasks = closedTasks;
        break;
      default:
        filteredTasks = [];
    }

    // Adaugă marcaje pentru task-uri expirate și viitoare
    const today = new Date();
    filteredTasks = filteredTasks.map(task => {
      const taskDate = new Date(task.dateTime);
      const isOverdue = taskDate < today;
      const isUpcoming = taskDate > today;
      return { ...task, isOverdue, isUpcoming };
    });

    // Filtrare după termenul de căutare
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();
      filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(lowerCaseSearchTerm));
    }

    return filteredTasks;
  };

  const formatDateAndTime = (dateTimeString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="todo-page">
      <div className="categories">
        <span className={currentCategory === 'todo' ? 'category selected' : 'category'} onClick={() => setCurrentCategory('todo')}>To Do</span>
        <span className={currentCategory === 'important' ? 'category selected' : 'category'} onClick={() => setCurrentCategory('important')}>Important</span>
        <span className={currentCategory === 'closed' ? 'category selected' : 'category'} onClick={() => setCurrentCategory('closed')}>Closed</span>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="tasks-container">
        {getFilteredTasks().map(task => (
          <div key={task.id} className={`task ${task.isOverdue ? 'overdue' : ''} ${task.isUpcoming ? 'upcoming' : ''}`} style={{ backgroundColor: task.color }}>
            <span className={`important-star ${task.isImportant ? 'marked' : ''}`} onClick={() => toggleImportant(task.id, currentCategory === 'closed')}>
              {task.isImportant ? '★' : '☆'}
            </span>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskTitle}
                  onChange={(e) => setEditedTaskTitle(e.target.value)}
                  autoFocus
                />
                <input
                  type="text"
                  value={editedTaskDetails}
                  onChange={(e) => setEditedTaskDetails(e.target.value)}
                  placeholder="Details"
                />
                <input
                  type="datetime-local"
                  value={editedTaskDateTime}
                  onChange={(e) => setEditedTaskDateTime(e.target.value)}
                />
                <input
                  type="color"
                  value={editedTaskColor}
                  onChange={(e) => setEditedTaskColor(e.target.value)}
                />
              </>
            ) : (
              <>
                <span className="task-title">
                  {task.title} {task.isUpcoming && <span className="upcoming-label">UPCOMING</span>} {task.isOverdue && <span className="overdue-label">OVERDUE</span>}
                </span>
                {task.details && <span className="task-details">{task.details}</span>}
                {task.dateTime && <span className="task-datetime">{formatDateAndTime(task.dateTime)}</span>}
              </>
            )}
            <div className="task-options">
              {currentCategory === 'closed' ? (
                <button onClick={() => reopenTask(task.id)}>Reopen</button>
              ) : (
                <>
                  {editingTaskId === task.id ? (
                    <>
                      <button onClick={() => finishEditing(task.id)}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => toggleComplete(task.id)}>
                        {task.isComplete ? 'Uncheck' : '✅'}
                      </button>
                      <button onClick={() => removeTask(task.id)}>❌</button>
                      <button onClick={() => startEditing(task.id, task.title, task.details, task.dateTime, task.color)}>✏️</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="add-task-form">
        {!isAddingTask && (
          <button className="add-task-button" onClick={startAddingTask}>
            + Add New Task
          </button>
        )}
        {isAddingTask && (
          <div className="task">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
            />
            <input
              type="text"
              value={newTaskDetails}
              onChange={(e) => setNewTaskDetails(e.target.value)}
              placeholder="Details"
            />
            <input
              type="datetime-local"
              value={newTaskDateTime}
              onChange={(e) => setNewTaskDateTime(e.target.value)}
            />
            <input
              type="color"
              value={newTaskColor}
              onChange={(e) => setNewTaskColor(e.target.value)}
            />
            <div className="task-options">
              <button onClick={finishAddingTask}>Add</button>
              <button onClick={cancelAddingTask}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDoPage;
