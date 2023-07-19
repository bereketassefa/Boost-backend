const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Stuff, validateStuff } = require("../models/Stuff");
const auth = require("../middleware/auth");
const adminMiddleware = require("../middleware/admin");

const router = express.Router();

router.get("/", [auth, adminMiddleware], async (req, res) => {
  const user = await Stuff.find().select("-password -__v");
  return res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateStuff(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Stuff.findOne({ email: req.body.email });
  if (user) return res.send("email already exist");

  const salt = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(req.body.password, salt);

  const stuff = Stuff({
    fullName: req.body.fullName,
    email: req.body.email,
    password: hashed,
    role: req.body.role,
  });
  let result = await stuff.save();

  const token = jwt.sign(
    { _id: result._id, role: result.role },
    process.env.jwt_secret
  );

  res
    .header("x-auth-token", token)
    .send({ email: result.email, _id: result._id });

  res.send();
});

router.delete("/:id", [auth, adminMiddleware], async (req, res) => {
  console.log(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("invalid id");

  const result = await Stuff.deleteOne({ _id: req.params.id });
  return res.send(result);
});

module.exports = router;
