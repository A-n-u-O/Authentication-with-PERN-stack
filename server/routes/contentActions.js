const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
const authorize = require("../middleware/authorize");

//to create content on the blog
router.post("/createContent", authorize, async (req, res) => {
  try {
    const user_id = req.user; //current user id
    const { title, description, body, dateAndTime } = req.body;
    console.log("create content", req.body);

    //validating inputs
    if (!title || !description || !body || !dateAndTime) {
      return res.status(400).json({ error: "fill all input fields" });
    }

    const newPost = await pool.query(
      "INSERT INTO posts (post_title, post_description, post_body, post_dateAndTime, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, body, dateAndTime, user_id]
    );

    res.json(newPost.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

//to get all posts by the user
router.get("/", authorize, async (req, res) => {
  //authorize was add to protect the route since it returns posts only for the loggged in user
  try {
    const user_id = req.user;
    const userPosts = await pool.query(
      "SELECT * FROM posts wHERE user_id = $1",
      [user_id]
    );
    res.json(userPosts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
