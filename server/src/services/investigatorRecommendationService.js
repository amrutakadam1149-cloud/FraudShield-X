function generateInvestigatorRecommendations({
    riskScore = 0,
    status = "SAFE",
    reasons = [],
    fraudDNA = {},
    fraudRing = {},
    adaptiveIntelligence = {}
}) {
    const recommendations = [];
    const evidence = [];

    const score = Number(riskScore) || 0;

    // -----------------------------
    // Risk-based recommendations
    // -----------------------------

    if (score >= 80) {
        recommendations.push({
            priority: "CRITICAL",
            action: "Immediately review and potentially block the transaction.",
            reason: "The adaptive risk score indicates extremely high fraud risk."
        });
    } else if (score >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Perform immediate manual investigation.",
            reason: "The transaction has reached the fraud-risk threshold."
        });
    } else if (score >= 40) {
        recommendations.push({
            priority: "MEDIUM",
            action: "Review the transaction and compare it with the user's historical behavior.",
            reason: "The transaction is classified as suspicious."
        });
    } else {
        recommendations.push({
            priority: "LOW",
            action: "Continue monitoring the transaction.",
            reason: "Current risk indicators are below the suspicious threshold."
        });
    }

    // -----------------------------
    // Fraud DNA recommendations
    // -----------------------------

    if ((fraudDNA.amountAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Verify the transaction amount with the customer.",
            reason: "A significant amount anomaly was detected."
        });

        evidence.push("High amount anomaly detected.");
    }

    if ((fraudDNA.deviceAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Investigate the device and its associated users.",
            reason: "The device shows abnormal association behavior."
        });

        evidence.push("Suspicious device association detected.");
    }

    if ((fraudDNA.merchantAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Review the merchant and previous transactions involving this merchant.",
            reason: "The merchant behavior is highly anomalous."
        });

        evidence.push("High merchant anomaly detected.");
    }

    if ((fraudDNA.locationAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "MEDIUM",
            action: "Verify the transaction location and user's normal geographic behavior.",
            reason: "The transaction location is anomalous."
        });

        evidence.push("Location anomaly detected.");
    }

    if ((fraudDNA.velocityAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Review recent transaction frequency and velocity.",
            reason: "Multiple transactions occurred within a suspicious time window."
        });

        evidence.push("Suspicious transaction velocity detected.");
    }

    if ((fraudDNA.behavioralAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Compare the transaction with the user's historical behavior profile.",
            reason: "The transaction differs significantly from normal user behavior."
        });

        evidence.push("Behavioral deviation detected.");
    }

    if ((fraudDNA.temporalAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "MEDIUM",
            action: "Investigate the transaction time against the user's historical activity.",
            reason: "The transaction occurred during an unusual time period."
        });

        evidence.push("Temporal anomaly detected.");
    }

    if ((fraudDNA.networkAnomaly || 0) >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Investigate connected users, devices, and merchants.",
            reason: "The transaction shows suspicious network relationships."
        });

        evidence.push("Network anomaly detected.");
    }

    // -----------------------------
    // Fraud Ring recommendations
    // -----------------------------

    const ringScore = Number(fraudRing.ringScore) || 0;

    if (ringScore >= 70) {
        recommendations.push({
            priority: "CRITICAL",
            action: "Investigate the entire connected fraud network.",
            reason: "A high-risk fraud ring was detected."
        });

        evidence.push("High-risk fraud ring detected.");
    } else if (ringScore >= 40) {
        recommendations.push({
            priority: "HIGH",
            action: "Investigate connected users, devices, and merchants for coordinated activity.",
            reason: "The network contains suspicious relationships."
        });

        evidence.push("Suspicious fraud-ring pattern detected.");
    } else if (ringScore >= 20) {
        recommendations.push({
            priority: "MEDIUM",
            action: "Monitor the connected network for additional suspicious transactions.",
            reason: "Possible coordinated activity was detected."
        });

        evidence.push("Possible fraud-ring activity detected.");
    }

    // -----------------------------
    // Shared device investigation
    // -----------------------------

    if ((fraudRing.sharedDeviceUsers || 0) >= 2) {
        recommendations.push({
            priority: "HIGH",
            action: "Investigate users sharing the same device.",
            reason: `${fraudRing.sharedDeviceUsers} users are associated with a shared device.`
        });

        evidence.push(
            `${fraudRing.sharedDeviceUsers} users share a device.`
        );
    }

    // -----------------------------
    // Shared merchant investigation
    // -----------------------------

    if ((fraudRing.sharedMerchantUsers || 0) >= 3) {
        recommendations.push({
            priority: "MEDIUM",
            action: "Review users connected through the same merchant.",
            reason: "Multiple users are associated with a common merchant."
        });

        evidence.push(
            `${fraudRing.sharedMerchantUsers} users share merchant activity.`
        );
    }

    // -----------------------------
    // Suspicious transaction count
    // -----------------------------

    if ((fraudRing.suspiciousTransactions || 0) >= 5) {
        recommendations.push({
            priority: "CRITICAL",
            action: "Investigate the connected suspicious transactions as a potential coordinated attack.",
            reason: "Multiple suspicious transactions were detected in the network."
        });

        evidence.push(
            `${fraudRing.suspiciousTransactions} suspicious network transactions detected.`
        );
    }

    // -----------------------------
    // Adaptive intelligence
    // -----------------------------

    const adaptiveScore =
        Number(adaptiveIntelligence.adaptiveScore) || score;

    if (adaptiveScore >= 70) {
        recommendations.push({
            priority: "HIGH",
            action: "Prioritize this transaction in the investigation queue.",
            reason: "Adaptive intelligence has classified the transaction as high risk."
        });
    }

    // -----------------------------
    // Existing rule reasons
    // -----------------------------

    if (Array.isArray(reasons)) {
        reasons.forEach((reason) => {
            if (reason && !evidence.includes(reason)) {
                evidence.push(reason);
            }
        });
    }

    // -----------------------------
    // Status-specific action
    // -----------------------------

    if (status === "FRAUD") {
        recommendations.push({
            priority: "CRITICAL",
            action: "Escalate the transaction as a confirmed fraud candidate.",
            reason: "The final fraud engine status is FRAUD."
        });
    }

    if (status === "SUSPICIOUS") {
        recommendations.push({
            priority: "HIGH",
            action: "Create an investigation case and monitor related activity.",
            reason: "The final fraud engine status is SUSPICIOUS."
        });
    }

    return {
        investigationPriority:
            score >= 70
                ? "CRITICAL"
                : score >= 40
                    ? "HIGH"
                    : "NORMAL",

        recommendationCount: recommendations.length,

        recommendations,

        evidence,

        nextActions: [
            "Review transaction details",
            "Inspect Fraud DNA signals",
            "Review connected network entities",
            "Compare historical user behavior",
            "Check related suspicious transactions"
        ]
    };
}

module.exports = {
    generateInvestigatorRecommendations
};