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
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://10.127.253.132:5173",
    ], // IMPORTANT for LAN/mobile testing (safe for dev)
    
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

// socket connection
io.on("connection", (socket) => {
  console.log("🟢 connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 disconnected:", socket.id);
  });
});

// start server
sequelize.sync().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
});

// (optional) export io for later use
module.exports = { io };
