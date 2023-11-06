// This file will handle the connection logic to the MongoDB database

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskEase', { useNewUrlParser: true }).then(() => {
    console.log("Connected successfully to MongoDB!");
}).catch((e) =>{
    console.log("Error while trying to connect to MongoDB");
    console.log(e);
});

module.exports={
    mongoose
};