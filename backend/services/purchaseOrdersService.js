const db = require("../models");
const PurchaseOrder = require("../models/PurchaseOrdersInfo");
const PurchaseOrderItem = require("../models/PurchaseOrderItemsInfo");
const Material = require("../models/MaterialsInfo");

// 🔥 helper: update stock + avg price based on PO type & status (transaction-safe & bulk)
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

    const matIds = Object.keys(materialMap);
    const materials = await Material.findAll({
        where: { material_id: matIds },
        transaction: t
    });

    for (let material of materials) {
        const matId = material.material_id;
        const currentStock = parseFloat(material.current_stock) || 0;
        const avgPrice = parseFloat(material.average_price) || 0;

        const qty = materialMap[matId].qty;
        const value = materialMap[matId].totalValue;

        let newStock = currentStock;
        let newAvg = avgPrice;

        // ✅ logic for In, Out, Sent
        if (po.po_type === "In") {
            if (type === "add") newStock = currentStock + qty;
            else if (type === "subtract") newStock = Math.max(currentStock - qty, 0);

            newAvg = newStock === 0 ? 0 :
                ((currentStock * avgPrice) + (type === "add" ? value : -value)) / newStock;

        } else if (po.po_type === "Out") {

            if (po.po_status === "Sent") {
                // 🔥 Sent = real خروج
                if (type === "add") newStock = Math.max(currentStock - qty, 0);
                else if (type === "subtract") newStock = currentStock + qty;

                newAvg = (newStock > 0 && currentStock > 0)
                    ? ((currentStock * avgPrice) + (type === "subtract" ? value : -value)) / newStock
                    : 0;

            } else {
                // ❗ Not Sent → stock ته مه لاس وهه (Fix)
                continue;
            }
        }

        await material.update(
            { current_stock: newStock, average_price: newAvg },
            { transaction: t }
        );
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
    return await db.sequelize.transaction(async (t) => {
        const order = await PurchaseOrder.create(data, { transaction: t });

        if (order.po_status === "Received" || order.po_status === "Sent") {
            await updateStock(order.po_id, "add", t);
        }

        return order;
    });
};

// UPDATE
exports.updateOrder = async (id, data) => {
    return await db.sequelize.transaction(async (t) => {

        const item = await PurchaseOrder.findOne({
            where: { po_id: id, is_deleted: false },
            transaction: t
        });

        if (!item) throw new Error("Order not found");

        const oldStatus = item.po_status;
        const newStatus = data.po_status;

        // 🔻 undo old
        if ((oldStatus === "Received" && newStatus !== "Received") ||
            (oldStatus === "Sent" && newStatus !== "Sent")) {
            await updateStock(id, "subtract", t);
        }

        await item.update(data, { transaction: t });

        // 🔺 apply new
        if ((newStatus === "Received" && oldStatus !== "Received") ||
            (newStatus === "Sent" && oldStatus !== "Sent")) {
            await updateStock(id, "add", t);
        }

        return item;
    });
};

// DELETE (🔥 with items sync)
exports.deleteOrder = async (id) => {
    return await db.sequelize.transaction(async (t) => {

        const item = await PurchaseOrder.findOne({
            where: { po_id: id, is_deleted: false },
            transaction: t
        });

        if (!item) throw new Error("Order not found");

        // 🔻 rollback stock first
        if (item.po_status === "Received" || item.po_status === "Sent") {
            await updateStock(id, "subtract", t);
        }

        // ✅ child items soft delete
        await PurchaseOrderItem.update(
            { is_deleted: true },
            {
                where: { po_id: id, is_deleted: false },
                transaction: t
            }
        );

        // ✅ parent delete
        await item.update({ is_deleted: true }, { transaction: t });

    });
};