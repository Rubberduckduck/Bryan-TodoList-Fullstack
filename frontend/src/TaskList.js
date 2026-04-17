import { useState } from "react";

// Export default exposes a function so that it can be used in other files, like in cpp includes.
// However, in js only one export default per file
export default function TaskList({tasks, onAdd}){
    const [input, setInput] = useState('');

    function handleSubmit(e){
        e.preventDefault();
        if(input.trim()){
            onAdd(input);
            setInput('');
        }
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeHolder="Add a new task"
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {tasks.map(task => (
                <li key={task.ID}>
                    {task.task}{task.description && `-${task.description}`}
                </li>
            ))}       
            </ul>
        </div>
    );

}