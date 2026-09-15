import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000/api/networks";

const TYPE_ORDER = [
    "USER",
    "DEVICE",
    "MERCHANT",
    "LOCATION"
];

const TYPE_META = {
    USER: {
        label: "Users",
        icon: "👤"
    },
    DEVICE: {
        label: "Devices",
        icon: "📱"
    },
    MERCHANT: {
        label: "Merchants",
        icon: "🏪"
    },
    LOCATION: {
        label: "Locations",
        icon: "📍"
    }
};

const getRisk = (node) => {
    const value = Number(
        node?.riskScore ??
        node?.adaptiveScore ??
        node?.fraudProbability ??
        0
    );

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.min(100, value));
};

const getRiskLevel = (risk) => {
    if (risk >= 90) return "CRITICAL";
    if (risk >= 70) return "HIGH";
    if (risk >= 40) return "MEDIUM";
    return "LOW";
};

const getNodeStatus = (node) => {
    const status = String(
        node?.status ||
        node?.riskStatus ||
        ""
    ).toUpperCase();

    const fraudCount = Number(node?.fraudCount || 0);
    const suspiciousCount = Number(
        node?.suspiciousCount || 0
    );

    if (
        status.includes("FRAUD") ||
        status === "CRITICAL" ||
        fraudCount > 0
    ) {
        return "FRAUD";
    }

    if (
        status.includes("SUSPICIOUS") ||
        status === "HIGH" ||
        suspiciousCount > 0
    ) {
        return "SUSPICIOUS";
    }

    return "SAFE";
};

const getEdgeStatus = (edge) => {
    const status = String(
        edge?.status ||
        edge?.riskStatus ||
        ""
    ).toUpperCase();

    const fraudCount = Number(edge?.fraudCount || 0);
    const suspiciousCount = Number(
        edge?.suspiciousCount || 0
    );

    if (
        status.includes("FRAUD") ||
        fraudCount > 0
    ) {
        return "FRAUD";
    }

    if (
        status.includes("SUSPICIOUS") ||
        suspiciousCount > 0
    ) {
        return "SUSPICIOUS";
    }

    return "SAFE";
};

const getStatusColor = (status) => {
    if (status === "FRAUD") {
        return "#dc2626";
    }

    if (status === "SUSPICIOUS") {
        return "#f59e0b";
    }

    return "#94a3b8";
};

const getRiskBorder = (risk) => {
    if (risk >= 90) return "#dc2626";
    if (risk >= 70) return "#f97316";
    if (risk >= 40) return "#f59e0b";
    return "#2563eb";
};

const getNodeRadius = (risk) => {
    if (risk >= 90) return 24;
    if (risk >= 70) return 22;
    if (risk >= 40) return 20;
    return 18;
};

const formatMoney = (value) => {
    const amount = Number(value || 0);

    if (!Number.isFinite(amount)) {
        return "₹0";
    }

    return `₹${amount.toLocaleString("en-IN", {
        maximumFractionDigits: 0
    })}`;
};

const truncate = (value, max = 18) => {
    const text = String(
        value || "UNKNOWN"
    );

    if (text.length <= max) {
        return text;
    }

    return `${text.substring(0, max - 1)}…`;
};

function FraudNetworks() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [statistics, setStatistics] = useState({});

    const [selectedNode, setSelectedNode] = useState(null);

    const [filter, setFilter] = useState(
        "FRAUD_SUSPICIOUS"
    );

    const [searchText, setSearchText] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] =
        useState(null);

    const [showAllNodes, setShowAllNodes] =
        useState(false);

    /*
     * IMPORTANT:
     * No JWT token.
     * No localStorage.
     * No authentication.
     */
    const fetchNetwork = async () => {
        try {
            setError("");

            const response = await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Network request failed: ${response.status}`
                );
            }

            const result =
                await response.json();

            if (
                result &&
                result.success === false
            ) {
                throw new Error(
                    result.message ||
                    "Failed to load fraud network"
                );
            }

            const networkData =
                result?.data || result || {};

            const incomingNodes =
                Array.isArray(networkData.nodes)
                    ? networkData.nodes
                    : [];

            const incomingEdges =
                Array.isArray(networkData.edges)
                    ? networkData.edges
                    : [];

            const safeNodes =
                incomingNodes
                    .filter(Boolean)
                    .map(
                        (node, index) => ({
                            ...node,
                            id:
                                String(
                                    node.id ??
                                    node._id ??
                                    `${node.type || "NODE"}-${index}`
                                ),
                            type:
                                String(
                                    node.type ||
                                    "USER"
                                ).toUpperCase(),
                            label:
                                node.label ||
                                node.name ||
                                node.id ||
                                node._id ||
                                "UNKNOWN",
                            riskScore:
                                getRisk(node)
                        })
                    );

            const safeEdges =
                incomingEdges
                    .filter(Boolean)
                    .map(
                        (edge, index) => ({
                            ...edge,
                            id:
                                String(
                                    edge.id ??
                                    edge._id ??
                                    `EDGE-${index}`
                                ),
                            source:
                                String(
                                    edge.source ??
                                    edge.from ??
                                    ""
                                ),
                            target:
                                String(
                                    edge.target ??
                                    edge.to ??
                                    ""
                                ),
                            status:
                                getEdgeStatus(edge)
                        })
                    )
                    .filter(
                        (edge) =>
                            edge.source &&
                            edge.target
                    );

            setNodes(safeNodes);
            setEdges(safeEdges);

            setStatistics(
                networkData.statistics || {}
            );

            setLastUpdated(new Date());

            /*
             * Remove selection if selected node
             * no longer exists.
             */
            setSelectedNode((current) => {
                if (!current) {
                    return null;
                }

                const updated =
                    safeNodes.find(
                        (node) =>
                            node.id === current.id
                    );

                return updated || null;
            });

        } catch (err) {
            console.error(
                "Fraud network loading failed:",
                err
            );

            setError(
                err.message ||
                "Unable to load fraud network."
            );

            setNodes([]);
            setEdges([]);
            setStatistics({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNetwork();

        const interval =
            setInterval(
                fetchNetwork,
                10000
            );

        return () => {
            clearInterval(interval);
        };
    }, []);

    const normalizedNodes = useMemo(() => {
        return nodes.map((node) => ({
            ...node,
            riskScore: getRisk(node),
            status: getNodeStatus(node)
        }));
    }, [nodes]);

    const normalizedEdges = useMemo(() => {
        return edges.map((edge) => ({
            ...edge,
            status: getEdgeStatus(edge)
        }));
    }, [edges]);

    const filteredNodes = useMemo(() => {
        let result =
            normalizedNodes.filter(
                (node) => {
                    const search =
                        searchText
                            .trim()
                            .toLowerCase();

                    if (search) {
                        const text =
                            `${node.type || ""} ${
                                node.label || ""
                            } ${
                                node.id || ""
                            }`.toLowerCase();

                        if (
                            !text.includes(search)
                        ) {
                            return false;
                        }
                    }

                    if (filter === "FRAUD") {
                        return (
                            node.status ===
                            "FRAUD"
                        );
                    }

                    if (
                        filter ===
                        "SUSPICIOUS"
                    ) {
                        return (
                            node.status ===
                            "SUSPICIOUS"
                        );
                    }

                    if (
                        filter ===
                        "FRAUD_SUSPICIOUS"
                    ) {
                        return (
                            node.status ===
                                "FRAUD" ||
                            node.status ===
                                "SUSPICIOUS"
                        );
                    }

                    return true;
                }
            );

        result.sort(
            (a, b) =>
                Number(b.riskScore || 0) -
                Number(a.riskScore || 0)
        );

        return result;
    }, [
        normalizedNodes,
        filter,
        searchText
    ]);

    /*
     * Keep default view clean.
     * Maximum 6 nodes per category.
     */
    const displayNodes = useMemo(() => {
        if (showAllNodes) {
            return filteredNodes.slice(
                0,
                120
            );
        }

        const grouped = {};

        TYPE_ORDER.forEach(
            (type) => {
                grouped[type] = [];
            }
        );

        filteredNodes.forEach(
            (node) => {
                const type =
                    TYPE_ORDER.includes(
                        node.type
                    )
                        ? node.type
                        : "USER";

                grouped[type].push(node);
            }
        );

        const result = [];

        TYPE_ORDER.forEach(
            (type) => {
                result.push(
                    ...grouped[type].slice(
                        0,
                        6
                    )
                );
            }
        );

        return result;
    }, [
        filteredNodes,
        showAllNodes
    ]);

    const displayNodeIds =
        useMemo(
            () =>
                new Set(
                    displayNodes.map(
                        (node) => node.id
                    )
                ),
            [displayNodes]
        );

    /*
     * Only show relationships between
     * currently visible nodes.
     */
    const displayEdges =
        useMemo(() => {
            let result =
                normalizedEdges.filter(
                    (edge) => {
                        if (
                            !displayNodeIds.has(
                                edge.source
                            ) ||
                            !displayNodeIds.has(
                                edge.target
                            )
                        ) {
                            return false;
                        }

                        if (
                            filter === "FRAUD"
                        ) {
                            return (
                                edge.status ===
                                "FRAUD"
                            );
                        }

                        if (
                            filter ===
                            "SUSPICIOUS"
                        ) {
                            return (
                                edge.status ===
                                "SUSPICIOUS"
                            );
                        }

                        if (
                            filter ===
                            "FRAUD_SUSPICIOUS"
                        ) {
                            return (
                                edge.status ===
                                    "FRAUD" ||
                                edge.status ===
                                    "SUSPICIOUS"
                            );
                        }

                        return true;
                    }
                );

            result.sort(
                (a, b) =>
                    Number(
                        b.maxRiskScore || 0
                    ) -
                    Number(
                        a.maxRiskScore || 0
                    )
            );

            return result.slice(
                0,
                showAllNodes ? 120 : 50
            );
        }, [
            normalizedEdges,
            displayNodeIds,
            filter,
            showAllNodes
        ]);

    const groupedNodes =
        useMemo(() => {
            const result = {};

            TYPE_ORDER.forEach(
                (type) => {
                    result[type] =
                        displayNodes.filter(
                            (node) =>
                                node.type ===
                                type
                        );
                }
            );

            return result;
        }, [displayNodes]);

    /*
     * Fixed four-column layout.
     */
    const graphLayout = useMemo(() => {
        const width = 1500;

        const maxCount =
            Math.max(
                ...TYPE_ORDER.map(
                    (type) =>
                        groupedNodes[
                            type
                        ]?.length || 0
                ),
                1
            );

        const height =
            Math.max(
                620,
                maxCount * 95 + 100
            );

        const xPositions = {
            USER: 130,
            DEVICE: 500,
            MERCHANT: 900,
            LOCATION: 1340
        };

        const positions = {};

        TYPE_ORDER.forEach(
            (type) => {
                const list =
                    groupedNodes[
                        type
                    ] || [];

                const total =
                    list.length;

                list.forEach(
                    (
                        node,
                        index
                    ) => {
                        let y;

                        if (
                            total === 1
                        ) {
                            y =
                                height / 2;
                        } else {
                            const top =
                                80;

                            const bottom =
                                height -
                                80;

                            y =
                                top +
                                (
                                    index /
                                    (total - 1)
                                ) *
                                    (
                                        bottom -
                                        top
                                    );
                        }

                        positions[
                            node.id
                        ] = {
                            x:
                                xPositions[
                                    type
                                ] ??
                                width / 2,
                            y
                        };
                    }
                );
            }
        );

        return {
            width,
            height,
            positions
        };
    }, [groupedNodes]);

    const stats = useMemo(() => {
        const fraud =
            normalizedNodes.filter(
                (node) =>
                    node.status ===
                    "FRAUD"
            ).length;

        const suspicious =
            normalizedNodes.filter(
                (node) =>
                    node.status ===
                    "SUSPICIOUS"
            ).length;

        const users =
            normalizedNodes.filter(
                (node) =>
                    node.type ===
                    "USER"
            ).length;

        const devices =
            normalizedNodes.filter(
                (node) =>
                    node.type ===
                    "DEVICE"
            ).length;

        const merchants =
            normalizedNodes.filter(
                (node) =>
                    node.type ===
                    "MERCHANT"
            ).length;

        const locations =
            normalizedNodes.filter(
                (node) =>
                    node.type ===
                    "LOCATION"
            ).length;

        return {
            fraud,
            suspicious,
            users,
            devices,
            merchants,
            locations
        };
    }, [normalizedNodes]);

    const selectedRelationships =
        useMemo(() => {
            if (!selectedNode) {
                return [];
            }

            return normalizedEdges
                .filter(
                    (edge) =>
                        edge.source ===
                            selectedNode.id ||
                        edge.target ===
                            selectedNode.id
                )
                .slice(0, 30);
        }, [
            selectedNode,
            normalizedEdges
        ]);

    const getNodeById = (id) => {
        return normalizedNodes.find(
            (node) =>
                node.id === id
        );
    };

    /*
     * Draw a controlled curved relationship.
     */
    const buildPath = (
        source,
        target
    ) => {
        if (
            !source ||
            !target
        ) {
            return "";
        }

        const dx =
            target.x - source.x;

        const curve =
            Math.max(
                50,
                Math.abs(dx) * 0.30
            );

        return `
            M ${source.x} ${source.y}
            C
            ${source.x + curve} ${source.y},
            ${target.x - curve} ${target.y},
            ${target.x} ${target.y}
        `;
    };

    return (
        <div
            style={{
                padding: "24px",
                background: "#f8fafc",
                minHeight: "100vh"
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    background: "#ffffff",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "24px",
                    marginBottom: "18px",
                    boxShadow:
                        "0 4px 18px rgba(15,23,42,0.06)"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "12px",
                                fontWeight: "800",
                                color: "#2563eb",
                                letterSpacing:
                                    "1.2px",
                                marginBottom: "5px"
                            }}
                        >
                            FRAUD INTELLIGENCE
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                color: "#0f172a",
                                fontSize: "28px"
                            }}
                        >
                            Fraud Network
                        </h1>

                        <p
                            style={{
                                margin:
                                    "7px 0 0",
                                color: "#64748b"
                            }}
                        >
                            Relationship analysis
                            across users, devices,
                            merchants and locations.
                        </p>
                    </div>

                    <button
                        onClick={fetchNetwork}
                        style={{
                            border:
                                "1px solid #cbd5e1",
                            background: "#ffffff",
                            borderRadius: "10px",
                            padding:
                                "10px 16px",
                            cursor: "pointer",
                            fontWeight: "700",
                            color: "#0f172a"
                        }}
                    >
                        ↻ Refresh
                    </button>
                </div>

                {lastUpdated && (
                    <div
                        style={{
                            marginTop: "12px",
                            fontSize: "12px",
                            color: "#94a3b8"
                        }}
                    >
                        Last updated:{" "}
                        {lastUpdated.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* STATISTICS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(150px,1fr))",
                    gap: "12px",
                    marginBottom: "18px"
                }}
            >
                {[
                    [
                        "Fraud Nodes",
                        stats.fraud,
                        "#dc2626"
                    ],
                    [
                        "Suspicious Nodes",
                        stats.suspicious,
                        "#f59e0b"
                    ],
                    [
                        "Users",
                        stats.users,
                        "#2563eb"
                    ],
                    [
                        "Devices",
                        stats.devices,
                        "#7c3aed"
                    ],
                    [
                        "Merchants",
                        stats.merchants,
                        "#0891b2"
                    ],
                    [
                        "Locations",
                        stats.locations,
                        "#ea580c"
                    ]
                ].map(
                    (item) => (
                        <div
                            key={item[0]}
                            style={{
                                background:
                                    "#ffffff",
                                border:
                                    "1px solid #e2e8f0",
                                borderLeft:
                                    `4px solid ${item[2]}`,
                                borderRadius:
                                    "12px",
                                padding: "16px"
                            }}
                        >
                            <div
                                style={{
                                    fontSize:
                                        "12px",
                                    color:
                                        "#64748b",
                                    fontWeight:
                                        "700"
                                }}
                            >
                                {item[0]}
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        "5px",
                                    fontSize:
                                        "24px",
                                    fontWeight:
                                        "800",
                                    color:
                                        "#0f172a"
                                }}
                            >
                                {item[1]}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* CONTROLS */}

            <div
                style={{
                    background: "#ffffff",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "14px",
                    marginBottom: "18px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap"
                }}
            >
                {[
                    [
                        "FRAUD_SUSPICIOUS",
                        "🚨 Fraud + Suspicious"
                    ],
                    [
                        "FRAUD",
                        "🔴 Fraud Only"
                    ],
                    [
                        "SUSPICIOUS",
                        "🟠 Suspicious Only"
                    ],
                    [
                        "ALL",
                        "⚪ All"
                    ]
                ].map(
                    ([value, label]) => (
                        <button
                            key={value}
                            onClick={() =>
                                setFilter(
                                    value
                                )
                            }
                            style={{
                                border:
                                    filter ===
                                    value
                                        ? "2px solid #2563eb"
                                        : "1px solid #cbd5e1",
                                background:
                                    filter ===
                                    value
                                        ? "#eff6ff"
                                        : "#ffffff",
                                color:
                                    "#0f172a",
                                borderRadius:
                                    "9px",
                                padding:
                                    "9px 13px",
                                fontWeight:
                                    "700",
                                cursor:
                                    "pointer"
                            }}
                        >
                            {label}
                        </button>
                    )
                )}

                <input
                    value={searchText}
                    onChange={(event) =>
                        setSearchText(
                            event.target.value
                        )
                    }
                    placeholder="Search user, device, merchant..."
                    style={{
                        marginLeft: "auto",
                        minWidth: "260px",
                        border:
                            "1px solid #cbd5e1",
                        borderRadius: "9px",
                        padding:
                            "10px 12px",
                        outline: "none"
                    }}
                />

                <button
                    onClick={() =>
                        setShowAllNodes(
                            (value) => !value
                        )
                    }
                    style={{
                        border:
                            "1px solid #cbd5e1",
                        background: "#ffffff",
                        borderRadius: "9px",
                        padding:
                            "10px 13px",
                        fontWeight: "700",
                        cursor: "pointer"
                    }}
                >
                    {showAllNodes
                        ? "Clean View"
                        : "Show More"}
                </button>
            </div>

            {/* GRAPH */}

            <div
                style={{
                    background: "#ffffff",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow:
                        "0 4px 18px rgba(15,23,42,0.05)"
                }}
            >
                <div
                    style={{
                        padding:
                            "20px 22px",
                        borderBottom:
                            "1px solid #e2e8f0"
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            color: "#0f172a",
                            fontSize: "21px"
                        }}
                    >
                        Relationship Graph
                    </h2>

                    <p
                        style={{
                            margin:
                                "5px 0 0",
                            color: "#64748b"
                        }}
                    >
                        Showing{" "}
                        <strong>
                            {displayNodes.length}
                        </strong>{" "}
                        nodes and{" "}
                        <strong>
                            {displayEdges.length}
                        </strong>{" "}
                        relationships.
                    </p>
                </div>

                {loading ? (
                    <div
                        style={{
                            height: "600px",
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            color: "#64748b"
                        }}
                    >
                        Loading fraud network...
                    </div>
                ) : error ? (
                    <div
                        style={{
                            padding: "60px",
                            textAlign: "center",
                            color: "#dc2626"
                        }}
                    >
                        <h3>
                            Fraud Network
                            Unavailable
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            onClick={
                                fetchNetwork
                            }
                            style={{
                                marginTop:
                                    "12px",
                                padding:
                                    "10px 18px",
                                border: "none",
                                borderRadius:
                                    "8px",
                                background:
                                    "#2563eb",
                                color:
                                    "#ffffff",
                                cursor:
                                    "pointer",
                                fontWeight:
                                    "700"
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : displayNodes.length === 0 ? (
                    <div
                        style={{
                            padding: "70px",
                            textAlign:
                                "center",
                            color: "#64748b"
                        }}
                    >
                        <div
                            style={{
                                fontSize:
                                    "40px",
                                marginBottom:
                                    "10px"
                            }}
                        >
                            🔎
                        </div>

                        <h3>
                            No matching nodes
                        </h3>

                        <p>
                            Try selecting
                            <strong>
                                {" "}All{" "}
                            </strong>
                            or clearing the
                            search field.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            overflowX:
                                "auto",
                            overflowY:
                                "hidden"
                        }}
                    >
                        <svg
                            width={
                                graphLayout.width
                            }
                            height={
                                graphLayout.height
                            }
                            viewBox={`0 0 ${graphLayout.width} ${graphLayout.height}`}
                            style={{
                                display:
                                    "block",
                                background:
                                    "#fbfdff"
                            }}
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
                                        stroke="#e2e8f0"
                                        strokeWidth="1"
                                    />
                                </pattern>

                                <marker
                                    id="fraudArrow"
                                    markerWidth="8"
                                    markerHeight="8"
                                    refX="7"
                                    refY="3"
                                    orient="auto"
                                >
                                    <path
                                        d="M0,0 L0,6 L7,3 z"
                                        fill="#dc2626"
                                    />
                                </marker>

                                <marker
                                    id="suspiciousArrow"
                                    markerWidth="8"
                                    markerHeight="8"
                                    refX="7"
                                    refY="3"
                                    orient="auto"
                                >
                                    <path
                                        d="M0,0 L0,6 L7,3 z"
                                        fill="#f59e0b"
                                    />
                                </marker>

                                <marker
                                    id="safeArrow"
                                    markerWidth="8"
                                    markerHeight="8"
                                    refX="7"
                                    refY="3"
                                    orient="auto"
                                >
                                    <path
                                        d="M0,0 L0,6 L7,3 z"
                                        fill="#94a3b8"
                                    />
                                </marker>
                            </defs>

                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#networkGrid)"
                            />

                            {/* COLUMN HEADERS */}

                            {TYPE_ORDER.map(
                                (type) => {
                                    const x =
                                        type ===
                                        "USER"
                                            ? 130
                                            : type ===
                                                "DEVICE"
                                              ? 500
                                              : type ===
                                                  "MERCHANT"
                                                ? 900
                                                : 1340;

                                    return (
                                        <text
                                            key={
                                                type
                                            }
                                            x={x}
                                            y="30"
                                            textAnchor="middle"
                                            fontSize="14"
                                            fontWeight="800"
                                            fill="#334155"
                                        >
                                            {
                                                TYPE_META[
                                                    type
                                                ]
                                                    .icon
                                            }{" "}
                                            {
                                                TYPE_META[
                                                    type
                                                ]
                                                    .label
                                            }
                                        </text>
                                    );
                                }
                            )}

                            {/* EDGES */}

                            {displayEdges.map(
                                (
                                    edge,
                                    index
                                ) => {
                                    const source =
                                        graphLayout
                                            .positions[
                                            edge.source
                                        ];

                                    const target =
                                        graphLayout
                                            .positions[
                                            edge.target
                                        ];

                                    if (
                                        !source ||
                                        !target
                                    ) {
                                        return null;
                                    }

                                    const color =
                                        getStatusColor(
                                            edge.status
                                        );

                                    const risk =
                                        Number(
                                            edge.maxRiskScore ||
                                            0
                                        );

                                    const width =
                                        edge.status ===
                                        "FRAUD"
                                            ? Math.min(
                                                  5,
                                                  2 +
                                                      risk /
                                                          40
                                              )
                                            : 2;

                                    return (
                                        <path
                                            key={
                                                edge.id ||
                                                `edge-${index}`
                                            }
                                            d={buildPath(
                                                source,
                                                target
                                            )}
                                            fill="none"
                                            stroke={
                                                color
                                            }
                                            strokeWidth={
                                                width
                                            }
                                            strokeOpacity={
                                                edge.status ===
                                                "FRAUD"
                                                    ? 0.65
                                                    : 0.45
                                            }
                                            markerEnd={
                                                edge.status ===
                                                "FRAUD"
                                                    ? "url(#fraudArrow)"
                                                    : edge.status ===
                                                        "SUSPICIOUS"
                                                      ? "url(#suspiciousArrow)"
                                                      : "url(#safeArrow)"
                                            }
                                        />
                                    );
                                }
                            )}

                            {/* NODES */}

                            {displayNodes.map(
                                (
                                    node,
                                    index
                                ) => {
                                    const position =
                                        graphLayout
                                            .positions[
                                            node.id
                                        ];

                                    if (
                                        !position
                                    ) {
                                        return null;
                                    }

                                    const risk =
                                        Number(
                                            node.riskScore ||
                                            0
                                        );

                                    const radius =
                                        getNodeRadius(
                                            risk
                                        );

                                    const border =
                                        getRiskBorder(
                                            risk
                                        );

                                    const selected =
                                        selectedNode?.id ===
                                        node.id;

                                    return (
                                        <g
                                            key={
                                                node.id ||
                                                `node-${index}`
                                            }
                                            onClick={() =>
                                                setSelectedNode(
                                                    node
                                                )
                                            }
                                            style={{
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            <circle
                                                cx={
                                                    position.x
                                                }
                                                cy={
                                                    position.y
                                                }
                                                r={
                                                    radius +
                                                    7
                                                }
                                                fill="#ffffff"
                                                stroke={
                                                    selected
                                                        ? "#0f172a"
                                                        : border
                                                }
                                                strokeWidth={
                                                    selected
                                                        ? 5
                                                        : 3
                                                }
                                            />

                                            <circle
                                                cx={
                                                    position.x
                                                }
                                                cy={
                                                    position.y
                                                }
                                                r={
                                                    radius
                                                }
                                                fill="#f8fafc"
                                                stroke={
                                                    border
                                                }
                                                strokeWidth="2"
                                            />

                                            <text
                                                x={
                                                    position.x
                                                }
                                                y={
                                                    position.y +
                                                    5
                                                }
                                                textAnchor="middle"
                                                fontSize="16"
                                            >
                                                {TYPE_META[
                                                    node.type
                                                ]?.icon ||
                                                    "●"}
                                            </text>

                                            <text
                                                x={
                                                    position.x
                                                }
                                                y={
                                                    position.y +
                                                    radius +
                                                    22
                                                }
                                                textAnchor="middle"
                                                fontSize="12"
                                                fontWeight="800"
                                                fill="#0f172a"
                                            >
                                                {truncate(
                                                    node.label
                                                )}
                                            </text>

                                            <text
                                                x={
                                                    position.x
                                                }
                                                y={
                                                    position.y +
                                                    radius +
                                                    38
                                                }
                                                textAnchor="middle"
                                                fontSize="10"
                                                fill={
                                                    border
                                                }
                                            >
                                                Risk{" "}
                                                {
                                                    risk
                                                }
                                            </text>
                                        </g>
                                    );
                                }
                            )}
                        </svg>
                    </div>
                )}

                {/* LEGEND */}

                <div
                    style={{
                        padding:
                            "14px 20px",
                        borderTop:
                            "1px solid #e2e8f0",
                        display: "flex",
                        gap: "22px",
                        flexWrap: "wrap",
                        color: "#475569",
                        fontSize: "13px",
                        fontWeight: "600"
                    }}
                >
                    <span>
                        <span
                            style={{
                                color: "#dc2626"
                            }}
                        >
                            ●
                        </span>{" "}
                        Fraud relationship
                    </span>

                    <span>
                        <span
                            style={{
                                color: "#f59e0b"
                            }}
                        >
                            ●
                        </span>{" "}
                        Suspicious relationship
                    </span>

                    <span>
                        <span
                            style={{
                                color: "#64748b"
                            }}
                        >
                            ●
                        </span>{" "}
                        Normal relationship
                    </span>

                    <span>
                        Click a node for details
                    </span>
                </div>
            </div>

            {/* SELECTED NODE */}

            {selectedNode && (
                <div
                    style={{
                        marginTop: "18px",
                        background: "#ffffff",
                        border:
                            "1px solid #e2e8f0",
                        borderRadius: "18px",
                        padding: "22px",
                        boxShadow:
                            "0 4px 18px rgba(15,23,42,0.05)"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            marginBottom:
                                "18px"
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize:
                                        "12px",
                                    fontWeight:
                                        "800",
                                    color:
                                        "#64748b"
                                }}
                            >
                                {selectedNode.type}
                            </div>

                            <h2
                                style={{
                                    margin:
                                        "5px 0",
                                    color:
                                        "#0f172a"
                                }}
                            >
                                {
                                    selectedNode.label
                                }
                            </h2>

                            <div
                                style={{
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "13px"
                                }}
                            >
                                Node ID:{" "}
                                {
                                    selectedNode.id
                                }
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                setSelectedNode(
                                    null
                                )
                            }
                            style={{
                                border:
                                    "1px solid #cbd5e1",
                                background:
                                    "#ffffff",
                                borderRadius:
                                    "8px",
                                padding:
                                    "8px 12px",
                                cursor:
                                    "pointer"
                            }}
                        >
                            Close
                        </button>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit,minmax(160px,1fr))",
                            gap: "12px",
                            marginBottom:
                                "18px"
                        }}
                    >
                        {[
                            [
                                "Risk Score",
                                selectedNode.riskScore
                            ],
                            [
                                "Risk Level",
                                getRiskLevel(
                                    selectedNode.riskScore
                                )
                            ],
                            [
                                "Transactions",
                                selectedNode.transactionCount ||
                                    0
                            ],
                            [
                                "Fraud Links",
                                selectedNode.fraudCount ||
                                    0
                            ],
                            [
                                "Suspicious Links",
                                selectedNode.suspiciousCount ||
                                    0
                            ]
                        ].map(
                            (item) => (
                                <div
                                    key={
                                        item[0]
                                    }
                                    style={{
                                        border:
                                            "1px solid #e2e8f0",
                                        borderRadius:
                                            "10px",
                                        padding:
                                            "14px"
                                    }}
                                >
                                    <div
                                        style={{
                                            color:
                                                "#64748b",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "700"
                                        }}
                                    >
                                        {item[0]}
                                    </div>

                                    <div
                                        style={{
                                            marginTop:
                                                "5px",
                                            fontSize:
                                                "20px",
                                            fontWeight:
                                                "800",
                                            color:
                                                "#0f172a"
                                        }}
                                    >
                                        {item[1]}
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {selectedRelationships.length >
                        0 && (
                        <div
                            style={{
                                overflowX:
                                    "auto"
                            }}
                        >
                            <table
                                style={{
                                    width:
                                        "100%",
                                    borderCollapse:
                                        "collapse"
                                }}
                            >
                                <thead>
                                    <tr
                                        style={{
                                            background:
                                                "#f8fafc"
                                        }}
                                    >
                                        <th
                                            style={{
                                                padding:
                                                    "11px",
                                                textAlign:
                                                    "left"
                                            }}
                                        >
                                            Relationship
                                        </th>

                                        <th
                                            style={{
                                                padding:
                                                    "11px",
                                                textAlign:
                                                    "left"
                                            }}
                                        >
                                            Connected Node
                                        </th>

                                        <th
                                            style={{
                                                padding:
                                                    "11px",
                                                textAlign:
                                                    "left"
                                            }}
                                        >
                                            Transactions
                                        </th>

                                        <th
                                            style={{
                                                padding:
                                                    "11px",
                                                textAlign:
                                                    "left"
                                            }}
                                        >
                                            Fraud
                                        </th>

                                        <th
                                            style={{
                                                padding:
                                                    "11px",
                                                textAlign:
                                                    "left"
                                            }}
                                        >
                                            Suspicious
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {selectedRelationships.map(
                                        (
                                            edge,
                                            index
                                        ) => {
                                            const otherId =
                                                edge.source ===
                                                selectedNode.id
                                                    ? edge.target
                                                    : edge.source;

                                            const other =
                                                getNodeById(
                                                    otherId
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        edge.id ||
                                                        `relationship-${index}`
                                                    }
                                                    style={{
                                                        borderTop:
                                                            "1px solid #e2e8f0"
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding:
                                                                "11px",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >
                                                        {edge.relationship ||
                                                            "CONNECTED"}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "11px"
                                                        }}
                                                    >
                                                        {TYPE_META[
                                                            other?.type
                                                        ]?.icon ||
                                                            "●"}{" "}
                                                        {other?.label ||
                                                            otherId}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "11px"
                                                        }}
                                                    >
                                                        {edge.transactionCount ||
                                                            0}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "11px",
                                                            color:
                                                                "#dc2626",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >
                                                        {edge.fraudCount ||
                                                            0}
                                                    </td>

                                                    <td
                                                        style={{
                                                            padding:
                                                                "11px",
                                                            color:
                                                                "#f59e0b",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >
                                                        {edge.suspiciousCount ||
                                                            0}
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
            )}

            {/* TRANSACTION NETWORK SUMMARY */}

            <div
                style={{
                    marginTop: "18px",
                    background: "#ffffff",
                    border:
                        "1px solid #e2e8f0",
                    borderRadius: "18px",
                    padding: "22px"
                }}
            >
                <h2
                    style={{
                        margin:
                            "0 0 6px",
                        color: "#0f172a"
                    }}
                >
                    Transaction Network
                </h2>

                <p
                    style={{
                        margin:
                            "0 0 18px",
                        color: "#64748b"
                    }}
                >
                    Complete network relationships
                    generated by FraudShield-X.
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(180px,1fr))",
                        gap: "12px"
                    }}
                >
                    {[
                        [
                            "Total Transactions",
                            statistics.totalTransactions ||
                                0
                        ],
                        [
                            "Total Nodes",
                            statistics.totalNodes ??
                                normalizedNodes.length
                        ],
                        [
                            "Total Relationships",
                            statistics.totalEdges ??
                                normalizedEdges.length
                        ],
                        [
                            "Total Amount",
                            formatMoney(
                                statistics.totalAmount
                            )
                        ]
                    ].map(
                        ([label, value]) => (
                            <div
                                key={label}
                                style={{
                                    padding:
                                        "15px",
                                    background:
                                        "#f8fafc",
                                    borderRadius:
                                        "10px"
                                }}
                            >
                                <div
                                    style={{
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "12px"
                                    }}
                                >
                                    {label}
                                </div>

                                <strong
                                    style={{
                                        display:
                                            "block",
                                        marginTop:
                                            "5px",
                                        fontSize:
                                            "20px",
                                        color:
                                            "#0f172a"
                                    }}
                                >
                                    {value}
                                </strong>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default FraudNetworks;