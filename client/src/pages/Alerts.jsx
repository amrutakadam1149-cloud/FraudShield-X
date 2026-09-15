import React, { useEffect, useState } from "react";
import "./Alerts.css";

const API_URL = "http://localhost:5000/api/alerts";

const DEFAULT_STATS = {
    total: 0,
    newAlerts: 0,
    acknowledged: 0,
    resolved: 0,
    critical: 0
};

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    const loadAlerts = async () => {
        try {
            setError("");

            const [alertsResponse, statsResponse] =
                await Promise.all([
                    fetch(API_URL),
                    fetch(`${API_URL}/stats`)
                ]);

            const alertsResult = await alertsResponse.json();
            const statsResult = await statsResponse.json();

            if (!alertsResponse.ok) {
                throw new Error(
                    alertsResult.message ||
                    "Failed to load alerts"
                );
            }

            if (!statsResponse.ok) {
                throw new Error(
                    statsResult.message ||
                    "Failed to load alert statistics"
                );
            }

            const alertData = Array.isArray(alertsResult.data)
                ? alertsResult.data
                : [];

            const statistics =
                statsResult.data &&
                typeof statsResult.data === "object"
                    ? statsResult.data
                    : DEFAULT_STATS;

            setAlerts(alertData);

            setStats({
                total: Number(statistics.total) || 0,
                newAlerts:
                    Number(statistics.newAlerts) ||
                    Number(statistics.new) ||
                    0,
                acknowledged:
                    Number(statistics.acknowledged) || 0,
                resolved:
                    Number(statistics.resolved) || 0,
                critical:
                    Number(statistics.critical) || 0
            });

        } catch (err) {
            console.error("Alerts loading failed:", err);

            setError(
                err.message ||
                "Unable to load fraud alerts"
            );

            setAlerts([]);
            setStats(DEFAULT_STATS);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();

        const interval = setInterval(() => {
            loadAlerts();
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const updateAlert = async (id, action) => {
        try {
            setError("");
            setUpdatingId(id);

            const response = await fetch(
                `${API_URL}/${id}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to update alert"
                );
            }

            await loadAlerts();

        } catch (err) {
            console.error(
                "Alert update failed:",
                err
            );

            setError(
                err.message ||
                "Failed to update alert"
            );

        } finally {
            setUpdatingId("");
        }
    };

    const getSeverityClass = (severity) => {
        switch (
            String(severity || "").toUpperCase()
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

    const getStatusClass = (status) => {
        switch (
            String(status || "").toUpperCase()
        ) {
            case "NEW":
                return "new";

            case "ACKNOWLEDGED":
                return "acknowledged";

            case "RESOLVED":
                return "resolved";

            default:
                return "";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleString();
    };

    const formatNumber = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toFixed(2);
    };

    const getAlertId = (alert) => {
        return alert?._id || alert?.id || "";
    };

    if (loading) {
        return (
            <div className="page-container alerts-page">
                <div className="page-header">
                    <div>
                        <h1>🚨 Fraud Alerts</h1>
                        <p>
                            Loading live fraud alerts...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container alerts-page">

            <div className="page-header">

                <div>
                    <h1>🚨 Fraud Alerts</h1>

                    <p>
                        Real-time alerts generated by
                        FraudShield-X intelligence engines.
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadAlerts}
                    disabled={loading}
                >
                    🔄 Refresh
                </button>

            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            <div className="stats-grid">

                <div className="stat-card">
                    <span>Total Alerts</span>
                    <strong>{stats.total}</strong>
                </div>

                <div className="stat-card">
                    <span>New Alerts</span>
                    <strong>{stats.newAlerts}</strong>
                </div>

                <div className="stat-card">
                    <span>Critical</span>
                    <strong>{stats.critical}</strong>
                </div>

                <div className="stat-card">
                    <span>Acknowledged</span>
                    <strong>{stats.acknowledged}</strong>
                </div>

                <div className="stat-card">
                    <span>Resolved</span>
                    <strong>{stats.resolved}</strong>
                </div>

            </div>

            <div className="alerts-panel">

                <div className="alerts-panel-header">

                    <div>
                        <h2>Alert Queue</h2>

                        <p>
                            Active fraud and suspicious
                            activity alerts.
                        </p>
                    </div>

                    <span>
                        Auto-refresh: 10 seconds
                    </span>

                </div>

                {alerts.length === 0 ? (

                    <div className="empty-state">

                        <div>✅</div>

                        <h3>
                            No alerts found
                        </h3>

                        <p>
                            FraudShield-X has not generated
                            any alerts yet.
                        </p>

                    </div>

                ) : (

                    <div className="alerts-list">

                        {alerts.map((alert) => {

                            const alertId =
                                getAlertId(alert);

                            const status =
                                String(
                                    alert.status || "NEW"
                                ).toUpperCase();

                            const severity =
                                String(
                                    alert.severity || "LOW"
                                ).toUpperCase();

                            const alertType =
                                String(
                                    alert.alertType || "ALERT"
                                ).replaceAll("_", " ");

                            const isUpdating =
                                updatingId === alertId;

                            return (
                                <div
                                    className="alert-card"
                                    key={alertId}
                                >

                                    <div className="alert-card-header">

                                        <div>
                                            <h3>
                                                {alertType}
                                            </h3>

                                            <p>
                                                User:{" "}
                                                <strong>
                                                    {alert.userId ||
                                                        "UNKNOWN"}
                                                </strong>
                                            </p>
                                        </div>

                                        <div className="alert-badges">

                                            <span
                                                className={`severity-badge ${getSeverityClass(
                                                    severity
                                                )}`}
                                            >
                                                {severity}
                                            </span>

                                            <span
                                                className={`status-badge ${getStatusClass(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>

                                        </div>

                                    </div>

                                    <p className="alert-message">
                                        {alert.message ||
                                            "Suspicious transaction activity detected."}
                                    </p>

                                    <div className="alert-details">

                                        <div>
                                            <span>
                                                Risk Score
                                            </span>

                                            <strong>
                                                {formatNumber(
                                                    alert.riskScore
                                                )}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Fraud Probability
                                            </span>

                                            <strong>
                                                {formatNumber(
                                                    alert.fraudProbability
                                                )}
                                                %
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Alert Type
                                            </span>

                                            <strong>
                                                {alertType}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Created
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    alert.createdAt
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="alert-actions">

                                        {status === "NEW" && (
                                            <button
                                                className="acknowledge-button"
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    updateAlert(
                                                        alertId,
                                                        "acknowledge"
                                                    )
                                                }
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : "✓ Acknowledge"}
                                            </button>
                                        )}

                                        {status !== "RESOLVED" && (
                                            <button
                                                className="resolve-button"
                                                disabled={isUpdating}
                                                onClick={() =>
                                                    updateAlert(
                                                        alertId,
                                                        "resolve"
                                                    )
                                                }
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : "✓ Resolve"}
                                            </button>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
};

export default Alerts;