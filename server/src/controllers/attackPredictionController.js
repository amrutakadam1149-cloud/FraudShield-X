const Transaction = require("../models/Transaction");
const {
    predictAttack
} = require("../services/attackPredictionService");

const getAttackPrediction = async (req, res) => {
    try {
        // ========================================
        // 1. GET TRANSACTIONS
        // ========================================

        const transactions = await Transaction.find({})
            .select(
                "status riskScore userId deviceId merchant location paymentMethod amount"
            )
            .lean();

        const totalTransactions = transactions.length;

        // ========================================
        // 2. TRANSACTION STATISTICS
        // ========================================

        const fraudTransactions = transactions.filter(
            (transaction) =>
                String(transaction.status || "")
                    .toUpperCase() === "FRAUD"
        ).length;

        const suspiciousTransactions = transactions.filter(
            (transaction) =>
                String(transaction.status || "")
                    .toUpperCase() === "SUSPICIOUS"
        ).length;

        const safeTransactions = transactions.filter(
            (transaction) =>
                String(transaction.status || "")
                    .toUpperCase() === "SAFE"
        ).length;

        const highRiskTransactions = transactions.filter(
            (transaction) =>
                Number(transaction.riskScore || 0) >= 70
        ).length;

        // ========================================
        // 3. BUILD NETWORK INFORMATION DIRECTLY
        // ========================================

        const users = new Set();
        const devices = new Set();
        const merchants = new Set();
        const locations = new Set();

        const edges = new Set();

        let fraudNodes = 0;
        let highRiskNodes = 0;

        transactions.forEach((transaction) => {
            const userId = transaction.userId
                ? String(transaction.userId)
                : "";

            const deviceId = transaction.deviceId
                ? String(transaction.deviceId)
                : "";

            const merchantName = transaction.merchant
                ? String(transaction.merchant)
                : "Unknown";

            const locationName = transaction.location
                ? String(transaction.location)
                : "Unknown";

            // ------------------------------
            // Nodes
            // ------------------------------

            if (userId) {
                users.add(userId);
            }

            if (deviceId) {
                devices.add(deviceId);
            }

            merchants.add(merchantName);
            locations.add(locationName);

            // ------------------------------
            // Transaction risk
            // ------------------------------

            const riskScore =
                Number(transaction.riskScore || 0);

            const status =
                String(transaction.status || "")
                    .toUpperCase();

            if (riskScore >= 70) {
                highRiskNodes++;
            }

            if (status === "FRAUD") {
                fraudNodes++;
            }

            // ------------------------------
            // Relationships
            // ------------------------------

            if (userId && deviceId) {
                edges.add(
                    `USER:${userId}->DEVICE:${deviceId}`
                );
            }

            if (userId && merchantName) {
                edges.add(
                    `USER:${userId}->MERCHANT:${merchantName}`
                );
            }

            if (userId && locationName) {
                edges.add(
                    `USER:${userId}->LOCATION:${locationName}`
                );
            }

            if (deviceId && merchantName) {
                edges.add(
                    `DEVICE:${deviceId}->MERCHANT:${merchantName}`
                );
            }

            if (deviceId && locationName) {
                edges.add(
                    `DEVICE:${deviceId}->LOCATION:${locationName}`
                );
            }
        });

        const totalNodes =
            users.size +
            devices.size +
            merchants.size +
            locations.size;

        const totalEdges = edges.size;

        // ========================================
        // 4. UNIQUE FRAUD-ASSOCIATED NODES
        // ========================================

        const fraudNodeSet = new Set();

        transactions.forEach((transaction) => {
            const status =
                String(transaction.status || "")
                    .toUpperCase();

            if (status !== "FRAUD") {
                return;
            }

            if (transaction.userId) {
                fraudNodeSet.add(
                    `USER:${String(transaction.userId)}`
                );
            }

            if (transaction.deviceId) {
                fraudNodeSet.add(
                    `DEVICE:${String(transaction.deviceId)}`
                );
            }

            if (transaction.merchant) {
                fraudNodeSet.add(
                    `MERCHANT:${String(transaction.merchant)}`
                );
            }

            if (transaction.location) {
                fraudNodeSet.add(
                    `LOCATION:${String(transaction.location)}`
                );
            }
        });

        const uniqueFraudNodes =
            fraudNodeSet.size;

        // ========================================
        // 5. CALCULATE ATTACK PREDICTION
        // ========================================

        const prediction = predictAttack({
            totalTransactions,
            fraudTransactions,
            suspiciousTransactions,

            highRiskNodes,

            fraudNodes: uniqueFraudNodes,

            totalEdges
        });

        // ========================================
        // 6. ADD EXTRA NETWORK METRICS
        // ========================================

        const fraudRate =
            totalTransactions > 0
                ? (
                    fraudTransactions /
                    totalTransactions
                ) * 100
                : 0;

        const suspiciousRate =
            totalTransactions > 0
                ? (
                    suspiciousTransactions /
                    totalTransactions
                ) * 100
                : 0;

        const riskRate =
            totalTransactions > 0
                ? (
                    highRiskTransactions /
                    totalTransactions
                ) * 100
                : 0;

        // ========================================
        // 7. RESPONSE
        // ========================================

        res.status(200).json({
            success: true,

            message:
                "Attack prediction generated successfully",

            data: {
                ...prediction,

                network: {
                    totalNodes,
                    totalEdges,

                    userNodes: users.size,
                    deviceNodes: devices.size,
                    merchantNodes: merchants.size,
                    locationNodes: locations.size,

                    fraudNodes: uniqueFraudNodes,
                    highRiskNodes
                },

                statistics: {
                    totalTransactions,
                    fraudTransactions,
                    suspiciousTransactions,
                    safeTransactions,

                    highRiskTransactions,

                    fraudRate:
                        Number(
                            fraudRate.toFixed(2)
                        ),

                    suspiciousRate:
                        Number(
                            suspiciousRate.toFixed(2)
                        ),

                    riskRate:
                        Number(
                            riskRate.toFixed(2)
                        ),

                    totalNodes,
                    totalEdges,

                    fraudNodes:
                        uniqueFraudNodes,

                    highRiskNodes
                }
            }
        });

    } catch (error) {
        console.error(
            "========================================"
        );

        console.error(
            "ATTACK PREDICTION ERROR"
        );

        console.error(
            "========================================"
        );

        console.error(
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate attack prediction"
        });
    }
};

module.exports = {
    getAttackPrediction
};