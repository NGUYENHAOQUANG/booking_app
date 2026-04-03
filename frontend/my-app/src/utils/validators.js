// src/utils/validators.js

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPhone = (phone) => {
  const re = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  return re.test(String(phone));
};

export const isStrongPassword = (password) => {
  // Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(password);
};
