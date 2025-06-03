const router = require("express").Router();
const { json } = require("express");
const pool = require("../db");

router.post("/createContent", async (req, res) => {
  try {
    const { title, description, body, user_id, dateAndTime } = req.body;
    console.log("create content", req.body);

    //validating inputs
    if (!title || !description || !body || !dateAndTime) {
      return res.status(400).json({ error: "fill all input fields" });
    }

    const newPost = await pool.query(
      "INSERT INTO posts (post_title, post_description, post_body, post_dateAndTime) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, body, dateAndTime]
    );

    res.json(newPost.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
module.exports = router;
