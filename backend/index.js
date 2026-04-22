// This is equivalent to import express, in cpp way, is bringinig in the dependency
const express = require('express');
const app = express(); 
const crypto = require('crypto');
const cors = require('cors');
// Port is the endpoint for communication between the 2 computers
const PORT = 8888;

// Middleware, convert body to json
app.use(express.json());

// Enable CORS for frontend communication
app.use(cors());

// Database to store todos
const db = require('./Database/database'); 

// This will in turn: GET http://localhost:<PORT>/todos
// GET is to retrieve data from a server
// 2nd arg is callback function
app.get('/todos', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
        const filterDate = req.query.date;
        if(filterDate){
            // Filter from database for all todos under that date
            // .all() is when u expecting array of datas, selecting from multiple rows
            const filtered = db.prepare('SELECT * FROM todos WHERE created_at = ?').all(filterDate);
            res.status(200).json({ Message: "Filtered Todos", Count: filtered.length, data: filtered });
        }
        else{
            // Get all todos from the db
            const allTodos = db.prepare('SELECT * FROM todos').all();
            res.status(200).json({ Message: "Read Todos", Count: allTodos.length, data: allTodos });
        }
    } 
);

// Post: Create new data
app.post('/todos', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
        
        // Get data from request's body
        const { task, description, date } = req.body = req.body;

        // Validate input
        if(!task || task.trim() === ""){
            return res.status(400).json({
                message: "Tasks is required in order to be added",
            });
        }

        // Create new todo
        const new_todo = {
            // Randomize GUID
            ID: crypto.randomUUID(),
            task: task.trim(),
            description: description || "",
            completed: 0,
            // Will use date send in from frontend react
            created_at: date || new Date().toLocaleDateString('en-CA')
        }

        // Insert new todo into db
        // .run is used for post(Create), update and delete
        db.prepare(`INSERT INTO todos(ID, task, description, completed, created_at)
            VALUES (@ID, @task, @description, @completed, @created_at)`).run(new_todo);


        // Success response with 201 status
        res.status(201).json({
            message: "Todo added successfully",
            data: new_todo
        });
    } 
);

// Change an element's data
app.put('/todos/:id',
    (req, res) => {
        // Get id to update from url
        const result = db.prepare('UPDATE todos SET task = ?, description = ? WHERE ID = ?').run(req.body.task, req.body.description, req.params.id);
        
        if(result === 0){
            return res.status(401).json("ID NOT FOUND!");
        }

        const updated = db.prepare('SELECT * FROM todos WHERE ID = ?').get(req.params.id);

        res.status(200).json({ message: "Todo updated!", data: updated });
    }
)

// Delete: Delete data from server
app.delete('/todos/:id',
    // When this exact url fires, this function will fire to handle the request
    (req, res) => {

        const result = db.prepare('DELETE FROM todos WHERE ID = ?').run(req.params.id);

        if (result.changes === 0) {
            return res.status(401).send("ID not found!");
        }

        res.status(201).json({
            message: "Todo successfully deleted!"
        })

        res.status(200).json({ message: "Todo successfully deleted!" });
    }
)

app.listen(PORT, 
    () => console.log(`Alive on http://localhost:${PORT}`)
)

