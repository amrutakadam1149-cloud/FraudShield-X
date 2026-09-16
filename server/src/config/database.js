const mongoose = require("mongoose");
const dns = require("dns");
const net = require("net");
const tls = require("tls");

function getHosts(uri) {
    const cleanUri = uri
        .replace(/^mongodb(\+srv)?:\/\//, "")
        .split("@")
        .pop()
        .split("/")[0]
        .split("?")[0];

    return cleanUri
        .split(",")
        .map((host) => host.trim())
        .filter(Boolean)
        .map((host) => {
            const parts = host.split(":");

            return {
                host: parts[0],
                port: Number(parts[1] || 27017)
            };
        });
}

function testDNS(host) {
    return new Promise((resolve) => {
        dns.lookup(host, { family: 4 }, (error, address) => {
            if (error) {
                console.log(`[DNS] ${host} -> FAILED`);
                console.log(`[DNS] ${error.message}`);
                resolve(false);
                return;
            }

            console.log(`[DNS] ${host} -> ${address}`);
            resolve(true);
        });
    });
}

function testTCP(host, port) {
    return new Promise((resolve) => {
        const socket = net.createConnection({
            host,
            port,
            family: 4
        });

        let finished = false;

        const finish = (result) => {
            if (finished) return;

            finished = true;

            socket.destroy();

            resolve(result);
        };

        socket.setTimeout(10000);

        socket.on("connect", () => {
            console.log(
                `[TCP] ${host}:${port} -> CONNECTED`
            );

            finish(true);
        });

        socket.on("timeout", () => {
            console.log(
                `[TCP] ${host}:${port} -> TIMEOUT`
            );

            finish(false);
        });

        socket.on("error", (error) => {
            console.log(
                `[TCP] ${host}:${port} -> FAILED`
            );

            console.log(
                `[TCP] ${error.message}`
            );

            finish(false);
        });
    });
}

function testTLS(host, port, minVersion, maxVersion) {
    return new Promise((resolve) => {
        console.log(
            `[TLS ${minVersion}-${maxVersion}] Testing ${host}:${port} ...`
        );

        const socket = tls.connect({
            host,
            port,
            family: 4,
            servername: host,
            minVersion,
            maxVersion,
            rejectUnauthorized: true
        });

        let finished = false;

        const finish = (result) => {
            if (finished) return;

            finished = true;

            socket.destroy();

            resolve(result);
        };

        socket.setTimeout(15000);

        socket.on("secureConnect", () => {
            console.log(
                `[TLS ${minVersion}-${maxVersion}] ${host}:${port} -> SUCCESS`
            );

            console.log(
                `[TLS] Negotiated protocol: ${socket.getProtocol()}`
            );

            console.log(
                `[TLS] Cipher: ${socket.getCipher().name}`
            );

            finish(true);
        });

        socket.on("timeout", () => {
            console.log(
                `[TLS ${minVersion}-${maxVersion}] ${host}:${port} -> TIMEOUT`
            );

            finish(false);
        });

        socket.on("error", (error) => {
            console.log(
                `[TLS ${minVersion}-${maxVersion}] ${host}:${port} -> FAILED`
            );

            console.log(
                `[TLS] ${error.message}`
            );

            finish(false);
        });
    });
}

const connectDB = async () => {
    try {
        console.log("========================================");
        console.log("MONGODB RENDER TLS DIAGNOSTIC");
        console.log("========================================");

        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MONGODB_URI is missing");
        }

        console.log("MongoDB URI found: YES");

        console.log(
            "Node version:",
            process.version
        );

        console.log(
            "Mongoose version:",
            mongoose.version
        );

        const hosts = getHosts(uri);

        console.log(
            "MongoDB hosts:",
            hosts.map((x) => x.host).join(", ")
        );

        console.log("");
        console.log("========================================");
        console.log("STEP 1: DNS TEST");
        console.log("========================================");

        let dnsOK = true;

        for (const item of hosts) {
            const result = await testDNS(item.host);

            if (!result) {
                dnsOK = false;
            }
        }

        console.log("");
        console.log(
            "DNS RESULT:",
            dnsOK ? "ALL OK" : "FAILED"
        );

        console.log("");
        console.log("========================================");
        console.log("STEP 2: TCP TEST");
        console.log("========================================");

        let tcpOK = false;

        for (const item of hosts) {
            const result = await testTCP(
                item.host,
                item.port
            );

            if (result) {
                tcpOK = true;
            }
        }

        console.log("");
        console.log(
            "TCP RESULT:",
            tcpOK ? "AT LEAST ONE HOST OK" : "ALL FAILED"
        );

        console.log("");
        console.log("========================================");
        console.log("STEP 3: TLS 1.2 TEST");
        console.log("========================================");

        let tls12OK = false;

        for (const item of hosts) {
            const result = await testTLS(
                item.host,
                item.port,
                "TLSv1.2",
                "TLSv1.2"
            );

            if (result) {
                tls12OK = true;
            }
        }

        console.log("");
        console.log(
            "TLS 1.2 RESULT:",
            tls12OK ? "SUCCESS" : "FAILED"
        );

        console.log("");
        console.log("========================================");
        console.log("STEP 4: TLS 1.3 TEST");
        console.log("========================================");

        let tls13OK = false;

        for (const item of hosts) {
            const result = await testTLS(
                item.host,
                item.port,
                "TLSv1.3",
                "TLSv1.3"
            );

            if (result) {
                tls13OK = true;
            }
        }

        console.log("");
        console.log(
            "TLS 1.3 RESULT:",
            tls13OK ? "SUCCESS" : "FAILED"
        );

        console.log("");
        console.log("========================================");
        console.log("DIAGNOSTIC SUMMARY");
        console.log("========================================");

        console.log("DNS:", dnsOK ? "PASS" : "FAIL");
        console.log("TCP:", tcpOK ? "PASS" : "FAIL");
        console.log("TLS 1.2:", tls12OK ? "PASS" : "FAIL");
        console.log("TLS 1.3:", tls13OK ? "PASS" : "FAIL");

        console.log("");

        if (!tcpOK) {
            console.log(
                "RESULT: Render cannot reach MongoDB Atlas."
            );

            process.exit(1);
        }

        if (!tls12OK && !tls13OK) {
            console.log(
                "RESULT: TCP works but both TLS 1.2 and TLS 1.3 fail."
            );

            process.exit(1);
        }

        if (tls12OK || tls13OK) {
            console.log(
                "RESULT: TLS works. Testing Mongoose connection..."
            );
        }

        console.log("");
        console.log("========================================");
        console.log("STEP 5: MONGOOSE TEST");
        console.log("========================================");

        await mongoose.connect(uri, {
            tls: true,
            family: 4,
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            retryWrites: true
        });

        console.log("");
        console.log("========================================");
        console.log("MONGODB CONNECTED SUCCESSFULLY");
        console.log("========================================");

        console.log(
            "Database:",
            mongoose.connection.name
        );

        return mongoose.connection;

    } catch (error) {
        console.log("");
        console.log("========================================");
        console.log("MONGODB CONNECTION FAILED");
        console.log("========================================");

        console.log(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;