const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
  const token = req.header("authorization");

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
    req.status(401).json({ error: "Invalid token" });
  }
}
module.exports = authorize;
