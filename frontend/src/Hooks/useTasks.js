import { useState, useEffect, useCallback } from "react";
import { API } from "../constants";
import { toDateString } from "../Utils/dateUtils";

// Custom hook: useTasks
// Encapsulates ALL data-fetching and CRUD logic
// App.js and components stay clean, they just call these functions
export function useTasks(selectedDate) {
  const [allTasks, setAllTasks] = useState([]);  // every task (for calendar chips)
  const [dayTasks, setDayTasks] = useState([]);  // tasks for the selected date only
  const [loading, setLoading]   = useState(false);

  // Read all TASKS
  const fetchAllTasks = useCallback(() => {
    fetch(`${API}/todos`)
      .then(r => r.json())
      .then(d => setAllTasks(d.data || []))
      .catch(() => {});
  }, []);

  // Read by date
  const fetchDayTasks = useCallback(() => {
    const dateStr = toDateString(selectedDate);
    setLoading(true);
    fetch(`${API}/todos?date=${dateStr}`)
      .then(r => r.json())
      .then(d => { setDayTasks(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedDate]);

  // Re-fetch whenever selectedDate changes
  useEffect(() => { fetchAllTasks(); }, [fetchAllTasks]);
  useEffect(() => { fetchDayTasks(); }, [fetchDayTasks]);

  // Create 
  function addTask(taskText, description) {
    if (!taskText.trim()) return;
    fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: taskText,
        description: description,
        date: toDateString(selectedDate),
      }),
    })
      .then(r => r.json())
      .then(() => { fetchDayTasks(); fetchAllTasks(); });
  }

  // Update 
  function updateTask(id, task, description) {
    fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, description }),
    })
      .then(() => { fetchDayTasks(); fetchAllTasks(); });
  }

  // Delete 
  function deleteTask(id) {
    fetch(`${API}/todos/${id}`, { method: "DELETE" })
      .then(() => { fetchDayTasks(); fetchAllTasks(); });
  }

  // Return everything components need
  return { allTasks, dayTasks, loading, addTask, updateTask, deleteTask };
}
