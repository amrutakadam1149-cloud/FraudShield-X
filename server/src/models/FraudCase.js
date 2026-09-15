const mongoose = require("mongoose");

const fraudCaseSchema = new mongoose.Schema(
    {
        caseId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction",
            required: true,
            index: true
        },

        userId: {
            type: String,
            required: true,
            index: true
        },

        riskScore: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: [
                "SAFE",
                "SUSPICIOUS",
                "FRAUD"
            ],
            default: "SUSPICIOUS"
        },

        investigationPriority: {
            type: String,
            enum: [
                "NORMAL",
                "HIGH",
                "CRITICAL"
            ],
            default: "NORMAL"
        },

        caseStatus: {
            type: String,
            enum: [
                "OPEN",
                "UNDER_REVIEW",
                "RESOLVED",
                "FALSE_POSITIVE"
            ],
            default: "OPEN",
            index: true
        },

        reasons: {
            type: [String],
            default: []
        },

        fraudDNA: {
            amountAnomaly: { type: Number, default: 0 },
            deviceAnomaly: { type: Number, default: 0 },
            merchantAnomaly: { type: Number, default: 0 },
            locationAnomaly: { type: Number, default: 0 },
            velocityAnomaly: { type: Number, default: 0 },
            behavioralAnomaly: { type: Number, default: 0 },
            temporalAnomaly: { type: Number, default: 0 },
            networkAnomaly: { type: Number, default: 0 }
        },

        dnaScore: {
            type: Number,
            default: 0
        },

        fraudRing: {
            ringScore: { type: Number, default: 0 },
            ringStatus: {
                type: String,
                default: "NO_RING"
            },
            connectedUsers: { type: Number, default: 0 },
            connectedDevices: { type: Number, default: 0 },
            connectedMerchants: { type: Number, default: 0 },
            sharedDeviceUsers: { type: Number, default: 0 },
            sharedMerchantUsers: { type: Number, default: 0 },
            suspiciousTransactions: { type: Number, default: 0 },
            multiHopConnections: { type: Number, default: 0 }
        },

        investigatorRecommendation: {
            investigationPriority: {
                type: String,
                default: "NORMAL"
            },

            recommendationCount: {
                type: Number,
                default: 0
            },

            recommendations: {
                type: Array,
                default: []
            },

            evidence: {
                type: [String],
                default: []
            },

            nextActions: {
                type: [String],
                default: []
            }
        },

        assignedTo: {
            type: String,
            default: ""
        },

        notes: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("FraudCase", fraudCaseSchema);