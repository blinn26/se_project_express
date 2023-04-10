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

// Add this middleware before loading the routes
app.use((req, res, next) => {
  req.user = {
    _id: "642b48dc3e96a204b1fd8a2b", // paste the _id of the test user created in the previous step
  };
  next();
});

// Load the routes
app.use("/", router);

// Start the server
app.listen(PORT, () => {});
