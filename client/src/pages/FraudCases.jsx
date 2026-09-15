import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/cases";

const FraudCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const normalizeCaseStatus = (caseStatus) => {
        const value = String(caseStatus || "OPEN")
            .trim()
            .toUpperCase();

        if (
            value === "RESOLVED" ||
            value === "CLOSED"
        ) {
            return "RESOLVED";
        }

        if (
            value === "INVESTIGATING" ||
            value === "IN_PROGRESS"
        ) {
            return "INVESTIGATING";
        }

        if (value === "FALSE_POSITIVE") {
            return "FALSE_POSITIVE";
        }

        return "OPEN";
    };

    const normalizeFraudStatus = (status) => {
        const value = String(status || "")
            .trim()
            .toUpperCase();

        if (
            value === "FRAUD" ||
            value === "CONFIRMED" ||
            value === "CONFIRMED_FRAUD"
        ) {
            return "FRAUD";
        }

        if (value === "SUSPICIOUS") {
            return "SUSPICIOUS";
        }

        if (value === "SAFE") {
            return "SAFE";
        }

        return value || "UNKNOWN";
    };

    const loadCases = async () => {
        try {
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const result = await response.json();

            if (
                result &&
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Failed to load fraud cases"
                );
            }

            const caseData =
                Array.isArray(result?.data)
                    ? result.data
                    : Array.isArray(result?.cases)
                        ? result.cases
                        : Array.isArray(result)
                            ? result
                            : [];

            const normalizedCases = caseData.map(
                (fraudCase) => ({
                    ...fraudCase,

                    normalizedCaseStatus:
                        normalizeCaseStatus(
                            fraudCase?.caseStatus
                        ),

                    normalizedFraudStatus:
                        normalizeFraudStatus(
                            fraudCase?.status
                        )
                })
            );

            setCases(normalizedCases);
        } catch (err) {
            console.error(
                "Fraud cases loading failed:",
                err
            );

            setError(
                err.message ||
                "Unable to load fraud cases"
            );

            setCases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();

        const interval = setInterval(
            loadCases,
            10000
        );

        return () => clearInterval(interval);
    }, []);

    const statistics = useMemo(() => {
        return {
            total: cases.length,

            open: cases.filter(
                (fraudCase) =>
                    fraudCase.normalizedCaseStatus ===
                    "OPEN"
            ).length,

            investigating: cases.filter(
                (fraudCase) =>
                    fraudCase.normalizedCaseStatus ===
                    "INVESTIGATING"
            ).length,

            resolved: cases.filter(
                (fraudCase) =>
                    fraudCase.normalizedCaseStatus ===
                    "RESOLVED"
            ).length,

            fraud: cases.filter(
                (fraudCase) =>
                    fraudCase.normalizedFraudStatus ===
                    "FRAUD"
            ).length,

            suspicious: cases.filter(
                (fraudCase) =>
                    fraudCase.normalizedFraudStatus ===
                    "SUSPICIOUS"
            ).length
        };
    }, [cases]);

    const getCaseStatusClass = (status) => {
        switch (
            normalizeCaseStatus(status)
        ) {
            case "OPEN":
                return "high";

            case "INVESTIGATING":
                return "medium";

            case "RESOLVED":
                return "resolved";

            case "FALSE_POSITIVE":
                return "low";

            default:
                return "";
        }
    };

    const getFraudStatusClass = (status) => {
        switch (
            normalizeFraudStatus(status)
        ) {
            case "FRAUD":
                return "critical";

            case "SUSPICIOUS":
                return "medium";

            case "SAFE":
                return "low";

            default:
                return "";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsed = new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "-";
        }

        return parsed.toLocaleString(
            "en-IN"
        );
    };

    const formatNumber = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0.00";
        }

        return number.toFixed(2);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <div className="page-kicker">
                            FRAUD INVESTIGATION
                        </div>

                        <h1>
                            📁 Fraud Cases
                        </h1>

                        <p>
                            Loading fraud
                            investigation cases...
                        </p>
                    </div>
                </div>

                <div className="empty-state">
                    <div>
                        ⟳
                    </div>

                    <h3>
                        Loading Cases
                    </h3>

                    <p>
                        FraudShield-X is
                        retrieving investigation
                        cases.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">
                <div>
                    <div className="page-kicker">
                        FRAUD INVESTIGATION
                    </div>

                    <h1>
                        📁 Fraud Cases
                    </h1>

                    <p>
                        Automatically generated
                        cases requiring fraud
                        investigation.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadCases}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* ERROR */}

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {/* STATISTICS */}

            <div className="stats-grid">

                <div className="stat-card">
                    <span>
                        Total Cases
                    </span>

                    <strong>
                        {statistics.total}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Open
                    </span>

                    <strong>
                        {statistics.open}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Investigating
                    </span>

                    <strong>
                        {statistics.investigating}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Fraud Cases
                    </span>

                    <strong>
                        {statistics.fraud}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>
                        Resolved
                    </span>

                    <strong>
                        {statistics.resolved}
                    </strong>
                </div>

            </div>

            {/* QUEUE */}

            <div className="alerts-panel">

                <div className="alerts-panel-header">

                    <div>
                        <h2>
                            Fraud Investigation Queue
                        </h2>

                        <span>
                            Auto-refresh: 10 seconds
                        </span>
                    </div>

                    <span>
                        {cases.length} cases
                    </span>

                </div>

                {cases.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            ✅
                        </div>

                        <h3>
                            No fraud cases found
                        </h3>

                        <p>
                            FraudShield-X has not
                            created any investigation
                            cases yet.
                        </p>

                    </div>

                ) : (

                    <div className="alerts-list">

                        {cases.map(
                            (fraudCase) => {

                                const caseStatus =
                                    fraudCase.normalizedCaseStatus ||
                                    normalizeCaseStatus(
                                        fraudCase.caseStatus
                                    );

                                const fraudStatus =
                                    fraudCase.normalizedFraudStatus ||
                                    normalizeFraudStatus(
                                        fraudCase.status
                                    );

                                const riskScore =
                                    Number(
                                        fraudCase.riskScore ||
                                        fraudCase.adaptiveScore ||
                                        0
                                    );

                                const fraudProbability =
                                    Number(
                                        fraudCase.fraudProbability ||
                                        fraudCase.mlProbability ||
                                        0
                                    );

                                const caseKey =
                                    fraudCase._id ||
                                    fraudCase.id ||
                                    fraudCase.caseId;

                                return (

                                    <div
                                        className="alert-card"
                                        key={caseKey}
                                    >

                                        {/* CARD HEADER */}

                                        <div className="alert-card-header">

                                            <div>

                                                <h3>
                                                    {
                                                        fraudCase.caseId ||
                                                        fraudCase._id ||
                                                        "Fraud Case"
                                                    }
                                                </h3>

                                                <p>
                                                    User:{" "}
                                                    <strong>
                                                        {
                                                            fraudCase.userId ||
                                                            "Unknown"
                                                        }
                                                    </strong>
                                                </p>

                                            </div>

                                            <div className="alert-badges">

                                                <span
                                                    className={`severity-badge ${getCaseStatusClass(
                                                        caseStatus
                                                    )}`}
                                                >
                                                    {caseStatus}
                                                </span>

                                                <span
                                                    className={`severity-badge ${getFraudStatusClass(
                                                        fraudStatus
                                                    )}`}
                                                >
                                                    {fraudStatus}
                                                </span>

                                            </div>

                                        </div>

                                        {/* DESCRIPTION */}

                                        <p className="alert-message">

                                            {
                                                fraudCase.description ||
                                                fraudCase.reason ||
                                                fraudCase.message ||
                                                "Suspicious activity requires investigation."
                                            }

                                        </p>

                                        {/* DETAILS */}

                                        <div className="alert-details">

                                            <div>
                                                <span>
                                                    Risk Score
                                                </span>

                                                <strong>
                                                    {formatNumber(
                                                        riskScore
                                                    )}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Fraud Probability
                                                </span>

                                                <strong>
                                                    {formatNumber(
                                                        fraudProbability
                                                    )}
                                                    %
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Created
                                                </span>

                                                <strong>
                                                    {formatDate(
                                                        fraudCase.createdAt
                                                    )}
                                                </strong>
                                            </div>

                                        </div>

                                        {/* CASE WORKFLOW */}

                                        <div className="alert-details">

                                            <div>
                                                <span>
                                                    Case Status
                                                </span>

                                                <strong>
                                                    {caseStatus}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Fraud Classification
                                                </span>

                                                <strong>
                                                    {fraudStatus}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Case ID
                                                </span>

                                                <strong>
                                                    {String(
                                                        fraudCase.caseId ||
                                                        fraudCase._id ||
                                                        "N/A"
                                                    ).slice(
                                                        0,
                                                        18
                                                    )}
                                                </strong>
                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

        </div>
    );
};

export default FraudCases;