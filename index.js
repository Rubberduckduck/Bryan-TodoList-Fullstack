// This is equivalent to import express, in cpp way, is bringinig in the dependency
const express = require('express');
const app = express(); 
const crypto = require('crypto');
// Port is the endpoint for communication between the 2 computers
const PORT = 8888;

// Middleware, convert body to json
app.use(express.json());

// Hard code the start todo for now
let todos = []

// This will in turn: GET http://localhost:<PORT>/one-piece
// GET is to retrieve data from a server
// 2nd arg is callback function
app.get('/todos', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
        res.status(200).json({
            // This will be in a json format
            // To read all todos
            Message: "Read Todos",
            Count: todos.length,
            data: todos,
        });
    } 
);

// Post: Create new data
app.post('/todos', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
        
        // Get data from request's body
        const { task, description } = req.body = req.body;

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
            completed: false,
            created_at: new Date().toISOString()
        }

        todos.push(new_todo);


        // Success response with 201 status
        res.status(201).json({
            message: "Todo added successfully",
            data: new_todo
        });
    } 
);

app.listen(PORT, 
    () => console.log(`Alive on http://localhost:${PORT}`)
)

