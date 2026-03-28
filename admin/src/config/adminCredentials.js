/**
 * Hardcoded admin login for the Admin Panel (change after first deploy).
 * Optional override: set REACT_APP_ADMIN_EMAIL and REACT_APP_ADMIN_PASSWORD in admin/.env
 */
export const ADMIN_EMAIL =
  (typeof process !== 'undefined' && process.env.REACT_APP_ADMIN_EMAIL) || 'admin@delvonzaexim.com';

export const ADMIN_PASSWORD =
  (typeof process !== 'undefined' && process.env.REACT_APP_ADMIN_PASSWORD) || 'Delvonza@Admin2026';
