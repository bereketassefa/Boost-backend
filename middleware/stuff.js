module.exports = function (req, res, next) {
  if (!req.user.role in ["sport", "library", "cafe", "faculty"])
    return res.status(403).send("access denied");

  next();
};
