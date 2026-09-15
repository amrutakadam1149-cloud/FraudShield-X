const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true,
            index: true
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
            trim: true
        },

        deviceId: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        transactionTime: {
            type: Date,
            default: Date.now
        },

        // =====================================================
        // FINAL TRANSACTION STATUS
        // =====================================================

        status: {
            type: String,
            enum: [
                "SAFE",
                "SUSPICIOUS",
                "FRAUD",
                "PENDING",
                "DECLINED"
            ],
            default: "SAFE",
            index: true
        },

        // =====================================================
        // RULE BASED RISK
        // =====================================================

        riskScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        riskLevel: {
            type: String,
            enum: [
                "LOW",
                "MEDIUM",
                "HIGH",
                "CRITICAL"
            ],
            default: "LOW"
        },

        // =====================================================
        // ML FRAUD PREDICTION
        // =====================================================

        fraudProbability: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        mlPrediction: {
            type: String,
            default: "UNKNOWN"
        },

        // =====================================================
        // FRAUD DNA
        // =====================================================

        fraudDna: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        fraudDnaScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // =====================================================
        // BEHAVIOR INTELLIGENCE
        // =====================================================

        behaviorIntelligence: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        behaviorScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // =====================================================
        // TEMPORAL INTELLIGENCE
        // =====================================================

        temporalIntelligence: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        temporalScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        temporalStatus: {
            type: String,
            default: "NORMAL"
        },

        // =====================================================
        // FRAUD RING
        // =====================================================

        fraudRing: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        fraudRingScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        fraudRingStatus: {
            type: String,
            default: "NO_RING"
        },

        // =====================================================
        // ADAPTIVE RISK ENGINE
        // =====================================================

        adaptiveRisk: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        adaptiveScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // =====================================================
        // EXPLAINABILITY
        // =====================================================

        reasons: {
            type: [String],
            default: []
        },

        investigatorRecommendation: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        // =====================================================
        // EXTRA INTELLIGENCE DATA
        // =====================================================

        intelligence: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Transaction ||
    mongoose.model("Transaction", transactionSchema);