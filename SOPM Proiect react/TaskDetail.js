// TaskDetail.js
import React, { useState } from 'react';

function TaskDetail({ task, onEdit, onClose, onCheck }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onEdit(editedTask);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <div className={`task-detail ${editedTask.isOverdue ? 'overdue' : ''} ${editedTask.isUpcoming ? 'upcoming' : ''}`}>
      <h2>{editedTask.title}</h2>
      <p>{editedTask.category}</p>
      {isEditing ? (
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
        />
      ) : (
        <p>{editedTask.description}</p>
      )}
      <div className="task-options">
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={onClose}>Close/Trash</button>
        <button onClick={onCheck}>Check</button>
      </div>
      {isEditing && (
        <div className="edit-options">
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      )}
      {editedTask.isOverdue && (
        <div className="overdue-label">OVERDUE</div>
      )}
      {editedTask.isUpcoming && (
        <div className="upcoming-label">UPCOMING</div>
      )}
    </div>
  );
}

export default TaskDetail;
