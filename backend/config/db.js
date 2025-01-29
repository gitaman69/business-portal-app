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

    // Connect to the user database if licenseId is provided
    if (userDBURI && !connections[userDBURI]) {
        try {
            connections[userDBURI] = await mongoose.createConnection(userDBURI, {});
            console.log(`User MongoDB Connected: ${userDBURI}`);
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

module.exports = connectDB;