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

app.get("/getBlogs", async (req, res) => {
  try {
    const { id, visibility = "all" } = req.query;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({
        status: true,
        message: "Please provide a valid blogs id",
      });
    }

    let query, queryParams;

    if (visibility === "all") {
      query = `SELECT * FROM blogs WHERE id = $1`;
      queryParams = [parseInt(id)];
    } else {
      query = `SELECT * FROM blogs WHERE id = $1 AND visibility = $2`;
      queryParams = [parseInt(id), visibility];
    }

    // Query to fetch blogs details
    const result = await pool.query(query, queryParams);

    // Check if blogs with the provided ID exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "blogs not found",
      });
    }

    // Return blogs details
    return res.json({ status: true, result: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/allblogs", async (req, res) => {
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
        SELECT * FROM blogs
        WHERE (title ILIKE $1 OR description ILIKE $1 OR type ILIKE $1 OR short_description ILIKE $1 OR visibility ILIKE $1 )
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      queryParams = [searchQuery, parseInt(pageSize), offset];

      countQuery = `
        SELECT COUNT(*) FROM blogs
        WHERE title ILIKE $1 OR description ILIKE $1 OR type ILIKE $1 OR short_description ILIKE $1 OR visibility ILIKE $1 
      `;
      countQueryParams = [searchQuery];
    } else {
      query = `
        SELECT * FROM blogs
        WHERE (title ILIKE $1 OR description ILIKE $1 OR type ILIKE $1 OR short_description ILIKE $1 OR visibility ILIKE $1 ) AND visibility = $4
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      queryParams = [searchQuery, parseInt(pageSize), offset, visibility];

      countQuery = `
        SELECT COUNT(*) FROM blogs
        WHERE (title ILIKE $1 OR description ILIKE $1 OR type ILIKE $1 OR short_description ILIKE $1 OR visibility ILIKE $1 ) AND visibility = $2
      `;
      countQueryParams = [searchQuery, visibility];
    }

    const blogsResult = await pool.query(query, queryParams);
    const countResult = await pool.query(countQuery, countQueryParams);
    const totalBlogs = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalBlogs / parseInt(pageSize));

    res.json({
      blogs: blogsResult.rows,
      totalBlogs,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error..." });
  }
});

app.delete("/deleteBlogs", authenticate, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "deleteBlogs ID is required" });
    }

    const result = await deleteBlogId(id);

    if (result.rowCount > 0) {
      console.log(`Deleted deleteBlogs with ID: ${id}`);
      res.status(200).json({ message: "Blog deleted successfully" });
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function deleteBlogId(id) {
  const client = await pool.connect();
  try {
    const res = await client.query("DELETE FROM blogs WHERE id = $1", [id]);
    return res;
  } finally {
    client.release();
  }
}

// ------------------MUlter
const imgActivity = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/blogs");
  },
  filename: (req, file, callback) => {
    callback(null, `blogs-${Date.now()}-${file.originalname}`);
  },
});

const uploadablogs = multer({
  storage: imgActivity,
});

app.post("/addblogs", uploadablogs.array("file"), async (req, res) => {
  try {
    const {
      title,
      short_description,
      description,
      type,
      id,
      visibility,
      tags,
      typeupload,
    } = req.body;
    let media_url, thumbnail_url;
    media_url = null;
    thumbnail_url = null;

    // Check for 'remove' in typeupload and set media_url and thumbnail_url accordingly
    if (typeupload.includes("media")) {
      if (typeupload.includes("remove")) {
        media_url = null;
      } else {
        media_url = req.files?.[0]?.filename || null;
      }
    }

    if (typeupload.includes("thumbnail")) {
      if (media_url && !typeupload.includes("remove")) {
        thumbnail_url = req.files?.[1]?.filename || null;
      } else if (typeupload.includes("remove")) {
        thumbnail_url = null;
      } else {
        thumbnail_url = req.files?.[0]?.filename || null;
      }
    }

    // Convert id to integer if present
    const blogsId = id ? parseInt(id) : null;

    // Additional processing if needed
    // Update updated_at with timezone
    const updated_at = new Date().toISOString(); // This will format the date as 'YYYY-MM-DDTHH:MM:SS.MMMZ'

    // Update slug based on title
    const slug = title.toLowerCase().replace(/ /g, "-");

    // Perform database insertion or any other necessary operation to add/update the blogs
    let query;
    let values;
    if (blogsId) {
      // Retrieve existing media URLs from the database
      const existingMediaUrlsQuery = `
          SELECT media_url, thumbnail_url
          FROM blogs
          WHERE id = $1
        `;
      const existingMediaUrlsResult = await pool.query(existingMediaUrlsQuery, [
        blogsId,
      ]);
      const existingMediaUrls = existingMediaUrlsResult.rows[0];

      // Update existing blogs
      query = `
          UPDATE blogs
          SET title = $1, short_description = $2, description = $3, type = $4, media_url = $5, thumbnail_url = $6, updated_at = $7, slug = $8, visibility = $10, keywords = $11
          WHERE id = $9
        `;

      if (typeupload.includes("media")) {
        media_url = media_url;
      } else {
        media_url = existingMediaUrls.media_url;
      }
      if (typeupload.includes("thumbnail")) {
        thumbnail_url = thumbnail_url;
      } else {
        thumbnail_url = existingMediaUrls.thumbnail_url;
      }
      values = [
        title,
        short_description,
        description,
        type,
        media_url,
        thumbnail_url,
        updated_at,
        slug,
        blogsId,
        visibility,
        tags,
      ];

      // Delete old files from the "uploads/blogs" directory if new files are uploaded
      if (
        media_url &&
        existingMediaUrls.media_url &&
        typeupload.includes("media")
      ) {
        const mediaFilePath = `./uploads/blogs/${existingMediaUrls.media_url}`;
        if (fs.existsSync(mediaFilePath)) {
          fs.unlinkSync(mediaFilePath);
        } else {
          console.log(`Media file does not exist: ${mediaFilePath}`);
        }
      }

      if (
        thumbnail_url &&
        existingMediaUrls.thumbnail_url &&
        typeupload.includes("thumbnail")
      ) {
        const thumbnailFilePath = `./uploads/blogs/${existingMediaUrls.thumbnail_url}`;
        if (fs.existsSync(thumbnailFilePath)) {
          fs.unlinkSync(thumbnailFilePath);
        } else {
          console.log(`Thumbnail file does not exist: ${thumbnailFilePath}`);
        }
      }
    } else {
      // Insert new blogs
      query = `
          INSERT INTO blogs (title, short_description, description, type, media_url, thumbnail_url, updated_at, slug, visibility, keywords)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;
      values = [
        title,
        short_description,
        description,
        type,
        media_url,
        thumbnail_url,
        updated_at,
        slug,
        visibility,
        tags,
      ];
    }

    await pool.query(query, values);

    res.status(201).json({ message: "Blog added/updated successfully" });
  } catch (error) {
    console.error("Error adding/updating blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
