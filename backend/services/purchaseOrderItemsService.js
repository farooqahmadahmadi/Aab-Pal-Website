const PurchaseOrderItem = require("../models/PurchaseOrderItemsInfo");
const PurchaseOrder = require("../models/PurchaseOrdersInfo");
const Material = require("../models/MaterialsInfo");

// 🔥 Helper: Update PO total
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

// 🔥 Helper: Recalculate Materials based on current PO items
const recalcMaterials = async (po_id) => {
    const po = await PurchaseOrder.findOne({ where: { po_id } });
    if (!po || po.po_status !== "Received") return;

    const items = await PurchaseOrderItem.findAll({
        where: { po_id, is_deleted: false }
    });

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

// 🔥 Helper: Check if PO is Pending
const isPOPending = async (po_id) => {
    const po = await PurchaseOrder.findByPk(po_id);
    if (!po) throw new Error("PO not found");
    return po.po_status === "Pending";
};

// GET all items
exports.getItems = async () => {
    return await PurchaseOrderItem.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE new item
exports.createItem = async (data) => {
    const pending = await isPOPending(data.po_id);
    if (!pending) throw new Error("Cannot add item: PO is not Pending");

    data.total_amount =
        (parseFloat(data.po_item_quantity) || 0) *
        (parseFloat(data.po_item_unit_price) || 0);

    const item = await PurchaseOrderItem.create(data);

    await updatePOTotal(data.po_id);
    await recalcMaterials(data.po_id);

    return item;
};

// UPDATE existing item
exports.updateItem = async (id, data) => {
    const item = await PurchaseOrderItem.findOne({
        where: { po_item_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    const pending = await isPOPending(item.po_id);
    if (!pending) throw new Error("Cannot update item: PO is not Pending");

    data.total_amount =
        (parseFloat(data.po_item_quantity) || 0) *
        (parseFloat(data.po_item_unit_price) || 0);

    await item.update(data);

    await updatePOTotal(item.po_id);
    await recalcMaterials(item.po_id);

    return item;
};

// DELETE existing item (soft delete)
exports.deleteItem = async (id) => {
    const item = await PurchaseOrderItem.findOne({
        where: { po_item_id: id, is_deleted: false }
    });

    if (!item) throw new Error("Item not found");

    const pending = await isPOPending(item.po_id);
    if (!pending) throw new Error("Cannot delete item: PO is not Pending");

    await item.update({ is_deleted: true });

    await updatePOTotal(item.po_id);
    await recalcMaterials(item.po_id);
};