const express = require('express');
const app = express();

const { mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in mongoose models
const { Project, Task, User } = require('./db/models');

const jwt = require('jsonwebtoken');

/* MIDDLEWARE */

// Load middleware
app.use(bodyParser.json());

// CORS HEADERS MIDDLEWARE
let FRONTEND_URI = "http://localhost:4200";
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", FRONTEND_URI); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods",  "GET, POST, HEAD, OPTION, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

// Check whether the request has a valid JWT token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // Verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) =>{

    })
}

// Verify refresh token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // Grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // Grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if(!user){
            // User couldn't be found
            return Promise.reject({
                'error' : 'User not found. Make sure that the refresh token and id are correct'
            });
        }

        // If the code reaches here - the user was found
        // Therefore the refresh token exists in the database - but still need to check if it has expired or not
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if(session.token === refreshToken){
                // Check if session has expired
                if(User.hasRefreshTokenExpired(session.expiresAt) === false){
                    // Refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if(isSessionValid) {
            // The session is VALID - call next() to continue processing this web request
            next();
        } else{
            // The session is not valid
            return Promise.reject({
                'error' : 'Refresh token has expired or the session is invalid'
            })
        }
    }).catch((e) => {
      res.status(400).send(e);
    })
}

/* END MIDDLEWARE */

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
    }).sort({statusIndex : 'asc'})
        .then((tasks) => {
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
 * Purpose: Create a new task for a specified project in a specified bucket
 */
app.post("/projects/:projectId/tasks", (req,res) => {
    let taskIndex = 0;

    // Check the index of the last task
    Task.findOne({_projectId: req.params.projectId, taskStatus : req.body.taskStatus}).sort({statusIndex : -1}).then((lastTask) => {
        let maxIndex;

        if(lastTask != null)
            maxIndex = lastTask.statusIndex;
        else
            maxIndex = 0;

        taskIndex = maxIndex + 1024

        // Create a new task in a project, specified by a project id
        let newTask = new Task({
            title: req.body.title,
            taskStatus: req.body.taskStatus,
            _projectId: req.params.projectId,
            statusIndex: taskIndex
        });

        newTask.save().then((newTaskDoc) => {
            res.send(newTaskDoc);
        })
    });
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
        // res.sendStatus(200);
        res.send({message: "Updated successfully"});
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
});

/* USER ROUTES */

/**
 * POST /users
 * Purpose: sign up
 */
app.post('/users', (req,res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // Now generating an access token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            //Access auth token generated successfully, now returing an object containing the auth tokens
            return {accessToken, refreshToken}
        });
    }).then((authTokens) => {
        // Constructing and sending the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/**
 * POST /users/login
 * Purpose: login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned
            // Now generating an access token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // Access auth token generated successfully, now returning an object conatining the auth tokens
                return {accessToken, refreshToken}
            });
        }).then((authTokens) => {
            // Constructing and sending the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        }).catch((e) => {
            res.status(400).send(e);
        })
    }).catch((e) => {
        res.status(401).send(e);
    })
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // Already knew that the user/caller is authenticated, the user_id and object are already available
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        // Sending the same data twice, to the header and to the body
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})