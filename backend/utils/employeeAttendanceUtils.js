const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🔐 Main Auth Middleware
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            user_id: decoded.id,
            employee_id: decoded.employee_id, 
            role: decoded.role || null
        };

        // Extra safety
        if (!req.user.employee_id) {
            return res.status(400).json({
                message: "Token missing employee_id"
            });
        }

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};
