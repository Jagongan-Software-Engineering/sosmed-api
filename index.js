require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./app/routes/auth.route");

const app = express();

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/sosmed_api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authRouter);

app.use("/", (req, res) => {
  res.send({ status: true, message: "Halo im alive" });
});

app.listen(3000, () => {
  console.log("Server started");
});
