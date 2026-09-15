const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is missing");
        }

        console.log("========================================");
        console.log("Connecting to MongoDB...");
        console.log("MongoDB URI found: YES");
        console.log(
            "MongoDB URI type:",
            mongoURI.startsWith("mongodb+srv://")
                ? "ATLAS SRV"
                : "OTHER"
        );

        const hostMatch = mongoURI.match(/@([^/?]+)/);

        console.log(
            "MongoDB host:",
            hostMatch ? hostMatch[1] : "NOT DETECTED"
        );

        console.log("========================================");

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });

        console.log("========================================");
        console.log("MongoDB CONNECTED SUCCESSFULLY");
        console.log("Database:", mongoose.connection.name);
        console.log("Host:", mongoose.connection.host);
        console.log("========================================");

    } catch (error) {
        console.error("========================================");
        console.error("MONGODB CONNECTION FAILED");
        console.error("========================================");

        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code || "NONE");

        if (error.reason && error.reason.servers) {
            console.error("SERVER CONNECTION DETAILS:");

            for (const [address, server] of error.reason.servers) {
                console.error("----------------------------------------");
                console.error("Server:", address);
                console.error(
                    "Server type:",
                    server.type || "UNKNOWN"
                );

                if (server.error) {
                    console.error(
                        "SERVER ERROR:",
                        server.error.message ||
                        String(server.error)
                    );
                } else {
                    console.error("SERVER ERROR: NONE");
                }
            }
        }

        if (error.cause) {
            console.error(
                "CAUSE:",
                error.cause.message || String(error.cause)
            );
        }

        console.error("========================================");

        throw error;
    }
};

mongoose.connection.on("connected", () => {
    console.log("MongoDB event: CONNECTED");
});

mongoose.connection.on("error", (error) => {
    console.error(
        "MongoDB event ERROR:",
        error.message
    );
});

mongoose.connection.on("disconnected", () => {
    console.error(
        "MongoDB event: DISCONNECTED"
    );
});

module.exports = connectDB;