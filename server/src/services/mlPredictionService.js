const axios = require("axios");
const Transaction = require("../models/Transaction");

const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL ||
    "http://127.0.0.1:8000";

const predictFraud = async (data) => {
    try {
        const {
            userId,
            amount,
            merchant,
            location,
            paymentMethod,
            deviceId
        } = data;

        // ----------------------------------------
        // Historical user frequency
        // ----------------------------------------

        const userFrequency = userId
            ? await Transaction.countDocuments({
                  userId
              })
            : 1;

        // ----------------------------------------
        // Historical device frequency
        // ----------------------------------------

        const deviceFrequency = deviceId
            ? await Transaction.countDocuments({
                  deviceId
              })
            : 1;

        // ----------------------------------------
        // Shared device detection
        // ----------------------------------------

        let sharedDevice = 0;

        if (deviceId) {
            const usersOnDevice =
                await Transaction.distinct(
                    "userId",
                    {
                        deviceId
                    }
                );

            if (usersOnDevice.length > 1) {
                sharedDevice = 1;
            }
        }

        // ----------------------------------------
        // Merchant risk
        // ----------------------------------------

        let merchantRisk = 0;

        if (merchant) {
            const merchantTransactions =
                await Transaction.find(
                    { merchant },
                    {
                        status: 1
                    }
                ).lean();

            if (merchantTransactions.length > 0) {
                const fraudCount =
                    merchantTransactions.filter(
                        (transaction) =>
                            transaction.status === "FRAUD"
                    ).length;

                const suspiciousCount =
                    merchantTransactions.filter(
                        (transaction) =>
                            transaction.status ===
                            "SUSPICIOUS"
                    ).length;

                const total =
                    merchantTransactions.length;

                merchantRisk = Math.min(
                    100,
                    (
                        (
                            fraudCount * 100 +
                            suspiciousCount * 50
                        ) /
                        total
                    )
                );
            }
        }

        // ----------------------------------------
        // Initial risk score for ML
        // ----------------------------------------

        let riskScore = 0;

        if (Number(amount) >= 100000) {
            riskScore += 60;
        } else if (Number(amount) >= 50000) {
            riskScore += 40;
        } else if (Number(amount) >= 25000) {
            riskScore += 20;
        }

        if (deviceFrequency >= 5) {
            riskScore += 15;
        }

        if (userFrequency >= 5) {
            riskScore += 10;
        }

        if (sharedDevice >= 1) {
            riskScore += 10;
        }

        if (merchantRisk >= 70) {
            riskScore += 20;
        }

        riskScore = Math.min(
            100,
            riskScore
        );

        // ----------------------------------------
        // Prepare ML request
        // ----------------------------------------

        const payload = {
            amount: Number(amount) || 0,
            riskScore,
            deviceFrequency,
            userFrequency,
            sharedDevice,
            merchantRisk
        };

        console.log(
            "========================================"
        );
        console.log("ML PREDICTION REQUEST");
        console.log(
            "ML SERVICE:",
            ML_SERVICE_URL
        );
        console.log("FEATURES:", payload);
        console.log(
            "========================================"
        );

        // ----------------------------------------
        // Call Python ML service
        // ----------------------------------------

        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            payload,
            {
                timeout: 30000,
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

        const result = response.data;

        if (!result || result.success !== true) {
            throw new Error(
                result?.message ||
                "ML service returned an invalid response"
            );
        }

        const fraudProbability = Number(
            result.fraudProbability ?? 0
        );

        const mlPrediction =
            result.isFraud === true ||
            result.prediction === 1
                ? "FRAUD"
                : fraudProbability >= 40
                ? "SUSPICIOUS"
                : "SAFE";

        console.log(
            "ML PREDICTION RESULT:",
            mlPrediction
        );

        console.log(
            "ML FRAUD PROBABILITY:",
            fraudProbability
        );

        return {
            fraudProbability,
            mlPrediction,
            prediction: Number(
                result.prediction ?? 0
            ),
            isFraud:
                result.isFraud === true,
            status:
                result.status || mlPrediction,
            modelProbability: Number(
                result.modelProbability ?? 0
            ),
            decisionReason:
                result.decisionReason ||
                "ML model prediction",
            riskSignals:
                Array.isArray(
                    result.riskSignals
                )
                    ? result.riskSignals
                    : [],
            features: {
                amount: Number(amount) || 0,
                riskScore,
                deviceFrequency,
                userFrequency,
                sharedDevice,
                merchantRisk
            }
        };

    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "ML PREDICTION ERROR"
        );

        console.error(
            "========================================"
        );

        if (error.response) {
            console.error(
                "ML STATUS:",
                error.response.status
            );

            console.error(
                "ML RESPONSE:",
                error.response.data
            );
        } else {
            console.error(
                "ERROR:",
                error.message
            );
        }

        console.error(
            "========================================"
        );

        // ----------------------------------------
        // Safe fallback
        // ----------------------------------------

        return {
            fraudProbability: 0,
            mlPrediction: "UNKNOWN",
            prediction: 0,
            isFraud: false,
            status: "UNKNOWN",
            modelProbability: 0,
            decisionReason:
                "ML service unavailable",
            riskSignals: [],
            features: {
                amount: Number(data.amount) || 0,
                riskScore: 0,
                deviceFrequency: 1,
                userFrequency: 1,
                sharedDevice: 0,
                merchantRisk: 0
            },
            error: error.message
        };
    }
};

module.exports = {
    predictFraud
};