const { Sequelize } = require("sequelize");
const db = require("../models");
const PurchaseOrder = db.PurchaseOrdersInfo;
const PurchaseOrderItem = db.PurchaseOrderItemsInfo;
const Material = db.MaterialsInfo;

// 🔥 helper: update stock + avg price based on PO type (transaction-safe)
const updateStock = async (po_id, type = "add", t) => {
    const po = await PurchaseOrder.findByPk(po_id, { transaction: t });
    if (!po) return;

    const items = await PurchaseOrderItem.findAll({
        where: { po_id, is_deleted: false },
        transaction: t
    });

    const materialMap = {};
    for (let i of items) {
        const matId = i.material_id;
        const qty = parseFloat(i.po_item_quantity) || 0;
        const price = parseFloat(i.po_item_unit_price) || 0;

        if (!materialMap[matId]) materialMap[matId] = { qty: 0, totalValue: 0 };
        materialMap[matId].qty += qty;
        materialMap[matId].totalValue += qty * price;
    }

    for (let matId of Object.keys(materialMap)) {
        const material = await Material.findByPk(matId, { transaction: t });
        if (!material) continue;

        let currentStock = parseFloat(material.current_stock) || 0;
        let avgPrice = parseFloat(material.average_price) || 0;

        const qty = materialMap[matId].qty;
        const value = materialMap[matId].totalValue;

        // in → stock زیاتوي, out → stock کموي
        if ((type === "add" && po.po_type === "In") || (type === "subtract" && po.po_type === "Out")) {
            const newStock = currentStock + qty;
            const newAvg = newStock === 0 ? 0 : ((currentStock * avgPrice) + value) / newStock;
            await material.update({ current_stock: newStock, average_price: newAvg }, { transaction: t });
        }

        if ((type === "subtract" && po.po_type === "In") || (type === "add" && po.po_type === "Out")) {
            const newStock = Math.max(currentStock - qty, 0);
            let newAvg = 0;
            if (newStock > 0 && currentStock > 0) newAvg = ((currentStock * avgPrice) - value) / newStock;
            await material.update({ current_stock: newStock, average_price: newAvg }, { transaction: t });
        }
    }
};

// GET
exports.getOrders = async () => {
    return await PurchaseOrder.findAll({
        where: { is_deleted: false },
        order: [["created_at", "DESC"]]
    });
};

// CREATE
exports.createOrder = async (data) => {
    if ((data.po_type === "In" && !data.supplier_id) ||
        (data.po_type === "Out" && !data.project_id) ||
        !data.order_date) {
        throw new Error("Required fields missing");
    }

    return await db.sequelize.transaction(async (t) => {
        const order = await PurchaseOrder.create(data, { transaction: t });
        if (order.po_status === "Received") {
            await updateStock(order.po_id, "add", t);
        }
        return order;
    });
};

// UPDATE
exports.updateOrder = async (id, data) => {
    return await db.sequelize.transaction(async (t) => {
        const item = await PurchaseOrder.findOne({ where: { po_id: id, is_deleted: false }, transaction: t });
        if (!item) throw new Error("Order not found");

        const oldStatus = item.po_status;
        const newStatus = data.po_status;

        // stock adjust مخکې له update
        if (oldStatus === "Received" && newStatus !== "Received") {
            await updateStock(id, "subtract", t);
        }

        await item.update(data, { transaction: t });

        if (newStatus === "Received" && oldStatus !== "Received") {
            await updateStock(id, "add", t);
        }

        return item;
    });
};

// DELETE
exports.deleteOrder = async (id) => {
    return await db.sequelize.transaction(async (t) => {
        const item = await PurchaseOrder.findOne({ where: { po_id: id, is_deleted: false }, transaction: t });
        if (!item) throw new Error("Order not found");

        if (item.po_status === "Received") {
            await updateStock(id, "subtract", t);
        }

        await item.update({ is_deleted: true }, { transaction: t });
    });
};