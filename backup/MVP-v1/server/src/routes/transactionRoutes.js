const express = require("express");

const {
    createTransaction,
    getAllTransactions
} = require("../controllers/transactionController");

const router = express.Router();


// =====================================================
// CREATE TRANSACTION
// POST /api/transactions
// =====================================================

router.post(
    "/",
    createTransaction
);


// =====================================================
// GET ALL TRANSACTIONS
// GET /api/transactions
// =====================================================

router.get(
    "/",
    getAllTransactions
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;