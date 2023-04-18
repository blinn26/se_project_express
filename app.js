const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

// Middleware
app.use(express.json());

// Load the routes
app.use("/", router);

// Start the server
app.listen(PORT, () => {});
