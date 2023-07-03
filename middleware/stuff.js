module.exports = function (req, res, next) {
  console.log(req.user.role);
  // if (req.user.role in ["sport", "library", "cafe", "faculty"]) next();
  if (req.user.role === "student") {
    return res.status(403).send("access denied");
  }
  next();
};
