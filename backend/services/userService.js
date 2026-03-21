const Users = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

exports.loginUser = async (email, password) => {
    const user = await Users.findOne({ where: { user_email: email } });
    if (!user) throw new Error("Invalid credentials");
    if (!user.is_active) throw new Error("User is inactive");

    const now = new Date();
    const time = now.toTimeString().split(" ")[0];
    if (user.access_time_start && user.access_time_end) {
        if (!(time >= user.access_time_start && time <= user.access_time_end)) {
            throw new Error("Login not allowed at this time");
        }
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
        user.failed_attempts += 1;
        await user.save();

        if (user.failed_attempts === 3) throw new Error("Too many wrong attempts, try after 30s");
        if (user.failed_attempts === 5) throw new Error("Too many wrong attempts, try after 60s");
        if (user.failed_attempts >= 6) {
            user.is_active = false;
            await user.save();
            throw new Error("User deactivated by system");
        }
        throw new Error("Invalid credentials");
    }

    user.failed_attempts = 0;
    user.login_status = "Online";
    user.last_login_at = new Date();
    await user.save();

    const token = jwt.sign({ id: user.user_id, role: user.user_role }, JWT_SECRET, { expiresIn: "8h" });
    return { user, token };
};

exports.getUsersList = async ({ page = 1, limit = 10, search = "", sortField = "user_id", sortOrder = "ASC" }) => {
    const offset = (page - 1) * limit;

    const where = {};
    if (search) where.user_name = { [Op.like]: `%${search}%` };

    const { rows, count } = await Users.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortField, sortOrder]],
    });

    return { users: rows, total: count };
};

exports.getUserById = async (id) => await Users.findByPk(id);

exports.addUser = async (data) => {
    data.password_hash = await bcrypt.hash(data.password, 10);
    return await Users.create(data);
};

exports.updateUser = async (id, data) => {
    const user = await Users.findByPk(id);
    if (!user) throw new Error("User not found");
    delete data.created_at;
    delete data.last_login_at;
    delete data.failed_attempts;
    return await user.update(data);
};

exports.deleteUser = async (id) => {
    const user = await Users.findByPk(id);
    if (!user) throw new Error("User not found");
    return await user.destroy();
};

exports.logoutUser = async (id) => {
    const user = await Users.findByPk(id);
    if (!user) throw new Error("User not found");
    user.login_status = "Offline";
    await user.save();
    return true;
};