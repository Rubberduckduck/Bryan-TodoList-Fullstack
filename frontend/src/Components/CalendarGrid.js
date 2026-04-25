import Icon from "./Icons";
import { MONTHS, DAYS } from "../constants";
import { buildDateString } from "../Utils/dateUtils";

// CalendarGrid: the main monthly grid in the centre of the screen
// Props:
//   year, month    — currently displayed month
//   cells          — array of null (empty) or day numbers, built in App.js
//   todayStr       — "YYYY-MM-DD" for today
//   selectedStr    — "YYYY-MM-DD" for the selected date
//   allTasks       — full task list, used to show chips on each day
//   onPrevMonth    — go to previous month
//   onNextMonth    — go to next month
//   onSelectDay    — called with day number when a cell is clicked
export default function CalendarGrid({ year, month, cells, todayStr, selectedStr, allTasks, onPrevMonth, onNextMonth, onSelectDay }) {

  // Filter tasks that belong to a specific day
  function tasksForDay(day) {
    const ds = buildDateString(year, month, day);
    return allTasks.filter(t => t.created_at === ds);
  }

  return (
    <main className="main">
      {/* Top navigation bar */}
      <div className="topbar">
        <button className="nav-btn" onClick={onPrevMonth}>{Icon.chevL}</button>
        <button className="nav-btn" onClick={onNextMonth}>{Icon.chevR}</button>
        <div className="month-title">
          <strong>{MONTHS[month]}</strong> {year}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="calendar-area">
        {/* Day name header row */}
        <div className="cal-day-headers">
          {DAYS.map(d => <div key={d} className="cal-day-header">{d}</div>)}
        </div>

        {/* Date cells */}
        <div className="cal-grid">
          {cells.map((day, idx) => {
            // Empty filler cells before the 1st
            if (!day) return <div key={`e${idx}`} className="cal-cell empty" />;

            const ds    = buildDateString(year, month, day);
            const chips = tasksForDay(day);
            let cls     = "cal-cell";
            if (ds === todayStr)    cls += " is-today";
            if (ds === selectedStr) cls += " is-selected";

            return (
              <div key={day} className={cls} onClick={() => onSelectDay(day)}>
                <div className="day-num">{day}</div>

                {/* Show up to 3 task chips per cell */}
                {chips.slice(0, 3).map(t => (
                  <div key={t.ID} className={`task-chip${t.completed ? " done" : ""}`}>
                    {t.task}
                  </div>
                ))}

                {/* "+N more" label if there are extra tasks */}
                {chips.length > 3 && (
                  <div className="more-chip">+{chips.length - 3} more</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
