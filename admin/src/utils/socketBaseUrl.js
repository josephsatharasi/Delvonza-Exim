/**
 * Socket.IO runs on the same host as the API without the `/api` suffix.
 * Set REACT_APP_SOCKET_URL if the API is proxied differently.
 */
export function getSocketBaseUrl() {
  const explicit = process.env.REACT_APP_SOCKET_URL;
  if (explicit) return String(explicit).replace(/\/$/, '');
  const api =
    process.env.REACT_APP_API_BASE_URL || 'https://delvonza-exim-backend.onrender.com/api';
  const trimmed = String(api).replace(/\/$/, '');
  const withoutApi = trimmed.replace(/\/?api$/i, '');
  return withoutApi || trimmed;
}
