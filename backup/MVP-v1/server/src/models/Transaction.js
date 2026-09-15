const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        merchant: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        paymentMethod: {
            type: String,
            required: true,
            enum: [
                "UPI",
                "CARD",
                "NETBANKING",
                "WALLET"
            ]
        },

        deviceId: {
            type: String,
            required: true,
            trim: true
        },

        riskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        mlProbability: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        status: {
            type: String,
            enum: [
                "SAFE",
                "SUSPICIOUS",
                "FRAUD"
            ],
            default: "SAFE"
        },

        isFraud: {
            type: Boolean,
            default: false
        },

        reasons: {
            type: [String],
            default: []
        },

        transactionTime: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);