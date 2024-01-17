import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ToDoPage from './ToDoPage';
import TaskList from './TaskList';
import { TasksProvider } from './TasksContext';

function App() {
  return (
    <TasksProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/todo" element={<ToDoPage />} />
          <Route
            path="/closed"
            element={
              <Navigate
                to="/closed"
                replace
              />
            }
          />
        </Routes>
      </Router>
    </TasksProvider>
  );
}

export default App;