const service = require("../services/faqsPage.service");

// ================= GET ALL =================
exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {
  try {
    const data = await service.getOne(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= ADMIN CREATE =================
exports.create = async (req, res) => {
  try {
    const data = await service.create(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= PUBLIC ASK QUESTION =================
exports.createPublicQuestion = async (
  req,
  res
) => {
  try {
    const {
      language_id,
      faqs_question,
    } = req.body;

    // ================= VALIDATION =================
    if (
      !language_id ||
      !faqs_question
    ) {
      return res.status(400).json({
        success: false,
        message:
          "language_id and faqs_question are required",
      });
    }

    const data =
      await service.createPublicQuestion({
        language_id,
        faqs_question,
      });

    res.status(201).json({
      success: true,
      message:
        "Question submitted successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
  try {
    const data = await service.update(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {
  try {
    await service.remove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};