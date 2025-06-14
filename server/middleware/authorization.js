const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorization(req, res, next) {
  const token = req.header("authorization");
  console.log(token);
  if (!token) {
    return res.status(403).json({ error: " authorization denied" });
  }

  try {
    const actualToken = token.startsWith("Bearer") ? token.slice(7) : token;
    const payload = jwt.verify(actualToken, process.env.jwtSecret);
    req.user = payload.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}
module.exports = authorization;
