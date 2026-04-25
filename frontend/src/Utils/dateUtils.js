// Converts a JS Date object to "YYYY-MM-DD" string in LOCAL time
// We use 'en-CA' because Canada's locale format is YYYY-MM-DD
// Avoids timezone issues that toISOString() causes
export function toDateString(date) {
  return date.toLocaleDateString("en-CA");
}

// Returns how many days are in a given month
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns what day of the week the 1st falls on (0=Sun, 6=Sat)
// Used to offset the calendar grid correctly
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// Builds a "YYYY-MM-DD" string from year/month/day numbers
export function buildDateString(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
