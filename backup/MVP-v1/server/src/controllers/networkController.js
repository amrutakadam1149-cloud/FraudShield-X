const Transaction = require("../models/Transaction");


/*
 * -----------------------------------------
 * GET FRAUD NETWORK DATA
 * -----------------------------------------
 */

const getNetworkData = async (req, res) => {

    try {

        /*
         * Get all transactions from MongoDB.
         */
        const transactions =
            await Transaction.find()
                .sort({
                    transactionTime: -1
                })
                .lean();


        /*
         * -----------------------------------------
         * CREATE UNIQUE USERS
         * -----------------------------------------
         */

        const usersMap = new Map();

        transactions.forEach((transaction) => {

            if (!usersMap.has(transaction.userId)) {

                usersMap.set(
                    transaction.userId,
                    {
                        id: transaction.userId,
                        type: "user",
                        label: transaction.userId,
                        transactionCount: 0,
                        fraudCount: 0,
                        riskScore: 0
                    }
                );

            }

            const user =
                usersMap.get(transaction.userId);

            user.transactionCount += 1;

            if (transaction.isFraud) {
                user.fraudCount += 1;
            }

            user.riskScore =
                Math.max(
                    user.riskScore,
                    Number(transaction.riskScore || 0)
                );

        });


        /*
         * -----------------------------------------
         * CREATE UNIQUE DEVICES
         * -----------------------------------------
         */

        const devicesMap = new Map();

        transactions.forEach((transaction) => {

            if (!devicesMap.has(transaction.deviceId)) {

                devicesMap.set(
                    transaction.deviceId,
                    {
                        id: transaction.deviceId,
                        type: "device",
                        label: transaction.deviceId,
                        transactionCount: 0,
                        users: new Set(),
                        fraudCount: 0
                    }
                );

            }

            const device =
                devicesMap.get(transaction.deviceId);

            device.transactionCount += 1;

            device.users.add(
                transaction.userId
            );

            if (transaction.isFraud) {
                device.fraudCount += 1;
            }

        });


        /*
         * -----------------------------------------
         * CREATE UNIQUE MERCHANTS
         * -----------------------------------------
         */

        const merchantsMap = new Map();

        transactions.forEach((transaction) => {

            const merchant =
                String(
                    transaction.merchant || "Unknown"
                );

            if (!merchantsMap.has(merchant)) {

                merchantsMap.set(
                    merchant,
                    {
                        id: merchant,
                        type: "merchant",
                        label: merchant,
                        transactionCount: 0,
                        fraudCount: 0,
                        riskScore: 0
                    }
                );

            }

            const merchantData =
                merchantsMap.get(merchant);

            merchantData.transactionCount += 1;

            if (transaction.isFraud) {
                merchantData.fraudCount += 1;
            }

            merchantData.riskScore =
                Math.max(
                    merchantData.riskScore,
                    Number(transaction.riskScore || 0)
                );

        });


        /*
         * -----------------------------------------
         * CREATE NETWORK CONNECTIONS
         * -----------------------------------------
         */

        const edges = [];

        transactions.forEach((transaction) => {

            /*
             * User → Device
             */
            edges.push({
                source: transaction.userId,
                target: transaction.deviceId,
                type: "user-device",
                riskScore: Number(
                    transaction.riskScore || 0
                ),
                isFraud: Boolean(
                    transaction.isFraud
                )
            });


            /*
             * User → Merchant
             */
            edges.push({
                source: transaction.userId,
                target: transaction.merchant,
                type: "user-merchant",
                riskScore: Number(
                    transaction.riskScore || 0
                ),
                isFraud: Boolean(
                    transaction.isFraud
                )
            });

        });


        /*
         * -----------------------------------------
         * FIND SHARED DEVICES
         * -----------------------------------------
         */

        const sharedDevices = [];

        devicesMap.forEach((device) => {

            const users =
                Array.from(device.users);

            if (users.length >= 2) {

                sharedDevices.push({

                    deviceId:
                        device.id,

                    users:
                        users,

                    userCount:
                        users.length,

                    transactionCount:
                        device.transactionCount,

                    fraudCount:
                        device.fraudCount

                });

            }

        });


        /*
         * -----------------------------------------
         * CONVERT MAPS TO ARRAYS
         * -----------------------------------------
         */

        const users =
            Array.from(
                usersMap.values()
            );

        const devices =
            Array.from(
                devicesMap.values()
            ).map((device) => ({

                id: device.id,

                type: device.type,

                label: device.label,

                transactionCount:
                    device.transactionCount,

                userCount:
                    device.users.size,

                fraudCount:
                    device.fraudCount

            }));

        const merchants =
            Array.from(
                merchantsMap.values()
            );


        /*
         * -----------------------------------------
         * NETWORK STATISTICS
         * -----------------------------------------
         */

        const fraudTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.isFraud
            ).length;


        const suspiciousTransactions =
            transactions.filter(
                (transaction) =>
                    transaction.status === "SUSPICIOUS"
            ).length;


        /*
         * -----------------------------------------
         * FINAL RESPONSE
         * -----------------------------------------
         */

        res.status(200).json({

            success: true,

            statistics: {

                totalTransactions:
                    transactions.length,

                totalUsers:
                    users.length,

                totalDevices:
                    devices.length,

                totalMerchants:
                    merchants.length,

                fraudTransactions:
                    fraudTransactions,

                suspiciousTransactions:
                    suspiciousTransactions,

                sharedDevices:
                    sharedDevices.length,

                totalConnections:
                    edges.length

            },

            nodes: {

                users,

                devices,

                merchants

            },

            edges,

            sharedDevices

        });

    } catch (error) {

        console.error(
            "Network analysis failed:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to generate fraud network",

            error:
                error.message

        });

    }

};


module.exports = {
    getNetworkData
};