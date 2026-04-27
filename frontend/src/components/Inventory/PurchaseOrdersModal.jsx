import React, { useEffect, useState } from "react";
import API from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function PurchaseOrdersModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    supplier_id: "",
    project_id: "",
    order_date: "",
    total_amount: 0,
    po_type: "In",
    po_status: "Pending",
  });

  const { t } = useTranslation();

  const [askInvoice, setAskInvoice] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);

  // ===== Load Data =====
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        supplier_id: "",
        project_id: "",
        order_date: "",
        total_amount: 0,
        po_type: "In",
        po_status: "Pending",
      });
    }

    setAskInvoice(false);
    setCreateInvoice(false);
  }, [initialData, isOpen]);

  // ===== Load Suppliers =====
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await API.get("/suppliers");
        setSuppliers(res.data.filter((s) => s.supplier_status === "Active"));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load suppliers");
      }
    };
    fetchSuppliers();
  }, []);

  // ===== Load Projects =====
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/project-info");
        setProjects(res.data.filter((p) => p.project_status === "InProgress"));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  if (!isOpen) return null;

  // ===== Change Handler =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    //  detect Approved → ask invoice
    if (name === "po_status") {
      if (value === "Approved" && form.po_status !== "Approved") {
        setAskInvoice(true);
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Submit =====
  const submit = async (e) => {
    e.preventDefault();

    // validation
    if ((form.po_type === "In" && !form.supplier_id) || !form.order_date) {
      toast.error("Required fields missing");
      return;
    }

    if (form.po_type === "Out" && !form.project_id) {
      toast.error("Project required for Out type");
      return;
    }

    const payload = {
      ...form,
      supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
      project_id: form.project_id ? Number(form.project_id) : null,
      total_amount: Number(form.total_amount),
      create_invoice: createInvoice,
    };

    try {
      await onSubmit(payload);

      toast.success("Purchase order saved successfully");

      if (createInvoice) {
        toast.success("Invoice created successfully");
      }

      setAskInvoice(false);
      setCreateInvoice(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save purchase order");
    }
  };

  // ===== Status Options =====
  const getStatusOptions = () => {
    const options = [
      { value: "Pending", label: "Pending" },
      { value: "Approved", label: "Approved" },
      { value: "Ordered", label: "Ordered" },
      { value: "Received", label: "Received" },
      { value: "Sent", label: "Sent" },
      { value: "Cancelled", label: "Cancelled" },
    ];

    if (form.po_type === "In") return options.filter((o) => o.value !== "Sent");
    if (form.po_type === "Out")
      return options.filter((o) => o.value !== "Received");

    return options;
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* ===== MAIN MODAL ===== */}
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-3">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-5">
        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-5">
            {initialData ? t("update_purchase_order") : t("add_purchase_order")}
          </h2>

          <form onSubmit={submit} className="space-y-3">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {" "}
                {t("type")}
              </label>
              <select
                name="po_type"
                value={form.po_type}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="In">In</option>
                <option value="Out">Out</option>
              </select>
            </div>

            {/* Supplier */}
            {form.po_type === "In" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("supplier")}
                </label>
                <select
                  name="supplier_id"
                  value={form.supplier_id}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.supplier_id} value={s.supplier_id}>
                      {s.supplier_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Project */}
            {form.po_type === "Out" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("project")}
                </label>
                <select
                  name="project_id"
                  value={form.project_id}
                  onChange={handleChange}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.project_id} value={p.project_id}>
                      {p.project_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("date")}
              </label>
              <input
                type="date"
                name="order_date"
                value={form.order_date}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("amount")}
              </label>
              <input
                type="number"
                name="total_amount"
                value={form.total_amount}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {" "}
                {t("status")}
              </label>
              <select
                name="po_status"
                value={form.po_status}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              >
                {getStatusOptions().map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>

              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {initialData ? t("update") : t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== INVOICE CONFIRM ===== */}
      {askInvoice && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-80 text-center space-y-4">
            <p className="font-semibold">
              Do you want to create invoice for this order?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setCreateInvoice(true);
                  setAskInvoice(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {t("yes")}
              </button>

              <button
                onClick={() => {
                  setCreateInvoice(false);
                  setAskInvoice(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                {t("no")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
