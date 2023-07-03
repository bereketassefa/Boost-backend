const mongoose = require("mongoose");
const express = require("express");
const app = express();
const stuff = require("./routes/stuff");
const student = require("./routes/student");
const auth = require("./routes/auth");
const clearance = require("./routes/clearance");
const cors = require("cors");
const general = require("./routes/general");
const advisor = require("./routes/Advisor");
const registrar = require("./routes/registrar");
require("dotenv").config();

const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/boost")
  .then(() => {
    console.log("connected to db succesfully");
  })
  .catch((err) => console.log("error connecting to database"));

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/student", student);
app.use("/api/stuff", stuff);
app.use("/api/clearance", clearance);
app.use("/api/general", general);
app.use("/api/advisor", advisor);
app.use("/api/registrar", registrar);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
