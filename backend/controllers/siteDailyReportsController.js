const SiteDailyReportsInfo = require("../models/SiteDailyReportsInfo");

// GET all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await SiteDailyReportsInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error });
    }
};

// GET report by ID
exports.getReportById = async (req, res) => {
    try {
        const report = await SiteDailyReportsInfo.findByPk(req.params.id);
        if (!report || report.is_deleted) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error fetching report", error });
    }
};

// CREATE report
exports.createReport = async (req, res) => {
    try {
        const report = await SiteDailyReportsInfo.create(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error creating report", error });
    }
};

// UPDATE report
exports.updateReport = async (req, res) => {
    try {
        const report = await SiteDailyReportsInfo.findByPk(req.params.id);
        if (!report || report.is_deleted) {
            return res.status(404).json({ message: "Report not found" });
        }
        await report.update(req.body);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: "Error updating report", error });
    }
};

// DELETE report (soft delete)
exports.deleteReport = async (req, res) => {
    try {
        const report = await SiteDailyReportsInfo.findByPk(req.params.id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        await report.update({ is_deleted: true });
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting report", error });
    }
};
