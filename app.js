const express = require("express");
const mongoose = require("mongoose");
const ERROR_CODES = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express(); // Initialize app here

const clothingItemRoutes = require("./routes/clothingItem");
app.use("/api/clothingItems", clothingItemRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

// Parse incoming requests with JSON payloads
app.use(express.json());

// Load the routes
const routes = require("./routes");

// Use the routes
app.use(routes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || "An error has occurred on the server.";

  res.status(statusCode).json({ message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
