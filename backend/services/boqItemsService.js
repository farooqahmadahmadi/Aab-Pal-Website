const Boq = require("../models/BoqItemsInfo");

// GET
exports.getItems = async () => {
    return await Boq.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createItem = async (data) => {
    data.total_amount = (data.item_quantity || 0) * (data.unit_price || 0);
    return await Boq.create(data);
};

// UPDATE
exports.updateItem = async (id, data) => {
    const item = await Boq.findOne({
        where: { boq_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    data.total_amount = (data.item_quantity || 0) * (data.unit_price || 0);

    await item.update(data);
    return item;
};

// DELETE
exports.deleteItem = async (id) => {
    const item = await Boq.findOne({
        where: { boq_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    await item.update({ is_deleted: true });
};
