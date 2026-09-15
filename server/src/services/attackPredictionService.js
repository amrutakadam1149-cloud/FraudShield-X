const predictAttack = (data = {}) => {
    const {
        totalTransactions = 0,
        fraudTransactions = 0,
        suspiciousTransactions = 0,
        highRiskNodes = 0,
        fraudNodes = 0,
        totalEdges = 0
    } = data;

    const transactions = Number(totalTransactions) || 0;
    const fraud = Number(fraudTransactions) || 0;
    const suspicious = Number(suspiciousTransactions) || 0;
    const highRisk = Number(highRiskNodes) || 0;
    const fraudNodeCount = Number(fraudNodes) || 0;
    const edges = Number(totalEdges) || 0;

    const fraudRate =
        transactions > 0
            ? (fraud / transactions) * 100
            : 0;

    const suspiciousRate =
        transactions > 0
            ? (suspicious / transactions) * 100
            : 0;

    let attackScore = 0;

    attackScore += Math.min(fraudRate * 0.45, 45);
    attackScore += Math.min(suspiciousRate * 0.20, 20);
    attackScore += Math.min(highRisk * 0.30, 15);
    attackScore += Math.min(fraudNodeCount * 0.20, 10);

    if (edges >= 200) {
        attackScore += 5;
    }

    attackScore = Math.min(
        Math.max(attackScore, 0),
        100
    );

    let threatLevel = "LOW";

    if (attackScore >= 75) {
        threatLevel = "CRITICAL";
    } else if (attackScore >= 55) {
        threatLevel = "HIGH";
    } else if (attackScore >= 30) {
        threatLevel = "MEDIUM";
    }

    let attackType = "NORMAL_ACTIVITY";

    if (fraudRate >= 40) {
        attackType = "COORDINATED_FRAUD_ATTACK";
    } else if (highRisk >= 30 && fraudNodeCount >= 20) {
        attackType = "FRAUD_NETWORK_ATTACK";
    } else if (suspiciousRate >= 20) {
        attackType = "SUSPICIOUS_ACTIVITY_SURGE";
    } else if (fraudRate >= 15) {
        attackType = "FRAUD_SPIKE";
    }

    const confidence = Math.min(
        Math.max(
            55 +
                fraudRate * 0.25 +
                suspiciousRate * 0.15,
            0
        ),
        99
    );

    const indicators = [];

    if (fraudRate >= 15) {
        indicators.push(
            "Elevated fraud transaction rate detected."
        );
    }

    if (suspiciousRate >= 15) {
        indicators.push(
            "High suspicious transaction activity detected."
        );
    }

    if (highRisk >= 20) {
        indicators.push(
            "Large number of high-risk network nodes detected."
        );
    }

    if (fraudNodeCount >= 20) {
        indicators.push(
            "Multiple fraud-associated nodes detected."
        );
    }

    if (edges >= 200) {
        indicators.push(
            "Dense transaction relationships may indicate coordinated activity."
        );
    }

    if (indicators.length === 0) {
        indicators.push(
            "No major attack indicators detected."
        );
    }

    let recommendation =
        "Continue monitoring transaction activity.";

    if (threatLevel === "CRITICAL") {
        recommendation =
            "Immediately investigate high-risk entities and coordinated fraud activity.";
    } else if (threatLevel === "HIGH") {
        recommendation =
            "Prioritize investigation of high-risk transactions and fraud networks.";
    } else if (threatLevel === "MEDIUM") {
        recommendation =
            "Increase monitoring and investigate suspicious activity.";
    }

    return {
        attackScore: Number(attackScore.toFixed(2)),
        threatLevel,
        attackType,
        confidence: Number(confidence.toFixed(2)),
        fraudRate: Number(fraudRate.toFixed(2)),
        suspiciousRate: Number(
            suspiciousRate.toFixed(2)
        ),
        indicators,
        recommendation,
        analyzedAt: new Date().toISOString()
    };
};

module.exports = {
    predictAttack
};