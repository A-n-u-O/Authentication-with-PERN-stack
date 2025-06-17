const jwt = require("jsonwebtoken");
require("dotenv").config();

//check if the token being sent is valid
function authorization(req, res, next) {
  const token = req.header("Authorization") || req.header("authorization");
  console.log("Received token",token);
  if (!token) {
    return res
      .status(403)
      .json({ error: " authorization denied-no token provided" });
  }

  try {
    const actualToken = token.include("Bearer ")
      ? token.split("Bearer ")[1]
      : token;

    if (!actualToken || actualToken.length < 10) {
      return res.status(401).json({ error: "Malformed token" });
    }

    const payload = jwt.verify(actualToken, process.env.jwtSecret);

    //validate payload structure
    if (!payload.user || !payload.user.id) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = payload.user;
    next();
  } catch (error) {
    console.error("JWT Verification Error", error.message);
    const errorResponse = { error: "Invalid token", details: null };

    if (error.name === "TokenExpiredError") {
      errorResponse.error = "Token expired";
      errorResponse.details = { expiredAt: error.expiredAt };
    } else if (error.name === "JsonWebTokenError") {
      errorResponse.error = "JWT error";
      errorResponse.details = error.message;
    }

    res.status(401).json(errorResponse);
  }
}
module.exports = authorization;
