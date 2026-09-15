const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
    try {
        const username =
            typeof req.body?.username === "string"
                ? req.body.username.trim()
                : "";

        const password =
            typeof req.body?.password === "string"
                ? req.body.password
                : "";

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from .env");

            return res.status(500).json({
                success: false,
                message: "Server authentication configuration error"
            });
        }

        const user = await User
            .findOne({
                username: username
            })
            .select("+password");

        if (!user) {
            console.log("Login failed: user not found");
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        if (!user.active) {
            console.log("Login failed: account inactive");
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        console.log(
            "Login attempt:",
            username,
            "| Password valid:",
            passwordValid
        );

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user._id.toString(),
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

module.exports = {
    login
};