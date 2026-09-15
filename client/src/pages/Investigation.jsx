import React, { useMemo, useState } from "react";

const Investigation = ({
    transactions = [],
    onRefresh,
    formatMoney
}) => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [selected, setSelected] = useState(null);

    const filteredTransactions = useMemo(() => {
        const query = search.trim().toLowerCase();

        return transactions.filter((transaction) => {
            const matchesSearch =
                !query ||
                String(transaction._id || "").toLowerCase().includes(query) ||
                String(transaction.userId || "").toLowerCase().includes(query) ||
                String(transaction.merchant || "").toLowerCase().includes(query) ||
                String(transaction.location || "").toLowerCase().includes(query) ||
                String(transaction.deviceId || "").toLowerCase().includes(query) ||
                String(transaction.paymentMethod || "").toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "ALL" ||
                transaction.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [transactions, search, statusFilter]);

    const getRiskClass = (score) => {
        const value = Number(score || 0);

        if (value >= 70) return "risk-high";
        if (value >= 40) return "risk-medium";

        return "risk-low";
    };

    const getStatusClass = (status) => {
        if (status === "FRAUD") return "status-fraud";
        if (status === "SUSPICIOUS") return "status-suspicious";

        return "status-safe";
    };

    const getRiskLabel = (score) => {
        const value = Number(score || 0);

        if (value >= 70) return "HIGH RISK";
        if (value >= 40) return "MEDIUM RISK";

        return "LOW RISK";
    };

    const getMlProbability = (transaction) => {
        const value = Number(
            transaction?.mlProbability ?? 0
        );

        return Math.min(
            Math.max(value, 0),
            100
        );
    };

    const getMlLabel = (probability) => {
        if (probability >= 70) return "HIGH";
        if (probability >= 40) return "MODERATE";

        return "LOW";
    };

    const getDate = (transaction) => {
        if (!transaction?.transactionTime) {
            return "N/A";
        }

        const date = new Date(
            transaction.transactionTime
        );

        if (Number.isNaN(date.getTime())) {
            return "N/A";
        }

        return date.toLocaleString();
    };

    const getAmount = (transaction) => {
        const amount = Number(
            transaction?.amount || 0
        );

        if (formatMoney) {
            return formatMoney(amount);
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const getAdaptiveScore = (transaction) => {
        return Number(
            transaction?.adaptiveIntelligence?.adaptiveScore ??
            transaction?.riskScore ??
            0
        );
    };

    const getPriorityClass = (priority) => {
        if (priority === "CRITICAL") {
            return "status-fraud";
        }

        if (priority === "HIGH") {
            return "status-suspicious";
        }

        return "status-safe";
    };

    const getPriorityIcon = (priority) => {
        if (priority === "CRITICAL") return "🚨";
        if (priority === "HIGH") return "⚠️";
        if (priority === "MEDIUM") return "🟡";

        return "🟢";
    };

    const handleSelect = (transaction) => {
        setSelected(transaction);
    };

    const handleClose = () => {
        setSelected(null);
    };

    const fraudDNA =
        selected?.fraudDNA || {};

    const fraudRing =
        selected?.fraudRing || {};

    const adaptive =
        selected?.adaptiveIntelligence || {};

    const recommendation =
        selected?.investigatorRecommendation || {};

    const recommendations =
        Array.isArray(
            recommendation.recommendations
        )
            ? recommendation.recommendations
            : [];

    const evidence =
        Array.isArray(
            recommendation.evidence
        )
            ? recommendation.evidence
            : [];

    const nextActions =
        Array.isArray(
            recommendation.nextActions
        )
            ? recommendation.nextActions
            : [];

    return (
        <div className="investigation-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="page-header">

                <div>

                    <div className="page-kicker">
                        FRAUD OPERATIONS
                    </div>

                    <h1>
                        Fraud Investigation
                    </h1>

                    <p>
                        Search, investigate and analyze
                        suspicious transactions using
                        adaptive fraud intelligence.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={onRefresh}
                >
                    ↻ Refresh Data
                </button>

            </div>


            {/* =====================================================
                TOOLBAR
            ===================================================== */}

            <div className="investigation-toolbar">

                <div className="search-box">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search user, merchant, device, location or transaction ID..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="FRAUD">
                        Fraud
                    </option>

                    <option value="SUSPICIOUS">
                        Suspicious
                    </option>

                    <option value="SAFE">
                        Safe
                    </option>

                </select>

            </div>


            {/* =====================================================
                SUMMARY
            ===================================================== */}

            <div className="investigation-summary">

                <div>
                    <strong>
                        {filteredTransactions.length}
                    </strong>

                    <span>
                        Transactions Found
                    </span>
                </div>

                <div>
                    <strong>
                        {
                            filteredTransactions.filter(
                                (transaction) =>
                                    transaction.status === "FRAUD"
                            ).length
                        }
                    </strong>

                    <span>
                        Fraud
                    </span>
                </div>

                <div>
                    <strong>
                        {
                            filteredTransactions.filter(
                                (transaction) =>
                                    transaction.status === "SUSPICIOUS"
                            ).length
                        }
                    </strong>

                    <span>
                        Suspicious
                    </span>
                </div>

            </div>


            {/* =====================================================
                TRANSACTION TABLE
            ===================================================== */}

            <div className="investigation-card">

                <div className="section-heading">

                    <div>

                        <h2>
                            Transaction Queue
                        </h2>

                        <p>
                            Select a transaction to view
                            complete detection analysis.
                        </p>

                    </div>

                </div>


                {filteredTransactions.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            🔍
                        </div>

                        <h3>
                            No transactions found
                        </h3>

                        <p>
                            Try changing your search or
                            status filter.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="investigation-table">

                            <thead>

                                <tr>

                                    <th>
                                        Transaction
                                    </th>

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

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredTransactions.map(
                                    (transaction) => {

                                        const risk =
                                            getAdaptiveScore(
                                                transaction
                                            );

                                        const ml =
                                            getMlProbability(
                                                transaction
                                            );

                                        return (

                                            <tr
                                                key={
                                                    transaction._id ||
                                                    `${transaction.userId}-${transaction.transactionTime}`
                                                }
                                            >

                                                <td>

                                                    <div className="transaction-id">

                                                        {String(
                                                            transaction._id ||
                                                            "N/A"
                                                        ).slice(0, 12)}

                                                        ...

                                                    </div>

                                                </td>

                                                <td>
                                                    {transaction.userId || "N/A"}
                                                </td>

                                                <td>
                                                    {getAmount(transaction)}
                                                </td>

                                                <td>
                                                    {transaction.merchant || "N/A"}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`risk-pill ${getRiskClass(
                                                            risk
                                                        )}`}
                                                    >
                                                        {risk}/100
                                                    </span>

                                                </td>

                                                <td>

                                                    <span className="ml-value">

                                                        {ml.toFixed(0)}%

                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            transaction.status
                                                        )}`}
                                                    >
                                                        {transaction.status ||
                                                            "SAFE"}
                                                    </span>

                                                </td>

                                                <td>

                                                    <button
                                                        className="view-button"
                                                        onClick={() =>
                                                            handleSelect(
                                                                transaction
                                                            )
                                                        }
                                                    >
                                                        Investigate
                                                    </button>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>


            {/* =====================================================
                INVESTIGATION MODAL
            ===================================================== */}

            {selected && (

                <div className="investigation-overlay">

                    <div className="investigation-modal">

                        {/* HEADER */}

                        <div className="modal-header">

                            <div>

                                <div className="page-kicker">
                                    TRANSACTION INVESTIGATION
                                </div>

                                <h2>
                                    {selected.userId || "Transaction"}
                                </h2>

                                <p>
                                    ID: {selected._id || "N/A"}
                                </p>

                            </div>

                            <button
                                className="close-button"
                                onClick={handleClose}
                            >
                                ✕ Close
                            </button>

                        </div>


                        {/* =================================================
                            RISK HERO
                        ================================================= */}

                        <div className="risk-hero">

                            <div>

                                <span>
                                    Adaptive Risk
                                </span>

                                <strong>
                                    {getAdaptiveScore(selected)}
                                    /100
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Status
                                </span>

                                <strong
                                    className={
                                        getStatusClass(
                                            selected.status
                                        )
                                    }
                                >
                                    {selected.status || "SAFE"}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Investigation Priority
                                </span>

                                <strong
                                    className={
                                        getPriorityClass(
                                            recommendation
                                                .investigationPriority
                                        )
                                    }
                                >
                                    {getPriorityIcon(
                                        recommendation
                                            .investigationPriority
                                    )}{" "}
                                    {recommendation
                                        .investigationPriority ||
                                        "NORMAL"}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Fraud Flag
                                </span>

                                <strong>

                                    {selected.isFraud
                                        ? "🚨 YES"
                                        : "✓ NO"}

                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            TRANSACTION DETAILS
                        ================================================= */}

                        <div className="transaction-detail-grid">

                            <div>
                                <span>
                                    Transaction Time
                                </span>

                                <strong>
                                    {getDate(selected)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Transaction ID
                                </span>

                                <strong>
                                    {selected._id || "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    User ID
                                </span>

                                <strong>
                                    {selected.userId || "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Amount
                                </span>

                                <strong>
                                    {getAmount(selected)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Merchant
                                </span>

                                <strong>
                                    {selected.merchant || "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Location
                                </span>

                                <strong>
                                    {selected.location || "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {selected.paymentMethod || "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Device ID
                                </span>

                                <strong>
                                    {selected.deviceId || "N/A"}
                                </strong>
                            </div>

                        </div>


                        {/* =================================================
                            ADAPTIVE INTELLIGENCE
                        ================================================= */}

                        <div className="risk-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        🧠 Adaptive Intelligence
                                    </h2>

                                    <p>
                                        Combined assessment from rules,
                                        ML, Fraud DNA, behavior,
                                        temporal and network intelligence.
                                    </p>

                                </div>

                            </div>


                            <div className="risk-analysis-grid">

                                <div className="analysis-card">

                                    <div className="analysis-card-header">

                                        <span>
                                            Adaptive Risk
                                        </span>

                                        <strong>
                                            {getAdaptiveScore(
                                                selected
                                            )}
                                            /100
                                        </strong>

                                    </div>

                                    <div className="progress-track">

                                        <div
                                            className="progress-fill rule-progress"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        getAdaptiveScore(
                                                            selected
                                                        ),
                                                        0
                                                    ),
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>

                                    <div className="analysis-label">

                                        {getRiskLabel(
                                            getAdaptiveScore(
                                                selected
                                            )
                                        )}

                                    </div>

                                </div>


                                <div className="analysis-card ml-analysis-card">

                                    <div className="analysis-card-header">

                                        <span>
                                            ML Fraud Probability
                                        </span>

                                        <strong>
                                            {getMlProbability(
                                                selected
                                            ).toFixed(0)}
                                            %
                                        </strong>

                                    </div>

                                    <div className="progress-track">

                                        <div
                                            className="progress-fill ml-progress"
                                            style={{
                                                width: `${getMlProbability(
                                                    selected
                                                )}%`
                                            }}
                                        />

                                    </div>

                                    <div className="analysis-label">

                                        {getMlLabel(
                                            getMlProbability(
                                                selected
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>


                            <div className="final-decision">

                                <div>

                                    <span>
                                        Final Decision
                                    </span>

                                    <strong
                                        className={getStatusClass(
                                            selected.status
                                        )}
                                    >
                                        {selected.status === "FRAUD"
                                            ? "🚨 FRAUD"
                                            : selected.status === "SUSPICIOUS"
                                            ? "⚠ SUSPICIOUS"
                                            : "✓ SAFE"}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Adaptive Status
                                    </span>

                                    <strong>
                                        {adaptive.adaptiveStatus ||
                                            selected.status ||
                                            "SAFE"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FRAUD DNA
                        ================================================= */}

                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        🧬 Fraud DNA
                                    </h2>

                                    <p>
                                        Individual anomaly signals contributing
                                        to the fraud assessment.
                                    </p>

                                </div>

                            </div>


                            <div className="risk-analysis-grid">

                                {[
                                    [
                                        "Amount Anomaly",
                                        fraudDNA.amountAnomaly
                                    ],
                                    [
                                        "Device Anomaly",
                                        fraudDNA.deviceAnomaly
                                    ],
                                    [
                                        "Merchant Anomaly",
                                        fraudDNA.merchantAnomaly
                                    ],
                                    [
                                        "Location Anomaly",
                                        fraudDNA.locationAnomaly
                                    ],
                                    [
                                        "Velocity Anomaly",
                                        fraudDNA.velocityAnomaly
                                    ],
                                    [
                                        "Behavioral Anomaly",
                                        fraudDNA.behavioralAnomaly
                                    ],
                                    [
                                        "Temporal Anomaly",
                                        fraudDNA.temporalAnomaly
                                    ],
                                    [
                                        "Network Anomaly",
                                        fraudDNA.networkAnomaly
                                    ]
                                ].map(
                                    ([label, value]) => {

                                        const score =
                                            Number(value || 0);

                                        return (

                                            <div
                                                className="analysis-card"
                                                key={label}
                                            >

                                                <div className="analysis-card-header">

                                                    <span>
                                                        {label}
                                                    </span>

                                                    <strong>
                                                        {score}/100
                                                    </strong>

                                                </div>

                                                <div className="progress-track">

                                                    <div
                                                        className="progress-fill rule-progress"
                                                        style={{
                                                            width: `${Math.min(
                                                                Math.max(
                                                                    score,
                                                                    0
                                                                ),
                                                                100
                                                            )}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>


                            <div className="final-decision">

                                <div>

                                    <span>
                                        Fraud DNA Score
                                    </span>

                                    <strong>
                                        {Number(
                                            selected.dnaScore || 0
                                        )}
                                        /100
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FRAUD RING
                        ================================================= */}

                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        🕸️ Fraud Ring Intelligence
                                    </h2>

                                    <p>
                                        Network relationships connected
                                        to this transaction.
                                    </p>

                                </div>

                            </div>


                            <div className="transaction-detail-grid">

                                <div>
                                    <span>
                                        Ring Score
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.ringScore || 0
                                        )}
                                        /100
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Ring Status
                                    </span>

                                    <strong>
                                        {fraudRing.ringStatus ||
                                            "NO_RING"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Connected Users
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.connectedUsers || 0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Connected Devices
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.connectedDevices || 0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Connected Merchants
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.connectedMerchants || 0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Shared Device Users
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.sharedDeviceUsers || 0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Shared Merchant Users
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.sharedMerchantUsers || 0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Suspicious Transactions
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.suspiciousTransactions || 0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Multi-Hop Connections
                                    </span>

                                    <strong>
                                        {Number(
                                            fraudRing.multiHopConnections || 0
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            DETECTION REASONS
                        ================================================= */}

                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        ⚠️ Detection Analysis
                                    </h2>

                                    <p>
                                        Why this transaction received
                                        its current risk assessment.
                                    </p>

                                </div>

                            </div>


                            {Array.isArray(selected.reasons) &&
                            selected.reasons.length > 0 ? (

                                <div className="reason-list">

                                    {selected.reasons.map(
                                        (reason, index) => {

                                            const text =
                                                String(reason);

                                            const isMlReason =
                                                text
                                                    .toLowerCase()
                                                    .includes(
                                                        "ml fraud probability"
                                                    );

                                            return (

                                                <div
                                                    className={`reason-item ${
                                                        isMlReason
                                                            ? "ml-reason"
                                                            : ""
                                                    }`}
                                                    key={index}
                                                >

                                                    <span>
                                                        {isMlReason
                                                            ? "🤖"
                                                            : "⚠️"}
                                                    </span>

                                                    <strong>
                                                        {text}
                                                    </strong>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            ) : (

                                <div className="reason-item">

                                    <span>
                                        ✓
                                    </span>

                                    <strong>
                                        No specific risk reasons recorded.
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            INVESTIGATOR RECOMMENDATIONS
                        ================================================= */}

                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        👨‍💼 Investigator Recommendations
                                    </h2>

                                    <p>
                                        Recommended actions generated
                                        from the combined fraud intelligence.
                                    </p>

                                </div>

                            </div>


                            <div className="final-decision">

                                <div>

                                    <span>
                                        Investigation Priority
                                    </span>

                                    <strong
                                        className={
                                            getPriorityClass(
                                                recommendation
                                                    .investigationPriority
                                            )
                                        }
                                    >
                                        {getPriorityIcon(
                                            recommendation
                                                .investigationPriority
                                        )}{" "}
                                        {recommendation
                                            .investigationPriority ||
                                            "NORMAL"}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Recommendations
                                    </span>

                                    <strong>
                                        {Number(
                                            recommendation
                                                .recommendationCount ||
                                            recommendations.length ||
                                            0
                                        )}
                                    </strong>

                                </div>

                            </div>


                            {recommendations.length > 0 ? (

                                <div className="reason-list">

                                    {recommendations.map(
                                        (item, index) => {

                                            const priority =
                                                item?.priority ||
                                                "LOW";

                                            return (

                                                <div
                                                    className="reason-item"
                                                    key={index}
                                                >

                                                    <span>
                                                        {getPriorityIcon(
                                                            priority
                                                        )}
                                                    </span>

                                                    <div>

                                                        <strong>
                                                            {item?.action ||
                                                                "Review transaction"}
                                                        </strong>

                                                        <p>
                                                            {item?.reason ||
                                                                "Investigate this activity."}
                                                        </p>

                                                    </div>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            ) : (

                                <div className="reason-item">

                                    <span>
                                        ✓
                                    </span>

                                    <strong>
                                        No investigator recommendations
                                        are currently available.
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            EVIDENCE
                        ================================================= */}

                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        🔎 Investigation Evidence
                                    </h2>

                                    <p>
                                        Signals that support the current
                                        investigation decision.
                                    </p>

                                </div>

                            </div>


                            {evidence.length > 0 ? (

                                <div className="reason-list">

                                    {evidence.map(
                                        (item, index) => (

                                            <div
                                                className="reason-item"
                                                key={index}
                                            >

                                                <span>
                                                    🔎
                                                </span>

                                                <strong>
                                                    {item}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="reason-item">

                                    <span>
                                        ✓
                                    </span>

                                    <strong>
                                        No additional evidence recorded.
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            NEXT ACTIONS
                        ================================================= */}

                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        ✅ Recommended Next Actions
                                    </h2>

                                    <p>
                                        Suggested investigation workflow
                                        for the analyst.
                                    </p>

                                </div>

                            </div>


                            {nextActions.length > 0 ? (

                                <div className="reason-list">

                                    {nextActions.map(
                                        (action, index) => (

                                            <div
                                                className="reason-item"
                                                key={index}
                                            >

                                                <span>
                                                    {index + 1}
                                                </span>

                                                <strong>
                                                    {action}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div className="reason-item">

                                    <span>
                                        ✓
                                    </span>

                                    <strong>
                                        Continue normal monitoring.
                                    </strong>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            ML ASSESSMENT
                        ================================================= */}

                        <div className="ml-model-assessment">

                            <div className="ml-model-icon">
                                🤖
                            </div>

                            <div>

                                <h3>
                                    ML Model Assessment
                                </h3>

                                <p>

                                    The machine-learning model assigned
                                    a{" "}
                                    <strong>
                                        {getMlProbability(
                                            selected
                                        ).toFixed(2)}%
                                    </strong>{" "}
                                    fraud probability to this transaction.

                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="modal-footer">

                            <button
                                className="secondary-button"
                                onClick={handleClose}
                            >
                                Close Investigation
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Investigation;