const service = require("../services/paymentsInfoService");

// GET ALL
exports.getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        console.log("GET DATA:", data); // debug

        res.json(data);
    } catch (err) {
        console.error("GET ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// CREATE
exports.create = async (req, res) => {
    try {
        console.log("RAW BODY:", req.body); // 🔥 مهم

        const payload = {
            invoice_id: Number(req.body.invoice_id),
            payment_amount: Number(req.body.payment_amount),
            payment_date: req.body.payment_date,

            // normalize ENUM (no error anymore)
            payment_method:
                req.body.payment_method
                    ? req.body.payment_method.charAt(0).toUpperCase() +
                    req.body.payment_method.slice(1).toLowerCase()
                    : "Cash",

            payment_status:
                req.body.payment_status
                    ? req.body.payment_status.charAt(0).toUpperCase() +
                    req.body.payment_status.slice(1).toLowerCase()
                    : "Pending",
        };

        console.log("FINAL PAYLOAD:", payload); // 🔥 مهم

        const data = await service.create(payload);

        res.status(201).json(data);
    } catch (err) {
        console.error("CREATE ERROR:", err); // 🔥 دا به اصل مشکل وښيي
        res.status(400).json({ message: err.message });
    }
};

// UPDATE
exports.update = async (req, res) => {
    try {
        console.log("UPDATE BODY:", req.body);

        const payload = {
            ...req.body,
            invoice_id: Number(req.body.invoice_id),
            payment_amount: Number(req.body.payment_amount),
        };

        const data = await service.update(req.params.id, payload);

        res.json(data);
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(400).json({ message: err.message });
    }
};

// DELETE
exports.remove = async (req, res) => {
    try {
        await service.remove(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(400).json({ message: err.message });
    }
};