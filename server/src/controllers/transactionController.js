const {
    getAllTransactions: getTransactions,
    processTransaction
} = require("../services/transactionService");

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await getTransactions();

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error("GET TRANSACTIONS ERROR:");
        console.error(error.stack || error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
            error: error.message
        });
    }
};

const createTransaction = async (req, res) => {
    try {
        console.log("========================================");
        console.log("CREATE TRANSACTION REQUEST");
        console.log("Body:", req.body);
        console.log("========================================");

        const {
            userId,
            amount,
            merchant,
            location,
            paymentMethod,
            deviceId,
            transactionTime
        } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        if (
            amount === undefined ||
            amount === null ||
            Number.isNaN(Number(amount))
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        if (!merchant) {
            return res.status(400).json({
                success: false,
                message: "merchant is required"
            });
        }

        if (!location) {
            return res.status(400).json({
                success: false,
                message: "location is required"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "paymentMethod is required"
            });
        }

        if (!deviceId) {
            return res.status(400).json({
                success: false,
                message: "deviceId is required"
            });
        }

        const result = await processTransaction({
            userId: String(userId),
            amount: Number(amount),
            merchant: String(merchant),
            location: String(location),
            paymentMethod: String(paymentMethod),
            deviceId: String(deviceId),
            transactionTime: transactionTime
                ? new Date(transactionTime)
                : new Date()
        });

        console.log("TRANSACTION CREATED SUCCESSFULLY");

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: result
        });

    } catch (error) {
        console.error("========================================");
        console.error("CREATE TRANSACTION ERROR");
        console.error("========================================");
        console.error(error);
        console.error("MESSAGE:", error.message);
        console.error("STACK:", error.stack);
        console.error("========================================");

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            stack: error.stack
        });
    }
};

module.exports = {
    getAllTransactions,
    createTransaction
};