require('dotenv').config();
const mongoose = require('mongoose');

// connect to mongodb
let uri = process.env.MONGO_URI;
mongoose.connect(uri);

// create the schema for each trip
const tripSchema = new mongoose.Schema({
    username: {
        type: String
    },
    phone: {
        type: String
    },
    route: {
        type: String
    },
    price: {
        type: Number
    },
    dateAndTime: {
        type: Date
    }
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;