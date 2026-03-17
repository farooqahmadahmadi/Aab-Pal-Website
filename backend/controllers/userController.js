const { registerUser, loginUser } = require("../services/userService");

exports.register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};