const express = require("express");

const {
    getAllCases,
    getCaseById,
    updateCaseStatus,
    getCaseStats
} = require("../controllers/fraudCaseController");

const router = express.Router();

// Get all fraud cases
router.get(
    "/",
    getAllCases
);

// Get fraud case statistics
router.get(
    "/stats",
    getCaseStats
);

// Get a single fraud case
router.get(
    "/:id",
    getCaseById
);

// Update fraud case status
router.patch(
    "/:id/status",
    updateCaseStatus
);

module.exports = router;