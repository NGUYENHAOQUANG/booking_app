// middleware/authValidation.js
const { body, param } = require("express-validator");
const { validateRequest } = require("./validationMiddleware");

const PASSWORD_MESSAGE =
  "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt";
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const passwordRule = (field = "password", label = "Mật khẩu") =>
  body(field)
    .notEmpty()
    .withMessage(`${label} là bắt buộc`)
    .bail()
    .isString()
    .withMessage(`${label} phải là chuỗi`)
    .bail()
    .matches(STRONG_PASSWORD_REGEX)
    .withMessage(PASSWORD_MESSAGE);

exports.validateRegister = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username là bắt buộc")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username phải từ 3 đến 30 ký tự"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  passwordRule("password", "Mật khẩu"),
  validateRequest,
];

exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password là bắt buộc")
    .bail()
    .isString()
    .withMessage("Password phải là chuỗi"),
  validateRequest,
];

exports.validateRefreshToken = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Không có refresh token")
    .bail()
    .isString()
    .withMessage("refreshToken phải là chuỗi"),
  validateRequest,
];

exports.validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  validateRequest,
];

exports.validateResetPassword = [
  param("token")
    .notEmpty()
    .withMessage("Token đặt lại mật khẩu là bắt buộc")
    .bail()
    .isString()
    .withMessage("Token đặt lại mật khẩu phải là chuỗi"),
  passwordRule("password", "Mật khẩu"),
  validateRequest,
];

exports.validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Mật khẩu hiện tại là bắt buộc")
    .bail()
    .isString()
    .withMessage("Mật khẩu hiện tại phải là chuỗi"),
  passwordRule("newPassword", "Mật khẩu mới"),
  body("newPassword")
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage("Mật khẩu mới không được trùng mật khẩu hiện tại"),
  validateRequest,
];
