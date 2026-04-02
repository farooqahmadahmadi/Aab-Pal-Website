const service = require('../services/systemSettingsService');

// GET
exports.getSettings = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch {
        res.status(500).json({ message: "Server Error" });
    }
};

// UPDATE (only value)
exports.updateSetting = async (req, res) => {
    try {
        const { setting_key, setting_value } = req.body;

        if (!setting_key)
            return res.status(400).json({ message: "Key required" });

        const updated = await service.update(setting_key, setting_value);

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};