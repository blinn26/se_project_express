const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    console.log("Connected to the database");
  })

  .catch((err) => {
    console.log(err);
  });

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is the terminal and Yes this is Working.");
});
