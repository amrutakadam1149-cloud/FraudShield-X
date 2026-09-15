const express = require("express");

const {
    getNetwork
} = require("../controllers/networkController");

const router = express.Router();

// Fraud network does not require login.
router.get(
    "/",
    getNetwork
);

module.exports = router;