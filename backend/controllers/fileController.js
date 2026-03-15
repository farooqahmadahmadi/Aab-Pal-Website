const fs = require("fs");
const path = require("path");

// Upload File
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        res.status(201).json({
            message: "File uploaded successfully",
            filename: req.file.filename,
            path: req.file.path
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading file", error });
    }
};

// Download File
exports.downloadFile = async (req, res) => {
    try {
        const { section, filename } = req.params;
        const folderMap = {
            contracts: "uploads/documents/contracts",
            employees: "uploads/documents/employees",
            projects: "uploads/documents/projects"
        };
        const filePath = path.join(folderMap[section], filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: "Error downloading file", error });
    }
};

// Delete File
exports.deleteFile = async (req, res) => {
    try {
        const { section, filename } = req.params;
        const folderMap = {
            contracts: "uploads/documents/contracts",
            employees: "uploads/documents/employees",
            projects: "uploads/documents/projects"
        };
        const filePath = path.join(folderMap[section], filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting file", error });
    }
};