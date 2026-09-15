const Alert = require("../models/Alert");

const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find()
            .sort({ createdAt: -1 })
            .limit(200)
            .lean();

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        console.error("Failed to fetch alerts:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch alerts"
        });
    }
};

const getAlertStats = async (req, res) => {
    try {
        const [
            total,
            newAlerts,
            acknowledged,
            resolved,
            critical
        ] = await Promise.all([
            Alert.countDocuments(),
            Alert.countDocuments({ status: "NEW" }),
            Alert.countDocuments({ status: "ACKNOWLEDGED" }),
            Alert.countDocuments({ status: "RESOLVED" }),
            Alert.countDocuments({ severity: "CRITICAL" })
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                newAlerts,
                acknowledged,
                resolved,
                critical
            }
        });
    } catch (error) {
        console.error(
            "Failed to fetch alert statistics:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch alert statistics"
        });
    }
};

const acknowledgeAlert = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            {
                status: "ACKNOWLEDGED"
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Alert acknowledged successfully",
            data: alert
        });
    } catch (error) {
        console.error(
            "Failed to acknowledge alert:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to acknowledge alert"
        });
    }
};

const resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            {
                status: "RESOLVED"
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Alert resolved successfully",
            data: alert
        });
    } catch (error) {
        console.error(
            "Failed to resolve alert:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to resolve alert"
        });
    }
};

module.exports = {
    getAllAlerts,
    getAlertStats,
    acknowledgeAlert,
    resolveAlert
};