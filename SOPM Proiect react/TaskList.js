import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function TaskList() {
  return (
    <div className="task-list">
      <div className="header">
        <h1>Task List</h1>
        <div className="tabs">
          <Link to="/todo?category=todo" className="tab">TO DO →</Link>
          <Link to="/todo?category=important" className="tab">IMPORTANT ★</Link>
          <Link to="/todo?category=closed" className="tab">CLOSED ❌</Link>
        </div>
      </div>
      <div className="task-container">
        {/* Aici vei itera prin task-uri și le vei afișa */}
      </div>
    </div>
  );
}

export default TaskList