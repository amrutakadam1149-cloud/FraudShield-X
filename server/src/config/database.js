const mongoose = require("mongoose");
const dns = require("dns");
const net = require("net");
const tls = require("tls");

const TEST_TIMEOUT = 10000;

function getMongoUri() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is missing.");
    }

    return uri.trim();
}

function getHostsFromUri(uri) {
    try {
        const withoutProtocol = uri.replace(/^mongodb(?:\+srv)?:\/\//, "");
        const withoutCredentials = withoutProtocol.includes("@")
            ? withoutProtocol.substring(withoutProtocol.lastIndexOf("@") + 1)
            : withoutProtocol;

        const hostPart = withoutCredentials.split("/")[0];
        const hosts = hostPart
            .split(",")
            .map((host) => host.split(":")[0].trim())
            .filter(Boolean);

        return hosts;
    } catch (error) {
        return [];
    }
}

function dnsTest(host) {
    return new Promise((resolve) => {
        dns.lookup(host, { family: 4 }, (error, address) => {
            if (error) {
                console.log(`[DNS] ${host} -> FAILED`);
                console.log(`[DNS] ${error.code || ""} ${error.message}`);
                resolve(false);
                return;
            }

            console.log(`[DNS] ${host} -> ${address}`);
            resolve(true);
        });
    });
}

function tcpTest(host) {
    return new Promise((resolve) => {
        console.log(`[TCP] Testing ${host}:27017 ...`);

        const socket = net.createConnection({
            host,
            port: 27017,
            family: 4
        });

        let finished = false;

        const finish = (result) => {
            if (finished) return;
            finished = true;

            socket.destroy();
            resolve(result);
        };

        socket.setTimeout(TEST_TIMEOUT);

        socket.on("connect", () => {
            console.log(`[TCP] ${host}:27017 -> CONNECTED`);
            finish(true);
        });

        socket.on("timeout", () => {
            console.log(`[TCP] ${host}:27017 -> TIMEOUT`);
            finish(false);
        });

        socket.on("error", (error) => {
            console.log(`[TCP] ${host}:27017 -> FAILED`);
            console.log(
                `[TCP] ${error.code || ""} ${error.message}`
            );
            finish(false);
        });
    });
}

function tlsTest(host) {
    return new Promise((resolve) => {
        console.log(`[TLS] Testing ${host}:27017 ...`);

        const socket = tls.connect({
            host,
            port: 27017,
            servername: host,
            family: 4,
            minVersion: "TLSv1.2",
            rejectUnauthorized: true
        });

        let finished = false;

        const finish = (result) => {
            if (finished) return;
            finished = true;

            socket.destroy();
            resolve(result);
        };

        socket.setTimeout(TEST_TIMEOUT);

        socket.on("secureConnect", () => {
            console.log(`[TLS] ${host}:27017 -> SECURE CONNECTION`);

            console.log(
                `[TLS] authorized: ${socket.authorized}`
            );

            if (socket.authorizationError) {
                console.log(
                    `[TLS] authorizationError: ${socket.authorizationError}`
                );
            }

            console.log(
                `[TLS] protocol: ${socket.getProtocol()}`
            );

            console.log(
                `[TLS] cipher: ${socket.getCipher()?.name || "unknown"}`
            );

            finish(true);
        });

        socket.on("timeout", () => {
            console.log(`[TLS] ${host}:27017 -> TIMEOUT`);
            finish(false);
        });

        socket.on("error", (error) => {
            console.log(`[TLS] ${host}:27017 -> FAILED`);
            console.log(
                `[TLS] ${error.code || ""} ${error.message}`
            );
            finish(false);
        });
    });
}

async function connectDB() {
    console.log("========================================");
    console.log("MongoDB NETWORK DIAGNOSTIC");
    console.log("========================================");

    let uri;

    try {
        uri = getMongoUri();
    } catch (error) {
        console.error(error.message);
        throw error;
    }

    console.log("MongoDB URI found: YES");

    console.log(
        "MongoDB URI type:",
        uri.startsWith("mongodb+srv://")
            ? "ATLAS SRV"
            : uri.startsWith("mongodb://")
                ? "STANDARD mongodb://"
                : "UNKNOWN"
    );

    const hosts = getHostsFromUri(uri);

    console.log("Hosts detected:", hosts.length);

    if (hosts.length === 0) {
        throw new Error(
            "Could not extract MongoDB hosts from MONGODB_URI."
        );
    }

    console.log("========================================");
    console.log("STEP 1: DNS TEST");
    console.log("========================================");

    const dnsResults = [];

    for (const host of hosts) {
        const result = await dnsTest(host);
        dnsResults.push({
            host,
            success: result
        });
    }

    console.log("========================================");
    console.log("STEP 2: TCP TEST");
    console.log("========================================");

    const tcpResults = [];

    for (const item of dnsResults) {
        if (!item.success) {
            console.log(
                `[TCP] Skipping ${item.host} because DNS failed.`
            );

            tcpResults.push({
                host: item.host,
                success: false
            });

            continue;
        }

        const result = await tcpTest(item.host);

        tcpResults.push({
            host: item.host,
            success: result
        });
    }

    console.log("========================================");
    console.log("STEP 3: TLS TEST");
    console.log("========================================");

    const tlsResults = [];

    for (const item of tcpResults) {
        if (!item.success) {
            console.log(
                `[TLS] Skipping ${item.host} because TCP failed.`
            );

            tlsResults.push({
                host: item.host,
                success: false
            });

            continue;
        }

        const result = await tlsTest(item.host);

        tlsResults.push({
            host: item.host,
            success: result
        });
    }

    console.log("========================================");
    console.log("DIAGNOSTIC SUMMARY");
    console.log("========================================");

    console.log("DNS RESULTS:");
    console.log(dnsResults);

    console.log("TCP RESULTS:");
    console.log(tcpResults);

    console.log("TLS RESULTS:");
    console.log(tlsResults);

    const tcpSuccess = tcpResults.some(
        (item) => item.success
    );

    const tlsSuccess = tlsResults.some(
        (item) => item.success
    );

    console.log("========================================");

    if (!tcpSuccess) {
        console.log(
            "RESULT: RENDER CANNOT REACH ATLAS ON TCP 27017."
        );
        console.log(
            "This is a network/connectivity problem."
        );

        process.exit(1);
    }

    if (!tlsSuccess) {
        console.log(
            "RESULT: TCP WORKS BUT TLS HANDSHAKE FAILS."
        );
        console.log(
            "This points to a TLS/network-path problem."
        );

        process.exit(1);
    }

    console.log(
        "RESULT: TCP AND TLS CONNECTIONS WORK."
    );

    console.log(
        "Now testing Mongoose connection..."
    );

    console.log("========================================");

    try {
        await mongoose.connect(uri, {
            tls: true,
            family: 4,
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            heartbeatFrequencyMS: 10000,
            retryWrites: true
        });

        console.log("========================================");
        console.log("MONGOOSE CONNECTION: SUCCESS");
        console.log("========================================");

        console.log(
            "Database:",
            mongoose.connection.name
        );

        console.log(
            "Ready state:",
            mongoose.connection.readyState
        );

        return mongoose.connection;
    } catch (error) {
        console.log("========================================");
        console.log("MONGOOSE CONNECTION: FAILED");
        console.log("========================================");

        console.log("Error name:", error.name);
        console.log("Error message:", error.message);

        throw error;
    }
}

module.exports = connectDB;