import React, { useEffect, useMemo, useState } from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import Investigation from "./pages/Investigation";
import AttackPrediction from "./pages/AttackPrediction";
import FraudNetworks from "./pages/FraudNetworks";
import FraudCases from "./pages/FraudCases";
import Alerts from "./pages/Alerts";
import Simulations from "./pages/Simulations";

import "./App.css";

const API_URL =
    "http://localhost:5000/api/transactions";

const STATUS_COLORS = {
    Fraud: "#ef4444",
    Suspicious: "#f59e0b",
    Safe: "#22c55e"
};

function App() {
    // =========================================================
    // APP STATE
    // =========================================================

    const [activePage, setActivePage] =
        useState("dashboard");

    const [transactions, setTransactions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [alertStats, setAlertStats] =
        useState({
            total: 0,
            newAlerts: 0,
            critical: 0,
            acknowledged: 0,
            resolved: 0
        });

    const [caseCount, setCaseCount] =
        useState(0);

    const [formData, setFormData] =
        useState({
            userId: "",
            amount: "",
            merchant: "",
            location: "",
            paymentMethod: "UPI",
            deviceId: ""
        });

    // =========================================================
    // FETCH DASHBOARD INTELLIGENCE
    // =========================================================

    const fetchDashboardIntelligence =
        async () => {
            try {

                const [
                    alertResponse,
                    caseResponse
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/alerts/stats",
                        {}
                    ),

                    fetch(
                        "http://localhost:5000/api/cases",
                        {}
                    )
                ]);


                if (alertResponse.ok) {
                    const alertResult =
                        await alertResponse.json();

                    if (
                        alertResult.success &&
                        alertResult.data
                    ) {
                        setAlertStats({
                            total: Number(
                                alertResult
                                    .data
                                    .total || 0
                            ),

                            newAlerts: Number(
                                alertResult
                                    .data
                                    .newAlerts ||
                                    0
                            ),

                            critical: Number(
                                alertResult
                                    .data
                                    .critical || 0
                            ),

                            acknowledged:
                                Number(
                                    alertResult
                                        .data
                                        .acknowledged ||
                                        0
                                ),

                            resolved:
                                Number(
                                    alertResult
                                        .data
                                        .resolved ||
                                        0
                                )
                        });
                    }
                }

                if (caseResponse.ok) {
                    const caseResult =
                        await caseResponse.json();

                    const caseData =
                        Array.isArray(
                            caseResult.data
                        )
                            ? caseResult.data
                            : Array.isArray(
                                caseResult.cases
                            )
                                ? caseResult.cases
                                : Array.isArray(
                                    caseResult
                                )
                                    ? caseResult
                                    : [];

                    setCaseCount(
                        caseData.length
                    );
                }

            } catch (err) {
                console.error(
                    "Dashboard intelligence fetch error:",
                    err
                );
            }
        };

    // =========================================================
    // FETCH TRANSACTIONS
    // =========================================================

    const fetchTransactions =
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        API_URL,
                        {}
                    );


                if (!response.ok) {
                    throw new Error(
                        `Server returned ${response.status}`
                    );
                }

                const result =
                    await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message ||
                            "Failed to fetch transactions"
                    );
                }

                setTransactions(
                    Array.isArray(
                        result.data
                    )
                        ? result.data
                        : []
                );

            } catch (err) {
                console.error(
                    "Transaction fetch error:",
                    err
                );

                if (
                    err.message ===
                    "Your session has expired. Please sign in again."
                ) {
                    setError(
                        err.message
                    );
                } else {
                    setError(
                        "Unable to connect to FraudShield-X server."
                    );
                }

            } finally {
                setLoading(false);
            }
        };

    // =========================================================
    // AUTO REFRESH
    // =========================================================

    useEffect(() => {
        fetchTransactions();

        fetchDashboardIntelligence();

        const interval =
            setInterval(() => {
                fetchTransactions();

                fetchDashboardIntelligence();
            }, 10000);

        return () =>
            clearInterval(interval);

    }, []);

    // =========================================================
    // FORM HANDLING
    // =========================================================

    const handleInputChange =
        (event) => {
            const {
                name,
                value
            } = event.target;

            setFormData(
                (previous) => ({
                    ...previous,
                    [name]: value
                })
            );
        };

    // =========================================================
    // CREATE TRANSACTION
    // =========================================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            try {
                setSubmitting(true);

                setError("");

                const payload = {
                    userId:
                        formData.userId.trim(),

                    amount:
                        Number(
                            formData.amount
                        ),

                    merchant:
                        formData.merchant.trim(),

                    location:
                        formData.location.trim(),

                    paymentMethod:
                        formData.paymentMethod,

                    deviceId:
                        formData.deviceId.trim()
                };

                // Validation
                if (!payload.userId) {
                    throw new Error(
                        "Please enter User ID."
                    );
                }

                if (
                    !Number.isFinite(
                        payload.amount
                    ) ||
                    payload.amount <= 0
                ) {
                    throw new Error(
                        "Please enter a valid transaction amount."
                    );
                }

                if (!payload.merchant) {
                    throw new Error(
                        "Please enter Merchant."
                    );
                }

                if (!payload.location) {
                    throw new Error(
                        "Please enter Location."
                    );
                }

                if (!payload.deviceId) {
                    throw new Error(
                        "Please enter Device ID."
                    );
                }

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );

                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                            "Transaction creation failed"
                    );
                }

                // Reset form
                setFormData({
                    userId: "",
                    amount: "",
                    merchant: "",
                    location: "",
                    paymentMethod:
                        "UPI",
                    deviceId: ""
                });

                setShowForm(false);

                // Reload data
                await fetchTransactions();

                await fetchDashboardIntelligence();

            } catch (err) {
                console.error(
                    "Transaction creation error:",
                    err
                );

                setError(
                    err.message ||
                        "Failed to create transaction."
                );

            } finally {
                setSubmitting(false);
            }
        };

    // =========================================================
    // FORMAT MONEY
    // =========================================================

    const formatMoney =
        (amount) => {
            return `₹${Number(
                amount || 0
            ).toLocaleString(
                "en-IN"
            )}`;
        };

    // =========================================================
    // DASHBOARD STATISTICS
    // =========================================================

    const dashboardStats =
        useMemo(() => {
            const total =
                transactions.length;

            const fraud =
                transactions.filter(
                    (transaction) =>
                        transaction.status ===
                            "FRAUD" ||
                        transaction.isFraud ===
                            true
                ).length;

            const suspicious =
                transactions.filter(
                    (transaction) =>
                        transaction.status ===
                        "SUSPICIOUS"
                ).length;

            const safe =
                transactions.filter(
                    (transaction) =>
                        transaction.status ===
                        "SAFE"
                ).length;

            const totalAmount =
                transactions.reduce(
                    (
                        sum,
                        transaction
                    ) =>
                        sum +
                        Number(
                            transaction.amount ||
                                0
                        ),
                    0
                );

            const mlTransactions =
                transactions.filter(
                    (transaction) =>
                        transaction.mlProbability !==
                            undefined &&
                        transaction.mlProbability !==
                            null
                );

            const averageML =
                mlTransactions.length >
                0
                    ? mlTransactions.reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum +
                            Number(
                                transaction.mlProbability ||
                                    0
                            ),
                        0
                    ) /
                    mlTransactions.length
                    : 0;

            const highRisk =
                transactions.filter(
                    (transaction) =>
                        Number(
                            transaction.riskScore ||
                                0
                        ) >= 70
                ).length;

            const mlCoverage =
                total > 0
                    ? (
                        mlTransactions.length /
                        total
                    ) * 100
                    : 0;

            return {
                total,
                fraud,
                suspicious,
                safe,
                totalAmount,
                averageML,
                highRisk,
                mlCoverage
            };
        }, [transactions]);

    // =========================================================
    // STATUS CHART DATA
    // =========================================================

    const statusData =
        useMemo(() => {
            return [
                {
                    name: "Fraud",
                    value:
                        dashboardStats.fraud
                },

                {
                    name: "Suspicious",
                    value:
                        dashboardStats.suspicious
                },

                {
                    name: "Safe",
                    value:
                        dashboardStats.safe
                }
            ];
        }, [dashboardStats]);

    // =========================================================
    // RISK DISTRIBUTION
    // =========================================================

    const riskData =
        useMemo(() => {
            return [
                {
                    category: "Safe",

                    count:
                        transactions.filter(
                            (transaction) =>
                                Number(
                                    transaction.riskScore ||
                                        0
                                ) < 40
                        ).length
                },

                {
                    category: "Medium",

                    count:
                        transactions.filter(
                            (transaction) => {
                                const score =
                                    Number(
                                        transaction.riskScore ||
                                            0
                                    );

                                return (
                                    score >= 40 &&
                                    score < 70
                                );
                            }
                        ).length
                },

                {
                    category: "High",

                    count:
                        transactions.filter(
                            (transaction) =>
                                Number(
                                    transaction.riskScore ||
                                        0
                                ) >= 70
                        ).length
                }
            ];
        }, [transactions]);

    // =========================================================
    // MERCHANT ACTIVITY
    // =========================================================

    const merchantData =
        useMemo(() => {
            const map = {};

            transactions.forEach(
                (transaction) => {
                    const merchant =
                        transaction.merchant ||
                        "Unknown";

                    if (!map[merchant]) {
                        map[merchant] = {
                            merchant,
                            transactions: 0,
                            fraud: 0
                        };
                    }

                    map[merchant]
                        .transactions += 1;

                    if (
                        transaction.status ===
                            "FRAUD" ||
                        transaction.isFraud ===
                            true
                    ) {
                        map[merchant]
                            .fraud += 1;
                    }
                }
            );

            return Object.values(map)
                .sort(
                    (a, b) =>
                        b.transactions -
                        a.transactions
                )
                .slice(0, 6);
        }, [transactions]);

    // =========================================================
    // RECENT TRANSACTIONS
    // =========================================================

    const recentTransactions =
        useMemo(() => {
            return [...transactions]
                .sort(
                    (a, b) => {
                        const dateA =
                            new Date(
                                a.transactionTime ||
                                    a.createdAt ||
                                    0
                            );

                        const dateB =
                            new Date(
                                b.transactionTime ||
                                    b.createdAt ||
                                    0
                            );

                        return (
                            dateB - dateA
                        );
                    }
                )
                .slice(0, 8);
        }, [transactions]);

    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass =
        (status) => {
            if (
                status === "FRAUD"
            ) {
                return "status-fraud";
            }

            if (
                status === "SUSPICIOUS"
            ) {
                return "status-suspicious";
            }

            return "status-safe";
        };

    // =========================================================
    // RISK CLASS
    // =========================================================

    const getRiskClass =
        (score) => {
            const value =
                Number(score || 0);

            if (value >= 70) {
                return "risk-high";
            }

            if (value >= 40) {
                return "risk-medium";
            }

            return "risk-low";
        };

    // =========================================================
    // DASHBOARD
    // =========================================================

    const renderDashboard =
        () => {
            if (loading) {
                return (
                    <div className="dashboard-page">
                        <div className="loading-card">
                            <div className="loading-spinner">
                                ⟳
                            </div>

                            <h2>
                                Loading FraudShield-X
                            </h2>

                            <p>
                                Connecting to
                                transaction
                                intelligence
                                services...
                            </p>
                        </div>
                    </div>
                );
            }

            return (
                <div className="dashboard-page">

                    {/* =================================================
                        DASHBOARD INTRO
                    ================================================= */}

                    <div className="dashboard-intro">

                        <div>
                            <div className="page-kicker">
                                AI FRAUD INTELLIGENCE PLATFORM
                            </div>

                            <h1>
                                FraudShield-X Dashboard
                            </h1>

                            <p>
                                Real-time overview
                                of transaction
                                risk, fraud
                                activity and
                                machine-learning
                                intelligence.
                            </p>
                        </div>

                        <div className="dashboard-live">
                            <span className="live-dot">
                            </span>

                            Live Data
                        </div>

                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (
                        <div className="error-banner">

                            <span>
                                ⚠️ {error}
                            </span>

                            <button
                                onClick={
                                    fetchTransactions
                                }
                            >
                                Retry
                            </button>

                        </div>
                    )}

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="dashboard-actions">

                        <button
                                className="primary-button"
                                onClick={() =>
                                    setShowForm(
                                        true
                                    )
                                }
                            >
                                + New Transaction
                            </button>

                        <button
                            className="secondary-button"
                            onClick={
                                fetchTransactions
                            }
                        >
                            ↻ Refresh
                        </button>

                    </div>

                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div className="stats-grid">

                        <div className="stat-card stat-blue">

                            <span className="stat-icon">
                                📊
                            </span>

                            <div>
                                <span>
                                    Total Transactions
                                </span>

                                <strong>
                                    {
                                        dashboardStats.total
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-red">

                            <span className="stat-icon">
                                🚨
                            </span>

                            <div>
                                <span>
                                    Fraud Transactions
                                </span>

                                <strong>
                                    {
                                        dashboardStats.fraud
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-orange">

                            <span className="stat-icon">
                                ⚠️
                            </span>

                            <div>
                                <span>
                                    Suspicious Activity
                                </span>

                                <strong>
                                    {
                                        dashboardStats.suspicious
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-green">

                            <span className="stat-icon">
                                🛡️
                            </span>

                            <div>
                                <span>
                                    Safe Transactions
                                </span>

                                <strong>
                                    {
                                        dashboardStats.safe
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-purple">

                            <span className="stat-icon">
                                🧠
                            </span>

                            <div>
                                <span>
                                    Average ML Probability
                                </span>

                                <strong>
                                    {dashboardStats.averageML.toFixed(
                                        1
                                    )}
                                    %
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-dark">

                            <span className="stat-icon">
                                🎯
                            </span>

                            <div>
                                <span>
                                    High Risk Transactions
                                </span>

                                <strong>
                                    {
                                        dashboardStats.highRisk
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-red">

                            <span className="stat-icon">
                                🚨
                            </span>

                            <div>
                                <span>
                                    Active Alerts
                                </span>

                                <strong>
                                    {
                                        alertStats.newAlerts
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="stat-card stat-orange">

                            <span className="stat-icon">
                                📁
                            </span>

                            <div>
                                <span>
                                    Fraud Cases
                                </span>

                                <strong>
                                    {caseCount}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        STATUS + RISK
                    ================================================= */}

                    <div className="dashboard-grid">

                        {/* TRANSACTION STATUS */}

                        <div className="dashboard-card">

                            <div className="card-heading">

                                <div>
                                    <h2>
                                        Transaction Status
                                    </h2>

                                    <p>
                                        Distribution of
                                        detected
                                        transaction
                                        outcomes.
                                    </p>
                                </div>

                            </div>

                            <div className="chart-container">

                                {dashboardStats.total ===
                                0 ? (
                                    <div className="empty-chart">
                                        No transaction
                                        data available.
                                    </div>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>

                                            <Pie
                                                data={
                                                    statusData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={
                                                    105
                                                }
                                                innerRadius={
                                                    55
                                                }
                                                paddingAngle={
                                                    4
                                                }
                                            >
                                                {statusData.map(
                                                    (
                                                        entry
                                                    ) => (
                                                        <Cell
                                                            key={
                                                                entry.name
                                                            }
                                                            fill={
                                                                STATUS_COLORS[
                                                                    entry
                                                                        .name
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>

                                            <Tooltip
                                                formatter={(
                                                    value
                                                ) => [
                                                    value,
                                                    "Transactions"
                                                ]}
                                            />

                                            <Legend />

                                        </PieChart>
                                    </ResponsiveContainer>
                                )}

                            </div>

                        </div>

                        {/* RISK DISTRIBUTION */}

                        <div className="dashboard-card">

                            <div className="card-heading">

                                <div>
                                    <h2>
                                        Risk Distribution
                                    </h2>

                                    <p>
                                        Transactions
                                        grouped by
                                        calculated risk
                                        score.
                                    </p>
                                </div>

                            </div>

                            <div className="chart-container">

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >
                                    <BarChart
                                        data={
                                            riskData
                                        }
                                        margin={{
                                            top: 10,
                                            right: 20,
                                            left: 0,
                                            bottom: 5
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="category"
                                        />

                                        <YAxis
                                            allowDecimals={
                                                false
                                            }
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="count"
                                            name="Transactions"
                                            fill="#2563eb"
                                            radius={[
                                                6,
                                                6,
                                                0,
                                                0
                                            ]}
                                        />

                                    </BarChart>
                                </ResponsiveContainer>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        MERCHANT + ML
                    ================================================= */}

                    <div className="dashboard-grid">

                        {/* MERCHANT ACTIVITY */}

                        <div className="dashboard-card">

                            <div className="card-heading">

                                <div>
                                    <h2>
                                        Merchant Activity
                                    </h2>

                                    <p>
                                        Most active
                                        merchants and
                                        associated fraud
                                        events.
                                    </p>
                                </div>

                            </div>

                            <div className="chart-container">

                                {merchantData.length ===
                                0 ? (
                                    <div className="empty-chart">
                                        No merchant data
                                        available.
                                    </div>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <BarChart
                                            data={
                                                merchantData
                                            }
                                            margin={{
                                                top: 10,
                                                right: 20,
                                                left: 0,
                                                bottom: 5
                                            }}
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="merchant"
                                            />

                                            <YAxis
                                                allowDecimals={
                                                    false
                                                }
                                            />

                                            <Tooltip />

                                            <Legend />

                                            <Bar
                                                dataKey="transactions"
                                                name="Transactions"
                                                fill="#2563eb"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0
                                                ]}
                                            />

                                            <Bar
                                                dataKey="fraud"
                                                name="Fraud"
                                                fill="#ef4444"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0
                                                ]}
                                            />

                                        </BarChart>
                                    </ResponsiveContainer>
                                )}

                            </div>

                        </div>

                        {/* ML INTELLIGENCE */}

                        <div className="dashboard-card ml-overview-card">

                            <div className="card-heading">

                                <div>
                                    <h2>
                                        🧠 ML Intelligence
                                    </h2>

                                    <p>
                                        Machine-learning
                                        fraud assessment
                                        coverage.
                                    </p>
                                </div>

                            </div>

                            <div className="ml-dashboard-content">

                                <div className="ml-big-number">

                                    {dashboardStats.averageML.toFixed(
                                        1
                                    )}
                                    %

                                    <span>
                                        Average fraud
                                        probability
                                    </span>

                                </div>

                                <div className="ml-progress-wrapper">

                                    <div className="ml-progress-header">

                                        <span>
                                            ML Coverage
                                        </span>

                                        <strong>
                                            {dashboardStats.mlCoverage.toFixed(
                                                1
                                            )}
                                            %
                                        </strong>

                                    </div>

                                    <div className="ml-progress-track">

                                        <div
                                            className="ml-progress-bar"
                                            style={{
                                                width: `${Math.min(
                                                    dashboardStats.mlCoverage,
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>

                                </div>

                                <div className="ml-info-grid">

                                    <div>
                                        <strong>
                                            {
                                                transactions.filter(
                                                    (
                                                        transaction
                                                    ) =>
                                                        Number(
                                                            transaction.mlProbability ||
                                                                0
                                                        ) >=
                                                        70
                                                ).length
                                            }
                                        </strong>

                                        <span>
                                            High ML Risk
                                        </span>
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                transactions.filter(
                                                    (
                                                        transaction
                                                    ) => {
                                                        const probability =
                                                            Number(
                                                                transaction.mlProbability ||
                                                                    0
                                                            );

                                                        return (
                                                            probability >=
                                                                40 &&
                                                            probability <
                                                                70
                                                        );
                                                    }
                                                ).length
                                            }
                                        </strong>

                                        <span>
                                            Moderate ML Risk
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        LIVE SECURITY OVERVIEW
                    ================================================= */}

                    <div className="dashboard-card">

                        <div className="card-heading">

                            <div>
                                <h2>
                                    🚨 Live Security
                                    Overview
                                </h2>

                                <p>
                                    Current alerts and
                                    fraud investigation
                                    activity.
                                </p>
                            </div>

                        </div>

                        <div className="ml-info-grid">

                            <div>
                                <strong>
                                    {
                                        alertStats.total
                                    }
                                </strong>

                                <span>
                                    Total Alerts
                                </span>
                            </div>

                            <div>
                                <strong>
                                    {
                                        alertStats.newAlerts
                                    }
                                </strong>

                                <span>
                                    New Alerts
                                </span>
                            </div>

                            <div>
                                <strong>
                                    {
                                        alertStats.critical
                                    }
                                </strong>

                                <span>
                                    Critical Alerts
                                </span>
                            </div>

                            <div>
                                <strong>
                                    {caseCount}
                                </strong>

                                <span>
                                    Fraud Cases
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        RECENT TRANSACTIONS
                    ================================================= */}

                    <div className="dashboard-card recent-card">

                        <div className="card-heading">

                            <div>
                                <h2>
                                    Recent Transactions
                                </h2>

                                <p>
                                    Latest activity from
                                    the FraudShield-X
                                    transaction engine.
                                </p>
                            </div>

                            <button
                                className="view-button"
                                onClick={() =>
                                    setActivePage(
                                        "investigation"
                                    )
                                }
                            >
                                View All
                            </button>

                        </div>

                        <div className="table-wrapper">

                            <table className="dashboard-table">

                                <thead>

                                    <tr>
                                        <th>
                                            User
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Merchant
                                        </th>

                                        <th>
                                            Risk
                                        </th>

                                        <th>
                                            ML %
                                        </th>

                                        <th>
                                            Status
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {recentTransactions.length ===
                                    0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="empty-table"
                                            >
                                                No transactions
                                                available.
                                            </td>
                                        </tr>
                                    ) : (
                                        recentTransactions.map(
                                            (
                                                transaction
                                            ) => (
                                                <tr
                                                    key={
                                                        transaction._id
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            transaction.userId
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatMoney(
                                                            transaction.amount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {
                                                            transaction.merchant
                                                        }
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`risk-pill ${getRiskClass(
                                                                transaction.riskScore
                                                            )}`}
                                                        >
                                                            {Number(
                                                                transaction.riskScore ||
                                                                    0
                                                            )}
                                                            /100
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {Number(
                                                            transaction.mlProbability ||
                                                                0
                                                        ).toFixed(
                                                            0
                                                        )}
                                                        %
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`status-badge ${getStatusClass(
                                                                transaction.status
                                                            )}`}
                                                        >
                                                            {
                                                                transaction.status ||
                                                                "SAFE"
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            );
        };

    // =========================================================
    // MAIN APPLICATION
    // =========================================================

    return (
        <div className="app-shell">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="app-header">

                <div className="header-content">

                    <div className="brand-section">

                        <div className="brand-icon">
                            🛡️
                        </div>

                        <div>

                            <h2>
                                FraudShield-X
                            </h2>

                            <span>
                                AI Fraud Intelligence
                            </span>

                        </div>

                    </div>

                    <div className="header-status">

                        <span className="live-dot">
                        </span>

                        System Online


                    </div>

                </div>

            </header>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className="main-navigation">

                <div className="navigation-inner">

                    <button
                        className={
                            activePage ===
                            "dashboard"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "dashboard"
                            )
                        }
                    >
                        📊 Dashboard
                    </button>

                    <button
                        className={
                            activePage ===
                            "investigation"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "investigation"
                            )
                        }
                    >
                        🔎 Fraud Investigation
                    </button>

                    <button
                        className={
                            activePage ===
                            "networks"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "networks"
                            )
                        }
                    >
                        🔗 Fraud Networks
                    </button>

                    <button
                        className={
                            activePage ===
                            "attack"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "attack"
                            )
                        }
                    >
                        🎯 Attack Prediction
                    </button>

                    <button
                        className={
                            activePage ===
                            "cases"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "cases"
                            )
                        }
                    >
                        📁 Fraud Cases
                    </button>

                    <button
                        className={
                            activePage ===
                            "alerts"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "alerts"
                            )
                        }
                    >
                        🚨 Alerts
                    </button>

                    <button
                        className={
                            activePage ===
                            "simulations"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setActivePage(
                                "simulations"
                            )
                        }
                    >
                        🎮 Simulations
                    </button>

                </div>

            </nav>

            {/* =================================================
                PAGE CONTENT
            ================================================= */}

            <main>

                {activePage ===
                    "dashboard" &&
                    renderDashboard()}

                {activePage ===
                    "investigation" && (
                    <Investigation
                        transactions={
                            transactions
                        }
                        onRefresh={
                            fetchTransactions
                        }
                        formatMoney={
                            formatMoney
                        }
                    />
                )}

                {activePage ===
                    "networks" && (
                    <FraudNetworks />
                )}

                {activePage ===
                    "attack" && (
                    <AttackPrediction
                        transactions={
                            transactions
                        }
                        onRefresh={
                            fetchTransactions
                        }
                        formatMoney={
                            formatMoney
                        }
                    />
                )}

                {activePage ===
                    "cases" && (
                    <FraudCases />
                )}

                {activePage ===
                    "alerts" && (
                    <Alerts />
                )}

                {activePage ===
                    "simulations" && (
                    <Simulations />
                )}

            </main>

            {/* =================================================
                NEW TRANSACTION MODAL
            ================================================= */}

            {showForm && (
                <div className="form-overlay">

                    <div className="transaction-form-modal">

                        <div className="modal-header">

                            <div>

                                <div className="page-kicker">
                                    TRANSACTION ENGINE
                                </div>

                                <h2>
                                    Create Transaction
                                </h2>

                                <p>
                                    Submit a transaction
                                    for rule-based and
                                    ML fraud analysis.
                                </p>

                            </div>

                            <button
                                className="close-button"
                                onClick={() =>
                                    setShowForm(
                                        false
                                    )
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="transaction-form"
                        >

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        User ID
                                    </label>

                                    <input
                                        name="userId"
                                        value={
                                            formData.userId
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="USER001"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Amount
                                    </label>

                                    <input
                                        name="amount"
                                        type="number"
                                        min="1"
                                        value={
                                            formData.amount
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="50000"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Merchant
                                    </label>

                                    <input
                                        name="merchant"
                                        value={
                                            formData.merchant
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Amazon"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Location
                                    </label>

                                    <input
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="Pune"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Payment Method
                                    </label>

                                    <select
                                        name="paymentMethod"
                                        value={
                                            formData.paymentMethod
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >

                                        <option value="UPI">
                                            UPI
                                        </option>

                                        <option value="CARD">
                                            CARD
                                        </option>

                                        <option value="NETBANKING">
                                            NETBANKING
                                        </option>

                                        <option value="WALLET">
                                            WALLET
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Device ID
                                    </label>

                                    <input
                                        name="deviceId"
                                        value={
                                            formData.deviceId
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        placeholder="DEVICE001"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowForm(
                                            false
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={
                                        submitting
                                    }
                                >
                                    {submitting
                                        ? "Analyzing..."
                                        : "Analyze Transaction"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default App;