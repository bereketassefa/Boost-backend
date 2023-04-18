const mongoose = require("mongoose");
const express = require("express");
const app = express();
const stuff = require("./routes/stuff");
const student = require("./routes/student");
const auth = require("./routes/auth");
const clearance = require("./routes/clearance");

require("dotenv").config();

const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/boost")
  .then(() => {
    console.log("connected to db succesfully");
  })
  .catch((err) => console.log("error connecting to database"));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/student", student);
app.use("/api/stuff", stuff);
app.use("/api/clearance", clearance);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
