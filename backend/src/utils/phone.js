/**
 * Admin mobile: exactly 10 digits (India local), stored as +91XXXXXXXXXX.
 */
const normalizeAdminPhone10 = (input) => {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length !== 10) return null;
  return `+91${digits}`;
};

module.exports = { normalizeAdminPhone10 };
