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
                String(transaction._id || "")
                    .toLowerCase()
                    .includes(query) ||
                String(transaction.userId || "")
                    .toLowerCase()
                    .includes(query) ||
                String(transaction.merchant || "")
                    .toLowerCase()
                    .includes(query) ||
                String(transaction.location || "")
                    .toLowerCase()
                    .includes(query) ||
                String(transaction.deviceId || "")
                    .toLowerCase()
                    .includes(query) ||
                String(transaction.paymentMethod || "")
                    .toLowerCase()
                    .includes(query);

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

        if (status === "FRAUD") {
            return "status-fraud";
        }

        if (status === "SUSPICIOUS") {
            return "status-suspicious";
        }

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

        if (probability >= 70) {
            return "HIGH";
        }

        if (probability >= 40) {
            return "MODERATE";
        }

        return "LOW";
    };


    const getDate = (transaction) => {

        if (!transaction?.transactionTime) {
            return "N/A";
        }

        const date =
            new Date(transaction.transactionTime);

        if (Number.isNaN(date.getTime())) {
            return "N/A";
        }

        return date.toLocaleString();
    };


    const getAmount = (transaction) => {

        const amount =
            Number(transaction?.amount || 0);

        if (formatMoney) {
            return formatMoney(amount);
        }

        return `₹${amount.toLocaleString("en-IN")}`;
    };


    const handleSelect = (transaction) => {

        setSelected(transaction);

    };


    const handleClose = () => {

        setSelected(null);

    };


    return (
        <div className="investigation-page">

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
                        rule-based and machine-learning
                        signals.
                    </p>

                </div>

                <button
                    className="primary-button"
                    onClick={onRefresh}
                >
                    ↻ Refresh Data
                </button>

            </div>


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
                                            Number(
                                                transaction.riskScore || 0
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


            {selected && (

                <div className="investigation-overlay">

                    <div className="investigation-modal">

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


                        <div className="risk-hero">

                            <div>

                                <span>
                                    Risk Score
                                </span>

                                <strong>
                                    {Number(
                                        selected.riskScore || 0
                                    )}
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
                                    Fraud Flag
                                </span>

                                <strong>

                                    {selected.isFraud
                                        ? "🚨 YES"
                                        : "✓ NO"}

                                </strong>

                            </div>

                        </div>


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


                        <div className="risk-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        🧠 Risk Analysis
                                    </h2>

                                    <p>
                                        Combined rule-based detection
                                        and machine-learning assessment.
                                    </p>

                                </div>

                            </div>


                            <div className="risk-analysis-grid">

                                <div className="analysis-card">

                                    <div className="analysis-card-header">

                                        <span>
                                            Rule-Based Risk
                                        </span>

                                        <strong>
                                            {Number(
                                                selected.riskScore || 0
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
                                                        Number(
                                                            selected.riskScore || 0
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
                                            selected.riskScore
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

                                        {
                                            getMlLabel(
                                                getMlProbability(
                                                    selected
                                                )
                                            )
                                        }

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
                                        ML Model
                                    </span>

                                    <strong>
                                        {getMlProbability(
                                            selected
                                        ).toFixed(2)}
                                        % probability
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="detection-analysis">

                            <div className="section-heading">

                                <div>

                                    <h2>
                                        Detection Analysis
                                    </h2>

                                    <p>
                                        Why this transaction was flagged.
                                    </p>

                                </div>

                            </div>


                            {Array.isArray(selected.reasons) &&
                            selected.reasons.length > 0 ? (

                                <div className="reason-list">

                                    {selected.reasons.map(
                                        (reason, index) => {

                                            const isMlReason =
                                                String(reason)
                                                    .toLowerCase()
                                                    .includes("ml fraud probability");

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
                                                        {reason}
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