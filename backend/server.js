require("dotenv").config();
const sequelize = require("./config/db");
const app = require("./app");

// NEW: http + socket.io
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// create server
const server = http.createServer(app);

// socket config
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
app.set("io", io);

// socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// start server
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

// (optional) export io for later use
module.exports = { io };
