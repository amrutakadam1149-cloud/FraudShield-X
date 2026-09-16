const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("========================================");
        console.log("Connecting to MongoDB...");
        console.log("========================================");

        const uri = process.env.MONGODB_URI;

        console.log(
            "MongoDB URI found:",
            uri ? "YES" : "NO"
        );

        if (!uri) {
            throw new Error(
                "MONGODB_URI environment variable is missing"
            );
        }

        if (uri.startsWith("mongodb+srv://")) {
            console.log(
                "MongoDB URI type: ATLAS SRV"
            );
        } else if (uri.startsWith("mongodb://")) {
            console.log(
                "MongoDB URI type: STANDARD mongodb://"
            );
        } else {
            console.log(
                "MongoDB URI type: UNKNOWN"
            );
        }

        const hostMatch = uri.match(
            /@([^/?]+)/
        );

        console.log(
            "MongoDB host:",
            hostMatch
                ? hostMatch[1]
                : "HIDDEN/NOT DETECTED"
        );

        console.log(
            "Node version:",
            process.version
        );

        console.log(
            "Mongoose version:",
            mongoose.version
        );

        console.log(
            "TLS mode: ENABLED"
        );

        console.log(
            "IPv4 mode: ENABLED"
        );

        console.log(
            "========================================"
        );

        await mongoose.connect(uri, {
            tls: true,
            family: 4,

            serverSelectionTimeoutMS: 30000,

            connectTimeoutMS: 30000,

            socketTimeoutMS: 45000,

            heartbeatFrequencyMS: 10000,

            retryWrites: true
        });

        console.log("========================================");
        console.log("MONGODB CONNECTED SUCCESSFULLY");
        console.log("========================================");

        console.log(
            "Database:",
            mongoose.connection.name
        );

        console.log(
            "Host:",
            mongoose.connection.host
        );

        console.log(
            "Ready State:",
            mongoose.connection.readyState
        );

        console.log("========================================");

        return mongoose.connection;

    } catch (error) {
        console.error("========================================");
        console.error("MONGODB CONNECTION FAILED");
        console.error("========================================");

        console.error(
            "Error name:",
            error.name
        );

        console.error(
            "Error message:",
            error.message
        );

        console.error(
            "Error code:",
            error.code || "NONE"
        );

        console.error(
            "Error reason:",
            error.reason || "NONE"
        );

        console.error(
            "Error cause:",
            error.cause || "NONE"
        );

        if (
            error.reason &&
            typeof error.reason === "object"
        ) {
            console.error(
                "Topology description:"
            );

            try {
                console.error(
                    JSON.stringify(
                        error.reason,
                        null,
                        2
                    )
                );
            } catch (jsonError) {
                console.error(
                    "Could not stringify topology"
                );
            }
        }

        console.error(
            "FULL ERROR STACK:"
        );

        console.error(
            error.stack || error
        );

        console.error("========================================");

        throw error;
    }
};

module.exports = connectDB;