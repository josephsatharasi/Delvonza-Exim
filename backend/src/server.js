require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const httpServer = http.createServer(app);
    initSocket(httpServer);
    httpServer.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
