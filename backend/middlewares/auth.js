import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'supersecret', (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

export const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden: insufficient role' });
    next();
};



exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};