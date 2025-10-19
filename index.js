// This is equivalent to import express, in cpp way, is bringinig in the dependency
const app = require('express')();
// Port is the endpoint for communication between the 2 computers
const PORT = 8888;

// app.listen(PORT, 
//     () => console.log(`Alive on http://localhost:${PORT}`)
// )

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



