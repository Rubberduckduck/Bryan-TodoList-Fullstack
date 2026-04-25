import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8888";

// Helper functions
function toDateString(date) {
  return date.toLocaleDateString("en-CA");
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Icons
const Icon = {
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  edit:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  plus:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chevL: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

export default function App() {
  const today = new Date();

  // States
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(today);
  const [allTasks, setAllTasks]         = useState([]);   // all tasks (for calendar dots/chips)
  const [dayTasks, setDayTasks]         = useState([]);   // tasks for selected day (right panel)
  const [editingTask, setEditingTask]   = useState(null); // task currently being edited
  const [newTask, setNewTask]           = useState({ task: "", description: "" });
  const [isAdding, setIsAdding]         = useState(false);
  const [loading, setLoading]           = useState(false);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch all tasks
  const fetchAllTasks = useCallback(() => {
    fetch(`${API}/todos`)
      .then(r => r.json())
      .then(d => setAllTasks(d.data || []))
      .catch(() => {});
  }, []);

  // Fetch tasks
  // Same pattern as your original useEffect
  const fetchDayTasks = useCallback(() => {
    const dateStr = toDateString(selectedDate);
    setLoading(true);
    fetch(`${API}/todos?date=${dateStr}`)
      .then(res => res.json())
      .then(data => { setDayTasks(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => { fetchAllTasks(); }, [fetchAllTasks]);
  useEffect(() => { fetchDayTasks(); }, [fetchDayTasks]);

  // Create
  function handleAddTask() {
    if (!newTask.task.trim()) return;
    const dateStr = toDateString(selectedDate);
    fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask.task, description: newTask.description, date: dateStr }),
    })
      .then(res => res.json())
      .then(() => {
        setNewTask({ task: "", description: "" });
        setIsAdding(false);
        fetchDayTasks();
        fetchAllTasks();
      });
  }

  // Delete
  function handleDelete(id) {
    fetch(`${API}/todos/${id}`, { method: "DELETE" })
      .then(() => { fetchDayTasks(); fetchAllTasks(); });
  }

  // Update
  function handleUpdate() {
    if (!editingTask || !editingTask.task.trim()) return;
    fetch(`${API}/todos/${editingTask.ID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: editingTask.task, description: editingTask.description }),
    })
      .then(() => { setEditingTask(null); fetchDayTasks(); fetchAllTasks(); });
  }

  // Calender grid
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);
  const todayStr    = toDateString(today);
  const selectedStr = toDateString(selectedDate);
  const taskDates   = new Set(allTasks.map(t => t.created_at));

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); }
  function goToday()   { setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(today); }

  function selectDay(day) {
    setSelectedDate(new Date(year, month, day));
    setIsAdding(false);
    setEditingTask(null);
  }

  function tasksForDay(day) {
    const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return allTasks.filter(t => t.created_at === ds);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Rendering all the panels and widgets
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f3f3f3; }
        .app { display: flex; height: 100vh; overflow: hidden; }

        /* Sidebar */
        .sidebar { width: 420px; min-width: 220px; background: #0078d4; display: flex; flex-direction: column; padding: 16px 12px; gap: 8px; color: #fff; }
        .sidebar-title { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; padding: 8px 8px 16px; border-bottom: 1px solid rgba(255,255,255,0.2); margin-bottom: 8px; text-align: center;}
        .sidebar-title span { font-weight: 300; opacity: 0.8; }
        .today-btn { background: rgba(93, 130, 125, 0.69); border: 1px solid rgba(255,255,255,0.3); color: #ffffff; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 600; text-align: center; transition: background 0.15s; }
        .today-btn:hover { background: rgba(255,255,255,0.25); }
        .mini-cal { margin-top: 8px; }
        .mini-cal-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 2px; margin-bottom: 6px; }
        .mini-cal-header span { font-size: 12px; font-weight: 600; }
        .mini-nav { background: none; border: none; color: #fff; cursor: pointer; padding: 2px 4px; border-radius: 3px; display: flex; align-items: center; opacity: 0.8; }
        .mini-nav:hover { opacity: 1; background: rgba(255,255,255,0.15); }
        .mini-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
        .mini-day-header { font-size: 10px; text-align: center; opacity: 0.6; padding: 2px 0; font-weight: 600; }
        .mini-day { font-size: 11px; text-align: center; padding: 3px 1px; border-radius: 50%; cursor: pointer; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; transition: background 0.1s; flex-direction: column; }
        .mini-day:hover { background: rgba(255,255,255,0.2); }
        .mini-day.is-today { background: rgba(255,255,255,0.3); font-weight: 700; }
        .mini-day.is-selected { background: #fff; color: #0078d4; font-weight: 700; }
        .mini-day.has-task::after { content: ''; display: block; width: 3px; height: 3px; background: #50e3c2; border-radius: 50%; margin: 1px auto 0; }

        /* Topbar */
        .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .topbar { background: #fff; border-bottom: 1px solid #e0e0e0; padding: 0 24px; height: 52px; display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
        .month-title { font-size: 20px; font-weight: 300; color: #1a1a1a; }
        .month-title strong { font-weight: 700; }
        .nav-btn { background: none; border: 1px solid #e0e0e0; color: #444; cursor: pointer; padding: 4px 8px; border-radius: 4px; display: flex; align-items: center; transition: all 0.15s; }
        .nav-btn:hover { background: #f3f3f3; border-color: #bbb; }

        /* Calendar grid */
        .calendar-area { flex: 1; overflow: auto; background: #fff; }
        .cal-day-headers { display: grid; grid-template-columns: repeat(7,1fr); border-bottom: 1px solid #e5e5e5; background: #fafafa; position: sticky; top: 0; z-index: 1; }
        .cal-day-header { text-align: center; padding: 8px 4px; font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
        .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); grid-auto-rows: minmax(100px,1fr); border-left: 1px solid #e5e5e5; }
        .cal-cell { border-right: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; padding: 6px; cursor: pointer; transition: background 0.1s; min-height: 100px; overflow: hidden; }
        .cal-cell:hover { background: #f5f9ff; }
        .cal-cell.empty { cursor: default; background: #fafafa; }
        .cal-cell.is-selected { background: #f0f7ff; }
        .cal-cell.is-today .day-num { background: #0078d4; color: #fff; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .day-num { font-size: 12px; color: #444; font-weight: 500; margin-bottom: 4px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
        .task-chip { font-size: 11px; padding: 2px 6px; border-radius: 3px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; background: #e1efff; color: #0050a0; font-weight: 500; }
        .task-chip.done { background: #e8f5e9; color: #2e7d32; text-decoration: line-through; }
        .more-chip { font-size: 10px; color: #0078d4; padding: 1px 4px; font-weight: 600; }

        /* Right panel */
        .panel { width: 500px; min-width: 320px; background: #fff; border-left: 1px solid #e0e0e0; display: flex; flex-direction: column; overflow: hidden; }
        .panel-header { padding: 16px 20px 12px; border-bottom: 1px solid #e8e8e8; flex-shrink: 0; }
        .panel-date { font-size: 13px; color: #888; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }
        .panel-day { font-size: 28px; font-weight: 300; color: #1a1a1a; line-height: 1.1; }
        .panel-day strong { font-weight: 700; }
        .add-btn { margin: 12px 20px 0; display: flex; align-items: center; gap: 6px; background: #0078d4; color: #fff; border: none; border-radius: 4px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; width: calc(100% - 40px); }
        .add-btn:hover { background: #106ebe; }

        /* Forms */
        .add-form { padding: 12px 20px; border-bottom: 1px solid #eee; flex-shrink: 0; }
        .add-form input, .add-form textarea, .edit-form input, .edit-form textarea { width: 100%; border: 1px solid #ddd; border-radius: 4px; padding: 8px 10px; font-size: 13px; font-family: inherit; margin-bottom: 8px; outline: none; transition: border-color 0.15s; resize: none; display: block; }
        .add-form input:focus, .add-form textarea:focus, .edit-form input:focus, .edit-form textarea:focus { border-color: #0078d4; }
        .form-actions, .edit-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .btn-save { background: #0078d4; color: #fff; border: none; border-radius: 4px; padding: 6px 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .btn-save:hover { background: #106ebe; }
        .btn-cancel { background: none; border: 1px solid #ddd; border-radius: 4px; padding: 6px 14px; font-size: 13px; cursor: pointer; color: #555; }
        .btn-cancel:hover { background: #f5f5f5; }

        /* Task list */
        .task-list { flex: 1; overflow-y: auto; padding: 8px 0; }
        .task-item { padding: 10px 20px; border-bottom: 1px solid #f0f0f0; }
        .task-item:hover { background: #fafafa; }
        .task-item-header { display: flex; align-items: flex-start; gap: 8px; }
        .task-name { flex: 1; font-size: 13px; font-weight: 500; color: #1a1a1a; line-height: 1.4; }
        .task-name.done { text-decoration: line-through; color: #999; }
        .task-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .icon-btn { background: none; border: none; cursor: pointer; padding: 3px; border-radius: 3px; color: #999; display: flex; align-items: center; transition: all 0.15s; }
        .icon-btn:hover { background: #f0f0f0; color: #333; }
        .icon-btn.delete:hover { background: #fff0f0; color: #d32f2f; }
        .task-desc { font-size: 12px; color: #888; margin-top: 3px; }
        .edit-form { padding: 4px 0; }
        .btn-icon-save { background: #0078d4; color: #fff; border: none; border-radius: 3px; padding: 4px 10px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; }
        .btn-icon-cancel { background: none; border: 1px solid #ddd; border-radius: 3px; padding: 4px 10px; font-size: 12px; cursor: pointer; color: #555; display: flex; align-items: center; gap: 4px; }
        .empty-state { text-align: center; padding: 40px 20px; color: #bbb; }
        .empty-state p { font-size: 13px; margin-top: 8px; }
        .loading { text-align: center; padding: 24px; color: #bbb; font-size: 13px; }
      `}</style>

      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-title">Todo<span> Calender</span></div>
          <button className="today-btn" onClick={goToday}>Today</button>
          <div className="mini-cal">
            <div className="mini-cal-header">
              <button className="mini-nav" onClick={prevMonth}>{Icon.chevL}</button>
              <span>{MONTHS[month].slice(0, 3)} {year}</span>
              <button className="mini-nav" onClick={nextMonth}>{Icon.chevR}</button>
            </div>
            <div className="mini-grid">
              {DAYS.map(d => <div key={d} className="mini-day-header">{d[0]}</div>)}
              {Array(getFirstDayOfMonth(year, month)).fill(null).map((_, i) => <div key={`e${i}`} />)}
              {Array(getDaysInMonth(year, month)).fill(null).map((_, i) => {
                const d  = i + 1;
                const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                let cls  = "mini-day";
                if (ds === selectedStr) cls += " is-selected";
                else if (ds === todayStr) cls += " is-today";
                if (taskDates.has(ds) && ds !== selectedStr) cls += " has-task";
                return <div key={d} className={cls} onClick={() => selectDay(d)}>{d}</div>;
              })}
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <button className="nav-btn" onClick={prevMonth}>{Icon.chevL}</button>
            <button className="nav-btn" onClick={nextMonth}>{Icon.chevR}</button>
            <div className="month-title"><strong>{MONTHS[month]}</strong> {year}</div>
          </div>
          <div className="calendar-area">
            <div className="cal-day-headers">
              {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
            </div>
            <div className="cal-grid">
              {cells.map((day, idx) => {
                if (!day) return <div key={`e${idx}`} className="cal-cell empty" />;
                const ds       = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const chips    = tasksForDay(day);
                let cls        = "cal-cell";
                if (ds === todayStr)    cls += " is-today";
                if (ds === selectedStr) cls += " is-selected";
                return (
                  <div key={day} className={cls} onClick={() => selectDay(day)}>
                    <div className="day-num">{day}</div>
                    {chips.slice(0, 3).map(t => (
                      <div key={t.ID} className={`task-chip${t.completed ? " done" : ""}`}>{t.task}</div>
                    ))}
                    {chips.length > 3 && <div className="more-chip">+{chips.length - 3} more</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <aside className="panel">
          <div className="panel-header">
            <div className="panel-date">{DAYS[selectedDate.getDay()]}, {MONTHS[selectedDate.getMonth()]}</div>
            <div className="panel-day"><strong>{selectedDate.getDate()}</strong>, {selectedDate.getFullYear()}</div>
          </div>

          <button className="add-btn" onClick={() => { setIsAdding(true); setEditingTask(null); }}>
            {Icon.plus} New Task
          </button>

          {isAdding && (
            <div className="add-form">
              <input
                placeholder="Task name *"
                value={newTask.task}
                autoFocus
                onChange={e => setNewTask(p => ({ ...p, task: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleAddTask()}
              />
              <textarea
                placeholder="Description (optional)"
                rows={2}
                value={newTask.description}
                onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
              />
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => { setIsAdding(false); setNewTask({ task: "", description: "" }); }}>Cancel</button>
                <button className="btn-save" onClick={handleAddTask}>Save</button>
              </div>
            </div>
          )}

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
                      <button className="btn-icon-cancel" onClick={() => setEditingTask(null)}>{Icon.x} Cancel</button>
                      <button className="btn-icon-save" onClick={handleUpdate}>{Icon.check} Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="task-item-header">
                      <div className={`task-name${task.completed ? " done" : ""}`}>{task.task}</div>
                      <div className="task-actions">
                        <button className="icon-btn" title="Edit" onClick={() => { setEditingTask({ ...task }); setIsAdding(false); }}>{Icon.edit}</button>
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(task.ID)}>{Icon.trash}</button>
                      </div>
                    </div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                  </>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}