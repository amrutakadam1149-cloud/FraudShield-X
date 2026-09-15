const mongoose = require("mongoose");

async function calculateBehaviorIntelligence(data = {}) {
    const {
        userId = "",
        amount = 0,
        merchant = "",
        location = "",
        paymentMethod = "",
        deviceId = ""
    } = data;

    console.log("========================================");
    console.log("BEHAVIOR INTELLIGENCE");
    console.log("User:", userId);
    console.log("MongoDB state:", mongoose.connection.readyState);
    console.log("========================================");

    // 0 = disconnected
    if (mongoose.connection.readyState !== 1) {
        throw new Error(
            "MongoDB is not connected. Cannot calculate behavior intelligence."
        );
    }

    const Transaction =
        mongoose.models.Transaction ||
        require("../models/Transaction");

    if (!Transaction) {
        throw new Error("Transaction model is unavailable.");
    }

    if (typeof Transaction.find !== "function") {
        throw new Error("Transaction.find is unavailable.");
    }

    let history = [];

    if (userId) {
        history = await Transaction
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
    }

    if (!history.length) {
        return {
            behaviorScore: 0,
            behaviorStatus: "NORMAL",
            historicalTransactions: 0,
            averageAmount: 0,
            amountDeviation: 0,
            merchantFrequency: 0,
            deviceFrequency: 0,
            locationFrequency: 0,
            paymentMethodFrequency: 0
        };
    }

    const amounts = history
        .map(tx => Number(tx.amount) || 0)
        .filter(value => value > 0);

    const averageAmount =
        amounts.length > 0
            ? amounts.reduce((a, b) => a + b, 0) / amounts.length
            : 0;

    const currentAmount = Number(amount) || 0;

    let amountDeviation = 0;

    if (averageAmount > 0) {
        amountDeviation =
            Math.abs(currentAmount - averageAmount) / averageAmount;
    }

    const merchantFrequency = history.filter(
        tx => tx.merchant === merchant
    ).length;

    const deviceFrequency = history.filter(
        tx => tx.deviceId === deviceId
    ).length;

    const locationFrequency = history.filter(
        tx => tx.location === location
    ).length;

    const paymentMethodFrequency = history.filter(
        tx => tx.paymentMethod === paymentMethod
    ).length;

    let behaviorScore = 0;

    if (amountDeviation > 2) {
        behaviorScore += 40;
    } else if (amountDeviation > 1) {
        behaviorScore += 25;
    } else if (amountDeviation > 0.5) {
        behaviorScore += 10;
    }

    if (merchant && merchantFrequency === 0) {
        behaviorScore += 15;
    }

    if (deviceId && deviceFrequency === 0) {
        behaviorScore += 15;
    }

    if (location && locationFrequency === 0) {
        behaviorScore += 10;
    }

    if (paymentMethod && paymentMethodFrequency === 0) {
        behaviorScore += 5;
    }

    behaviorScore = Math.min(100, behaviorScore);

    let behaviorStatus = "NORMAL";

    if (behaviorScore >= 70) {
        behaviorStatus = "HIGH_RISK";
    } else if (behaviorScore >= 40) {
        behaviorStatus = "SUSPICIOUS";
    } else if (behaviorScore >= 20) {
        behaviorStatus = "ELEVATED";
    }

    return {
        behaviorScore,
        behaviorStatus,
        historicalTransactions: history.length,
        averageAmount,
        amountDeviation,
        merchantFrequency,
        deviceFrequency,
        locationFrequency,
        paymentMethodFrequency
    };
}

module.exports = {
    calculateBehaviorIntelligence
};