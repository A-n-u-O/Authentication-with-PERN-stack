const jwt = require("jsonwebtoken");
require("dotenv").config(); //allows us get access to all our environment variable

function jwtGenerator(user_id) {
  const payload = {
    //create payload
    user: { id: user_id },
  };

  //signing the token
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1h" }); //takes payload data and secret
}

module.exports = jwtGenerator;
