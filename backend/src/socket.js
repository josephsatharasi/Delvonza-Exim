const { Server } = require('socket.io');

let io;

const parseOrigins = () =>
  (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Attach Socket.IO to the HTTP server (same port as API). Admin listens for `inquiry:new`.
 */
function initSocket(httpServer) {
  const allowedOrigins = parseOrigins();

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true
    }
  });

  io.on('connection', () => {
    /* reserved for future admin-only rooms / auth */
  });

  return io;
}

function emitNewInquiry(inquiry) {
  if (!io || !inquiry) return;
  const doc = typeof inquiry.toObject === 'function' ? inquiry.toObject() : inquiry;
  io.emit('inquiry:new', {
    inquiry: {
      _id: doc._id,
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      country: doc.country,
      message: doc.message,
      status: doc.status,
      productSlug: doc.productSlug,
      productName: doc.productName,
      createdAt: doc.createdAt
    }
  });
}

module.exports = { initSocket, emitNewInquiry };
