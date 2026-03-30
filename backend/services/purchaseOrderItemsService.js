const PurchaseOrderItem = require("../models/PurchaseOrderItemsInfo");

// GET
exports.getItems = async () => {
    return await PurchaseOrderItem.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createItem = async (data) => {
    return await PurchaseOrderItem.create(data);
};

// UPDATE
exports.updateItem = async (id, data) => {
    const item = await PurchaseOrderItem.findOne({
        where: { po_item_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    await item.update(data);
    return item;
};

// DELETE
exports.deleteItem = async (id) => {
    const item = await PurchaseOrderItem.findOne({
        where: { po_item_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    await item.update({ is_deleted: true });
};