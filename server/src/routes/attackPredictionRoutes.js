const express = require("express");

const {
    getAttackPrediction
} = require(
    "../controllers/attackPredictionController"
);

const router = express.Router();

router.get(
    "/",
    getAttackPrediction
);

module.exports = router;