import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Database and Routes
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production configuration
app.use(express.static(path.join(__dirname, "../frontend")));  // Serve static files from frontend

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));  // Serve index.html
});


// Server initialization
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🟢 Server running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   MongoDB URI: ${process.env.MONGODB_URI}`);
  
  connectDB().catch(error => {
    console.error("🔴 MongoDB connection failed:", error.message);
    process.exit(1);
  });
});
