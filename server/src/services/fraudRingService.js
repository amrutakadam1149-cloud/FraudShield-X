const Transaction = require("../models/Transaction");


const calculateFraudRing = async (transaction) => {

    const userId =
        transaction.userId;

    const deviceId =
        transaction.deviceId;

    const merchant =
        String(transaction.merchant || "")
            .toLowerCase()
            .trim();


    /*
     * Find transactions connected to the
     * current user, device, or merchant.
     */
    const directTransactions =
        await Transaction.find({
            $or: [
                { userId: userId },
                { deviceId: deviceId },
                { merchant: transaction.merchant }
            ]
        })
        .sort({
            transactionTime: -1
        })
        .limit(100)
        .lean();


    if (!directTransactions.length) {

        return {
            success: true,
            ringScore: 0,
            ringStatus: "NO_RING",

            signals: {
                connectedUsers: 0,
                connectedDevices: 0,
                connectedMerchants: 0,
                sharedDeviceUsers: 0,
                sharedMerchantUsers: 0,
                suspiciousTransactions: 0,
                multiHopConnections: 0
            },

            network: {
                users: [],
                devices: [],
                merchants: []
            }
        };
    }


    /*
     * Entity sets.
     */
    const users =
        new Set();

    const devices =
        new Set();

    const merchants =
        new Set();


    /*
     * Build direct network.
     */
    for (
        const item of directTransactions
    ) {

        if (item.userId) {

            users.add(
                item.userId
            );
        }


        if (item.deviceId) {

            devices.add(
                item.deviceId
            );
        }


        if (item.merchant) {

            merchants.add(
                String(item.merchant)
                    .toLowerCase()
                    .trim()
            );
        }
    }


    /*
     * Find all transactions involving
     * connected users or devices.
     *
     * This creates a second network layer.
     */
    const secondHopTransactions =
        await Transaction.find({
            $or: [
                {
                    userId: {
                        $in:
                            Array.from(users)
                    }
                },
                {
                    deviceId: {
                        $in:
                            Array.from(devices)
                    }
                },
                {
                    merchant: {
                        $in:
                            Array.from(merchants)
                    }
                }
            ]
        })
        .limit(200)
        .lean();


    /*
     * Add second-hop entities.
     */
    for (
        const item of secondHopTransactions
    ) {

        if (item.userId) {

            users.add(
                item.userId
            );
        }


        if (item.deviceId) {

            devices.add(
                item.deviceId
            );
        }


        if (item.merchant) {

            merchants.add(
                String(item.merchant)
                    .toLowerCase()
                    .trim()
            );
        }
    }


    /*
     * Count suspicious transactions.
     */
    const suspiciousTransactions =
        secondHopTransactions.filter(
            item =>
                item.isFraud === true ||
                item.status === "FRAUD" ||
                item.status === "SUSPICIOUS"
        ).length;


    /*
     * Count users sharing current device.
     */
    const currentDeviceTransactions =
        secondHopTransactions.filter(
            item =>
                item.deviceId === deviceId
        );


    const sharedDeviceUsers =
        new Set(
            currentDeviceTransactions
                .map(item => item.userId)
                .filter(Boolean)
        );


    /*
     * Count users connected to current merchant.
     */
    const currentMerchantTransactions =
        secondHopTransactions.filter(
            item =>
                String(item.merchant || "")
                    .toLowerCase()
                    .trim() === merchant
        );


    const sharedMerchantUsers =
        new Set(
            currentMerchantTransactions
                .map(item => item.userId)
                .filter(Boolean)
        );


    /*
     * Multi-hop connection count.
     */
    let multiHopConnections = 0;


    for (
        const connectedUser
        of users
    ) {

        const userTransactions =
            secondHopTransactions.filter(
                item =>
                    item.userId ===
                    connectedUser
            );


        const userDevices =
            new Set(
                userTransactions
                    .map(item => item.deviceId)
                    .filter(Boolean)
            );


        const userMerchants =
            new Set(
                userTransactions
                    .map(item =>
                        String(
                            item.merchant || ""
                        )
                        .toLowerCase()
                        .trim()
                    )
                    .filter(Boolean)
            );


        /*
         * A user connected through both
         * devices and merchants provides
         * stronger network evidence.
         */
        if (
            userDevices.size >= 2 &&
            userMerchants.size >= 2
        ) {

            multiHopConnections++;
        }
    }


    /*
     * Network counts.
     */
    const connectedUsers =
        users.size;

    const connectedDevices =
        devices.size;

    const connectedMerchants =
        merchants.size;


    /*
     * Calculate ring score.
     */
    let ringScore = 0;


    /*
     * Shared device evidence.
     */
    if (
        sharedDeviceUsers.size >= 2
    ) {

        ringScore += 30;
    }


    if (
        sharedDeviceUsers.size >= 3
    ) {

        ringScore += 15;
    }


    /*
     * Shared merchant evidence.
     */
    if (
        sharedMerchantUsers.size >= 3
    ) {

        ringScore += 10;
    }


    /*
     * Multiple devices.
     */
    if (
        connectedDevices >= 3
    ) {

        ringScore += 10;
    }


    /*
     * Multiple merchants.
     */
    if (
        connectedMerchants >= 3
    ) {

        ringScore += 10;
    }


    /*
     * Suspicious transaction concentration.
     */
    if (
        suspiciousTransactions >= 2
    ) {

        ringScore += 15;
    }


    if (
        suspiciousTransactions >= 5
    ) {

        ringScore += 10;
    }


    /*
     * Multi-hop evidence.
     */
    if (
        multiHopConnections >= 1
    ) {

        ringScore += 15;
    }


    if (
        multiHopConnections >= 3
    ) {

        ringScore += 10;
    }


    /*
     * Cap score.
     */
    ringScore =
        Math.min(
            ringScore,
            100
        );


    /*
     * Determine ring status.
     */
    let ringStatus =
        "NO_RING";


    if (
        ringScore >= 70
    ) {

        ringStatus =
            "HIGH_RISK_RING";

    } else if (
        ringScore >= 40
    ) {

        ringStatus =
            "SUSPICIOUS_RING";

    } else if (
        ringScore >= 20
    ) {

        ringStatus =
            "POSSIBLE_RING";
    }


    return {

        success: true,

        ringScore,

        ringStatus,

        signals: {

            connectedUsers,

            connectedDevices,

            connectedMerchants,

            sharedDeviceUsers:
                sharedDeviceUsers.size,

            sharedMerchantUsers:
                sharedMerchantUsers.size,

            suspiciousTransactions,

            multiHopConnections
        },

        network: {

            users:
                Array.from(users),

            devices:
                Array.from(devices),

            merchants:
                Array.from(merchants)
        }
    };
};


module.exports = {
    calculateFraudRing
};