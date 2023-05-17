require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://api.wtwr.crabdance.com",
    "https://wtwr.crabdance.com",
  ];
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Database connection error:", error));

app.use(express.json());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(requestLogger);
app.use("/", router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
