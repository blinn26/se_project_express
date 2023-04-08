const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

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

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An error has occurred on the server.";

  res.status(statusCode).json({ message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
