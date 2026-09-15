const mongoose = require("mongoose");

async function calculateTemporalIntelligence(data = {}) {
    const {
        userId = "",
        amount = 0
    } = data;

    console.log("========================================");
    console.log("TEMPORAL INTELLIGENCE");
    console.log("User:", userId);
    console.log("MongoDB state:", mongoose.connection.readyState);
    console.log("========================================");

    // Do not query MongoDB until it is connected.
    if (mongoose.connection.readyState !== 1) {
        throw new Error(
            "MongoDB is not connected. Cannot calculate temporal intelligence."
        );
    }

    // Safely get the Transaction model.
    const Transaction =
        mongoose.models.Transaction ||
        require("../models/Transaction");

    if (!Transaction || typeof Transaction.find !== "function") {
        throw new Error("Transaction model is unavailable.");
    }

    let history = [];

    if (userId) {
        history = await Transaction
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
    }

    const now = new Date();

    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const nightActivity =
        currentHour >= 22 || currentHour < 6;

    const weekendActivity =
        currentDay === 0 || currentDay === 6;

    const fiveMinutesAgo =
        new Date(now.getTime() - 5 * 60 * 1000);

    const recentTransactions = history.filter((tx) => {
        if (!tx.createdAt) {
            return false;
        }

        return new Date(tx.createdAt) >= fiveMinutesAgo;
    }).length;

    let velocityScore = 0;

    if (recentTransactions >= 5) {
        velocityScore = 80;
    } else if (recentTransactions >= 3) {
        velocityScore = 50;
    } else if (recentTransactions >= 2) {
        velocityScore = 25;
    }

    let temporalScore = 0;

    if (nightActivity) {
        temporalScore += 20;
    }

    if (weekendActivity) {
        temporalScore += 10;
    }

    temporalScore += velocityScore;

    temporalScore = Math.min(100, temporalScore);

    let temporalStatus = "NORMAL";

    if (temporalScore >= 70) {
        temporalStatus = "HIGH_RISK";
    } else if (temporalScore >= 40) {
        temporalStatus = "SUSPICIOUS";
    } else if (temporalScore >= 20) {
        temporalStatus = "ELEVATED";
    }

    return {
        temporalScore,
        temporalStatus,
        currentHour,
        currentDay,
        nightActivity,
        weekendActivity,
        recentTransactions,
        velocityScore,
        historicalTransactions: history.length,
        analyzedAmount: Number(amount) || 0
    };
}

module.exports = {
    calculateTemporalIntelligence
};