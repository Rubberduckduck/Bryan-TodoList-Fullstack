import { useState } from "react";
import "./App.css";

// Utilities
import { toDateString, getDaysInMonth, getFirstDayOfMonth } from "./Utils/dateUtils";

// Custom hooks, all API calls here
import { useTasks } from "./Hooks/useTasks";

// Components
import Sidebar      from "./Components/Sidebar";
import CalendarGrid from "./Components/CalendarGrid";
import TaskPanel    from "./Components/TaskPanel";

export default function App() {
  const today = new Date();

  // Calendar navigation state
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // All data + CRUD from custom hook
  const { allTasks, dayTasks, loading, addTask, updateTask, deleteTask } = useTasks(selectedDate);

  // Derived values
  const todayStr    = toDateString(today);
  const selectedStr = toDateString(selectedDate);
  const taskDates   = new Set(allTasks.map(t => t.created_at));

  // Calendar grid cells: nulls for empty leading cells, then day numbers
  const cells = [];
  for (let i = 0; i < getFirstDayOfMonth(year, month); i++) cells.push(null);
  for (let d = 1; d <= getDaysInMonth(year, month); d++) cells.push(d);

  // Navigation handlers
  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); }
  function goToday()   {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  }
  function selectDay(day) {
    setSelectedDate(new Date(year, month, day));
  }

  // Render
  return (
    <div className="app">
      <Sidebar
        year={year}
        month={month}
        selectedDate={selectedDate}
        todayStr={todayStr}
        taskDates={taskDates}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onToday={goToday}
        onSelectDay={selectDay}
      />

      <CalendarGrid
        year={year}
        month={month}
        cells={cells}
        todayStr={todayStr}
        selectedStr={selectedStr}
        allTasks={allTasks}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onSelectDay={selectDay}
      />

      <TaskPanel
        selectedDate={selectedDate}
        dayTasks={dayTasks}
        loading={loading}
        onAdd={addTask}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
