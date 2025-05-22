const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
//registering
router.post("/register", async (req, res) => {
  try {
    //1. destructure the req.body to get (name, email, password)
    const { name, email, password } = req.body;

    //2. check if user exists(if user exists then throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    res.json(user.rows)

    if (user.rowCount.length !== 0) {
      //if the user exists
      return res.status(401).send("user already exists"); //the person is unauthenticated, 403- unauthorized
    }
    
    //3. else bcrypt the user password
    const saltRound = 10;

    //4. Enter the new user into the database
    //5. Generating our jwt token
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
