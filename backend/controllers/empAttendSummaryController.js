const EmpAttendSummaryInfo = require("../models/EmpAttendSummaryInfo");

// GET all summaries
exports.getAllSummaries = async (req, res) => {
    try {
        const records = await EmpAttendSummaryInfo.findAll({
            where: { is_deleted: false }
        });
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance summaries", error });
    }
};

// GET summary by ID
exports.getSummaryById = async (req, res) => {
    try {
        const record = await EmpAttendSummaryInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Summary not found" });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching summary", error });
    }
};

// CREATE summary
exports.createSummary = async (req, res) => {
    try {
        const record = await EmpAttendSummaryInfo.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error creating summary", error });
    }
};

// UPDATE summary
exports.updateSummary = async (req, res) => {
    try {
        const record = await EmpAttendSummaryInfo.findByPk(req.params.id);
        if (!record || record.is_deleted) {
            return res.status(404).json({ message: "Summary not found" });
        }
        await record.update(req.body);
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error updating summary", error });
    }
};

// DELETE summary (soft delete)
exports.deleteSummary = async (req, res) => {
    try {
        const record = await EmpAttendSummaryInfo.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({ message: "Summary not found" });
        }
        await record.update({ is_deleted: true });
        res.status(200).json({ message: "Summary deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting summary", error });
    }
};
