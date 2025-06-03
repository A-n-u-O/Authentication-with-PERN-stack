const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");
const authorize = require("../middleware/authorize");

//to create content on the blog
router.post("/createContent",authorize, async (req, res) => {
  try {
    user_id = req.user;//current user id
    const { title, description, body, user_id, dateAndTime } = req.body;
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
router.get("/", async (req, res) => {
  try {
    const allPosts = await pool.query("SELECT * FROM posts");
    res.json(allPosts.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
