const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
//registering
router.post("/register", validInfo, async (req, res) => {
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
      return res.status(401).json("user already exists"); //the person is unauthenticated, 403- unauthorized
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
    // res.json(newUser.rows);
    console.log("new user inserted", newUser.rows);

    //5. Generating our jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);
    res.json(token);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    //a lot more bcrypt

    // 1. destructure the request.body(req)
    const { email, password } = req.body;

    // 2. check if user does exist(if not, throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rowCount === 0) {
      return res.status(401).json("password or email is incorrect!"); //unauthenticated
    }

    // 3. check if incoming password is the same as database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("password or email is incorrect");
    }

    console.log(validPassword);

    // 4. if password is correct, give them the jwt token
    const token = jwtGenerator(user.rows[0].user_id);

    res.json(token);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/is-verify", async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
