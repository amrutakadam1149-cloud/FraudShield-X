const Transaction = require("../models/Transaction");

const {
    calculateRiskScore
} = require("./fraudDetectionService");

const {
    predictFraud
} = require("./mlPredictionService");

const {
    calculateFraudDNA
} = require("./fraudDnaService");

const {
    calculateBehaviorIntelligence
} = require("./behaviorIntelligenceService");

const {
    calculateTemporalIntelligence
} = require("./temporalIntelligenceService");

const {
    calculateFraudRing
} = require("./fraudRingService");

const {
    calculateAdaptiveRisk
} = require("./adaptiveFraudEngine");

const {
    generateInvestigatorRecommendations
} = require("./investigatorRecommendationService");

const {
    createFraudCase
} = require("./fraudCaseService");

const {
    createAlertIfRequired
} = require("./alertService");


const safeExecute = async (name, fn, fallback) => {
    try {
        const result = await fn();
        return result;
    } catch (error) {
        console.error(`${name} ERROR:`);
        console.error(error.message);

        return fallback;
    }
};


const getAllTransactions = async () => {
    return await Transaction
        .find()
        .sort({ createdAt: -1 })
        .limit(500);
};


const getTransactionById = async (id) => {
    return await Transaction.findById(id);
};


const processTransaction = async (data) => {

    console.log("========================================");
    console.log("PROCESSING TRANSACTION");
    console.log("========================================");

    console.log("Input:", data);


    /*
     * 1. RULE BASED RISK
     */

    const ruleResult = await safeExecute(
        "RULE ENGINE",
        async () => {

            return await calculateRiskScore({
                userId: data.userId,
                amount: data.amount,
                merchant: data.merchant,
                location: data.location,
                paymentMethod: data.paymentMethod,
                deviceId: data.deviceId,
                transactionTime: data.transactionTime
            });

        },
        {
            riskScore: 0,
            riskLevel: "LOW",
            reasons: []
        }
    );


    /*
     * 2. ML PREDICTION
     */

    const mlResult = await safeExecute(
        "ML SERVICE",
        async () => {

            return await predictFraud({
                amount: data.amount,
                merchant: data.merchant,
                location: data.location,
                paymentMethod: data.paymentMethod,
                deviceId: data.deviceId
            });

        },
        {
            fraudProbability: 0,
            mlPrediction: "UNKNOWN",
            reason: "ML service unavailable"
        }
    );


    /*
     * 3. FRAUD DNA
     */

    const dnaResult = await safeExecute(
        "FRAUD DNA",
        async () => {

            return await calculateFraudDNA({
                userId: data.userId,
                amount: data.amount,
                merchant: data.merchant,
                location: data.location,
                paymentMethod: data.paymentMethod,
                deviceId: data.deviceId
            });

        },
        {
            score: 0,
            profile: {}
        }
    );


    /*
     * 4. BEHAVIOR INTELLIGENCE
     */

    const behaviorResult = await safeExecute(
        "BEHAVIOR INTELLIGENCE",
        async () => {

            return await calculateBehaviorIntelligence({
                userId: data.userId,
                amount: data.amount,
                merchant: data.merchant,
                location: data.location,
                deviceId: data.deviceId
            });

        },
        {
            score: 0,
            intelligence: {}
        }
    );


    /*
     * 5. TEMPORAL INTELLIGENCE
     */

    const temporalResult = await safeExecute(
        "TEMPORAL INTELLIGENCE",
        async () => {

            return await calculateTemporalIntelligence({
                userId: data.userId,
                transactionTime: data.transactionTime,
                amount: data.amount
            });

        },
        {
            score: 0,
            status: "NORMAL",
            intelligence: {}
        }
    );


    /*
     * 6. FRAUD RING
     */

    const ringResult = await safeExecute(
        "FRAUD RING",
        async () => {

            return await calculateFraudRing({
                userId: data.userId,
                deviceId: data.deviceId,
                merchant: data.merchant,
                location: data.location
            });

        },
        {
            score: 0,
            status: "NO_RING",
            ring: {}
        }
    );


    /*
     * 7. ADAPTIVE RISK
     */

    const adaptiveResult = await safeExecute(
        "ADAPTIVE RISK",
        async () => {

            return await calculateAdaptiveRisk({
                ruleScore:
                    ruleResult?.riskScore || 0,

                mlProbability:
                    mlResult?.fraudProbability || 0,

                fraudDnaScore:
                    dnaResult?.score ||
                    dnaResult?.fraudDnaScore ||
                    0,

                behaviorScore:
                    behaviorResult?.score ||
                    behaviorResult?.behaviorScore ||
                    0,

                temporalScore:
                    temporalResult?.score ||
                    temporalResult?.temporalScore ||
                    0,

                fraudRingScore:
                    ringResult?.score ||
                    ringResult?.fraudRingScore ||
                    0
            });

        },
        {
            score: ruleResult?.riskScore || 0,
            riskLevel:
                ruleResult?.riskLevel || "LOW"
        }
    );


    /*
     * 8. FINAL VALUES
     */

    const riskScore = Number(
        adaptiveResult?.score ??
        adaptiveResult?.adaptiveScore ??
        ruleResult?.riskScore ??
        0
    );


    const fraudProbability = Number(
        mlResult?.fraudProbability ??
        mlResult?.probability ??
        0
    );


    let status = "SAFE";

    if (
        fraudProbability >= 70 ||
        riskScore >= 80
    ) {
        status = "FRAUD";

    } else if (
        fraudProbability >= 40 ||
        riskScore >= 55
    ) {
        status = "SUSPICIOUS";
    }


    let riskLevel = "LOW";

    if (riskScore >= 80) {
        riskLevel = "CRITICAL";

    } else if (riskScore >= 60) {
        riskLevel = "HIGH";

    } else if (riskScore >= 30) {
        riskLevel = "MEDIUM";
    }


    /*
     * 9. REASONS
     */

    const reasons = [];

    if (Array.isArray(ruleResult?.reasons)) {
        reasons.push(...ruleResult.reasons);
    }

    if (mlResult?.reason) {
        reasons.push(mlResult.reason);
    }

    if (mlResult?.mlPrediction === "FRAUD") {
        reasons.push("Machine learning model detected fraud.");
    }

    if (riskScore >= 80) {
        reasons.push("Critical adaptive risk score detected.");
    } else if (riskScore >= 60) {
        reasons.push("High adaptive risk score detected.");
    }

    if (reasons.length === 0) {
        reasons.push("No significant fraud indicators detected.");
    }


    /*
     * 10. CREATE TRANSACTION
     */

    const transaction = await Transaction.create({

        userId: data.userId,

        amount: data.amount,

        merchant: data.merchant,

        location: data.location,

        paymentMethod: data.paymentMethod,

        deviceId: data.deviceId,

        transactionTime:
            data.transactionTime || new Date(),

        status,

        riskScore,

        riskLevel,

        fraudProbability,

        mlPrediction:
            mlResult?.mlPrediction || "UNKNOWN",

        fraudDna:
            dnaResult?.profile ||
            dnaResult?.fraudDna ||
            {},

        fraudDnaScore:
            Number(
                dnaResult?.score ??
                dnaResult?.fraudDnaScore ??
                0
            ),

        behaviorIntelligence:
            behaviorResult?.intelligence ||
            behaviorResult?.behaviorIntelligence ||
            {},

        behaviorScore:
            Number(
                behaviorResult?.score ??
                behaviorResult?.behaviorScore ??
                0
            ),

        temporalIntelligence:
            temporalResult?.intelligence ||
            temporalResult?.temporalIntelligence ||
            {},

        temporalScore:
            Number(
                temporalResult?.score ??
                temporalResult?.temporalScore ??
                0
            ),

        temporalStatus:
            temporalResult?.status ||
            temporalResult?.temporalStatus ||
            "NORMAL",

        fraudRing:
            ringResult?.ring ||
            ringResult?.fraudRing ||
            {},

        fraudRingScore:
            Number(
                ringResult?.score ??
                ringResult?.fraudRingScore ??
                0
            ),

        fraudRingStatus:
            ringResult?.status ||
            ringResult?.fraudRingStatus ||
            "NO_RING",

        adaptiveRisk:
            adaptiveResult || {},

        adaptiveScore:
            riskScore,

        reasons,

        intelligence: {
            rule: ruleResult,
            ml: mlResult,
            fraudDna: dnaResult,
            behavior: behaviorResult,
            temporal: temporalResult,
            fraudRing: ringResult,
            adaptive: adaptiveResult
        }
    });


    console.log("========================================");
    console.log("TRANSACTION SAVED");
    console.log("ID:", transaction._id);
    console.log("STATUS:", transaction.status);
    console.log("RISK SCORE:", transaction.riskScore);
    console.log("ML PROBABILITY:", transaction.fraudProbability);
    console.log("========================================");


    /*
     * 11. INVESTIGATOR RECOMMENDATION
     */

    const recommendation = await safeExecute(
        "INVESTIGATOR RECOMMENDATION",
        async () => {

            return await generateInvestigatorRecommendations(
                transaction
            );

        },
        {}
    );


    /*
     * 12. FRAUD CASE
     */

    const fraudCase = await safeExecute(
        "FRAUD CASE",
        async () => {

            if (
                status === "FRAUD" ||
                status === "SUSPICIOUS"
            ) {
                return await createFraudCase(
                    transaction
                );
            }

            return null;

        },
        null
    );


    /*
     * 13. ALERT
     */

    const alert = await safeExecute(
        "ALERT",
        async () => {

            if (
                status === "FRAUD" ||
                status === "SUSPICIOUS"
            ) {

                return await createAlertIfRequired({
                    transaction,
                    riskScore,
                    fraudProbability,
                    status
                });

            }

            return null;

        },
        null
    );


    return {

        transaction,

        intelligence: {

            rule: ruleResult,

            ml: mlResult,

            fraudDna: dnaResult,

            behavior: behaviorResult,

            temporal: temporalResult,

            fraudRing: ringResult,

            adaptive: adaptiveResult,

            investigatorRecommendation:
                recommendation
        },

        fraudCase,

        alert
    };
};


module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction: processTransaction,
    processTransaction
};