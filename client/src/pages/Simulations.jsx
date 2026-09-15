import React, { useState } from "react";
import "./Simulations.css";

const API_URL = "http://localhost:5000/api/transactions";

const SCENARIOS = {
    SAFE: {
        name: "Safe Transaction",
        description: "Normal low-risk transaction",
        amount: 500,
        merchant: "Normal-Shop",
        location: "Pune",
        paymentMethod: "UPI",
        deviceId: "SIM_SAFE_DEVICE"
    },

    SUSPICIOUS: {
        name: "Suspicious Transaction",
        description: "Transaction with suspicious characteristics",
        amount: 25000,
        merchant: "Suspicious-Merchant",
        location: "Delhi",
        paymentMethod: "UPI",
        deviceId: "SIM_SUSPICIOUS_DEVICE"
    },

    HIGH_RISK: {
        name: "High Risk Transaction",
        description: "Large transaction with high-risk indicators",
        amount: 75000,
        merchant: "High-Risk-Merchant",
        location: "Mumbai",
        paymentMethod: "UPI",
        deviceId: "SIM_HIGH_RISK_DEVICE"
    },

    FRAUD: {
        name: "Fraud Transaction",
        description: "Transaction designed to trigger fraud detection",
        amount: 150000,
        merchant: "Fraud-Test-Merchant",
        location: "Delhi",
        paymentMethod: "UPI",
        deviceId: "SIM_FRAUD_DEVICE"
    }
};

const Simulations = () => {
    const [selectedScenario, setSelectedScenario] = useState("SAFE");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const runSimulation = async () => {
        try {
            setLoading(true);
            setError("");
            setResult(null);

            const scenario = SCENARIOS[selectedScenario];

            const uniqueId =
                `SIM_${selectedScenario}_${Date.now()}`;

            const body = {
                userId: uniqueId,
                amount: scenario.amount,
                merchant: scenario.merchant,
                location: scenario.location,
                paymentMethod: scenario.paymentMethod,
                deviceId: `${scenario.deviceId}_${Date.now()}`,
                transactionTime: new Date().toISOString()
            };

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Simulation failed"
                );
            }

            setResult(data);

        } catch (err) {
            console.error(
                "Simulation failed:",
                err
            );

            setError(
                err.message ||
                "Unable to run simulation"
            );

        } finally {
            setLoading(false);
        }
    };

    const getTransaction = () => {
        return result?.data?.transaction || null;
    };

    const getIntelligence = () => {
        return result?.data?.intelligence || {};
    };

    const getAlert = () => {
        return result?.data?.alert || null;
    };

    const getFraudCase = () => {
        return result?.data?.fraudCase || null;
    };

    const transaction = getTransaction();
    const intelligence = getIntelligence();
    const alert = getAlert();
    const fraudCase = getFraudCase();

    const getStatusClass = (status) => {
        switch (
            String(status || "")
                .toUpperCase()
        ) {
            case "FRAUD":
                return "fraud";

            case "SUSPICIOUS":
                return "suspicious";

            case "SAFE":
                return "safe";

            default:
                return "unknown";
        }
    };

    const formatNumber = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0.00";
        }

        return number.toFixed(2);
    };

    const formatDate = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleString();
    };

    return (
        <div className="page-container simulations-page">

            <div className="page-header">

                <div>
                    <h1>🎮 Fraud Simulations</h1>

                    <p>
                        Test FraudShield-X fraud detection
                        intelligence using controlled scenarios.
                    </p>
                </div>

            </div>

            {error && (
                <div className="simulation-error">
                    ⚠️ {error}
                </div>
            )}

            <div className="simulation-layout">

                <div className="simulation-panel">

                    <div className="panel-header">
                        <h2>Choose Simulation</h2>

                        <p>
                            Select a transaction scenario
                            and run the complete fraud
                            detection pipeline.
                        </p>
                    </div>

                    <div className="scenario-grid">

                        {Object.entries(SCENARIOS).map(
                            ([key, scenario]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={
                                        selectedScenario === key
                                            ? `scenario-card selected ${key.toLowerCase()}`
                                            : `scenario-card ${key.toLowerCase()}`
                                    }
                                    onClick={() => {
                                        setSelectedScenario(key);
                                        setResult(null);
                                        setError("");
                                    }}
                                >

                                    <div className="scenario-icon">

                                        {key === "SAFE" && "🟢"}

                                        {key === "SUSPICIOUS" && "🟡"}

                                        {key === "HIGH_RISK" && "🟠"}

                                        {key === "FRAUD" && "🔴"}

                                    </div>

                                    <div className="scenario-content">

                                        <h3>
                                            {scenario.name}
                                        </h3>

                                        <p>
                                            {scenario.description}
                                        </p>

                                        <span>
                                            ₹
                                            {scenario.amount.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                    </div>

                                </button>
                            )
                        )}

                    </div>

                    <div className="selected-scenario">

                        <h3>
                            Selected Scenario
                        </h3>

                        <div className="selected-details">

                            <div>
                                <span>
                                    Scenario
                                </span>

                                <strong>
                                    {SCENARIOS[
                                        selectedScenario
                                    ].name}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Amount
                                </span>

                                <strong>
                                    ₹
                                    {SCENARIOS[
                                        selectedScenario
                                    ].amount.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Merchant
                                </span>

                                <strong>
                                    {SCENARIOS[
                                        selectedScenario
                                    ].merchant}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Location
                                </span>

                                <strong>
                                    {SCENARIOS[
                                        selectedScenario
                                    ].location}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Payment
                                </span>

                                <strong>
                                    {SCENARIOS[
                                        selectedScenario
                                    ].paymentMethod}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="run-simulation-button"
                        onClick={runSimulation}
                        disabled={loading}
                    >

                        {loading
                            ? "⏳ Running Simulation..."
                            : "▶ Run Simulation"}

                    </button>

                </div>

                <div className="pipeline-panel">

                    <div className="panel-header">

                        <h2>Detection Pipeline</h2>

                        <p>
                            FraudShield-X analyzes each
                            simulated transaction through
                            multiple intelligence engines.
                        </p>

                    </div>

                    <div className="pipeline">

                        <div className="pipeline-step">
                            <span>1</span>
                            <div>
                                <strong>
                                    Transaction Input
                                </strong>
                                <small>
                                    User, amount, merchant,
                                    device and location
                                </small>
                            </div>
                        </div>

                        <div className="pipeline-arrow">
                            ↓
                        </div>

                        <div className="pipeline-step">
                            <span>2</span>
                            <div>
                                <strong>
                                    Rule-Based Detection
                                </strong>
                                <small>
                                    Risk scoring and fraud rules
                                </small>
                            </div>
                        </div>

                        <div className="pipeline-arrow">
                            ↓
                        </div>

                        <div className="pipeline-step">
                            <span>3</span>
                            <div>
                                <strong>
                                    ML Prediction
                                </strong>
                                <small>
                                    Machine-learning fraud probability
                                </small>
                            </div>
                        </div>

                        <div className="pipeline-arrow">
                            ↓
                        </div>

                        <div className="pipeline-step">
                            <span>4</span>
                            <div>
                                <strong>
                                    Fraud Intelligence
                                </strong>
                                <small>
                                    DNA, behavior, temporal and
                                    network analysis
                                </small>
                            </div>
                        </div>

                        <div className="pipeline-arrow">
                            ↓
                        </div>

                        <div className="pipeline-step">
                            <span>5</span>
                            <div>
                                <strong>
                                    Adaptive Risk Engine
                                </strong>
                                <small>
                                    Final risk classification
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {result && transaction && (

                <div className="simulation-result">

                    <div className="result-header">

                        <div>
                            <h2>
                                Simulation Result
                            </h2>

                            <p>
                                FraudShield-X completed the
                                transaction analysis.
                            </p>
                        </div>

                        <div
                            className={`result-status ${getStatusClass(
                                transaction.status
                            )}`}
                        >
                            {transaction.status ||
                                "UNKNOWN"}
                        </div>

                    </div>

                    <div className="result-grid">

                        <div className="result-card">

                            <span>
                                Transaction ID
                            </span>

                            <strong>
                                {transaction._id ||
                                    transaction.id ||
                                    "-"}
                            </strong>

                        </div>

                        <div className="result-card">

                            <span>
                                Risk Score
                            </span>

                            <strong>
                                {formatNumber(
                                    transaction.riskScore
                                )}
                            </strong>

                        </div>

                        <div className="result-card">

                            <span>
                                ML Fraud Probability
                            </span>

                            <strong>
                                {formatNumber(
                                    transaction.fraudProbability
                                )}
                                %
                            </strong>

                        </div>

                        <div className="result-card">

                            <span>
                                Amount
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    transaction.amount || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </div>

                    <div className="intelligence-section">

                        <h3>
                            🧠 Intelligence Results
                        </h3>

                        <div className="intelligence-grid">

                            <div>
                                <span>
                                    Rule Score
                                </span>

                                <strong>
                                    {formatNumber(
                                        intelligence.ruleScore ??
                                        transaction.ruleScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    ML Score
                                </span>

                                <strong>
                                    {formatNumber(
                                        intelligence.mlScore ??
                                        transaction.mlScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Fraud DNA
                                </span>

                                <strong>
                                    {formatNumber(
                                        intelligence.dnaScore ??
                                        transaction.dnaScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Behavior
                                </span>

                                <strong>
                                    {formatNumber(
                                        intelligence.behaviorScore ??
                                        transaction.behaviorScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Temporal
                                </span>

                                <strong>
                                    {formatNumber(
                                        intelligence.temporalScore ??
                                        transaction.temporalScore
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Fraud Ring
                                </span>

                                <strong>
                                    {formatNumber(
                                        intelligence.ringScore ??
                                        transaction.ringScore
                                    )}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {transaction.reasons &&
                        Array.isArray(
                            transaction.reasons
                        ) &&
                        transaction.reasons.length > 0 && (

                        <div className="reasons-section">

                            <h3>
                                🔍 Detection Reasons
                            </h3>

                            <ul>
                                {transaction.reasons.map(
                                    (reason, index) => (
                                        <li key={index}>
                                            {String(reason)}
                                        </li>
                                    )
                                )}
                            </ul>

                        </div>
                    )}

                    {alert && (

                        <div className="result-alert">

                            <h3>
                                🚨 Alert Generated
                            </h3>

                            <div className="alert-result-grid">

                                <div>
                                    <span>
                                        Alert Type
                                    </span>

                                    <strong>
                                        {alert.alertType ||
                                            "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Severity
                                    </span>

                                    <strong>
                                        {alert.severity ||
                                            "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {alert.status ||
                                            "-"}
                                    </strong>
                                </div>

                            </div>

                        </div>
                    )}

                    {fraudCase && (

                        <div className="result-case">

                            <h3>
                                📁 Fraud Case Created
                            </h3>

                            <div className="case-result-grid">

                                <div>
                                    <span>
                                        Case ID
                                    </span>

                                    <strong>
                                        {fraudCase._id ||
                                            fraudCase.id ||
                                            "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {fraudCase.caseStatus ||
                                            fraudCase.status ||
                                            "OPEN"}
                                    </strong>
                                </div>

                            </div>

                        </div>
                    )}

                    <div className="result-meta">

                        <span>
                            Simulation completed:
                        </span>

                        <strong>
                            {formatDate(
                                transaction.createdAt
                            )}
                        </strong>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Simulations;