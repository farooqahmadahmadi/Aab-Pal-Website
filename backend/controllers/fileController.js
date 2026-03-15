const fs = require("fs");
const path = require("path");
const SystemLogs = require("../models/SystemLogs");

// Folder mapping
const folderMap = {
    contracts: "uploads/documents/contracts",
    employees: "uploads/documents/employees",
    projects: "uploads/documents/projects"
};


// Upload File
exports.uploadFile = async (req, res) => {
    try {
        const { section } = req.body;
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const folderPath = folderMap[section] || "uploads/documents/others";

        // Log the upload
        await SystemLogs.create({
            user_id: req.user.user_id,
            action: "UPLOAD_FILE",
            reference_table: "files",
            reference_record_id: null,
            old_value: null,
            new_value: req.file.filename
        });

        res.status(201).json({
            message: "File uploaded successfully",
            filename: req.file.filename,
            path: req.file.path
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading file", error });
    }
};


// Update File
exports.updateFile = async (req, res) => {
    try {
        const { section, oldFilename } = req.body;
        if (!req.file) return res.status(400).json({ message: "No new file uploaded" });

        const folderPath = folderMap[section] || "uploads/documents/others";
        const oldFilePath = path.join(folderPath, oldFilename);

        // Delete old file if exists
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

        // Log the update
        await SystemLogs.create({
            user_id: req.user.user_id,
            action: "UPDATE_FILE",
            reference_table: "files",
            reference_record_id: null,
            old_value: oldFilename,
            new_value: req.file.filename
        });

        res.status(200).json({
            message: "File updated successfully",
            newFile: req.file.filename,
            path: req.file.path
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating file", error });
    }
};


// Download File
exports.downloadFile = async (req, res) => {
    try {
        const { section, filename } = req.params;
        const folderPath = folderMap[section] || "uploads/documents/others";
        const filePath = path.join(folderPath, filename);

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        res.download(filePath);

    } catch (error) {
        res.status(500).json({ message: "Error downloading file", error });
    }
};


// Delete File
exports.deleteFile = async (req, res) => {
    try {
        const { section, filename } = req.params;
        const folderPath = folderMap[section] || "uploads/documents/others";
        const filePath = path.join(folderPath, filename);

        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found" });

        fs.unlinkSync(filePath);

        // Log the deletion
        await SystemLogs.create({
            user_id: req.user.user_id,
            action: "DELETE_FILE",
            reference_table: "files",
            reference_record_id: null,
            old_value: filename,
            new_value: null
        });

        res.status(200).json({ message: "File deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting file", error });
    }
};