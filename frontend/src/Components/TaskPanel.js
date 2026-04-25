import { useState } from "react";
import Icon from "./Icons";
import { MONTHS, DAYS } from "../constants";

// TaskPanel: right-side panel showing tasks for the selected date
// Props:
//   selectedDate  — JS Date object for the selected day
//   dayTasks      — array of task objects for that day
//   loading       — boolean, shows a loading indicator while fetching
//   onAdd         — fn(taskText, description) — calls useTasks.addTask
//   onUpdate      — fn(id, task, description) — calls useTasks.updateTask
//   onDelete      — fn(id)                    — calls useTasks.deleteTask
export default function TaskPanel({ selectedDate, dayTasks, loading, onAdd, onUpdate, onDelete }) {
  const [isAdding, setIsAdding]     = useState(false);
  const [newTask, setNewTask]       = useState({ task: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);

  // Handlers 
  function handleAdd() {
    if (!newTask.task.trim()) return;
    onAdd(newTask.task, newTask.description);
    setNewTask({ task: "", description: "" });
    setIsAdding(false);
  }

  function handleUpdate() {
    if (!editingTask || !editingTask.task.trim()) return;
    onUpdate(editingTask.ID, editingTask.task, editingTask.description);
    setEditingTask(null);
  }

  function startEditing(task) {
    setEditingTask({ ...task });
    setIsAdding(false);
  }

  function cancelAdding() {
    setIsAdding(false);
    setNewTask({ task: "", description: "" });
  }

  return (
    <aside className="panel">
      {/* Header: shows selected date */}
      <div className="panel-header">
        <div className="panel-date">
          {DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]}
        </div>
        <div className="panel-day">
          <strong>{selectedDate.getDate()}</strong>, {selectedDate.getFullYear()}
        </div>
      </div>

      {/* New Task button */}
      <button className="add-btn" onClick={() => { setIsAdding(true); setEditingTask(null); }}>
        {Icon.plus} New Task
      </button>

      {/* Add form — appears when New Task is clicked */}
      {isAdding && (
        <div className="add-form">
          <input
            placeholder="Task name *"
            value={newTask.task}
            autoFocus
            onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <textarea
            placeholder="Description (optional)"
            rows={2}
            value={newTask.description}
            onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
          />
          <div className="form-actions">
            <button className="btn-cancel" onClick={cancelAdding}>Cancel</button>
            <button className="btn-save" onClick={handleAdd}>Save</button>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="task-list">
        {loading && <div className="loading">Loading...</div>}

        {!loading && dayTasks.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 32 }}>📋</div>
            <p>No tasks for this day</p>
          </div>
        )}

        {!loading && dayTasks.map(task => (
          <div key={task.ID} className="task-item">

            {/* Inline edit form */}
            {editingTask?.ID === task.ID ? (
              <div className="edit-form">
                <input
                  value={editingTask.task}
                  autoFocus
                  onChange={e => setEditingTask(p => ({ ...p, task: e.target.value }))}
                />
                <textarea
                  rows={2}
                  value={editingTask.description}
                  placeholder="Description (optional)"
                  onChange={e => setEditingTask(p => ({ ...p, description: e.target.value }))}
                />
                <div className="edit-actions">
                  <button className="btn-icon-cancel" onClick={() => setEditingTask(null)}>
                    {Icon.x} Cancel
                  </button>
                  <button className="btn-icon-save" onClick={handleUpdate}>
                    {Icon.check} Save
                  </button>
                </div>
              </div>
            ) : (
              /* Task display row */
              <>
                <div className="task-item-header">
                  <div className={`task-name${task.completed ? " done" : ""}`}>
                    {task.task}
                  </div>
                  <div className="task-actions">
                    <button className="icon-btn" title="Edit" onClick={() => startEditing(task)}>
                      {Icon.edit}
                    </button>
                    <button className="icon-btn delete" title="Delete" onClick={() => onDelete(task.ID)}>
                      {Icon.trash}
                    </button>
                  </div>
                </div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
