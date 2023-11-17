const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require("../app");


/* Connecting to the database before each test. */
beforeEach(async () => {
    /* Disconnecting from MongoDB */
    await mongoose.disconnect();

    /* Creating a test MongoDB database with mongo-db-memory-server */
    const mongod = await MongoMemoryServer.create();
    const uri = await mongod.getUri();
    await mongoose.connect(uri);
});

/* Deleting data from database after each test. */
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        const collection = collections[key];
        await collection.deleteMany();
    }
});

/* Closing database connection and app after all the tests. */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await app.close();
});

describe("POST /api/users for Sign Up", () => {
    it("Sign Up with missing fields - should return 400", async () => {
        const res = await request(app).post("/users").send({
            email: "test@test.com"
        });
        expect(res.statusCode).toBe(400);
    });

    it("Sign Up with correct fields - should return 200 and access + refresh tokens", async () => {
        const res = await request(app).post("/users").send({
            email: "test@test.com",
            password: "helloworld"
        });
        expect(res.statusCode).toBe(200);
        console.log(res.headers);
    });
});