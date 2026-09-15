const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error(
                "MONGODB_URI is missing from server/.env"
            );
        }

        console.log("========================================");
        console.log("Connecting to MongoDB...");
        console.log("========================================");

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });

        console.log("========================================");
        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
        console.log("========================================");

    } catch (error) {
        console.error("========================================");
        console.error("MongoDB connection FAILED");
        console.error("Error:", error.message);
        console.error("========================================");

        throw error;
    }
};

mongoose.connection.on("connected", () => {
    console.log("MongoDB event: CONNECTED");
});

mongoose.connection.on("error", (error) => {
    console.error("MongoDB event ERROR:", error.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB event: DISCONNECTED");
});

module.exports = connectDB;