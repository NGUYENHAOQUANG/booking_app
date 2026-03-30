// middleware/validationMiddleware.js
const { validationResult } = require("express-validator");

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  return res.status(422).json({
    success: false,
    message: "Dữ liệu không hợp lệ",
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};
