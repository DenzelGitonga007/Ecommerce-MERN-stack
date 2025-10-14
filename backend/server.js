// server.js
// ----------------------------
// Basic Node + Express server
// ----------------------------

// Import required libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // allows frontend (React) to talk to backend
const bodyParser = require("body-parser");

const app = express();

// ----------------------------
// MIDDLEWARE SETUP
// ----------------------------
app.use(cors());                 // allow requests from React
app.use(bodyParser.json());      // parse incoming JSON data

// ----------------------------
// CONNECT TO MONGODB
// ----------------------------
// (Make sure MongoDB is running locally or use MongoDB Atlas)
mongoose.connect("mongodb://localhost:27017/simpleEcom", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// ----------------------------
// ROUTES
// ----------------------------
// Import routes for auth and products
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ----------------------------
// START SERVER
// ----------------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));