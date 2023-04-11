const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const config = require("./utils/config");
const auth = require("./middlewares/auth");

const app = express();
const { PORT = 3001 } = process.env; // get PORT from environment variable

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch(() => {});

// Middleware
app.use(express.json());

// Add this middleware before loading the routes
app.use((req, res, next) => {
  req.user = {
    _id: "642b48dc3e96a204b1fd8a2b", // paste the _id of the test user created in the previous step
  };
  next();
});

// Load the routes
app.use("/", router);

// Apply the auth middleware to the "/users" route
app.use("/users", auth, router);

// Super Secret Key
const secretKey = config.JWT_SECRET;

// Check if the secret key is set
if (!secretKey) {
  console.error("JWT_SECRET is not set in the configuration file");
  process.exit(1);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
