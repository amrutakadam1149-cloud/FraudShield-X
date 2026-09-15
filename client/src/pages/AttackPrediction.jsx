import React, { useCallback, useEffect, useState } from "react";
import "./AttackPrediction.css";

const API_URL =
    "http://localhost:5000/api/attack-prediction";

const AttackPrediction = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchPrediction = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const response = await fetch(API_URL);

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                            "Failed to load attack prediction"
                    );
                }

                setPrediction(result.data);
            } catch (err) {
                console.error(
                    "Attack prediction error:",
                    err
                );

                setError(
                    err.message ||
                        "Unable to connect to Attack Prediction API"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchPrediction();

        const interval = setInterval(() => {
            fetchPrediction(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchPrediction]);

    const getThreatClass = (level) => {
        switch (
            String(level || "").toUpperCase()
        ) {
            case "CRITICAL":
                return "critical";

            case "HIGH":
                return "high";

            case "MEDIUM":
                return "medium";

            default:
                return "low";
        }
    };

    const formatPercent = (value) => {
        const number = Number(value || 0);

        return `${number.toFixed(2)}%`;
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString();
    };

    if (loading) {
        return (
            <div className="attack-page">
                <div className="attack-loading">
                    <div className="loading-spinner"></div>

                    <h2>
                        Analyzing attack patterns...
                    </h2>

                    <p>
                        FraudShield-X is analyzing
                        transactions and network
                        intelligence.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="attack-page">
                <div className="attack-error">
                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Attack Prediction
                        Unavailable
                    </h2>

                    <p>{error}</p>

                    <button
                        className="refresh-button"
                        onClick={() =>
                            fetchPrediction(true)
                        }
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const network =
        prediction?.network || {};

    const statistics =
        prediction?.statistics || {};

    const threatClass =
        getThreatClass(
            prediction?.threatLevel
        );

    return (
        <div className="attack-page">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="attack-header">
                <div>
                    <div className="attack-title-row">
                        <div className="attack-icon">
                            ⚡
                        </div>

                        <div>
                            <h1>
                                Attack Prediction
                            </h1>

                            <p>
                                AI-powered prediction
                                of emerging fraud
                                attack patterns
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="refresh-button"
                    onClick={() =>
                        fetchPrediction(true)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Analyzing..."
                        : "↻ Refresh Prediction"}
                </button>
            </div>

            {/* =====================================
                MAIN PREDICTION
            ====================================== */}

            <div className="prediction-grid">

                <div className="score-card">
                    <div className="card-label">
                        ATTACK RISK SCORE
                    </div>

                    <div className="score-value">
                        {Number(
                            prediction?.attackScore || 0
                        ).toFixed(2)}
                    </div>

                    <div className="score-scale">
                        <span>0</span>
                        <div className="score-bar">
                            <div
                                className={`score-fill ${threatClass}`}
                                style={{
                                    width: `${Math.min(
                                        Number(
                                            prediction?.attackScore ||
                                                0
                                        ),
                                        100
                                    )}%`
                                }}
                            ></div>
                        </div>
                        <span>100</span>
                    </div>

                    <div
                        className={`threat-badge ${threatClass}`}
                    >
                        {prediction?.threatLevel ||
                            "LOW"}
                    </div>
                </div>

                <div className="attack-type-card">
                    <div className="card-label">
                        PREDICTED ATTACK
                    </div>

                    <h2>
                        {String(
                            prediction?.attackType ||
                                "NORMAL_ACTIVITY"
                        )
                            .replaceAll(
                                "_",
                                " "
                            )}
                    </h2>

                    <p>
                        Current transaction and
                        network behavior indicates
                        this attack pattern.
                    </p>

                    <div className="confidence">
                        <span>
                            Prediction confidence
                        </span>

                        <strong>
                            {formatPercent(
                                prediction?.confidence
                            )}
                        </strong>
                    </div>
                </div>
            </div>

            {/* =====================================
                KEY METRICS
            ====================================== */}

            <div className="section-title">
                <span>▣</span>
                Risk Intelligence
            </div>

            <div className="metrics-grid">

                <div className="metric-card">
                    <div className="metric-icon">
                        ◉
                    </div>

                    <div>
                        <span>
                            Fraud Rate
                        </span>

                        <strong>
                            {formatPercent(
                                prediction?.fraudRate
                            )}
                        </strong>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        !
                    </div>

                    <div>
                        <span>
                            Suspicious Rate
                        </span>

                        <strong>
                            {formatPercent(
                                prediction?.suspiciousRate
                            )}
                        </strong>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        ▲
                    </div>

                    <div>
                        <span>
                            High-Risk Nodes
                        </span>

                        <strong>
                            {formatNumber(
                                network.highRiskNodes ||
                                    statistics.highRiskNodes
                            )}
                        </strong>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">
                        ⚠
                    </div>

                    <div>
                        <span>
                            Fraud Nodes
                        </span>

                        <strong>
                            {formatNumber(
                                network.fraudNodes ||
                                    statistics.fraudNodes
                            )}
                        </strong>
                    </div>
                </div>
            </div>

            {/* =====================================
                NETWORK INTELLIGENCE
            ====================================== */}

            <div className="section-title">
                <span>◈</span>
                Fraud Network Intelligence
            </div>

            <div className="network-grid">

                <div className="network-stat">
                    <span>
                        Total Network Nodes
                    </span>

                    <strong>
                        {formatNumber(
                            network.totalNodes ||
                                statistics.totalNodes
                        )}
                    </strong>
                </div>

                <div className="network-stat">
                    <span>
                        Transaction Relationships
                    </span>

                    <strong>
                        {formatNumber(
                            network.totalEdges ||
                                statistics.totalEdges
                        )}
                    </strong>
                </div>

                <div className="network-stat">
                    <span>
                        User Nodes
                    </span>

                    <strong>
                        {formatNumber(
                            network.userNodes
                        )}
                    </strong>
                </div>

                <div className="network-stat">
                    <span>
                        Device Nodes
                    </span>

                    <strong>
                        {formatNumber(
                            network.deviceNodes
                        )}
                    </strong>
                </div>

                <div className="network-stat">
                    <span>
                        Merchant Nodes
                    </span>

                    <strong>
                        {formatNumber(
                            network.merchantNodes
                        )}
                    </strong>
                </div>

                <div className="network-stat">
                    <span>
                        Location Nodes
                    </span>

                    <strong>
                        {formatNumber(
                            network.locationNodes
                        )}
                    </strong>
                </div>
            </div>

            {/* =====================================
                TRANSACTION STATISTICS
            ====================================== */}

            <div className="section-title">
                <span>▤</span>
                Transaction Analysis
            </div>

            <div className="transaction-grid">

                <div className="transaction-stat">
                    <span>
                        Total Transactions
                    </span>

                    <strong>
                        {formatNumber(
                            statistics.totalTransactions
                        )}
                    </strong>
                </div>

                <div className="transaction-stat fraud">
                    <span>
                        Fraud Transactions
                    </span>

                    <strong>
                        {formatNumber(
                            statistics.fraudTransactions
                        )}
                    </strong>
                </div>

                <div className="transaction-stat suspicious">
                    <span>
                        Suspicious Transactions
                    </span>

                    <strong>
                        {formatNumber(
                            statistics.suspiciousTransactions
                        )}
                    </strong>
                </div>

                <div className="transaction-stat safe">
                    <span>
                        Safe Transactions
                    </span>

                    <strong>
                        {formatNumber(
                            statistics.safeTransactions
                        )}
                    </strong>
                </div>

                <div className="transaction-stat">
                    <span>
                        High-Risk Transactions
                    </span>

                    <strong>
                        {formatNumber(
                            statistics.highRiskTransactions
                        )}
                    </strong>
                </div>

                <div className="transaction-stat">
                    <span>
                        Overall Risk Rate
                    </span>

                    <strong>
                        {formatPercent(
                            statistics.riskRate
                        )}
                    </strong>
                </div>
            </div>

            {/* =====================================
                INDICATORS + RECOMMENDATION
            ====================================== */}

            <div className="analysis-grid">

                <div className="analysis-card">

                    <div className="analysis-card-header">
                        <h3>
                            Attack Indicators
                        </h3>

                        <span className="indicator-count">
                            {prediction?.indicators
                                ?.length || 0}
                        </span>
                    </div>

                    <div className="indicator-list">

                        {prediction?.indicators?.map(
                            (indicator, index) => (
                                <div
                                    className="indicator-item"
                                    key={index}
                                >
                                    <span>
                                        ⚠
                                    </span>

                                    <p>
                                        {indicator}
                                    </p>
                                </div>
                            )
                        )}

                    </div>
                </div>

                <div className="analysis-card recommendation-card">

                    <div className="analysis-card-header">
                        <h3>
                            AI Recommendation
                        </h3>

                        <span>
                            AI
                        </span>
                    </div>

                    <div className="recommendation-content">
                        <div className="recommendation-icon">
                            ◆
                        </div>

                        <p>
                            {prediction?.recommendation ||
                                "Continue monitoring transaction activity."}
                        </p>
                    </div>

                    <div className="analysis-footer">
                        Last analyzed:{" "}
                        {prediction?.analyzedAt
                            ? new Date(
                                prediction.analyzedAt
                            ).toLocaleString()
                            : "N/A"}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AttackPrediction;