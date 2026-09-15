require("dotenv").config();

const environment = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI
};

module.exports = environment;