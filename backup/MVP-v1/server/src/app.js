const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/database");
const transactionRoutes = require("./routes/transactionRoutes");
const networkRoutes = require("./routes/networkRoutes");


/*
 * -----------------------------------------
 * LOAD ENVIRONMENT VARIABLES
 * -----------------------------------------
 */

dotenv.config();


/*
 * -----------------------------------------
 * CREATE EXPRESS APPLICATION
 * -----------------------------------------
 */

const app = express();


/*
 * -----------------------------------------
 * MIDDLEWARE
 * -----------------------------------------
 */

app.use(cors());

app.use(express.json());


/*
 * -----------------------------------------
 * API ROUTES
 * -----------------------------------------
 */

/*
 * Transaction APIs
 *
 * POST /api/transactions
 * GET  /api/transactions
 */
app.use(
    "/api/transactions",
    transactionRoutes
);


/*
 * Fraud Network APIs
 *
 * GET /api/networks
 */
app.use(
    "/api/networks",
    networkRoutes
);


/*
 * -----------------------------------------
 * ROOT API
 * -----------------------------------------
 */

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "FraudShield-X server is running",

        endpoints: {

            transactions:
                "/api/transactions",

            networks:
                "/api/networks"

        }

    });

});


/*
 * -----------------------------------------
 * PORT
 * -----------------------------------------
 */

const PORT =
    process.env.PORT || 5000;


/*
 * -----------------------------------------
 * START SERVER
 * -----------------------------------------
 */

const server =
    app.listen(
        PORT,
        () => {

            console.log(
                "========================================"
            );

            console.log(
                `FraudShield-X server running on port ${PORT}`
            );

            console.log(
                "========================================"
            );

        }
    );


/*
 * -----------------------------------------
 * SERVER ERROR
 * -----------------------------------------
 */

server.on(
    "error",
    (error) => {

        console.error(
            "SERVER ERROR:",
            error
        );

    }
);


/*
 * -----------------------------------------
 * CONNECT MONGODB
 * -----------------------------------------
 */

connectDB()
    .then(() => {

        console.log(
            "MongoDB connection completed."
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error.message
        );

    });


/*
 * -----------------------------------------
 * GRACEFUL SHUTDOWN
 * -----------------------------------------
 */

process.on(
    "SIGINT",
    () => {

        console.log(
            "Server shutting down..."
        );

        server.close(
            () => {

                process.exit(0);

            }
        );

    }
);