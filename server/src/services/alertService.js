const Alert = require("../models/Alert");


/* =========================================================
   NORMALIZE FRAUD PROBABILITY

   Accepts either:
   0.10  -> 10%
   10    -> 10%
   0.90  -> 90%
   90    -> 90%
========================================================= */

const normalizeProbability = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    if (number >= 0 && number <= 1) {
        return number * 100;
    }

    return Math.min(
        Math.max(number, 0),
        100
    );
};


/* =========================================================
   CREATE ALERT
========================================================= */

const createAlert = async (data = {}) => {

    try {

        const {
            transactionId = null,
            userId = "UNKNOWN",
            riskScore = 0,
            fraudProbability = 0,
            alertType = "SUSPICIOUS_ACTIVITY",
            metadata = {}
        } = data;


        const normalizedRiskScore =
            Math.min(
                Math.max(
                    Number(riskScore) || 0,
                    0
                ),
                100
            );


        const normalizedProbability =
            normalizeProbability(
                fraudProbability
            );


        /* =====================================================
           SEVERITY
        ===================================================== */

        let severity = "LOW";


        if (
            alertType === "FRAUD_DETECTED" ||
            normalizedRiskScore >= 90 ||
            normalizedProbability >= 90
        ) {

            severity = "CRITICAL";

        } else if (
            normalizedRiskScore >= 70 ||
            normalizedProbability >= 70
        ) {

            severity = "HIGH";

        } else if (
            normalizedRiskScore >= 40 ||
            normalizedProbability >= 40
        ) {

            severity = "MEDIUM";
        }


        /* =====================================================
           MESSAGE
        ===================================================== */

        let message =
            "Suspicious transaction activity detected.";


        if (
            alertType === "FRAUD_DETECTED"
        ) {

            message =
                "Fraudulent transaction detected by FraudShield-X.";

        } else if (
            alertType === "HIGH_RISK"
        ) {

            message =
                "High-risk transaction detected.";

        } else if (
            alertType === "VELOCITY_ALERT"
        ) {

            message =
                "Unusual transaction velocity detected.";

        } else if (
            alertType === "FRAUD_RING"
        ) {

            message =
                "Potential fraud ring activity detected.";
        }


        /* =====================================================
           SAVE ALERT
        ===================================================== */

        const alert =
            await Alert.create({

                transactionId,

                userId,

                alertType,

                severity,

                riskScore:
                    normalizedRiskScore,

                fraudProbability:
                    normalizedProbability,

                message,

                status: "NEW",

                metadata
            });


        console.log(
            "========================================"
        );

        console.log(
            "ALERT CREATED"
        );

        console.log(
            "Type:",
            alertType
        );

        console.log(
            "Severity:",
            severity
        );

        console.log(
            "User:",
            userId
        );

        console.log(
            "Risk Score:",
            normalizedRiskScore
        );

        console.log(
            "Fraud Probability:",
            normalizedProbability + "%"
        );

        console.log(
            "========================================"
        );


        return alert;


    } catch (error) {

        console.error(
            "========================================"
        );

        console.error(
            "ALERT CREATION FAILED"
        );

        console.error(
            error.message
        );

        console.error(
            "========================================"
        );

        throw error;
    }
};


/* =========================================================
   CREATE ALERT IF REQUIRED
========================================================= */

const createAlertIfRequired = async (
    data = {}
) => {

    const {
        riskScore = 0,
        fraudProbability = 0,
        isFraud = false,
        temporalStatus = "",
        fraudRingStatus = ""
    } = data;


    const normalizedRiskScore =
        Math.min(
            Math.max(
                Number(riskScore) || 0,
                0
            ),
            100
        );


    const normalizedProbability =
        normalizeProbability(
            fraudProbability
        );


    let alertType = null;


    /* =====================================================
       1. CONFIRMED FRAUD
       
       IMPORTANT:
       Do NOT treat 10% as 100%.
       Fraud is triggered by:
       - final transaction fraud decision
       - OR >= 90% ML probability
    ===================================================== */

    if (
        isFraud === true ||
        normalizedProbability >= 90
    ) {

        alertType =
            "FRAUD_DETECTED";


    /* =====================================================
       2. FRAUD RING
    ===================================================== */

    } else if (
        fraudRingStatus === "HIGH_RISK" ||
        fraudRingStatus === "HIGH_RISK_RING"
    ) {

        alertType =
            "FRAUD_RING";


    /* =====================================================
       3. TEMPORAL / VELOCITY
    ===================================================== */

    } else if (
        temporalStatus === "HIGH_RISK"
    ) {

        alertType =
            "VELOCITY_ALERT";


    /* =====================================================
       4. HIGH RISK
    ===================================================== */

    } else if (
        normalizedRiskScore >= 70 ||
        normalizedProbability >= 70
    ) {

        alertType =
            "HIGH_RISK";


    /* =====================================================
       5. SUSPICIOUS
    ===================================================== */

    } else if (
        normalizedRiskScore >= 40 ||
        normalizedProbability >= 40
    ) {

        alertType =
            "SUSPICIOUS_ACTIVITY";
    }


    /* =====================================================
       NO ALERT REQUIRED
    ===================================================== */

    if (!alertType) {

        return null;
    }


    return createAlert({

        ...data,

        riskScore:
            normalizedRiskScore,

        fraudProbability:
            normalizedProbability,

        alertType
    });
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

    createAlert,

    createAlertIfRequired,

    normalizeProbability

};