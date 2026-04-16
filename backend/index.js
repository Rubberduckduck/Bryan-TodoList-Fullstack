// This is equivalent to import express, in cpp way, is bringinig in the dependency
const express = require('express');
const app = express(); 
const crypto = require('crypto');
const cors = require('cors');
// Port is the endpoint for communication between the 2 computers
const PORT = 8888;

// Middleware, convert body to json
app.use(express.json());

// Hard code the start todo for now
let todos = []

// This will in turn: GET http://localhost:<PORT>/todos
// GET is to retrieve data from a server
// 2nd arg is callback function
app.get('/todos', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
        const filterDate = req.query.date;
        if(filterDate){
            const filtered = todos.filter(t => t.created_at === filterDate);
            res.status(200).json({
            // This will be in a json format
            Message: "Filtered Todos",
            Count: filtered.length,
            data: filtered,
            });
        }
        else{
            res.status(200).json({
                // This will be in a json format
                // To read all todos
                Message: "Read Todos",
                Count: todos.length,
                data: todos,
            });
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
            completed: false,
            // Will use date send in from frontend react
            created_at: date || new Date().toLocaleDateString('en-CA')
        }

        todos.push(new_todo);


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
        // Dont use parseInt because crypto.randomUUID() returns a string
        const todo = todos.find( i => i.ID === req.params.id);

        // Find() returns undefined if cannot find
        if(todo === undefined ){return res.status(404).send("ID not found!");}

        // Update todo task's name
        todo.task = req.body.task;

        // Update todo description
        todo.description = req.body.description;

        res.status(201).json({
            message: "Todo task name successfully updated!",
            data: todo
        })
    }
)

// Delete: Delete data from server
app.delete('/todos/:id',
    // When this exact url fires, this function will fire to handle the request
    (req, res) => {

        // Get id to delete from url
        // Dont use parseInt because crypto.randomUUID() returns a string
        const todoID = todos.findIndex( i => i.ID === req.params.id);

        if(todoID === -1 ){return res.status(404).send("ID not found!");}

        // Remove item
        const deletedTodo = todos.splice(todoID, 1);

        res.status(201).json({
            message: "Todo successfully deleted!"
        })
    }
)

app.listen(PORT, 
    () => console.log(`Alive on http://localhost:${PORT}`)
)

