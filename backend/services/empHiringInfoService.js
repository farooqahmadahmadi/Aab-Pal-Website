const EmpHiringInfo = require("../models/EmpHiringInfo");

const EmpHiringInfoService = {
    getAll: async () => {
        return await EmpHiringInfo.findAll({
            where: { is_deleted: false }
        });
    },

    getById: async (id) => {
        return await EmpHiringInfo.findByPk(id);
    },

    create: async (data) => {
        return await EmpHiringInfo.create(data);
    },

    update: async (id, data) => {
        const hiring = await EmpHiringInfo.findByPk(id);
        if (!hiring) return null;

        await hiring.update(data);
        return hiring;
    },

    delete: async (id) => {
        const hiring = await EmpHiringInfo.findByPk(id);
        if (!hiring) return null;

        await hiring.update({ is_deleted: true });
        return true;
    }
};

module.exports = EmpHiringInfoService;
