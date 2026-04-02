const SystemSettings = require('../models/SystemSettings');

class SystemSettingsService {

    async getAll() {
        return await SystemSettings.findAll({
            order: [['setting_group', 'ASC']]
        });
    }

    async update(setting_key, value) {
        const setting = await SystemSettings.findOne({ where: { setting_key } });

        if (!setting) throw new Error("Setting not found");

        setting.setting_value = value;
        return await setting.save();
    }
}

module.exports = new SystemSettingsService();
