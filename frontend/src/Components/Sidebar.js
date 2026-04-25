import Icon from "./Icons";
import { MONTHS, DAYS } from "../constants";
import { getDaysInMonth, getFirstDayOfMonth, buildDateString, toDateString } from "../Utils/dateUtils";

// Sidebar: blue left panel with app title, Today button, and mini calendar
// Props:
//   year, month        — currently displayed month
//   selectedDate       — the date the user has clicked
//   todayStr           — today's date as "YYYY-MM-DD"
//   taskDates          — Set of "YYYY-MM-DD" strings that have tasks (for dots)
//   onPrevMonth        — go to previous month
//   onNextMonth        — go to next month
//   onToday            — jump back to today
//   onSelectDay        — called with a day number when user clicks a mini-cal date
export default function Sidebar({ year, month, selectedDate, todayStr, taskDates, onPrevMonth, onNextMonth, onToday, onSelectDay }) {
  const selectedStr = toDateString(selectedDate);

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Todo<span> Calendar</span></div>

      <button className="today-btn" onClick={onToday}>Today</button>

      {/* Mini calendar */}
      <div className="mini-cal">
        <div className="mini-cal-header">
          <button className="mini-nav" onClick={onPrevMonth}>{Icon.chevL}</button>
          <span>{MONTHS[month].slice(0, 3)} {year}</span>
          <button className="mini-nav" onClick={onNextMonth}>{Icon.chevR}</button>
        </div>

        <div className="mini-grid">
          {/* Day name headers: S M T W T F S */}
          {DAYS.map(d => <div key={d} className="mini-day-header">{d[0]}</div>)}

          {/* Empty cells before the 1st of the month */}
          {Array(getFirstDayOfMonth(year, month)).fill(null).map((_, i) => (
            <div key={`e${i}`} />
          ))}

          {/* Day number cells */}
          {Array(getDaysInMonth(year, month)).fill(null).map((_, i) => {
            const d  = i + 1;
            const ds = buildDateString(year, month, d);
            let cls  = "mini-day";
            if (ds === selectedStr)       cls += " is-selected";
            else if (ds === todayStr)     cls += " is-today";
            if (taskDates.has(ds) && ds !== selectedStr) cls += " has-task";
            return (
              <div key={d} className={cls} onClick={() => onSelectDay(d)}>{d}</div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
