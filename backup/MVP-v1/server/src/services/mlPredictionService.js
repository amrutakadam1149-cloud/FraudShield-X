const axios = require("axios");

const ML_SERVICE_URL = "http://127.0.0.1:8000/predict";


const predictFraud = async ({
    amount,
    riskScore,
    deviceFrequency,
    userFrequency,
    sharedDevice,
    merchantRisk
}) => {

    console.log("");
    console.log("========================================");
    console.log("Calling FraudShield-X ML Service...");
    console.log("========================================");

    console.log("ML URL:", ML_SERVICE_URL);

    console.log("ML Input:", {
        amount,
        riskScore,
        deviceFrequency,
        userFrequency,
        sharedDevice,
        merchantRisk
    });


    try {

        const response = await axios.post(
            ML_SERVICE_URL,
            {
                amount,
                riskScore,
                deviceFrequency,
                userFrequency,
                sharedDevice,
                merchantRisk
            },
            {
                timeout: 5000
            }
        );


        console.log("ML Response:", response.data);

        console.log("========================================");
        console.log("ML Service Call Successful");
        console.log("========================================");
        console.log("");


        return response.data;

    } catch (error) {

        console.error("");
        console.error("========================================");
        console.error("ML SERVICE ERROR");
        console.error("========================================");

        console.error(
            "Error:",
            error.message
        );

        if (error.response) {

            console.error(
                "ML Status:",
                error.response.status
            );

            console.error(
                "ML Response:",
                error.response.data
            );

        }

        console.error("========================================");
        console.error("");


        return {
            success: false,
            isFraud: false,
            status: "UNKNOWN",
            fraudProbability: 0,
            message: "ML service unavailable"
        };
    }
};


module.exports = {
    predictFraud
};