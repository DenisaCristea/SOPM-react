// TasksContext.js
import React, { createContext, useState } from 'react';

export const TasksContext = createContext(null);

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'TASK1', isImportant: false, isComplete: false },
    { id: 2, title: 'TASK2', isImportant: false, isComplete: false },
    { id: 3, title: 'TASK3', isImportant: false, isComplete: false },
    // Presupunem că nu avem task-uri overdue inițiale
  ]);

  const [closedTasks, setClosedTasks] = useState([
    // Presupunem că nu avem task-uri închise inițiale
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Funcție pentru a adăuga un task la lista închisă
  const addClosedTask = (task) => {
    setClosedTasks(prevClosedTasks => [...prevClosedTasks, task]);
  };

  // Funcție pentru a muta un task înapoi la lista activă
  const reopenTask = (task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  // Funcție pentru a elimina un task din lista închisă
  const removeClosedTask = (id) => {
    setClosedTasks(prevClosedTasks => prevClosedTasks.filter(task => task.id !== id));
  };

  // Funcție pentru a actualiza importanța unui task închis
  const toggleImportantClosedTask = (id) => {
    setClosedTasks(prevClosedTasks => 
      prevClosedTasks.map(task => 
        task.id === id ? { ...task, isImportant: !task.isImportant } : task
      )
    );
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      setTasks,
      closedTasks,
      setClosedTasks,
      addClosedTask,
      reopenTask,
      removeClosedTask,
      toggleImportantClosedTask,
      searchTerm,
      setSearchTerm,
    }}>
      {children}
    </TasksContext.Provider>
  );
};
