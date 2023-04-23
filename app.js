const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.options("*", cors()); // enable requests for all routes

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});
