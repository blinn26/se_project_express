const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();

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

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
