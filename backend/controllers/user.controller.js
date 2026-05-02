const jwt = require("jsonwebtoken");

const {
  loginUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/user.service");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// LOGIN
exports.login = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    const user = await loginUser(user_email, password);

    const token = jwt.sign(
      { id: user.user_id, role: user.user_role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const users = await getUsers();
    res.json({ users });
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// GET BY ID
exports.getOne = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed" });
  }
};

// CREATE
exports.create = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.user_photo = `/uploads/users/${req.file.filename}`;
    }

    const user = await createUser(data);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.user_photo = `/uploads/users/${req.file.filename}`;
    }

    const user = await updateUser(req.params.id, data);

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};