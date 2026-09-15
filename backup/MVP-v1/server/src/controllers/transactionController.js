const transactionService = require("../services/transactionService");


// =====================================================
// CREATE TRANSACTION
// =====================================================

const createTransaction = async (req, res) => {

    try {

        const transaction =
            await transactionService.createTransaction(
                req.body
            );


        res.status(201).json({

            success: true,

            message:
                "Transaction created successfully",

            data: transaction
        });


    } catch (error) {

        console.error(
            "Transaction creation failed:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create transaction",

            error:
                error.message
        });
    }
};


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

const getAllTransactions = async (req, res) => {

    try {

        const transactions =
            await transactionService.getAllTransactions();


        res.status(200).json({

            success: true,

            count:
                transactions.length,

            data:
                transactions
        });


    } catch (error) {

        console.error(
            "Failed to fetch transactions:",
            error.message
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to fetch transactions",

            error:
                error.message
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createTransaction,
    getAllTransactions
};