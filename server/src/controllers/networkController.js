const Transaction = require("../models/Transaction");

/*
=========================================================
FraudShield-X Network Controller
=========================================================

Builds a fraud network from transaction relationships.

Network entities:
- Users
- Devices
- Merchants
- Locations

Relationships:
- User -> Device
- User -> Merchant
- User -> Location
- Device -> Merchant
- Device -> Location

The controller intentionally uses transaction data only.
=========================================================
*/


const normalizeValue = (value, fallback = "UNKNOWN") => {
    if (
        value === undefined ||
        value === null
    ) {
        return fallback;
    }

    const text = String(value).trim();

    return text || fallback;
};


const getRiskScore = (transaction) => {
    const score = Number(
        transaction?.riskScore || 0
    );

    if (!Number.isFinite(score)) {
        return 0;
    }

    return Math.min(
        Math.max(score, 0),
        100
    );
};


const getFraudProbability = (transaction) => {
    let probability = Number(
        transaction?.fraudProbability ??
        transaction?.mlProbability ??
        0
    );

    if (!Number.isFinite(probability)) {
        probability = 0;
    }

    /*
    Some older records may contain probability
    as a decimal between 0 and 1.
    */
    if (
        probability > 0 &&
        probability <= 1
    ) {
        probability *= 100;
    }

    return Math.min(
        Math.max(probability, 0),
        100
    );
};


const getTransactionStatus = (transaction) => {
    if (
        transaction?.isFraud === true ||
        String(
            transaction?.status || ""
        ).toUpperCase() === "FRAUD"
    ) {
        return "FRAUD";
    }

    if (
        String(
            transaction?.status || ""
        ).toUpperCase() === "SUSPICIOUS"
    ) {
        return "SUSPICIOUS";
    }

    return "SAFE";
};


const getRiskLevel = (score) => {
    if (score >= 90) {
        return "CRITICAL";
    }

    if (score >= 70) {
        return "HIGH";
    }

    if (score >= 40) {
        return "MEDIUM";
    }

    return "LOW";
};


/*
=========================================================
GET FRAUD NETWORK
=========================================================
*/

const getFraudNetwork = async (req, res) => {
    try {

        console.log(
            "Fraud network request received."
        );

        const transactions =
            await Transaction
                .find({})
                .sort({
                    createdAt: -1
                })
                .limit(1000)
                .lean();

        console.log(
            "Transactions loaded for network:",
            transactions.length
        );


        const nodesMap = new Map();
        const edgesMap = new Map();


        /*
        -------------------------------------------------
        NODE CREATION
        -------------------------------------------------
        */

        const addNode = (
            id,
            label,
            type,
            transaction
        ) => {

            if (!nodesMap.has(id)) {

                const riskScore =
                    getRiskScore(
                        transaction
                    );

                const fraudProbability =
                    getFraudProbability(
                        transaction
                    );

                const status =
                    getTransactionStatus(
                        transaction
                    );

                nodesMap.set(
                    id,
                    {
                        id,
                        label,
                        type,

                        riskScore,

                        fraudProbability,

                        riskLevel:
                            getRiskLevel(
                                riskScore
                            ),

                        status,

                        transactionCount: 0,

                        fraudCount: 0,

                        suspiciousCount: 0
                    }
                );

            }


            const node =
                nodesMap.get(id);


            node.transactionCount += 1;


            if (
                getTransactionStatus(
                    transaction
                ) === "FRAUD"
            ) {
                node.fraudCount += 1;
            }


            if (
                getTransactionStatus(
                    transaction
                ) === "SUSPICIOUS"
            ) {
                node.suspiciousCount += 1;
            }


            /*
            Keep the highest observed risk
            score for this entity.
            */

            const transactionRisk =
                getRiskScore(
                    transaction
                );

            if (
                transactionRisk >
                node.riskScore
            ) {
                node.riskScore =
                    transactionRisk;

                node.riskLevel =
                    getRiskLevel(
                        transactionRisk
                    );
            }

        };


        /*
        -------------------------------------------------
        EDGE CREATION
        -------------------------------------------------
        */

        const addEdge = (
            source,
            target,
            relationship,
            transaction
        ) => {

            const edgeId =
                `${source}__${target}__${relationship}`;


            if (
                !edgesMap.has(edgeId)
            ) {

                edgesMap.set(
                    edgeId,
                    {
                        id: edgeId,

                        source,

                        target,

                        relationship,

                        transactionCount: 0,

                        fraudCount: 0,

                        suspiciousCount: 0,

                        totalAmount: 0,

                        maxRiskScore: 0
                    }
                );

            }


            const edge =
                edgesMap.get(
                    edgeId
                );


            edge.transactionCount += 1;


            const amount =
                Number(
                    transaction?.amount || 0
                );


            if (
                Number.isFinite(amount)
            ) {
                edge.totalAmount +=
                    amount;
            }


            const riskScore =
                getRiskScore(
                    transaction
                );


            if (
                riskScore >
                edge.maxRiskScore
            ) {
                edge.maxRiskScore =
                    riskScore;
            }


            const status =
                getTransactionStatus(
                    transaction
                );


            if (
                status === "FRAUD"
            ) {
                edge.fraudCount += 1;
            }


            if (
                status === "SUSPICIOUS"
            ) {
                edge.suspiciousCount += 1;
            }

        };


        /*
        -------------------------------------------------
        BUILD NETWORK
        -------------------------------------------------
        */

        for (
            const transaction
            of transactions
        ) {

            const userId =
                normalizeValue(
                    transaction.userId
                );


            const deviceId =
                normalizeValue(
                    transaction.deviceId
                );


            const merchant =
                normalizeValue(
                    transaction.merchant
                );


            const location =
                normalizeValue(
                    transaction.location
                );


            const userNodeId =
                `USER:${userId}`;

            const deviceNodeId =
                `DEVICE:${deviceId}`;

            const merchantNodeId =
                `MERCHANT:${merchant}`;

            const locationNodeId =
                `LOCATION:${location}`;


            /*
            Add nodes
            */

            addNode(
                userNodeId,
                userId,
                "USER",
                transaction
            );


            addNode(
                deviceNodeId,
                deviceId,
                "DEVICE",
                transaction
            );


            addNode(
                merchantNodeId,
                merchant,
                "MERCHANT",
                transaction
            );


            addNode(
                locationNodeId,
                location,
                "LOCATION",
                transaction
            );


            /*
            Add relationships
            */

            addEdge(
                userNodeId,
                deviceNodeId,
                "USES_DEVICE",
                transaction
            );


            addEdge(
                userNodeId,
                merchantNodeId,
                "TRANSACTS_WITH",
                transaction
            );


            addEdge(
                userNodeId,
                locationNodeId,
                "LOCATED_AT",
                transaction
            );


            addEdge(
                deviceNodeId,
                merchantNodeId,
                "DEVICE_USED_AT",
                transaction
            );


            addEdge(
                deviceNodeId,
                locationNodeId,
                "DEVICE_LOCATION",
                transaction
            );

        }


        const nodes =
            Array.from(
                nodesMap.values()
            );


        const edges =
            Array.from(
                edgesMap.values()
            );


        /*
        -------------------------------------------------
        NETWORK STATISTICS
        -------------------------------------------------
        */

        const fraudTransactions =
            transactions.filter(
                (transaction) =>
                    getTransactionStatus(
                        transaction
                    ) === "FRAUD"
            ).length;


        const suspiciousTransactions =
            transactions.filter(
                (transaction) =>
                    getTransactionStatus(
                        transaction
                    ) === "SUSPICIOUS"
            ).length;


        const safeTransactions =
            transactions.filter(
                (transaction) =>
                    getTransactionStatus(
                        transaction
                    ) === "SAFE"
            ).length;


        const totalAmount =
            transactions.reduce(
                (
                    total,
                    transaction
                ) => {

                    const amount =
                        Number(
                            transaction?.amount ||
                            0
                        );

                    return (
                        total +
                        (
                            Number.isFinite(
                                amount
                            )
                                ? amount
                                : 0
                        )
                    );

                },
                0
            );


        const highRiskNodes =
            nodes.filter(
                (node) =>
                    Number(
                        node.riskScore || 0
                    ) >= 70
            ).length;


        const fraudNodes =
            nodes.filter(
                (node) =>
                    Number(
                        node.fraudCount || 0
                    ) > 0
            ).length;


        const statistics = {

            totalTransactions:
                transactions.length,

            totalNodes:
                nodes.length,

            totalEdges:
                edges.length,

            fraudTransactions,

            suspiciousTransactions,

            safeTransactions,

            totalAmount,

            highRiskNodes,

            fraudNodes

        };


        /*
        -------------------------------------------------
        RESPONSE
        -------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            message:
                "Fraud network generated successfully",

            data: {

                nodes,

                edges,

                statistics

            },

            /*
            Compatibility fields.
            These make the response easier for
            different frontend versions to consume.
            */

            nodes,

            edges,

            statistics

        });


    } catch (error) {

        console.error(
            "Fraud network generation failed:"
        );

        console.error(
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to generate fraud network"

        });

    }
};


/*
=========================================================
COMPATIBILITY EXPORTS
=========================================================

Different versions of FraudShield-X may refer to the
controller using different function names.

We export all expected names.
=========================================================
*/

const getNetwork =
    getFraudNetwork;


const getFraudNetworks =
    getFraudNetwork;


module.exports = {

    getFraudNetwork,

    getNetwork,

    getFraudNetworks

};