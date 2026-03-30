const PurchaseOrder = require("../models/PurchaseOrdersInfo");

// GET
exports.getOrders = async () => {
    return await PurchaseOrder.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createOrder = async (data) => {
    return await PurchaseOrder.create(data);
};

// UPDATE
exports.updateOrder = async (id, data) => {
    const item = await PurchaseOrder.findOne({
        where: { po_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Order not found");

    await item.update(data);
    return item;
};

// DELETE
exports.deleteOrder = async (id) => {
    const item = await PurchaseOrder.findOne({
        where: { po_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Order not found");

    await item.update({ is_deleted: true });
};
