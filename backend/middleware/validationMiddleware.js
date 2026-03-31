// middleware/validationMiddleware.js
const { validationResult } = require("express-validator");

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const formattedErrors = errors.array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

  const firstErrorMsg = formattedErrors.length > 0 ? formattedErrors[0].message : "Dữ liệu không hợp lệ";

  return res.status(422).json({
    success: false,
    message: firstErrorMsg,
    errors: formattedErrors,
  });
};
