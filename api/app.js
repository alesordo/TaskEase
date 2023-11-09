const express = require('express');
const app = express();

const { mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in mongoose models
const { Project, Task } = require('./db/models');

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
let FRONTEND_URI = "http://localhost:4200";
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", FRONTEND_URI); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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

/* Tasks routes */

/**
 * GET /projects/:projectId/tasks
 * Purpose: Get all tasks of a specific project
 */
app.get("/projects/:projectId/tasks", (req,res) => {
    // Return all tasks belonging to a specific project
    Task.find({
        _projectId: req.params.projectId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * GET /projects/:projectId/tasks/:taskId
 * Purpose: Get task with specified id
 */
app.get("/projects/:projectId/tasks/:taskId", (req, res) => {
    // Return task with specified id
    Task.findOne({
        _projectId: req.params.projectId,
        _id: req.params.taskId
    }).then((task) => {
        res.send(task);
    })
})

/**
 * POST /projects/:projectId/tasks
 */
app.post("/projects/:projectId/tasks", (req,res) => {
    // Create a new task in a project, specified by a project id
    let newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        estimatedTime: req.body.estimatedTime,
        taskStatus: req.body.taskStatus,
        _projectId: req.params.projectId
    });

    newTask.save().then((newTaskDoc) => {
        res.send(newTaskDoc);
    })
});

/**
 * PATCH /projects/:projectId/tasks/:taskId
 * Purpose: update an existing task
 */
app.patch("/projects/:projectId/tasks/:taskId", (req, res) => {
    // Update specific task specified by taskId
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _projectId: req.params.projectId
    }, {
        $set: req.body
    }).then(() =>{
        res.sendStatus(200);
    })
});

/**
 * DELETE /projects/:projectId/tasks/:taskId
 * Purpose: delete an existing task
 */
app.delete("/projects/:projectId/tasks/:taskId", (req, res) => {
    Task.findOneAndDelete({
        _id: req.params.taskId,
        _projectId: req.params.projectId}).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})