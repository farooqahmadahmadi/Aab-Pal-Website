const { loginUser, logoutUser } = require("../services/userService");

exports.login = async (req, res) => {
    try {
        const { user_email, password } = req.body;
        const data = await loginUser(user_email, password);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;
        await logoutUser(userId);
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
