require("dotenv").config();
const sequelize = require("./config/db");
const app = require("./app");

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup (DEV + LAN safe)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.set("io", io);

// Socket events
io.on("connection", (socket) => {
  console.log("🟢 connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 disconnected:", socket.id);
  });
});

// DB + Server start (NO sync)
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database Connected Successfully");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err.message);
  });

// export socket
module.exports = { io };