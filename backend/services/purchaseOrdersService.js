const db = require("../models");
const PurchaseOrder = require("../models/PurchaseOrdersInfo");
const PurchaseOrderItem = require("../models/PurchaseOrderItemsInfo");
const Material = require("../models/MaterialsInfo");
const Invoice = require("../models/InvoicesInfo");
const logService = require("./systemLogsService");
const { handleDelete } = require("../utils/deleteHelper");

// helpers
const getUserId = (user) => user?.user_id || user?.id || 0;
const isAdmin = (user) => user?.role === "Admin";

// ==============================
// 🔥 INVOICE HELPERS
// ==============================

const upsertInvoiceFromPO = async (order, t) => {
  const invoice = await Invoice.findOne({
    where: { reference_id: order.po_id, reference_type: "Purchase Order" },
    transaction: t,
  });

  if (invoice) {
    await invoice.update(
      {
        is_deleted: false,
        project_id: order.project_id || null,
        invoice_amount: order.total_amount || 0,
        invoice_type: "Out",
      },
      { transaction: t },
    );

    await order.update({ has_invoice: true }, { transaction: t });
    return invoice;
  }

  const newInvoice = await Invoice.create(
    {
      project_id: order.project_id || null,
      invoice_type: "Out",
      invoice_amount: order.total_amount || 0,
      invoice_description: "From Purchase Order",
      reference_id: order.po_id,
      reference_type: "Purchase Order",
    },
    { transaction: t },
  );

  await order.update({ has_invoice: true }, { transaction: t });
  return newInvoice;
};

const updateInvoiceFromPO = async (order, t) => {
  const invoice = await Invoice.findOne({
    where: { reference_id: order.po_id, reference_type: "Purchase Order" },
    transaction: t,
  });

  if (!invoice) return;

  await invoice.update(
    {
      project_id: order.project_id || null,
      invoice_amount: order.total_amount || 0,
    },
    { transaction: t },
  );
};

const deleteInvoiceFromPO = async (order, t) => {
  const invoice = await Invoice.findOne({
    where: { reference_id: order.po_id, reference_type: "Purchase Order" },
    transaction: t,
  });

  if (!invoice) return;

  await invoice.update({ is_deleted: true }, { transaction: t });
  await order.update({ has_invoice: false }, { transaction: t });
};

// ==============================
// 🔥 STOCK HELPER
// ==============================

const updateStock = async (po_id, type = "add", t) => {
  const po = await PurchaseOrder.findByPk(po_id, { transaction: t });
  if (!po) return;

  const items = await PurchaseOrderItem.findAll({
    where: { po_id, is_deleted: false },
    transaction: t,
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

  const materials = await Material.findAll({
    where: { material_id: Object.keys(materialMap) },
    transaction: t,
  });

  for (let material of materials) {
    const matId = material.material_id;
    const currentStock = parseFloat(material.current_stock) || 0;
    const avgPrice = parseFloat(material.average_price) || 0;
    const qty = materialMap[matId].qty;
    const value = materialMap[matId].totalValue;

    let newStock = currentStock;
    let newAvg = avgPrice;

    if (po.po_type === "In") {
      if (type === "add") newStock = currentStock + qty;
      else if (type === "subtract") newStock = Math.max(currentStock - qty, 0);

      newAvg =
        newStock === 0
          ? 0
          : (currentStock * avgPrice + (type === "add" ? value : -value)) /
            newStock;
    } else if (po.po_type === "Out") {
      if (po.po_status === "Sent") {
        if (type === "add") newStock = Math.max(currentStock - qty, 0);
        else if (type === "subtract") newStock = currentStock + qty;
        newAvg =
          newStock > 0 && currentStock > 0
            ? (currentStock * avgPrice +
                (type === "subtract" ? value : -value)) /
              newStock
            : 0;
      }
    }

    await material.update(
      { current_stock: newStock, average_price: newAvg },
      { transaction: t },
    );
  }
};

// ==============================
// ✅ GET
// ==============================

exports.getOrders = async () => {
  return await PurchaseOrder.findAll({
    where: { is_deleted: false },
    order: [["created_at", "DESC"]],
  });
};

// ==============================
// ✅ CREATE
// ==============================

exports.createOrder = async (data, user = {}) => {
  return await db.sequelize.transaction(async (t) => {
    const order = await PurchaseOrder.create(data, { transaction: t });

    if (order.po_status === "Received" || order.po_status === "Sent") {
      await updateStock(order.po_id, "add", t);
    }

    await logService.createLog({
      user_id: getUserId(user),
      action: "CREATE",
      reference_table: "purchase_orders",
      reference_record_id: order.po_id,
      old_value: null,
      new_value: order.toJSON(),
    });

    return order;
  });
};

// ==============================
// ✅ UPDATE
// ==============================

exports.updateOrder = async (id, data, user = {}) => {
  return await db.sequelize.transaction(async (t) => {
    const item = await PurchaseOrder.findOne({
      where: { po_id: id, is_deleted: false },
      transaction: t,
    });
    if (!item) throw new Error("Order not found");

    const oldValue = item.toJSON();
    const oldStatus = item.po_status;
    const newStatus = data.po_status ?? oldStatus;

    if (
      (oldStatus === "Received" && newStatus !== "Received") ||
      (oldStatus === "Sent" && newStatus !== "Sent")
    ) {
      await updateStock(id, "subtract", t);
    }

    await item.update(data, { transaction: t });

    if (
      (newStatus === "Received" && oldStatus !== "Received") ||
      (newStatus === "Sent" && oldStatus !== "Sent")
    ) {
      await updateStock(id, "add", t);
    }

    if (oldStatus !== "Approved" && newStatus === "Approved") {
      await upsertInvoiceFromPO(item, t);
    }

    if (newStatus === "Approved") {
      await updateInvoiceFromPO(item, t);
    }

    if (
      oldStatus === "Approved" &&
      (newStatus === "Pending" || newStatus === "Cancelled")
    ) {
      await deleteInvoiceFromPO(item, t);
    }

    await logService.createLog({
      user_id: getUserId(user),
      action: "UPDATE",
      reference_table: "purchase_orders",
      reference_record_id: item.po_id,
      old_value: oldValue,
      new_value: item.toJSON(),
    });

    return item;
  });
};

// ==============================
// ❌ DELETE (SOFT/HARD for admin)
// ==============================

exports.deleteOrder = async (id, user = {}) => {
  return await db.sequelize.transaction(async (t) => {
    const item = await PurchaseOrder.findOne({
      where: { po_id: id, is_deleted: false },
      transaction: t,
    });
    if (!item) throw new Error("Order not found");

    const oldValue = item.toJSON();

    if (item.po_status === "Received" || item.po_status === "Sent") {
      await updateStock(id, "subtract", t);
    }

    await deleteInvoiceFromPO(item, t);

    if (isAdmin(user)) {
      // HARD DELETE
      await PurchaseOrderItem.destroy({ where: { po_id: id }, transaction: t });
      await item.destroy({ transaction: t });

      await logService.createLog({
        user_id: getUserId(user),
        action: "HARD_DELETE",
        reference_table: "purchase_orders",
        reference_record_id: id,
        old_value: oldValue,
        new_value: null,
      });
    } else {
      // SOFT DELETE
      await PurchaseOrderItem.update(
        { is_deleted: true },
        { where: { po_id: id, is_deleted: false }, transaction: t },
      );
      await item.update({ is_deleted: true }, { transaction: t });

      await logService.createLog({
        user_id: getUserId(user),
        action: "DELETE",
        reference_table: "purchase_orders",
        reference_record_id: id,
        old_value: oldValue,
        new_value: null,
      });
    }

    return true;
  });
};
