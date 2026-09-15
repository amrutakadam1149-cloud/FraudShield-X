const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "..", ".env")
});

const connectDB = require("./config/database");

const transactionRoutes = require("./routes/transactionRoutes");
const networkRoutes = require("./routes/networkRoutes");
const fraudCaseRoutes = require("./routes/fraudCaseRoutes");
const alertRoutes = require("./routes/alertRoutes");
const authRoutes = require("./routes/authRoutes");
const attackPredictionRoutes = require("./routes/attackPredictionRoutes");

const app = express();

app.disable("x-powered-by");

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
    cors({
        origin: allowedOrigins,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: true,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/networks", networkRoutes);
app.use("/api/cases", fraudCaseRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/attack-prediction", attackPredictionRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FraudShield-X server is running",
        version: "1.0.0"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        server: "FraudShield-X",
        status: "ONLINE",
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

app.use((error, req, res, next) => {
    console.error("GLOBAL SERVER ERROR:");
    console.error(error);

    res.status(error.status || 500).json({
        success: false,
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log("========================================");
        console.log("Starting FraudShield-X...");
        console.log("========================================");

        console.log(
            "JWT_SECRET:",
            process.env.JWT_SECRET ? "FOUND" : "MISSING"
        );

        await connectDB();

        console.log("MongoDB connection completed.");

        const server = app.listen(
            PORT,
            "0.0.0.0",
            () => {
                console.log("========================================");
                console.log("FraudShield-X server running");
                console.log(`Port: ${PORT}`);
                console.log("Host: 0.0.0.0");
                console.log("Helmet security: ENABLED");
                console.log("Rate limiting: ENABLED");
                console.log("Authentication: ENABLED");
                console.log("Attack Prediction API: ENABLED");
                console.log("========================================");
            }
        );

        server.on("error", (error) => {
            console.error("========================================");
            console.error("SERVER ERROR");
            console.error("========================================");
            console.error(error.message);

            if (error.code === "EADDRINUSE") {
                console.error(
                    `Port ${PORT} is already being used.`
                );
            }
        });

    } catch (error) {
        console.error("========================================");
        console.error("FAILED TO START FRAUDSHIELD-X");
        console.error("========================================");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();

module.exports = app;