const FraudCase = require("../models/FraudCase");

function generateCaseId() {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `CASE-${timestamp}-${random}`;
}

async function createFraudCase(transaction) {
    if (!transaction) {
        throw new Error("Transaction is required to create a fraud case.");
    }

    // Only create cases for suspicious or fraudulent transactions.
    if (
        transaction.status !== "SUSPICIOUS" &&
        transaction.status !== "FRAUD"
    ) {
        return null;
    }

    // Prevent duplicate cases for the same transaction.
    const existingCase = await FraudCase.findOne({
        transactionId: transaction._id
    });

    if (existingCase) {
        return existingCase;
    }

    const recommendation =
        transaction.investigatorRecommendation || {};

    const fraudDNA =
        transaction.fraudDNA || {};

    const fraudRing =
        transaction.fraudRing || {};

    const fraudCase = new FraudCase({
        caseId: generateCaseId(),

        transactionId: transaction._id,

        userId: transaction.userId,

        riskScore:
            transaction.adaptiveIntelligence?.adaptiveScore ??
            transaction.riskScore ??
            0,

        status: transaction.status,

        investigationPriority:
            recommendation.investigationPriority ||
            "NORMAL",

        caseStatus: "OPEN",

        reasons: transaction.reasons || [],

        fraudDNA: {
            amountAnomaly:
                fraudDNA.amountAnomaly || 0,

            deviceAnomaly:
                fraudDNA.deviceAnomaly || 0,

            merchantAnomaly:
                fraudDNA.merchantAnomaly || 0,

            locationAnomaly:
                fraudDNA.locationAnomaly || 0,

            velocityAnomaly:
                fraudDNA.velocityAnomaly || 0,

            behavioralAnomaly:
                fraudDNA.behavioralAnomaly || 0,

            temporalAnomaly:
                fraudDNA.temporalAnomaly || 0,

            networkAnomaly:
                fraudDNA.networkAnomaly || 0
        },

        dnaScore:
            transaction.dnaScore || 0,

        fraudRing: {
            ringScore:
                fraudRing.ringScore || 0,

            ringStatus:
                fraudRing.ringStatus || "NO_RING",

            connectedUsers:
                fraudRing.connectedUsers || 0,

            connectedDevices:
                fraudRing.connectedDevices || 0,

            connectedMerchants:
                fraudRing.connectedMerchants || 0,

            sharedDeviceUsers:
                fraudRing.sharedDeviceUsers || 0,

            sharedMerchantUsers:
                fraudRing.sharedMerchantUsers || 0,

            suspiciousTransactions:
                fraudRing.suspiciousTransactions || 0,

            multiHopConnections:
                fraudRing.multiHopConnections || 0
        },

        investigatorRecommendation: {
            investigationPriority:
                recommendation.investigationPriority ||
                "NORMAL",

            recommendationCount:
                recommendation.recommendationCount || 0,

            recommendations:
                recommendation.recommendations || [],

            evidence:
                recommendation.evidence || [],

            nextActions:
                recommendation.nextActions || []
        },

        assignedTo: "",

        notes: []
    });

    await fraudCase.save();

    return fraudCase;
}


async function getAllFraudCases(filters = {}) {
    const query = {};

    if (filters.caseStatus) {
        query.caseStatus = filters.caseStatus;
    }

    if (filters.priority) {
        query.investigationPriority = filters.priority;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    return FraudCase.find(query)
        .populate("transactionId")
        .sort({ createdAt: -1 });
}


async function getFraudCaseById(caseId) {
    return FraudCase.findOne({
        caseId
    }).populate("transactionId");
}


async function updateFraudCase(caseId, updates) {
    const allowedUpdates = {};

    if (updates.caseStatus) {
        allowedUpdates.caseStatus =
            updates.caseStatus;
    }

    if (updates.assignedTo !== undefined) {
        allowedUpdates.assignedTo =
            updates.assignedTo;
    }

    if (Array.isArray(updates.notes)) {
        allowedUpdates.notes =
            updates.notes;
    }

    return FraudCase.findOneAndUpdate(
        { caseId },
        { $set: allowedUpdates },
        {
            new: true,
            runValidators: true
        }
    ).populate("transactionId");
}


async function getFraudCaseStats() {
    const [
        total,
        open,
        underReview,
        resolved,
        falsePositive,
        critical,
        high
    ] = await Promise.all([
        FraudCase.countDocuments(),

        FraudCase.countDocuments({
            caseStatus: "OPEN"
        }),

        FraudCase.countDocuments({
            caseStatus: "UNDER_REVIEW"
        }),

        FraudCase.countDocuments({
            caseStatus: "RESOLVED"
        }),

        FraudCase.countDocuments({
            caseStatus: "FALSE_POSITIVE"
        }),

        FraudCase.countDocuments({
            investigationPriority: "CRITICAL"
        }),

        FraudCase.countDocuments({
            investigationPriority: "HIGH"
        })
    ]);

    return {
        total,
        open,
        underReview,
        resolved,
        falsePositive,
        critical,
        high
    };
}


module.exports = {
    createFraudCase,
    getAllFraudCases,
    getFraudCaseById,
    updateFraudCase,
    getFraudCaseStats
};