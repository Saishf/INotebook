const mongoose = require('mongoose');

const mongoURI = "mongodb://0.0.0.0:27017/?tls=false";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
}

module.exports = connectToMongo