const express = require('express');
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in mongoose models
const { Project, Task } = require('./db/models');

// Load middleware
app.use(bodyParser.json());

/* Route handlers */

/* Projects routes */

/**
 * GET /projects
 * Purpose: Get all projects
 */
app.get('/projects', (req,res) => {
    // Return an array of all the projects in the database
    Project.find({}).then((projects) => {
        res.send(projects);
    })
})

/**
 * POST /projects
 * Purpose: Create a project
 */
app.post('/projects', (req,res) => {
    // Create a new project and returns the new project document to the user (with id)
    // The project information (fields) will be passed in via the JSON body
    let title = req.body.title;

    let newProject = new Project({
        title
    });

    newProject.save().then((projectDoc) => {
        // The full project document is returned (incl. id)
        res.send(projectDoc);
    })
});


/**
 * PATH /projects/:id
 * Purpose: Update a specified project
 */
app.patch('/projects/:id', (req,res)=>{
    // Update specified project (project document with id in the URL) with the new values of the JSON body of the request
    Project.findOneAndUpdate({_id: req.params.id}, {
      $set: req.body
    }).then(() => {
        res.sendStatus(200);
    })
})

/**
 * DELETE /projects/
 * Purpose: Delete a specified project
 */
app.delete('/projects/:id', (req,res) => {
    // Delete a specified project (document with id in the url)
    Project.findOneAndDelete({
        _id: req.params.id}).then((removedListDoc) => {
        res.send(removedListDoc);
    })
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})