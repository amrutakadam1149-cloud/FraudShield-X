const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            default: null
        },

        userId: {
            type: String,
            required: true,
            index: true
        },

        alertType: {
            type: String,
            required: true,
            enum: [
                "HIGH_RISK",
                "FRAUD_DETECTED",
                "SUSPICIOUS_ACTIVITY",
                "VELOCITY_ALERT",
                "FRAUD_RING"
            ]
        },

        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM"
        },

        riskScore: {
            type: Number,
            default: 0
        },

        fraudProbability: {
            type: Number,
            default: 0
        },

        message: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["NEW", "ACKNOWLEDGED", "RESOLVED"],
            default: "NEW"
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Alert ||
    mongoose.model("Alert", alertSchema);