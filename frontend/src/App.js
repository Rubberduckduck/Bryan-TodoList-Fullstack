import { useState,useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import TaskList from './TaskList';


// Helper function to convert JS Date to "YYYY-MM-DD" string
function toDateString(date){
  return date.toLocaleDateString('en-CA');
}


export default function App() {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);

    // Refetch whenever selected date changes
    useEffect(() =>{
      const dateStr = toDateString(selectedDate);
      fetch(`http://localhost:8888/todos?date=${dateStr}`)
      .then(res => res.json())
      .then(data => setTasks(data.data));
    }, [selectedDate]); // This is the dependency array key

    function handleAddTask(taskText){
      const dateStr = toDateString(selectedDate);
      fetch('http://localhost:8888/todos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({task: taskText, date: dateStr}),
      })
      // Res is the response from json if the crud methods goes through or not
      .then(res => res.json())
      .then(newTask => setTasks(prev => [...prev, newTask.data]));
    }

    return(
      <div style={{display: 'flex', gap: '2rem', padding: '2rem'}}>
        <Calendar onChange={setSelectedDate} value={selectedDate}></Calendar>
        <div>
          <h2>Tasks for {toDateString(selectedDate)}
          <TaskList tasks = {tasks} onAdd={handleAddTask}/>
          </h2>
        </div>
      </div>
    );
}
