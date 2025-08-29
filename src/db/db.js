const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Database connected...");
    } catch (error) {
        console.log("Error occured while connecting to DB., ", error);
    }
}

module.exports = connectDB;