const authService = require("../services/authService");

exports.login = async (req, res, next) => {
    try {
        const { user_name, password } = req.body;
        const result = await authService.loginUser(user_name, password);
        res.status(200).json({
            success: true,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};

// Logout (simple version)
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
};