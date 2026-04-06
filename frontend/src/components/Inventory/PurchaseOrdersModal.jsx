import React, { useEffect, useState } from "react";
import API from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

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

  const [askInvoice, setAskInvoice] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        supplier_id: "",
        project_id: "",
        order_date: "",
        total_amount: 0,
        po_type: "In",
        po_status: "Pending",
      });

    setAskInvoice(false);
    setCreateInvoice(false);
  }, [initialData, isOpen]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 detect Approved change
    if (name === "po_status") {
      if (value === "Approved" && form.po_status !== "Approved") {
        setAskInvoice(true);
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // basic validation
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
      create_invoice: createInvoice, // 🔥 important flag for backend
    };

    try {
      await onSubmit(payload);
      toast.success("Purchase order saved successfully");

      if (createInvoice) {
        toast.success("Invoice created successfully");
      }

      // reset invoice popup
      setAskInvoice(false);
      setCreateInvoice(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save purchase order");
    }
  };

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
      <Toaster position="top-right" reverseOrder={false} />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
        <div className="bg-white p-6 rounded w-96">
          <h3 className="font-bold mb-4">
            {initialData ? "Edit" : "Add"} Purchase Order
          </h3>

          <form onSubmit={submit} className="space-y-3">
            <select
              name="po_type"
              value={form.po_type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="In">In</option>
              <option value="Out">Out</option>
            </select>

            {form.po_type === "In" && (
              <select
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.supplier_id} value={s.supplier_id}>
                    {s.supplier_name}
                  </option>
                ))}
              </select>
            )}

            {form.po_type === "Out" && (
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.project_id} value={p.project_id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            )}

            <input
              type="date"
              name="order_date"
              value={form.order_date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="number"
              name="total_amount"
              value={form.total_amount}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />

            <select
              name="po_status"
              value={form.po_status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {getStatusOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {initialData ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🔥 Invoice Confirm Modal */}
      {askInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-80 text-center">
            <p className="font-semibold mb-4">
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
                Yes
              </button>

              <button
                onClick={() => {
                  setCreateInvoice(false);
                  setAskInvoice(false);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
