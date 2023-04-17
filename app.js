const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const config = require("./utils/config");
const auth = require("./middlewares/auth");
const login = require("./routes/index");
const createUser = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

router.post("/signin", auth, login);
router.post("/signup", auth, createUser);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

// Middleware
app.use(express.json());

// Load the routes
app.use("/", router);

// Apply the auth middleware to the "/users" route
app.use("/users", auth);

// Super Secret Key
const secretKey = config.JWT_SECRET;

// Check if the secret key is set
if (!secretKey) {
  process.exit(1);
}

const userRoutes = require("./routes/users");

app.use("/users", userRoutes);

// Start the server
app.listen(PORT, () => {});
