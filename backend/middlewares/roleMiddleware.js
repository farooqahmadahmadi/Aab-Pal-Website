module.exports = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.user_role)) {
            return res.status(403).json({
                message: "Access denied. Role not allowed"
            });
        }
        next();
    };
};