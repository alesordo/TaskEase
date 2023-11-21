const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require("../app");
const {Project} = require("../db/models");


/* Connecting to the database before each test. */
beforeAll(async () => {
    /* Disconnecting from MongoDB */
    await mongoose.disconnect();

    /* Creating a test MongoDB database with mongo-db-memory-server */
    const mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    await mongoose.connect(uri);
});

/* Deleting data from database after each test. */
// afterEach(async () => {
//
// });

/* Closing database connection and app after all the tests. */
afterAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await app.close();
});

let xAccessToken;
let xRefreshToken;
let userId;
let xAccessToken2;

describe("POST /users for Sign Up", () => {
    it("should return 400 - sign up with missing fields", async () => {
        const res = await request(app).post("/users").send({
            email: "test@test.com"
        });
        expect(res.statusCode).toBe(400);
    });

    it("should return 200 and tokens - sign up with correct fields", async () => {
        const res = await request(app).post("/users").send({
            email: "test@test.com",
            password: "helloworld"
        });
        expect(res.statusCode).toBe(200);
        expect(res.headers).toEqual(expect.objectContaining({
            'x-refresh-token': expect.anything(),
            'x-access-token': expect.anything()
        }));
    });

    it("should return 403 - sign up with existing email", async () => {
        const res = await request(app).post("/users").send({
            email: "test@test.com",
            password: "helloworld"
        });
        expect(res.statusCode).toBe(403);
    });

    it("should return 200 and tokens - sign up second user with correct fields", async () => {
        const res = await request(app).post("/users").send({
            email: "test2@test.com",
            password: "helloworld"
        });
        expect(res.statusCode).toBe(200);
        expect(res.headers).toEqual(expect.objectContaining({
            'x-refresh-token': expect.anything(),
            'x-access-token': expect.anything()
        }));

        xAccessToken2 = res.headers['x-access-token'];
    });
});

describe("POST /users/login for Login", () => {
    it("should return 401 - login with missing fields", async () => {
        const res = await request(app).post("/users/login").send({
            email: "test@test.com"
        });
        expect(res.statusCode).toBe(401);
    });

    it("should return 200 and tokens - login with correct fields", async () => {
        const res = await request(app).post("/users/login").send({
            email: "test@test.com",
            password: "helloworld",
        });
        expect(res.statusCode).toBe(200);

        expect(res.headers).toEqual(expect.objectContaining({
            'x-refresh-token': expect.anything(),
            'x-access-token': expect.anything()
        }));

        // Saving the user id and x-refresh-token for later
        userId = res.body._id;
        xRefreshToken = res.headers['x-refresh-token'];
    });
});

describe("GET /users/me/access-token to refresh access token", () => {
    it("should return 400 - refresh with missing/incorrect headers", async () => {
        const res = await request(app).get("/users/me/access-token");
        expect(res.statusCode).toBe(400);
    });

    it("should return 200 and x-access-token - refresh with correct headers", async () => {
        const res = await request(app).get("/users/me/access-token").set({
            'x-refresh-token': xRefreshToken,
            '_id': userId
        });

        expect(res.statusCode).toBe(200);

        expect(res.headers).toEqual(expect.objectContaining({
            'x-access-token': expect.anything()
        }));

        // Saving access token for later
        xAccessToken = res.headers['x-access-token'];
    });
});

let projectId;

describe("POST /projects to add a project, user must be authenticated", () => {
    const projectTitle = "Test title";

    it("should return 401 - correct body but incorrect user header", async () => {
        const res = await request(app).post("/projects")
            .send({
                title: projectTitle
            })
        expect(res.statusCode).toBe(401);
    });

    it("should return 400 - correct user header but missing body", async () => {
        const res = await request(app).post("/projects")
            .send({

            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 200, id and title of project - correct header and body", async () => {
        const res = await request(app).post("/projects")
            .send({
            title: projectTitle
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(200);

        expect(res.body.title).toBe(projectTitle);
        expect(res.body._id);

        projectId = res.body._id;
    });
});

describe("GET /projects to list all the projects of a user", () => {
    it("should return 401 - user unauthorised/missing", async () => {
        const res = await request(app).get("/projects");

        expect(res.statusCode).toBe(401);
    });

    it("should return 200 and projects array - correct user provided", async () => {
        const res = await request(app).get("/projects").set({
            'x-access-token': xAccessToken
        });

        expect(res.statusCode).toBe(200);
        expect(res.body);
        expect(res.body[0]._id).toBe(projectId);
    });
});

describe("PATCH /projects/:id to edit an existing project of a user", () => {
    const projectTitle = "Edited title";

    it("should return 401 - correct body and project id but user missing", async () => {
        const res = await request(app).patch('/projects/' + projectId)
            .send({
                title: projectTitle
            })
        expect(res.statusCode).toBe(401);
    });

    it("should return 401 - valid user id and project id but not authorised on project", async () => {
        const res = await request(app).patch('/projects/' + projectId)
            .send({
                title: projectTitle
            })
            .set({
                'x-access-token': xAccessToken2
            });
        expect(res.statusCode).toBe(401);
    });

    it("should return 400 - valid user but non existent project id", async () => {
        const res = await request(app).patch('/projects/abc')
            .send({
                title: projectTitle
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 200 - correct header and body", async () => {
        const res = await request(app).patch('/projects/' + projectId)
            .send({
                title: projectTitle
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(200);
    });
});

let taskId;

describe("POST /projects/:projectId/tasks to add a task to a project, user must be authenticated", () => {
    const taskTitle = "Test task title";

    it("should return 401 - correct body but incorrect user header", async () => {
        const res = await request(app).post("/projects/" + projectId + "/tasks")
            .send({
                title: taskTitle
            })
        expect(res.statusCode).toBe(401);
    });

    it("should return 404 - valid user id and project id but not authorised on project", async () => {
        const res = await request(app).post('/projects/' + projectId + "/tasks")
            .send({
                title: taskTitle
            })
            .set({
                'x-access-token': xAccessToken2
            });
        expect(res.statusCode).toBe(404);
    });

    it("should return 400 - valid user but non existent project id", async () => {
        const res = await request(app).post('/projects/abc/tasks')
            .send({
                title: taskTitle
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 400 - valid project id, authorised user but missing task title", async () => {
        const res = await request(app).post('/projects/' + projectId + '/tasks')
            .send({
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 200 and task object - valid project id, authorised user, task title", async () => {
        const res = await request(app).post('/projects/' + projectId + '/tasks')
            .send({
                title: taskTitle
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(200);

        expect(res.body.title).toBe(taskTitle);
        expect(res.body._projectId).toBe(projectId);
        expect(res.body._id);
        expect(res.body.statusIndex);
        expect(res.body.taskStatus).toBe(0);

        taskId = res.body._id;
    });
});

describe("GET /projects/:projectId/tasks to list all task of a project", () => {
    it("should return 401 - incorrect user header", async () => {
        const res = await request(app).get("/projects/" + projectId + "/tasks");
        expect(res.statusCode).toBe(401);
    });

    it("should return 400 - valid user but non existent project id", async () => {
        const res = await request(app).get('/projects/abc/tasks')
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 404 - valid user id and project id but not authorised on project", async () => {
        const res = await request(app).get('/projects/' + projectId + "/tasks")
            .set({
                'x-access-token': xAccessToken2
            });
        expect(res.statusCode).toBe(404);
    });

    it("should return 200 and task array - valid project id, authorised user", async () => {
        const res = await request(app).get('/projects/' + projectId + '/tasks')
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(200);

        expect(res.body);
        expect(res.body[0]._id).toBe(taskId);
    });
});

describe("PATCH /projects/:projectId/tasks/:taskId to update a specific task", () => {
    it("should return 401 - incorrect user header", async () => {
        const res = await request(app).patch("/projects/" + projectId + "/tasks/" + taskId);
        expect(res.statusCode).toBe(401);
    });

    it("should return 400 - valid user but non existent project id", async () => {
        const res = await request(app).patch("/projects/abc/tasks/" + taskId)
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 404 - valid user id and project id but not authorised on project", async () => {
        const res = await request(app).patch("/projects/" + projectId + "/tasks/" + taskId)
            .set({
                'x-access-token': xAccessToken2
            });
        expect(res.statusCode).toBe(404);
    });

    it("should return 404 - valid user id and project id but invalid task id", async () => {
        const res = await request(app).patch("/projects/" + projectId + "/tasks/abc")
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(404);
    });

    it("should return 200 - valid user id, project id and task id", async () => {
        const res = await request(app).patch("/projects/" + projectId + "/tasks/" + taskId)
            .send({
                title: "Edited title"
            })
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(200);
    });
});

describe("DELETE /projects/:id/tasks/:taskId to delete an existing task of a project", () => {
    it("should return 401 - incorrect user header", async () => {
        const res = await request(app).delete("/projects/" + projectId + "/tasks/" + taskId);
        expect(res.statusCode).toBe(401);
    });

    it("should return 400 - valid user but non existent project id", async () => {
        const res = await request(app).delete("/projects/abc/tasks/" + taskId)
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(400);
    });

    it("should return 404 - valid user id and project id but not authorised on project", async () => {
        const res = await request(app).delete("/projects/" + projectId + "/tasks/" + taskId)
            .set({
                'x-access-token': xAccessToken2
            });
        expect(res.statusCode).toBe(404);
    });

    it("should return 404 - valid user id and project id but invalid task id", async () => {
        const res = await request(app).delete("/projects/" + projectId + "/tasks/abc")
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(404);
    });

    it("should return 200 - valid user id, project id and task id", async () => {
        const res = await request(app).delete("/projects/" + projectId + "/tasks/" + taskId)
            .set({
                'x-access-token': xAccessToken
            });
        expect(res.statusCode).toBe(200);
    });
});

describe("DELETE /projects/:id to delete an existing project of a user", () => {
    it("should return 401 - user missing", async () => {
        const res = await request(app).delete("/projects/" + projectId);

        expect(res.statusCode).toBe(401);
    });

    it("should return 400 - valid user and non-existent project id", async () => {
        const res = await request(app).delete("/projects/abc")
            .set({
                'x-access-token': xAccessToken
            });

        expect(res.statusCode).toBe(400);
    });

    it("should return 401 - correct project id but unauthorised user", async () => {
        const res = await request(app).delete("/projects/" + projectId)
            .set({
                'x-access-token': xAccessToken2
            });

        expect(res.statusCode).toBe(401);
    });

    it("should return 200, id and title of project - correct project id but unauthorised user", async () => {
        const res = await request(app).delete("/projects/" + projectId)
            .set({
                'x-access-token': xAccessToken
            });

        expect(res.statusCode).toBe(200);

        expect(res.body.title);
        expect(res.body._id).toBe(projectId);
    });
});