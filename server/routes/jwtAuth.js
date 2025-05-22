const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
//registering
router.post("/register", async (req, res) => {
  try {
    //1. destructure the req.body to get (name, email, password)
    const { name, email, password } = req.body;
    console.log("Register request body:", req.body);

    //2. check if user exists(if user exists then throw error)

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    console.log("user found:", user.rows);

    if (user.rowCount !== 0) {
      //if the user exists
      return res.status(401).send("user already exists"); //the person is unauthenticated, 403- unauthorized
    }

    //3. else bcrypt the user password
    const saltRounds = 10; //how strong the hash is
    const salt = await bcrypt.genSalt(saltRounds); //salt - random data for each password to make it more secure
    //start encrypting
    const bcryptPassword = await bcrypt.hash(password, salt); //hashes the plain password with salt
console.log("Hashed password:", bcryptPassword);

    //4. Enter the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );
    res.json(newUser.rows);
    console.log("new user inserted", newUser.rows);

    //5. Generating our jwt token
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
