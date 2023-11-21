// This file will handle the connection logic to the MongoDB database
const mongoose = require("mongoose");
require('dotenv').config()

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }).then(() => {
    console.log("Connected successfully to MongoDB!");
}).catch((e) =>{
    console.log("Error while trying to connect to MongoDB");
    console.log(e);
});

module.exports={
    mongoose
};