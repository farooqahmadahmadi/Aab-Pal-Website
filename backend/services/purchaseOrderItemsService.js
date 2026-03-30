const PurchaseOrderItem = require("../models/PurchaseOrderItemsInfo");
const PurchaseOrder = require("../models/PurchaseOrdersInfo");
const Material = require("../models/MaterialsInfo");

// 🔥 helper: update PO total
const updatePOTotal = async (po_id) => {
    const items = await PurchaseOrderItem.findAll({
        where: { po_id, is_deleted: false }
    });

    const total = items.reduce((sum, i) => {
        return sum + (parseFloat(i.po_item_quantity) * parseFloat(i.po_item_unit_price));
    }, 0);

    await PurchaseOrder.update(
        { total_amount: total },
        { where: { po_id } }
    );
};

// 🔥 helper: recalc Materials based on current PO items
const recalcMaterials = async (po_id) => {
    const po = await PurchaseOrder.findOne({ where: { po_id } });
    if (!po || po.po_status !== "Received") return; // یوازې که status Received وي

    const items = await PurchaseOrderItem.findAll({
        where: { po_id, is_deleted: false }
    });

    // map materials to calculate new stock and avgPrice
    const materialMap = {};

    for (let i of items) {
        const matId = i.material_id;
        const qty = parseFloat(i.po_item_quantity) || 0;
        const price = parseFloat(i.po_item_unit_price) || 0;

        if (!materialMap[matId]) {
            materialMap[matId] = { qty: 0, totalValue: 0 };
        }

        materialMap[matId].qty += qty;
        materialMap[matId].totalValue += qty * price;
    }

    for (let matId of Object.keys(materialMap)) {
        const material = await Material.findByPk(matId);
        if (!material) continue;

        const newQty = materialMap[matId].qty;
        const newValue = materialMap[matId].totalValue;

        const newStock = newQty;
        const newAvg = newStock === 0 ? 0 : newValue / newStock;

        await material.update({
            current_stock: newStock,
            average_price: newAvg
        });
    }
};

// GET
exports.getItems = async () => {
    return await PurchaseOrderItem.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createItem = async (data) => {
    data.total_amount =
        (parseFloat(data.po_item_quantity) || 0) *
        (parseFloat(data.po_item_unit_price) || 0);

    const item = await PurchaseOrderItem.create(data);

    // ✅ update PO total
    await updatePOTotal(data.po_id);
    // ✅ update Materials stock/average_price
    await recalcMaterials(data.po_id);

    return item;
};

// UPDATE
exports.updateItem = async (id, data) => {
    const item = await PurchaseOrderItem.findOne({
        where: { po_item_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    data.total_amount =
        (parseFloat(data.po_item_quantity) || 0) *
        (parseFloat(data.po_item_unit_price) || 0);

    await item.update(data);

    // ✅ update PO total
    await updatePOTotal(item.po_id);
    // ✅ update Materials stock/average_price
    await recalcMaterials(item.po_id);

    return item;
};

// DELETE
exports.deleteItem = async (id) => {
    const item = await PurchaseOrderItem.findOne({
        where: { po_item_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    await item.update({ is_deleted: true });

    // ✅ update PO total
    await updatePOTotal(item.po_id);
    // ✅ update Materials stock/average_price
    await recalcMaterials(item.po_id);
};