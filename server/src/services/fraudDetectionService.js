// =====================================================
// FraudShield-X
// Fraud Detection Service
// =====================================================

const calculateRiskScore = async (transaction, Transaction) => {

    let riskScore = 0;
    const reasons = [];

    // =====================================================
    // GET TRANSACTION DETAILS
    // =====================================================

    const amount = Number(transaction.amount || 0);

    const paymentMethod = String(
        transaction.paymentMethod || ""
    ).toUpperCase();

    const merchant = String(
        transaction.merchant || ""
    ).toLowerCase();

    const location = String(
        transaction.location || ""
    ).toLowerCase();

    const deviceId = String(
        transaction.deviceId || ""
    ).toLowerCase();


    // =====================================================
    // 1. TRANSACTION AMOUNT
    // =====================================================

    if (amount >= 100000) {

        riskScore += 40;
        reasons.push("Very high transaction amount");

    } else if (amount >= 50000) {

        riskScore += 25;
        reasons.push("High transaction amount");

    } else if (amount >= 20000) {

        riskScore += 10;
        reasons.push("Above-normal transaction amount");
    }


    // =====================================================
    // 2. PAYMENT METHOD
    // =====================================================

    if (paymentMethod === "CARD") {

        riskScore += 10;
        reasons.push("Card payment detected");

    } else if (paymentMethod === "NETBANKING") {

        riskScore += 5;
        reasons.push("Net banking transaction");
    }


    // =====================================================
    // 3. DEVICE CHECK
    // =====================================================

    if (
        !deviceId ||
        deviceId === "unknown" ||
        deviceId === "unknown-device"
    ) {

        riskScore += 20;

        reasons.push(
            "Unknown or missing device"
        );
    }


    // =====================================================
    // 4. SUSPICIOUS MERCHANT
    // =====================================================

    const suspiciousMerchants = [
        "unknown",
        "crypto",
        "casino",
        "unverified",
        "fake",
        "scam"
    ];

    if (
        suspiciousMerchants.some(
            name => merchant.includes(name)
        )
    ) {

        riskScore += 25;

        reasons.push(
            "Suspicious merchant"
        );
    }


    // =====================================================
    // 5. SUSPICIOUS LOCATION
    // =====================================================

    if (
        location.includes("unknown") ||
        location.includes("unverified")
    ) {

        riskScore += 20;

        reasons.push(
            "Suspicious transaction location"
        );
    }


    // =====================================================
    // 6. RECENT USER TRANSACTIONS
    // =====================================================

    let recentTransactions = [];

    if (
        Transaction &&
        transaction.userId
    ) {

        recentTransactions =
            await Transaction.find({
                userId: transaction.userId
            })
            .sort({
                transactionTime: -1
            })
            .limit(5);
    }


    // =====================================================
    // 7. MULTIPLE RECENT TRANSACTIONS
    // =====================================================

    if (
        recentTransactions.length >= 3
    ) {

        riskScore += 20;

        reasons.push(
            "Multiple recent transactions from same user"
        );
    }


    // =====================================================
    // 8. SAME DEVICE USED BY MULTIPLE USERS
    // =====================================================

    if (
        Transaction &&
        transaction.deviceId
    ) {

        const deviceTransactions =
            await Transaction.find({
                deviceId: transaction.deviceId
            })
            .limit(20);

        const uniqueUsers =
            new Set(
                deviceTransactions
                    .map(item => item.userId)
                    .filter(Boolean)
            );

        if (uniqueUsers.size >= 3) {

            riskScore += 20;

            reasons.push(
                "Device associated with multiple users"
            );
        }
    }


    // =====================================================
    // 9. LIMIT RISK SCORE
    // =====================================================

    riskScore = Math.min(
        Math.max(riskScore, 0),
        100
    );


    // =====================================================
    // 10. DETERMINE STATUS
    // =====================================================

    let status;

    if (riskScore >= 70) {

        status = "FRAUD";

    } else if (riskScore >= 40) {

        status = "SUSPICIOUS";

    } else {

        status = "SAFE";
    }


    // =====================================================
    // 11. FINAL RESULT
    // =====================================================

    return {
        riskScore,
        status,
        isFraud: status === "FRAUD",
        reasons
    };
};


// =====================================================
// EXPORT FUNCTION
// =====================================================

module.exports = {
    calculateRiskScore
};