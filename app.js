const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const config = require("./utils/config");
const auth = require("./middlewares/auth");
const userRoutes = require("./routes/users");

const app = express();
const { PORT = 3001 } = process.env; // get PORT from environment variable

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

// Middleware
app.use(express.json());

// Apply the auth middleware to the "/users" route
app.use("/users", auth);

// Load the routes
app.use("/", router);
app.use("/users", userRoutes);

// Super Secret Key
const secretKey = config.JWT_SECRET;

// Check if the secret key is set
if (!secretKey) {
  process.exit(1);
}

// Start the server
app.listen(PORT, () => {});
