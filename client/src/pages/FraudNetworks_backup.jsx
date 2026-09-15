import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:5000/api/networks";

function FraudNetworks() {
    const [network, setNetwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);

    const fetchNetwork = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || "Failed to load fraud network"
                );
            }

            setNetwork(result);
        } catch (err) {
            console.error("Fraud network error:", err);

            setError(
                "Unable to load fraud network from FraudShield-X server."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNetwork();
    }, []);

    const users = network?.nodes?.users || [];
    const devices = network?.nodes?.devices || [];
    const merchants = network?.nodes?.merchants || [];
    const edges = network?.edges || [];
    const sharedDevices = network?.sharedDevices || [];
    const statistics = network?.statistics || {};

    const uniqueConnections = useMemo(() => {
        const map = new Map();

        edges.forEach((edge) => {
            const key = `${edge.source}|${edge.target}|${edge.type}`;

            if (!map.has(key)) {
                map.set(key, {
                    ...edge,
                    transactionCount: 1
                });
            } else {
                const existing = map.get(key);

                existing.transactionCount += 1;

                existing.riskScore = Math.max(
                    Number(existing.riskScore || 0),
                    Number(edge.riskScore || 0)
                );

                if (edge.isFraud) {
                    existing.isFraud = true;
                }
            }
        });

        return Array.from(map.values());
    }, [edges]);

    const graphNodes = useMemo(() => {
        const result = [];

        const graphWidth = 1100;

        const userX = 150;
        const deviceX = graphWidth / 2;
        const merchantX = 950;

        const createPositions = (items, x, type) => {
            const maxVisible = 12;
            const visible = items.slice(0, maxVisible);

            const spacing =
                visible.length <= 1
                    ? 300
                    : Math.min(
                          72,
                          430 / Math.max(visible.length - 1, 1)
                      );

            const totalHeight =
                (visible.length - 1) * spacing;

            const startY =
                330 - totalHeight / 2;

            visible.forEach((item, index) => {
                result.push({
                    ...item,
                    graphType: type,
                    x,
                    y: startY + index * spacing
                });
            });
        };

        createPositions(users, userX, "user");
        createPositions(devices, deviceX, "device");
        createPositions(merchants, merchantX, "merchant");

        return result;
    }, [users, devices, merchants]);

    const nodeMap = useMemo(() => {
        const map = new Map();

        graphNodes.forEach((node) => {
            map.set(`${node.graphType}:${node.id}`, node);
        });

        return map;
    }, [graphNodes]);

    const getNode = (id, type) => {
        return nodeMap.get(`${type}:${id}`);
    };

    const graphEdges = useMemo(() => {
        return uniqueConnections
            .map((edge) => {
                const sourceType = "user";

                const targetType =
                    edge.type === "user-device"
                        ? "device"
                        : "merchant";

                const source = getNode(
                    edge.source,
                    sourceType
                );

                const target = getNode(
                    edge.target,
                    targetType
                );

                if (!source || !target) {
                    return null;
                }

                return {
                    ...edge,
                    sourceNode: source,
                    targetNode: target
                };
            })
            .filter(Boolean);
    }, [uniqueConnections, nodeMap]);

    const getRiskLabel = (score) => {
        const value = Number(score || 0);

        if (value >= 70) return "HIGH";
        if (value >= 40) return "MEDIUM";

        return "LOW";
    };

    const getRiskClass = (score) => {
        const value = Number(score || 0);

        if (value >= 70) {
            return "network-risk-high";
        }

        if (value >= 40) {
            return "network-risk-medium";
        }

        return "network-risk-low";
    };

    const getNodeRadius = (node) => {
        const activity =
            Number(node?.transactionCount || 0);

        return Math.min(
            30,
            20 + activity * 1.2
        );
    };

    const selectNode = (node) => {
        setSelectedNode(node);
    };

    if (loading) {
        return (
            <div className="network-page">
                <div className="network-loading-card">
                    <div className="network-spinner">
                        ⟳
                    </div>

                    <h2>
                        Loading Fraud Network
                    </h2>

                    <p>
                        Analyzing users, devices,
                        merchants and fraud connections...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="network-page">
                <div className="network-error-card">
                    <div className="network-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Fraud Network Unavailable
                    </h2>

                    <p>{error}</p>

                    <button
                        className="primary-button"
                        onClick={fetchNetwork}
                    >
                        ↻ Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="network-page">

            <div className="network-page-header">
                <div>
                    <div className="page-kicker">
                        NETWORK INTELLIGENCE
                    </div>

                    <h1>
                        🔗 Fraud Network Analysis
                    </h1>

                    <p>
                        Detect coordinated fraud activity
                        across users, devices and merchants.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={fetchNetwork}
                >
                    ↻ Refresh Network
                </button>
            </div>

            <div className="network-stats-grid">

                <div className="network-stat-card blue">
                    <span className="network-stat-icon">
                        👤
                    </span>

                    <div>
                        <span>Total Users</span>
                        <strong>
                            {statistics.totalUsers || 0}
                        </strong>
                    </div>
                </div>

                <div className="network-stat-card purple">
                    <span className="network-stat-icon">
                        📱
                    </span>

                    <div>
                        <span>Total Devices</span>
                        <strong>
                            {statistics.totalDevices || 0}
                        </strong>
                    </div>
                </div>

                <div className="network-stat-card green">
                    <span className="network-stat-icon">
                        🏪
                    </span>

                    <div>
                        <span>Total Merchants</span>
                        <strong>
                            {statistics.totalMerchants || 0}
                        </strong>
                    </div>
                </div>

                <div className="network-stat-card red">
                    <span className="network-stat-icon">
                        🚨
                    </span>

                    <div>
                        <span>Fraud Transactions</span>
                        <strong>
                            {statistics.fraudTransactions || 0}
                        </strong>
                    </div>
                </div>

                <div className="network-stat-card orange">
                    <span className="network-stat-icon">
                        ⚠️
                    </span>

                    <div>
                        <span>Suspicious Transactions</span>
                        <strong>
                            {statistics.suspiciousTransactions || 0}
                        </strong>
                    </div>
                </div>

                <div className="network-stat-card dark">
                    <span className="network-stat-icon">
                        🕸️
                    </span>

                    <div>
                        <span>Shared Devices</span>
                        <strong>
                            {statistics.sharedDevices || 0}
                        </strong>
                    </div>
                </div>

            </div>

            <div className="network-card">

                <div className="network-section-header">
                    <div>
                        <h2>
                            🚨 Potential Fraud Rings
                        </h2>

                        <p>
                            Devices connected to multiple
                            users may indicate coordinated
                            fraud activity.
                        </p>
                    </div>

                    <span className="network-count-badge">
                        {sharedDevices.length} detected
                    </span>
                </div>

                {sharedDevices.length === 0 ? (
                    <div className="network-empty">
                        <span>🛡️</span>

                        <h3>
                            No shared-device fraud rings detected
                        </h3>

                        <p>
                            No device is currently connected
                            to multiple users.
                        </p>
                    </div>
                ) : (
                    <div className="network-table-wrapper">
                        <table className="network-table">

                            <thead>
                                <tr>
                                    <th>Device</th>
                                    <th>Linked Users</th>
                                    <th>Transactions</th>
                                    <th>Fraud Events</th>
                                    <th>User Count</th>
                                    <th>Threat</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sharedDevices.map((device) => {

                                    const threat =
                                        Number(
                                            device.fraudCount || 0
                                        ) > 0;

                                    return (
                                        <tr
                                            key={device.deviceId}
                                        >
                                            <td>
                                                <strong>
                                                    {device.deviceId}
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="linked-users">
                                                    {Array.isArray(
                                                        device.users
                                                    ) &&
                                                        device.users.map(
                                                            (user) => (
                                                                <span
                                                                    key={user}
                                                                    className="user-chip"
                                                                >
                                                                    {user}
                                                                </span>
                                                            )
                                                        )}
                                                </div>
                                            </td>

                                            <td>
                                                {device.transactionCount || 0}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        threat
                                                            ? "fraud-count-badge"
                                                            : "safe-count-badge"
                                                    }
                                                >
                                                    {device.fraudCount || 0}
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {device.userCount || 0}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        threat
                                                            ? "status-badge status-fraud"
                                                            : "status-badge status-suspicious"
                                                    }
                                                >
                                                    {threat
                                                        ? "FRAUD RING"
                                                        : "SHARED DEVICE"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>

            <div className="network-card">

                <div className="network-section-header">

                    <div>
                        <h2>
                            Relationship Graph
                        </h2>

                        <p>
                            Each connection represents
                            transaction activity. Click a
                            node to inspect its network role.
                        </p>
                    </div>

                    <div className="network-legend">

                        <span>
                            <i className="legend-user"></i>
                            User
                        </span>

                        <span>
                            <i className="legend-device"></i>
                            Device
                        </span>

                        <span>
                            <i className="legend-merchant"></i>
                            Merchant
                        </span>

                        <span>
                            <i className="legend-fraud"></i>
                            Fraud
                        </span>

                        <span>
                            <i className="legend-normal"></i>
                            Normal
                        </span>

                    </div>

                </div>

                <div className="network-graph-container">

                    <svg
                        viewBox="0 0 1100 680"
                        className="network-svg"
                        preserveAspectRatio="xMidYMid meet"
                    >

                        <defs>
                            <pattern
                                id="networkGrid"
                                width="32"
                                height="32"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 32 0 L 0 0 0 32"
                                    fill="none"
                                    stroke="#e7edf5"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>

                        <rect
                            x="0"
                            y="0"
                            width="1100"
                            height="680"
                            fill="url(#networkGrid)"
                        />

                        <text
                            x="150"
                            y="38"
                            textAnchor="middle"
                            className="network-column-title"
                        >
                            USERS
                        </text>

                        <text
                            x="550"
                            y="38"
                            textAnchor="middle"
                            className="network-column-title"
                        >
                            DEVICES
                        </text>

                        <text
                            x="950"
                            y="38"
                            textAnchor="middle"
                            className="network-column-title"
                        >
                            MERCHANTS
                        </text>

                        {graphEdges.map((edge, index) => {

                            const fraud =
                                Boolean(edge.isFraud);

                            const risk =
                                Number(edge.riskScore || 0);

                            let stroke = "#cbd5e1";
                            let strokeWidth = 1.5;

                            if (fraud) {
                                stroke = "#ef4444";
                                strokeWidth = 3;
                            } else if (risk >= 40) {
                                stroke = "#f59e0b";
                                strokeWidth = 2.5;
                            }

                            return (
                                <line
                                    key={`${edge.source}-${edge.target}-${index}`}
                                    x1={edge.sourceNode.x}
                                    y1={edge.sourceNode.y}
                                    x2={edge.targetNode.x}
                                    y2={edge.targetNode.y}
                                    stroke={stroke}
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                    opacity={
                                        fraud ? 0.9 : 0.55
                                    }
                                />
                            );
                        })}

                        {graphNodes.map((node) => {

                            const radius =
                                getNodeRadius(node);

                            const fraud =
                                Number(node.fraudCount || 0) > 0;

                            let fill = "#eef4ff";
                            let stroke = "#6478e8";

                            if (
                                node.graphType === "device"
                            ) {
                                fill = "#e8f6ff";
                                stroke = "#38a6df";
                            }

                            if (
                                node.graphType === "merchant"
                            ) {
                                fill = "#e9faf2";
                                stroke = "#38b982";
                            }

                            if (fraud) {
                                stroke = "#ef4444";
                                fill = "#fff1f2";
                            }

                            const isSelected =
                                selectedNode?.id === node.id &&
                                selectedNode?.graphType ===
                                    node.graphType;

                            return (
                                <g
                                    key={`${node.graphType}-${node.id}`}
                                    className="network-node-group"
                                    onClick={() =>
                                        selectNode(node)
                                    }
                                >

                                    {fraud && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={radius + 7}
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="2"
                                            opacity="0.3"
                                        />
                                    )}

                                    {isSelected && (
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={radius + 10}
                                            fill="none"
                                            stroke="#1d4ed8"
                                            strokeWidth="2"
                                            strokeDasharray="5 4"
                                        />
                                    )}

                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={radius}
                                        fill={fill}
                                        stroke={stroke}
                                        strokeWidth="3"
                                    />

                                    <text
                                        x={node.x}
                                        y={node.y + 4}
                                        textAnchor="middle"
                                        className="network-node-icon"
                                    >
                                        {node.graphType === "user"
                                            ? "U"
                                            : node.graphType === "device"
                                            ? "D"
                                            : "M"}
                                    </text>

                                    <text
                                        x={node.x}
                                        y={
                                            node.y +
                                            radius +
                                            18
                                        }
                                        textAnchor="middle"
                                        className="network-node-label"
                                    >
                                        {String(
                                            node.label || node.id
                                        ).length > 16
                                            ? `${String(
                                                  node.label ||
                                                      node.id
                                              ).slice(0, 16)}...`
                                            : node.label ||
                                              node.id}
                                    </text>

                                </g>
                            );
                        })}

                    </svg>

                </div>
            </div>

            {selectedNode && (
                <div className="network-card selected-node-card">

                    <div className="network-section-header">

                        <div>
                            <div className="page-kicker">
                                NODE INTELLIGENCE
                            </div>

                            <h2>
                                Selected Node
                            </h2>

                            <p>
                                Detailed network information
                                for the selected entity.
                            </p>
                        </div>

                        <button
                            className="secondary-button"
                            onClick={() =>
                                setSelectedNode(null)
                            }
                        >
                            ✕ Clear
                        </button>

                    </div>

                    <div className="selected-node-grid">

                        <div className="selected-node-main">

                            <div className="selected-node-icon">
                                {selectedNode.graphType ===
                                "user"
                                    ? "👤"
                                    : selectedNode.graphType ===
                                      "device"
                                    ? "📱"
                                    : "🏪"}
                            </div>

                            <div>
                                <span className="selected-node-type">
                                    {selectedNode.graphType.toUpperCase()}
                                </span>

                                <h3>
                                    {selectedNode.label ||
                                        selectedNode.id}
                                </h3>
                            </div>

                        </div>

                        <div className="node-detail-item">
                            <span>Transactions</span>

                            <strong>
                                {selectedNode.transactionCount || 0}
                            </strong>
                        </div>

                        <div className="node-detail-item">
                            <span>Fraud Events</span>

                            <strong className="node-fraud-number">
                                {selectedNode.fraudCount || 0}
                            </strong>
                        </div>

                        {(selectedNode.graphType === "user" ||
                            selectedNode.graphType === "merchant") && (
                            <div className="node-detail-item">
                                <span>Maximum Risk</span>

                                <strong>
                                    {selectedNode.riskScore || 0}
                                    /100
                                </strong>
                            </div>
                        )}

                        {selectedNode.graphType === "device" && (
                            <div className="node-detail-item">
                                <span>Connected Users</span>

                                <strong>
                                    {selectedNode.userCount || 0}
                                </strong>
                            </div>
                        )}

                    </div>
                </div>
            )}

            <div className="network-card">

                <div className="network-section-header">

                    <div>
                        <h2>
                            Transaction Connections
                        </h2>

                        <p>
                            User-to-device and
                            user-to-merchant relationships
                            detected by the backend.
                        </p>
                    </div>

                    <span className="network-count-badge">
                        {uniqueConnections.length} connections
                    </span>

                </div>

                {uniqueConnections.length === 0 ? (
                    <div className="network-empty">
                        <span>🔍</span>

                        <h3>
                            No network connections found
                        </h3>

                        <p>
                            The backend has not returned
                            any transaction relationships.
                        </p>
                    </div>
                ) : (
                    <div className="network-table-wrapper">

                        <table className="network-table">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Relationship</th>
                                    <th>Target</th>
                                    <th>Transactions</th>
                                    <th>Risk</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {uniqueConnections
                                    .slice(0, 50)
                                    .map(
                                        (connection, index) => {

                                            const fraud =
                                                Boolean(
                                                    connection.isFraud
                                                );

                                            const targetType =
                                                connection.type ===
                                                "user-device"
                                                    ? "Device"
                                                    : "Merchant";

                                            const risk =
                                                Number(
                                                    connection.riskScore ||
                                                        0
                                                );

                                            return (
                                                <tr
                                                    key={`${connection.source}-${connection.target}-${connection.type}-${index}`}
                                                >

                                                    <td>
                                                        <strong>
                                                            {connection.source}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <span className="relationship-badge">
                                                            {connection.type ===
                                                            "user-device"
                                                                ? "USER → DEVICE"
                                                                : "USER → MERCHANT"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="target-label">
                                                            {connection.target ||
                                                                "Unknown"}
                                                        </span>

                                                        <small>
                                                            {targetType}
                                                        </small>
                                                    </td>

                                                    <td>
                                                        {
                                                            connection.transactionCount
                                                        }
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
                                                        <span
                                                            className={
                                                                fraud
                                                                    ? "status-badge status-fraud"
                                                                    : risk >= 40
                                                                    ? "status-badge status-suspicious"
                                                                    : "status-badge status-safe"
                                                            }
                                                        >
                                                            {fraud
                                                                ? "FRAUD"
                                                                : getRiskLabel(
                                                                      risk
                                                                  )}
                                                        </span>
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

        </div>
    );
}

export default FraudNetworks;