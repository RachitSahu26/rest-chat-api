const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
// const cors = require('cors');
const connectDB = require("./config/db");
const colors = require("colors");
const cookieParser = require('cookie-parser');
const messageRoute = require("./routes/message.routes");
const AuthRoutes = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");
const { setupSocket } = require("./socket/socket");
const { initializeSocket } = require("./controllers/message.controller");

dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server



// app.use(cors({
//   origin:"http://localhost:3000",
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
// }));

app.use(cookieParser());
app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// Set up socket connection
const { io } = setupSocket(server);
initializeSocket(io); // Initialize the socket in the message controller

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>{
  connectDB();
   console.log(`Server is running on port ${PORT}`)
}

);
