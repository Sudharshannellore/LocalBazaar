const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io"); // <-- ADD THIS

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now (later you can restrict it to your frontend URL)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Middleware to pass io to req
app.use((req, res, next) => {
  req.io = io; // Attach socket.io instance to every request
  next();
});

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Successfully Connected"))
.catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use('/admin', require('./AdminFeatures/routes/AdminRoute'))
app.use('/vendor', require('./VendorFeatures/routes/VendorRoute'));
app.use('/user', require('./UserFeatures/routes/UserRoute'));
app.use('/delivery', require('./DeliveryFeatures/routes/DeliveryRoute'));

// Test server
app.get('/', (req, res) => {
  res.send('Hello FreshBazaar');
});

// Handle Socket.IO Connections
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
