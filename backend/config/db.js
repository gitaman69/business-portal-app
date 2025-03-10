const mongoose = require("mongoose");

const connections = {}; // Cache for database connections

const connectDB = async (licenseId) => {
    const mainDBURI = process.env.MONGO_URI;
    const userDBURI = licenseId ? `${process.env.MONGO_URI}-${licenseId}` : null;

    // Connect to the main database if not already connected
    if (!connections[mainDBURI]) {
        try {
            connections[mainDBURI] = await mongoose.connect(mainDBURI, {});
            console.log("Main MongoDB Connected");
        } catch (err) {
            console.error("Main DB connection error:", err);
            throw err;
        }
    }

    // Connect to the user database if not already connected
    if (userDBURI && !connections[userDBURI]) {
        try {
            connections[userDBURI] = mongoose.createConnection(userDBURI, {});
            console.log(`User MongoDB Connected`);
        } catch (err) {
            console.error("User DB connection error:", err);
            throw err;
        }
    }

    return {
        mainDB: connections[mainDBURI],
        userDB: userDBURI ? connections[userDBURI] : null,
    };
};

// Function to disconnect user-specific database
const disconnectDB = async (licenseId) => {
    const userDBURI = `${process.env.MONGO_URI}-${licenseId}`;
    
    if (connections[userDBURI]) {
        await connections[userDBURI].close();
        delete connections[userDBURI];
        console.log(`User MongoDB Disconnected`);
    }
};

module.exports = { connectDB, disconnectDB, connections };
