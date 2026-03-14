const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token." });
  }
  try {
    const verified = jwt.verify(token, "SECRET_KEY");
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};