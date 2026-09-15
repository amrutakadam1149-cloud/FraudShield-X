const express = require("express");

const {
    getAllAlerts,
    getAlertStats,
    acknowledgeAlert,
    resolveAlert
} = require("../controllers/alertController");

const router = express.Router();

// Get all alerts
router.get(
    "/",
    getAllAlerts
);

// Get alert statistics
router.get(
    "/stats",
    getAlertStats
);

// Acknowledge an alert
router.patch(
    "/:id/acknowledge",
    acknowledgeAlert
);

// Resolve an alert
router.patch(
    "/:id/resolve",
    resolveAlert
);

module.exports = router;