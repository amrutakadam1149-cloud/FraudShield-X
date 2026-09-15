const express = require("express");

const {
    createTransaction,
    getAllTransactions
} = require("../controllers/transactionController");

const router = express.Router();

// Get all transactions
router.get(
    "/",
    getAllTransactions
);

// Create a transaction
router.post(
    "/",
    createTransaction
);

module.exports = router;