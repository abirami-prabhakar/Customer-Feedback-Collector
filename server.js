// server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "b1ue",
  port: 5432,
});


app.get("/", (req, res) => {
  res.send("API is running");
});


app.post("/users", async (req, res) => {
  const { name, email, age, gender, city } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email required" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT user_id FROM feedback.users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.json({
        message: "User already exists",
        user_id: existingUser.rows[0].user_id,
      });
    }

    const newUser = await pool.query(
      "INSERT INTO feedback.users (name,email,age,gender,city) VALUES ($1,$2,$3,$4,$5) RETURNING user_id",
      [name, email, age, gender, city]
    );

    res.json({
      message: "User registered",
      user_id: newUser.rows[0].user_id,
    });
  } catch (err) {
    console.error("User error:", err);
    res.status(500).json({ message: "User creation failed" });
  }
});


app.get("/forms", async (req, res) => {
  try {
    const forms = await pool.query(
      "SELECT form_id, title FROM feedback.feedback_forms ORDER BY form_id"
    );
    res.json(forms.rows);
  } catch (err) {
    console.error("Forms error:", err);
    res.status(500).json({ message: "Error fetching forms" });
  }
});


app.get("/questions/:formId", async (req, res) => {
  const { formId } = req.params;

  try {
    const questions = await pool.query(
      "SELECT question_id, question_text FROM feedback.questions WHERE form_id=$1 ORDER BY question_id",
      [formId]
    );

    const form = await pool.query(
      "SELECT title FROM feedback.feedback_forms WHERE form_id=$1",
      [formId]
    );

    res.json({
      title: form.rows[0]?.title || "Feedback Form",
      questions: questions.rows,
    });
  } catch (err) {
    console.error("Questions error:", err);
    res.status(500).json({ message: "Error fetching questions" });
  }
});


app.post("/submit-feedback", async (req, res) => {
  const { user_id, form_id, responses } = req.body;

  if (!user_id || !form_id || !responses) {
    return res.status(400).json({ message: "Missing data" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const submission = await client.query(
      "INSERT INTO feedback.form_submissions (form_id,user_id) VALUES ($1,$2) RETURNING submission_id",
      [form_id, user_id]
    );
    const submissionId = submission.rows[0].submission_id;

    for (let r of responses) {
      await client.query(
        "INSERT INTO feedback.responses (submission_id,question_id,answer) VALUES ($1,$2,$3)",
        [submissionId, r.question_id, r.answer]
      );

      await client.query(
        "INSERT INTO feedback.ratings (submission_id,question_id,rating_value) VALUES ($1,$2,$3)",
        [submissionId, r.question_id, r.rating]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Submission error:", err);
    res.status(500).json({ message: "Feedback submission failed" });
  } finally {
    client.release();
  }
});

app.get("/feedback/analytics", async (req, res) => {
  try {
    const query = `
      SELECT 
        f.form_id,
        f.title,
        COUNT(s.submission_id) AS total_submissions,
        ROUND(AVG(r.rating_value)::numeric, 2) AS avg_rating
      FROM feedback.feedback_forms f
      LEFT JOIN feedback.form_submissions s ON f.form_id = s.form_id
      LEFT JOIN feedback.ratings r ON s.submission_id = r.submission_id
      GROUP BY f.form_id, f.title
      ORDER BY f.form_id;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});


app.get("/feedback/analytics/gender", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.gender,
        COUNT(s.submission_id) AS total_submissions,
        ROUND(AVG(r.rating_value)::numeric, 2) AS avg_rating
      FROM feedback.users u
      LEFT JOIN feedback.form_submissions s ON u.user_id = s.user_id
      LEFT JOIN feedback.ratings r ON s.submission_id = r.submission_id
      GROUP BY u.gender
      ORDER BY u.gender;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Gender analytics error:", err);
    res.status(500).json({ message: "Failed to fetch gender analytics" });
  }
});


app.get("/feedback/analytics/city", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.city,
        COUNT(s.submission_id) AS total_submissions,
        ROUND(AVG(r.rating_value)::numeric, 2) AS avg_rating
      FROM feedback.users u
      LEFT JOIN feedback.form_submissions s ON u.user_id = s.user_id
      LEFT JOIN feedback.ratings r ON s.submission_id = r.submission_id
      GROUP BY u.city
      ORDER BY u.city;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("City analytics error:", err);
    res.status(500).json({ message: "Failed to fetch city analytics" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});