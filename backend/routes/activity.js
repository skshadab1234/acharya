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

app.get("/getactivity", async (req, res) => {
  try {
    const { id } = req.query;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({
        status: true,
        message: "Please provide a valid activity id",
      });
    }

    // Query to fetch activity details
    const query = `SELECT * FROM activities WHERE id = $1`;
    const result = await pool.query(query, [parseInt(id)]);

    // Check if activity with the provided ID exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Activity not found",
      });
    }

    // Return activity details
    return res.json({ status: true, result: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/allactivities", async (req, res) => {
  const { page = 1, pageSize = 10, search = "" } = req.body;

  try {
    const offset = (page - 1) * pageSize;
    const searchQuery = `%${search}%`;

    // Query to fetch activities with pagination and search
    const query = `
        SELECT * FROM activities
        WHERE title ILIKE $1 OR description ILIKE $1 OR type ILIKE $1  OR short_description ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
    const activitiesResult = await pool.query(query, [
      searchQuery,
      pageSize,
      offset,
    ]);

    // Query to count total activities matching the search criteria
    const countQuery = `
        SELECT COUNT(*) FROM activities
        WHERE title ILIKE $1 OR description ILIKE $1 OR type ILIKE $1 OR short_description ILIKE $1
      `;
    const countResult = await pool.query(countQuery, [searchQuery]);
    const totalActivities = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalActivities / pageSize);

    res.json({
      activities: activitiesResult.rows,
      totalActivities,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error..." });
  }
});

app.delete("/deleteactivity", authenticate, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Activity ID is required" });
    }

    const result = await deleteActivityById(id);

    if (result.rowCount > 0) {
      console.log(`Deleted activity with ID: ${id}`);
      res.status(200).json({ message: "Activity deleted successfully" });
    } else {
      res.status(404).json({ error: "Activity not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function deleteActivityById(id) {
  const client = await pool.connect();
  try {
    const res = await client.query("DELETE FROM activities WHERE id = $1", [
      id,
    ]);
    return res;
  } finally {
    client.release();
  }
}

// ------------------MUlter
const imgActivity = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/activity");
  },
  filename: (req, file, callback) => {
    callback(null, `activity-${Date.now()}-${file.originalname}`);
  },
});

const uploadaactivity = multer({
  storage: imgActivity,
});

app.post("/addactivity", uploadaactivity.array("file"), async (req, res) => {
  try {
    const { title, short_description, description, type, id, typeupload } =
      req.body;
    let media_url, thumbnail_url;
    media_url = req.files?.[0]?.filename || null;
    thumbnail_url = req.files?.[1]?.filename || null;

    console.log(req.body);
    // Convert id to integer if present
    const activityId = id ? parseInt(id) : null;

    // Additional processing if needed
    // Update updated_at with timezone
    const updated_at = new Date().toISOString(); // This will format the date as 'YYYY-MM-DDTHH:MM:SS.MMMZ'

    // Update slug based on title
    const slug = title.toLowerCase().replace(/ /g, "-");

    // Perform database insertion or any other necessary operation to add/update the activity
    let query;
    let values;
    if (activityId) {
      // Retrieve existing media URLs from the database
      const existingMediaUrlsQuery = `
          SELECT media_url, thumbnail_url
          FROM activities
          WHERE id = $1
        `;
      const existingMediaUrlsResult = await pool.query(existingMediaUrlsQuery, [
        activityId,
      ]);
      const existingMediaUrls = existingMediaUrlsResult.rows[0];

      // Update existing activity
      query = `
          UPDATE activities
          SET title = $1, short_description = $2, description = $3, type = $4, media_url = $5, thumbnail_url = $6, updated_at = $7, slug = $8
          WHERE id = $9
        `;
      if (typeupload.includes("media")) {
        media_url = media_url || existingMediaUrls.media_url;
      } else {
        media_url = existingMediaUrls.media_url;
      }
      if (typeupload.includes("thumbnail")) {
        thumbnail_url = thumbnail_url || existingMediaUrls.thumbnail_url;
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
        activityId,
      ];

      // Delete old files from the "uploads/activity" directory if new files are uploaded
      if (
        media_url &&
        existingMediaUrls.media_url &&
        typeupload.includes("media")
      ) {
        fs.unlinkSync(`./uploads/activity/${existingMediaUrls.media_url}`);
      }
      if (
        thumbnail_url &&
        existingMediaUrls.thumbnail_url &&
        typeupload.includes("thumbnail")
      ) {
        fs.unlinkSync(`./uploads/activity/${existingMediaUrls.thumbnail_url}`);
      }
    } else {
      // Insert new activity
      query = `
          INSERT INTO activities (title, short_description, description, type, media_url, thumbnail_url, updated_at, slug)
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
      ];
    }

    await pool.query(query, values);

    res.status(201).json({ message: "Activity added/updated successfully" });
  } catch (error) {
    console.error("Error adding/updating activity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
