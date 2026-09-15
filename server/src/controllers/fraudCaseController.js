const FraudCase = require("../models/FraudCase");

const getAllCases = async (req, res) => {
    try {
        const cases = await FraudCase.find()
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();

        res.status(200).json({
            success: true,
            count: cases.length,
            data: cases
        });

    } catch (error) {
        console.error(
            "Failed to fetch fraud cases:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch fraud cases"
        });
    }
};

const getCaseById = async (req, res) => {
    try {
        const fraudCase = await FraudCase.findById(
            req.params.id
        ).lean();

        if (!fraudCase) {
            return res.status(404).json({
                success: false,
                message: "Fraud case not found"
            });
        }

        res.status(200).json({
            success: true,
            data: fraudCase
        });

    } catch (error) {
        console.error(
            "Failed to fetch fraud case:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch fraud case"
        });
    }
};

const updateCaseStatus = async (req, res) => {
    try {
        const status = String(
            req.body.status || ""
        )
            .trim()
            .toUpperCase();

        const allowedStatuses = [
            "OPEN",
            "INVESTIGATING",
            "CONFIRMED",
            "RESOLVED",
            "CLOSED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid case status"
            });
        }

        const fraudCase =
            await FraudCase.findByIdAndUpdate(
                req.params.id,
                {
                    status
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!fraudCase) {
            return res.status(404).json({
                success: false,
                message: "Fraud case not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Fraud case status updated successfully",
            data: fraudCase
        });

    } catch (error) {
        console.error(
            "Failed to update fraud case:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to update fraud case"
        });
    }
};

const getCaseStats = async (req, res) => {
    try {
        const [
            total,
            open,
            investigating,
            confirmed,
            resolved
        ] = await Promise.all([
            FraudCase.countDocuments(),

            FraudCase.countDocuments({
                status: "OPEN"
            }),

            FraudCase.countDocuments({
                status: "INVESTIGATING"
            }),

            FraudCase.countDocuments({
                $or: [
                    { status: "CONFIRMED" },
                    { status: "CONFIRMED_FRAUD" },
                    { status: "FRAUD" }
                ]
            }),

            FraudCase.countDocuments({
                $or: [
                    { status: "RESOLVED" },
                    { status: "CLOSED" }
                ]
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                open,
                investigating,
                confirmed,
                resolved
            }
        });

    } catch (error) {
        console.error(
            "Failed to fetch fraud case statistics:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch fraud case statistics"
        });
    }
};

module.exports = {
    getAllCases,
    getCaseById,
    updateCaseStatus,
    getCaseStats
};