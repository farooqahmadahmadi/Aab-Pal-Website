const ClientInfo = require("../models/ClientInfo");

const ClientService = {
    getAll: () => ClientInfo.findAll({ where: { is_deleted: false } }),

    getById: (id) => ClientInfo.findOne({ where: { client_id: id, is_deleted: false } }),

    create: (data) => ClientInfo.create(data),

    update: async (id, data) => {
        const client = await ClientInfo.findByPk(id);
        if (!client) return null;
        await client.update(data);
        return client;
    },

    delete: async (id) => {
        await ClientInfo.update({ is_deleted: true }, { where: { client_id: id } });
    }
};

module.exports = ClientService;