const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const authenticate = require("../lib");
const multer = require("multer");
const fs = require("fs");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/allcourses", async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    visibility = "all",
  } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const searchQuery = `%${search}%`;

    let query, queryParams, countQuery, countQueryParams;

    if (visibility === "all") {
      query = `
          SELECT * FROM courses
          WHERE (title ILIKE $1 OR description ILIKE $1 )
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `;
      queryParams = [searchQuery, parseInt(pageSize), offset];

      countQuery = `
          SELECT COUNT(*) FROM courses
          WHERE title ILIKE $1 OR description ILIKE $1  
        `;
      countQueryParams = [searchQuery];
    } else {
      query = `
          SELECT * FROM courses
          WHERE (title ILIKE $1 OR description ILIKE $1) AND visibility = $4
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `;
      queryParams = [searchQuery, parseInt(pageSize), offset, visibility];

      countQuery = `
          SELECT COUNT(*) FROM courses
          WHERE (title ILIKE $1 OR description ILIKE $1) AND visibility = $2
        `;
      countQueryParams = [searchQuery, visibility];
    }

    const coursesResult = await pool.query(query, queryParams);
    const countResult = await pool.query(countQuery, countQueryParams);
    const totalcourses = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalcourses / parseInt(pageSize));

    res.json({
      courses: coursesResult.rows,
      totalcourses,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error..." });
  }
});

const imgActivity = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/course_thumbnail");
  },
  filename: (req, file, callback) => {
    callback(null, `course_thumbnail-${Date.now()}-${file.originalname}`);
  },
});

const uploadacourse_thumbnail = multer({
  storage: imgActivity,
});

app.post(
  "/addCourses",
  uploadacourse_thumbnail.single("course_thumbnail"),
  async (req, res) => {
    try {
      const { data } = req.body;
      const file = req.file;
      const parseData = JSON.parse(data);
      console.log(parseData, "dada");
      return;
      const {
        title,
        description,
        price,
        old_price = 0,
        duration = "",
        level = "",
        course_thumbnail,
        chapters,
        is_free = false,
        instructor = "By Shiv",
        visibility = false,
      } = req.body;
      const created_at = new Date().toISOString();
      const updated_at = new Date().toISOString();
      const slug = title.toLowerCase().replace(/ /g, "-");
      const query = ` 
    INSERT INTO courses (title, description, price, old_price, duration, level, course_thumbnail, is_free, instructor, visibility, created_at, updated_at, slug) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
    RETURNING *`;
      const values = [
        title,
        description,
        price,
        old_price,
        duration,
        level,
        course_thumbnail,
        is_free,
        instructor,
        visibility,
        created_at,
        updated_at,
        slug,
      ];
      const result = await pool.query(query, values);
      const courseId = result.rows[0].id;
      const chapterQuery = `
    INSERT INTO chapters (title, description, course_id, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
      const chapterValues = chapters.map((chapter) => [
        chapter.title,
        chapter.description,
        courseId,
        created_at,
        updated_at,
        chapter.slug,
      ]);
      const chapterResult = await pool.query(chapterQuery, chapterValues);
      const chapterIds = chapterResult.rows.map((chapter) => chapter.id);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: "Internal Error...." });
    }
  }
);
module.exports = app;
