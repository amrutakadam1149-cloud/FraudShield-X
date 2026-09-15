const axios = require("axios");

const ML_SERVICE_URL =
    process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

/*
 * Normalize ML probability to percentage format: 0 - 100.
 *
 * Examples:
 * 0.10   -> 10
 * 0.75   -> 75
 * 0.90   -> 90
 * 10     -> 10
 * 75     -> 75
 * 100    -> 100
 */
const normalizeProbability = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    if (number >= 0 && number <= 1) {
        return Math.round(number * 10000) / 100;
    }

    return Math.round(
        Math.min(Math.max(number, 0), 100) * 100
    ) / 100;
};

const predictFraud = async (data = {}) => {
    const {
        amount = 0,
        merchant = "",
        location = "",
        paymentMethod = "",
        deviceId = "",
        userId = ""
    } = data;

    console.log("========================================");
    console.log("ML FRAUD PREDICTION");
    console.log("ML SERVICE:", ML_SERVICE_URL);
    console.log("User:", userId);
    console.log("Amount:", amount);
    console.log("========================================");

    try {
        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            {
                amount: Number(amount) || 0,
                merchant,
                location,
                paymentMethod,
                deviceId,
                userId
            },
            {
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        const result = response.data || {};

        /*
         * Support different response names from the ML service.
         */
        const rawProbability =
            result.fraudProbability ??
            result.fraud_probability ??
            result.probability ??
            result.mlProbability ??
            result.ml_probability ??
            0;

        const fraudProbability =
            normalizeProbability(rawProbability);

        /*
         * Keep prediction/status information if supplied
         * by the ML service.
         */
        const prediction =
            result.prediction ??
            result.label ??
            result.classification ??
            null;

        const isFraud =
            result.isFraud === true ||
            result.is_fraud === true ||
            prediction === "FRAUD" ||
            prediction === "fraud" ||
            fraudProbability >= 90;

        let mlStatus = "NORMAL";

        if (fraudProbability >= 90) {
            mlStatus = "HIGH_RISK";
        } else if (fraudProbability >= 70) {
            mlStatus = "SUSPICIOUS";
        } else if (fraudProbability >= 40) {
            mlStatus = "ELEVATED";
        }

        console.log("========================================");
        console.log("ML PREDICTION RESULT");
        console.log("Raw probability:", rawProbability);
        console.log("Normalized probability:", fraudProbability);
        console.log("Prediction:", prediction);
        console.log("Is Fraud:", isFraud);
        console.log("ML Status:", mlStatus);
        console.log("========================================");

        return {
            success: true,

            fraudProbability,

            /*
             * Keep aliases for compatibility with existing
             * FraudShield-X services.
             */
            mlProbability: fraudProbability,

            prediction,
            isFraud,
            mlStatus,

            model: result.model || "fraud_model.pkl",

            rawResponse: result
        };

    } catch (error) {

        console.error("========================================");
        console.error("ML PREDICTION FAILED");
        console.error("Error:", error.message);
        console.error("========================================");

        /*
         * Do not crash the complete transaction pipeline
         * if the ML service is temporarily unavailable.
         */
        return {
            success: false,

            fraudProbability: 0,
            mlProbability: 0,

            prediction: null,
            isFraud: false,
            mlStatus: "UNAVAILABLE",

            error: error.message
        };
    }
};

module.exports = {
    predictFraud,
    normalizeProbability
};