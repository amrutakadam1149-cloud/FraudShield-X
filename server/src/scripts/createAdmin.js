const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "..", "..", ".env")
});

const User = require("../models/User");

const resetAdminPassword = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("========================================");
        console.log("FraudShield-X Admin Password Reset");
        console.log("========================================");
        console.log("MongoDB connected.");
        console.log("Database:", mongoose.connection.name);

        const username = "admin";

        const newPassword = "Pa123344";

        const hashedPassword = await bcrypt.hash(
            newPassword,
            12
        );

        const user = await User.findOneAndUpdate(
            { username },
            {
                username,
                password: hashedPassword,
                role: "ADMIN",
                active: true
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true
            }
        );

        console.log("----------------------------------------");
        console.log("ADMIN ACCOUNT READY");
        console.log("Username:", user.username);
        console.log("Role:", user.role);
        console.log("Active:", user.active);
        console.log("----------------------------------------");
        console.log("Password reset successfully.");
        console.log("========================================");

        await mongoose.disconnect();

        console.log("MongoDB disconnected.");
        console.log("Setup completed.");

    } catch (error) {
        console.error("========================================");
        console.error("ADMIN PASSWORD RESET FAILED");
        console.error("Error:", error.message);
        console.error("========================================");

        try {
            await mongoose.disconnect();
        } catch {}

        process.exit(1);
    }
};

resetAdminPassword();