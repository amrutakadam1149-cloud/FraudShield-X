const Transaction = require("../models/Transaction");

const {
    calculateRiskScore
} = require("./fraudDetectionService");

const {
    predictFraud
} = require("./mlPredictionService");


/*
 * Get additional transaction information
 * that will be sent to the ML service.
 */
const getMlContext = async (transaction) => {

    const [
        deviceTransactions,
        userTransactions
    ] = await Promise.all([

        Transaction.find({
            deviceId: transaction.deviceId
        })
        .select("userId")
        .lean(),

        Transaction.find({
            userId: transaction.userId
        })
        .select("_id")
        .lean()

    ]);


    /*
     * Find how many different users
     * are associated with this device.
     */
    const uniqueUsers = new Set(
        deviceTransactions.map(
            (item) => item.userId
        )
    );


    /*
     * Check whether the merchant
     * looks suspicious.
     */
    const merchant =
        String(
            transaction.merchant || ""
        ).toLowerCase();


    const suspiciousMerchants = [
        "unknown",
        "unknownmerchant",
        "crypto",
        "casino",
        "unverified",
        "fake",
        "scam"
    ];


    const merchantRisk =
        suspiciousMerchants.some(
            (name) =>
                merchant.includes(name)
        )
            ? 1
            : 0;


    return {

        deviceFrequency:
            deviceTransactions.length + 1,

        userFrequency:
            userTransactions.length + 1,

        sharedDevice:
            uniqueUsers.size >= 2
                ? 1
                : 0,

        merchantRisk

    };
};


/*
 * Create and analyze a new transaction.
 */
const createTransaction = async (
    transactionData
) => {

    /*
     * Prepare transaction data.
     */
    const transaction = {

        userId:
            transactionData.userId,

        amount:
            Number(transactionData.amount),

        merchant:
            transactionData.merchant,

        location:
            transactionData.location,

        paymentMethod:
            transactionData.paymentMethod,

        deviceId:
            transactionData.deviceId

    };


    /*
     * -----------------------------------------
     * STEP 1: RULE-BASED FRAUD DETECTION
     * -----------------------------------------
     */

    const fraudResult =
        await calculateRiskScore(
            transaction,
            Transaction
        );


    /*
     * -----------------------------------------
     * STEP 2: GET ML FEATURES
     * -----------------------------------------
     */

    const mlContext =
        await getMlContext(
            transaction
        );


    /*
     * -----------------------------------------
     * STEP 3: CALL ML SERVICE
     * -----------------------------------------
     */

    const mlResult =
        await predictFraud({

            amount:
                transaction.amount,

            riskScore:
                fraudResult.riskScore,

            deviceFrequency:
                mlContext.deviceFrequency,

            userFrequency:
                mlContext.userFrequency,

            sharedDevice:
                mlContext.sharedDevice,

            merchantRisk:
                mlContext.merchantRisk

        });


    /*
     * -----------------------------------------
     * STEP 4: INITIAL FINAL VALUES
     * -----------------------------------------
     */

    let finalRiskScore =
        fraudResult.riskScore;

    let finalStatus =
        fraudResult.status;

    let finalIsFraud =
        fraudResult.isFraud;


    /*
     * Separate ML probability field.
     */
    let mlProbability = 0;


    const finalReasons = [
        ...fraudResult.reasons
    ];


    /*
     * -----------------------------------------
     * STEP 5: PROCESS ML RESULT
     * -----------------------------------------
     */

    if (
        mlResult &&
        mlResult.success
    ) {

        mlProbability =
            Number(
                mlResult.fraudProbability || 0
            );


        /*
         * Keep ML probability between 0 and 100.
         */
        mlProbability =
            Math.min(
                Math.max(
                    mlProbability,
                    0
                ),
                100
            );


        /*
         * Use the higher value between
         * rule-based risk and ML probability.
         */
        finalRiskScore =
            Math.max(
                finalRiskScore,
                Math.round(
                    mlProbability
                )
            );


        /*
         * ML probability >= 70%
         * means FRAUD.
         */
        if (
            mlProbability >= 70
        ) {

            finalStatus =
                "FRAUD";

            finalIsFraud =
                true;

        }


        /*
         * ML probability between
         * 40% and 69.99%
         * means SUSPICIOUS.
         */
        else if (
            mlProbability >= 40
        ) {

            if (
                finalStatus !== "FRAUD"
            ) {

                finalStatus =
                    "SUSPICIOUS";

                finalIsFraud =
                    false;

            }

        }


        /*
         * Add ML explanation.
         */
        finalReasons.push(
            `ML fraud probability: ${mlProbability.toFixed(2)}%`
        );

    }


    /*
     * If ML service is unavailable,
     * keep rule-based result.
     */
    else {

        finalReasons.push(
            "ML service unavailable"
        );

    }


    /*
     * -----------------------------------------
     * STEP 6: CREATE MONGODB DOCUMENT
     * -----------------------------------------
     */

    const newTransaction =
        new Transaction({

            ...transaction,

            /*
             * Final combined risk score.
             */
            riskScore:
                Math.min(
                    Math.max(
                        finalRiskScore,
                        0
                    ),
                    100
                ),

            /*
             * Separate ML probability field.
             */
            mlProbability:
                mlProbability,

            /*
             * Final transaction status.
             */
            status:
                finalStatus,

            /*
             * Whether transaction is fraud.
             */
            isFraud:
                finalIsFraud,

            /*
             * Fraud detection explanations.
             */
            reasons:
                finalReasons

        });


    /*
     * -----------------------------------------
     * DEBUG: CHECK ML PROBABILITY
     * -----------------------------------------
     */

    console.log("========================================");

    console.log(
        "DEBUG ML PROBABILITY:",
        mlProbability
    );

    console.log(
        "DEBUG TRANSACTION:",
        newTransaction.toObject()
    );

    console.log("========================================");


    /*
     * -----------------------------------------
     * STEP 7: SAVE TO MONGODB
     * -----------------------------------------
     */

    const savedTransaction =
        await newTransaction.save();


    /*
     * DEBUG SAVED DOCUMENT
     */
    console.log("========================================");

    console.log(
        "DEBUG SAVED TRANSACTION:",
        savedTransaction.toObject()
    );

    console.log("========================================");


    return savedTransaction;

};


/*
 * -----------------------------------------
 * GET ALL TRANSACTIONS
 * -----------------------------------------
 */

const getAllTransactions = async () => {

    return await Transaction.find()
        .sort({
            transactionTime: -1
        });

};


/*
 * -----------------------------------------
 * EXPORT SERVICES
 * -----------------------------------------
 */

module.exports = {

    createTransaction,

    getAllTransactions

};