// This is equivalent to import express, in cpp way, is bringinig in the dependency
const express = require('express');
const app = express(); 
// Port is the endpoint for communication between the 2 computers
const PORT = 8888;

// Middleware, convert body to json
app.use(express.json());

// This will in turn: GET http://localhost:<PORT>/one-piece
// GET is to retrieve data from a server
// 2nd arg is callback function
app.get('/one-piece', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
        res.status(200).send({
            // This will be in a json format
            character: 'monkey D. luffy',
            job: 'pirate'
        })
    } 
);

// Post: Create new data
app.post('/one-piece/:id', 
    // When this exact url fires, this function will fire to handle the request
    (req, res)=> {
            const{id} = req.params;
            const{crew_name} = req.body;

            // Check if have right_hand
            if(!crew_name){
                return res.status(400).json({message: 'Pirate needs a crew'});
            }

            // Success response with 201 status
            res.status(201).json({
                message: 'Crew member added successfully',
                crew: `pirate in the ${crew_name} and ID of ${id}`,
            });
    } 
);

app.listen(PORT, 
    () => console.log(`Alive on http://localhost:${PORT}`)
)

