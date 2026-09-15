const clamp = (value) => {
    return Math.min(
        Math.max(Number(value) || 0, 0),
        100
    );
};


/*
 * Fraud DNA Signal Engine
 *
 * Generates a structured fraud-state representation
 * for a transaction.
 *
 * Each signal is normalized to 0-100.
 */

const calculateFraudDNA = async (
    transaction,
    Transaction
) => {

    const amount =
        Number(transaction.amount || 0);

    const merchant =
        String(
            transaction.merchant || ""
        ).toLowerCase();

    const location =
        String(
            transaction.location || ""
        ).toLowerCase();

    const deviceId =
        String(
            transaction.deviceId || ""
        ).toLowerCase();


    /*
     * 1. Amount Anomaly
     */

    let amountAnomaly = 0;

    if (amount >= 150000) {
        amountAnomaly = 100;
    } else if (amount >= 100000) {
        amountAnomaly = 85;
    } else if (amount >= 50000) {
        amountAnomaly = 65;
    } else if (amount >= 20000) {
        amountAnomaly = 35;
    }


    /*
     * 2. Device Anomaly
     */

    let deviceAnomaly = 0;

    if (
        !deviceId ||
        deviceId === "unknown" ||
        deviceId === "unknown-device"
    ) {
        deviceAnomaly = 100;
    }


    let deviceTransactions = [];

    if (
        Transaction &&
        transaction.deviceId
    ) {

        deviceTransactions =
            await Transaction.find({
                deviceId:
                    transaction.deviceId
            })
            .select("userId")
            .lean();

    }


    const uniqueUsers =
        new Set(
            deviceTransactions.map(
                (item) => item.userId
            )
        );


    if (uniqueUsers.size >= 5) {
        deviceAnomaly = Math.max(
            deviceAnomaly,
            100
        );
    } else if (uniqueUsers.size >= 3) {
        deviceAnomaly = Math.max(
            deviceAnomaly,
            75
        );
    } else if (uniqueUsers.size >= 2) {
        deviceAnomaly = Math.max(
            deviceAnomaly,
            50
        );
    }


    /*
     * 3. Merchant Anomaly
     */

    const suspiciousMerchants = [
        "unknown",
        "unknownmerchant",
        "crypto",
        "casino",
        "unverified",
        "fake",
        "scam"
    ];


    const merchantAnomaly =
        suspiciousMerchants.some(
            (name) =>
                merchant.includes(name)
        )
            ? 100
            : 0;


    /*
     * 4. Location Anomaly
     */

    let locationAnomaly = 0;

    if (
        location.includes("unknown") ||
        location.includes("unverified")
    ) {
        locationAnomaly = 100;
    }


    /*
     * 5. Velocity Anomaly
     *
     * Measures repeated activity from the
     * same user.
     */

    let velocityAnomaly = 0;

    let userTransactions = [];

    if (
        Transaction &&
        transaction.userId
    ) {

        userTransactions =
            await Transaction.find({
                userId:
                    transaction.userId
            })
            .select("_id")
            .lean();

    }


    const userFrequency =
        userTransactions.length + 1;


    if (userFrequency >= 10) {
        velocityAnomaly = 100;
    } else if (userFrequency >= 7) {
        velocityAnomaly = 80;
    } else if (userFrequency >= 5) {
        velocityAnomaly = 60;
    } else if (userFrequency >= 3) {
        velocityAnomaly = 35;
    }


    /*
     * 6. Behavioral Anomaly
     *
     * Initial version uses a combination of
     * device and merchant anomalies.
     *
     * This will later be replaced by a
     * learned user behavioral profile.
     */

    const behavioralAnomaly =
        clamp(
            (
                deviceAnomaly * 0.5
                +
                merchantAnomaly * 0.5
            )
        );


    /*
     * 7. Temporal Anomaly
     *
     * Initial version.
     *
     * A full temporal intelligence engine
     * will be added in the next phase.
     */

    let temporalAnomaly = 0;

    const hour =
        new Date().getHours();


    if (
        hour >= 0 &&
        hour <= 4
    ) {
        temporalAnomaly = 50;
    }


    /*
     * 8. Network Anomaly
     *
     * Shared device is the first network signal.
     */

    let networkAnomaly = 0;

    if (uniqueUsers.size >= 5) {
        networkAnomaly = 100;
    } else if (uniqueUsers.size >= 3) {
        networkAnomaly = 75;
    } else if (uniqueUsers.size >= 2) {
        networkAnomaly = 50;
    }


    /*
     * Final Fraud DNA
     */

    const fraudDNA = {

        amountAnomaly:
            clamp(amountAnomaly),

        deviceAnomaly:
            clamp(deviceAnomaly),

        merchantAnomaly:
            clamp(merchantAnomaly),

        locationAnomaly:
            clamp(locationAnomaly),

        velocityAnomaly:
            clamp(velocityAnomaly),

        behavioralAnomaly:
            clamp(behavioralAnomaly),

        temporalAnomaly:
            clamp(temporalAnomaly),

        networkAnomaly:
            clamp(networkAnomaly)

    };


    /*
     * Average signal intensity.
     */

    const values =
        Object.values(
            fraudDNA
        );


    const dnaScore =
        clamp(
            values.reduce(
                (sum, value) =>
                    sum + value,
                0
            ) / values.length
        );


    return {

        success: true,

        dnaScore:
            Number(
                dnaScore.toFixed(2)
            ),

        fraudDNA

    };

};


module.exports = {
    calculateFraudDNA
};