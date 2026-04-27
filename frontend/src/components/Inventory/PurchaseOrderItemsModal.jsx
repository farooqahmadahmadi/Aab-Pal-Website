import React, { useEffect, useState } from "react";
import API from "../../services/api";

import { useTranslation } from "react-i18next";

export default function PurchaseOrderItemsModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [poStatuses, setPoStatuses] = useState({});

  const [form, setForm] = useState({
    po_id: "",
    material_id: "",
    po_item_quantity: 0,
    po_item_unit_price: 0,
  });

  const { t } = useTranslation();

  const [isPending, setIsPending] = useState(false);

  // ===== Load initial / reset =====
  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        po_id: "",
        material_id: "",
        po_item_quantity: 0,
        po_item_unit_price: 0,
      });
  }, [initialData, isOpen]);

  // ===== Load data =====
  useEffect(() => {
    const loadData = async () => {
      try {
        const poRes = await API.get("/purchase-orders");
        const matRes = await API.get("/materials");

        setOrders(poRes.data);
        setMaterials(matRes.data);

        const statusMap = {};
        poRes.data.forEach((po) => {
          statusMap[po.po_id] = po.po_status;
        });
        setPoStatuses(statusMap);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // ===== Check PO status =====
  useEffect(() => {
    setIsPending(form.po_id ? poStatuses[form.po_id] === "Pending" : false);
  }, [form.po_id, poStatuses]);

  if (!isOpen) return null;

  // ===== Handle Change =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;

    // 🔥 FIX: numbers clean convert
    if (["po_id", "material_id"].includes(name)) {
      val = value === "" ? "" : Number(value);
    }

    if (["po_item_quantity", "po_item_unit_price"].includes(name)) {
      val = value === "" ? 0 : Number(value);
    }

    setForm((prev) => ({ ...prev, [name]: val }));
  };

  // ===== Submit =====
  const submit = (e) => {
    e.preventDefault();

    if (!form.po_id || !form.material_id) {
      alert("Required fields missing");
      return;
    }

    if (!isPending) {
      alert("Cannot add or edit items: Selected PO is not Pending");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
          {initialData ? t("update_po_item") : t("add_po_item")}
        </h2>

        <form onSubmit={submit} className="space-y-3">
          {/* PO */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("po")}</label>
            <select
              name="po_id"
              value={form.po_id || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={initialData && !isPending}
            >
              <option value="">Select PO</option>
              {orders.map((o) => (
                <option key={o.po_id} value={o.po_id}>
                  #{o.po_id} ({o.po_status})
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("material")}
            </label>
            <select
              name="material_id"
              value={form.material_id || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              disabled={!isPending}
            >
              <option value="">Select Material</option>
              {materials.map((m) => (
                <option key={m.material_id} value={m.material_id}>
                  {m.material_name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("qty")}
            </label>
            <input
              type="number"
              name="po_item_quantity"
              value={form.po_item_quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              readOnly={!isPending}
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {" "}
              {t("price")}
            </label>
            <input
              type="number"
              name="po_item_unit_price"
              value={form.po_item_unit_price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              readOnly={!isPending}
            />
          </div>

          {/* Warning */}
          {!isPending && form.po_id && (
            <p className="text-red-500 text-sm">
              Cannot add/edit items because this PO is not Pending.
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={!isPending}
              className={`px-4 py-2 rounded ${
                isPending
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
