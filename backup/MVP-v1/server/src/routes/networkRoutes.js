const express = require("express");

const {
    getNetworkData
} = require("../controllers/networkController");


const router = express.Router();


/*
 * GET FRAUD NETWORK DATA
 *
 * GET /api/networks
 */
router.get("/", getNetworkData);


module.exports = router;