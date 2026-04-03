// middleware/authValidation.js
const { body, cookie } = require("express-validator");
const { validateRequest } = require("./validationMiddleware");

const PASSWORD_MESSAGE =
  "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ thường, chữ hoa, số và ký tự đặc biệt";
const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PHONE_REGEX = /^\+?[0-9]{9,15}$/;
const OTP_REGEX = /^[0-9]{6}$/;
const normalizePhone = (value = "") => String(value).replace(/[^\d+]/g, "");

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
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Họ tên là bắt buộc")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Họ tên phải từ 2 đến 100 ký tự"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Số điện thoại là bắt buộc")
    .bail()
    .customSanitizer((value) => normalizePhone(value))
    .matches(PHONE_REGEX)
    .withMessage("Số điện thoại không hợp lệ"),
  passwordRule("password", "Mật khẩu"),
  body("acceptTerms")
    .custom((value) => value === true)
    .withMessage("Bạn phải đồng ý điều khoản sử dụng"),
  body("allowPromotions")
    .optional()
    .isBoolean()
    .withMessage("allowPromotions phải là true hoặc false"),
  validateRequest,
];

exports.validateLogin = [
  body()
    .custom((_, { req }) => {
      const identifier = String(req.body.identifier || req.body.email || req.body.phoneNumber || "").trim();
      if (!identifier) throw new Error("Vui lòng nhập email hoặc số điện thoại");

      if (identifier.includes("@")) {
        const isEmailValid = /^\S+@\S+\.\S+$/.test(identifier);
        if (!isEmailValid) throw new Error("Email không hợp lệ");
        return true;
      }

      const normalizedPhone = normalizePhone(identifier);
      const isPhoneValid = PHONE_REGEX.test(normalizedPhone);
      if (!isPhoneValid) throw new Error("Số điện thoại không hợp lệ");
      return true;
    })
    .withMessage("Email hoặc số điện thoại không hợp lệ"),
  body("password")
    .notEmpty()
    .withMessage("Password là bắt buộc")
    .bail()
    .isString()
    .withMessage("Password phải là chuỗi"),
  validateRequest,
];

exports.validateRefreshToken = [
  cookie("refreshToken")
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

exports.validateVerifyForgotPasswordOtp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("otp")
    .notEmpty()
    .withMessage("OTP là bắt buộc")
    .bail()
    .matches(OTP_REGEX)
    .withMessage("OTP phải gồm 6 chữ số"),
  validateRequest,
];

exports.validateResetPasswordWithOtp = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email là bắt buộc")
    .bail()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
  body("otp")
    .notEmpty()
    .withMessage("OTP là bắt buộc")
    .bail()
    .matches(OTP_REGEX)
    .withMessage("OTP phải gồm 6 chữ số"),
  passwordRule("password", "Mật khẩu mới"),
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
