const ClientInfo = require("../models/ClientInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// 🔥 helper (fix for user_id issue)
const getUserId = (user) => user?.user_id || user?.id || 0;

const ClientService = {
  // ===== GET ALL =====
  getAll: () =>
    ClientInfo.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]],
    }),

  // ===== GET BY ID =====
  getById: (id) =>
    ClientInfo.findOne({
      where: { client_id: id, is_deleted: false },
    }),

  // ===== CREATE =====
  create: async (data, user = {}) => {
    const client = await ClientInfo.create(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "client_info",
      reference_record_id: client.client_id,
      old_value: null,
      new_value: client.toJSON(),
    });

    return client;
  },

  // ===== UPDATE =====
  update: async (id, data, user = {}) => {
    const client = await ClientInfo.findOne({
      where: { client_id: id, is_deleted: false },
    });

    if (!client) throw new Error("Client not found");

    const oldValue = client.toJSON();

    await client.update(data);

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "client_info",
      reference_record_id: client.client_id,
      old_value: oldValue,
      new_value: client.toJSON(),
    });

    return client;
  },

  // ===== DELETE (Soft + Hard via helper) =====
  delete: async (id, user = {}) => {
    const client = await ClientInfo.findOne({
      where: { client_id: id, is_deleted: false },
    });

    if (!client) throw new Error("Client not found");

    const oldValue = client.toJSON();

    await handleDelete(client, user, "client_info", getUserId(user), oldValue);

    return true;
  },
};

module.exports = ClientService;