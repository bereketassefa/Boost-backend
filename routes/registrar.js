const express = require("express");
const auth = require("../middleware/auth");
const advisorMiddleware = require("../middleware/Advisor");
const { Student } = require("../models/student");
const { default: mongoose } = require("mongoose");
const registrar = require("../middleware/registrar");
const router = express.Router();

router.get("/", [auth, registrar], async (req, res) => {
  const result = await Student.find({
    regStatus: "enrolled",
    registrarClearance: true,
  });
  return res.send(result);
});
router.post("/", [auth, registrar], async (req, res) => {
  const newresult = await Student.updateOne(
    { _id: req.body.id },
    {
      $set: {
        regStatus: "finished",
      },
    }
  );
  res.send(newresult);
});

module.exports = router;
