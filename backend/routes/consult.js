const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const authenticate = require("../lib");
const sendEmail = require("./nodemailer");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/consultation", authenticate, async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search, mode = null } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    let cleanedSearchTerm = search ? search.replace(/-/g, "") : null;

    let consultationsQuery = `
      SELECT * FROM consultation
      WHERE 1=1 
    `;
    let countQuery = `
      SELECT COUNT(*) FROM consultation
      WHERE 1=1
    `;
    const values = [];
    const countValues = [];

    // Append search conditions if search term is provided
    if (cleanedSearchTerm) {
      consultationsQuery += `
        AND (
          full_name ILIKE $${values.push(`%${cleanedSearchTerm}%`)} OR
          REPLACE(contact_number, '-', '') ILIKE $${values.push(
            `%${cleanedSearchTerm}%`
          )} OR
          payment_id ILIKE $${values.push(`%${cleanedSearchTerm}%`)} OR
          payment_status ILIKE $${values.push(`%${cleanedSearchTerm}%`)} OR
          payment_amount ILIKE $${values.push(`%${cleanedSearchTerm}%`)} OR
          email_address ILIKE $${values.push(`%${cleanedSearchTerm}%`)}
        )
      `;
      countQuery += `
        AND (
          full_name ILIKE $${countValues.push(`%${cleanedSearchTerm}%`)} OR
          REPLACE(contact_number, '-', '') ILIKE $${countValues.push(
            `%${cleanedSearchTerm}%`
          )} OR
          payment_id ILIKE $${countValues.push(`%${cleanedSearchTerm}%`)} OR 
          payment_status ILIKE $${countValues.push(`%${cleanedSearchTerm}%`)} OR
          payment_amount ILIKE $${countValues.push(`%${cleanedSearchTerm}%`)} OR
          email_address ILIKE $${countValues.push(`%${cleanedSearchTerm}%`)}
        )
      `;
    }

    if (mode === "today") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
      consultationsQuery += `
        AND preferred_date = $${values.push(today)}
      `;
      countQuery += `
        AND preferred_date = $${countValues.push(today)}
      `;
    } else if (mode === "attended") {
      consultationsQuery += `
        AND appointmentstatus = $${values.push(mode)}
      `;
      countQuery += `
        AND appointmentstatus = $${countValues.push(mode)}
      `;
    } else if (mode === "not_attended") {
      consultationsQuery += `
        AND appointmentstatus = $${values.push(mode)}
      `;
      countQuery += `
        AND appointmentstatus = $${countValues.push(mode)}
      `;
    } else if (mode === "cancelled") {
      consultationsQuery += `
        AND appointmentstatus = $${values.push(mode)}
      `;
      countQuery += `
        AND appointmentstatus = $${countValues.push(mode)}
      `;
    }

    // Order by preferred_date, preferred_time, created_at
    consultationsQuery += `
      ORDER BY 
          CASE
              WHEN preferred_date IS NULL THEN 1
              ELSE 0
          END,
          preferred_date ASC,
          CASE
              WHEN preferred_time IS NULL THEN 1
              ELSE 0
          END,
          preferred_time ASC,
          created_at DESC
      LIMIT $${values.push(parseInt(pageSize))} OFFSET $${values.push(offset)}
    `;

    const [consultations, totalCount] = await Promise.all([
      pool.query(consultationsQuery, values),
      pool.query(countQuery, countValues),
    ]);

    console.log(consultationsQuery, values);
    res.json({
      data: consultations.rows,
      total: parseInt(totalCount.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error...." });
  }
});

app.put("/update-consultation/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentstatus, additionaltext } = req.body;
    const appointmentEndedByAdminTime = new Date(); // Get current timestamp with timezone

    // Update the consultation in the database
    const updateQuery = `
      UPDATE consultation
      SET appointmentstatus = $1,
          additionaltext = $2,
          appointmentendedbyadmintime = $3
      WHERE id = $4
      RETURNING *
    `;

    const { rows } = await pool.query(updateQuery, [
      appointmentstatus,
      additionaltext,
      appointmentEndedByAdminTime,
      id,
    ]);

    const updatedConsultation = rows[0];

    res.status(200).json({
      message: "Consultation updated successfully",
      consultation: updatedConsultation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error...." });
  }
});

app.post("/addNewConsultRecord", async (req, res) => {
  try {
    const {
      preferred_date,
      preferred_time,
      appointment_till_date,
      appointment_till_time,
      insert,
    } = req.body;

    // res.status(200).json({ availableSlots });
    const padZero = (num) => (num < 10 ? `0${num}` : num);

    // Array to store time slots
    const timeSlots = [];

    // Loop through each hour from 11:00 AM to 11:00 PM, skipping 17, 18, and 19
    for (let hour = 11; hour <= 23; hour++) {
      // Skip hours 17, 18, and 19
      if (
        hour === 16 ||
        hour === 23 ||
        hour === 17 ||
        hour === 18 ||
        hour === 19
      ) {
        continue;
      }

      // Generate time slot string (HH:00 format)
      const timeSlot = `${padZero(hour)}:00:00`;

      // Push time slot to array
      timeSlots.push(timeSlot);
    }

    // Calculate appointment duration in minutes
    const [startHour, startMinute] = preferred_time.split(":").map(Number);
    const [endHour, endMinute] = appointment_till_time.split(":").map(Number);

    // Convert start time to minutes
    const startTimeInMinutes = startHour * 60 + startMinute;

    // Convert end time to minutes
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Calculate appointment duration in minutes
    const appointmentDuration = endTimeInMinutes - startTimeInMinutes;

    // Check if appointment is within allowed time slots
    const isWithinAllowedTimeSlot =
      (startHour >= 11 && endHour < 16) || (startHour >= 20 && endHour < 23);

    const slotQueryAvailable = `
      SELECT DISTINCT preferred_time
      FROM consultation
      WHERE preferred_date = $1
    `;
    const slotValuesavailable = [preferred_date];
    const slotResultAvailable = await pool.query(
      slotQueryAvailable,
      slotValuesavailable
    );

    // Extract the existing preferred times
    const existingPreferredTimes = slotResultAvailable.rows.map(
      (row) => row.preferred_time.split("+")[0]
    );

    // Filter out existing preferred times from all time slots
    const availableTimeSlots = timeSlots.filter(
      (timeSlot) => !existingPreferredTimes.includes(timeSlot)
    );

    if (!isWithinAllowedTimeSlot) {
      return res.status(400).json({
        error:
          "Appointment time must be between 11:00 AM to 4:00 PM and 8:00 PM to 11:00 PM.",
        availableTimeSlots,
        request: req.body,
      });
    }

    // Check if appointment duration exceeds 1 hour
    if (appointmentDuration > 60) {
      return res.status(400).json({
        error: "Appointment duration cannot exceed 1 hour.",
        availableTimeSlots,
        request: req.body,
      });
    }

    // Check if slot is available
    const slotQuery = `
      SELECT COUNT(*) AS slot_count
      FROM consultation
      WHERE (
        (preferred_date, preferred_time) <= ($1, $4)
        AND (appointment_till_date, appointment_till_time) >= ($2, $3)
      )
      OR (
        (preferred_date, preferred_time) >= ($1, $4)
        AND (preferred_date, preferred_time) <= ($2, $3)
      )
      OR (
        (appointment_till_date, appointment_till_time) >= ($1, $4)
        AND (appointment_till_date, appointment_till_time) <= ($2, $3)
      )
    `;

    const slotValues = [
      preferred_date,
      appointment_till_date,
      preferred_time,
      appointment_till_time,
    ];
    const slotResult = await pool.query(slotQuery, slotValues);

    if (slotResult.rows[0].slot_count > 0) {
      return res.status(400).json({
        error: "Slot not available.",
        availableTimeSlots,
        request: req.body,
      });
    }

    // Insert new consultation record
    if (insert) {
      const {
        full_name = "",
        age = 0,
        contact_number = 0,
        alternate_mobile_number = 0,
        email_address = "",
        country = "",
        user_state = "",
        city = "",
        diet_preference = "",
        zodiac_sign = "",
        relationship_status = "",
        medicine_consumption = "",
        disorders_or_disease = "",
        purpose_of_yoga = "",
        personal_notes = "",
        payment_mode = "Online",
        payment_status = "Unpaid",
        payment_amount = "",
        payment_id = "",
        payment_obj = {},
      } = req.body;

      const insertQuery = `
      INSERT INTO consultation (
        full_name,
        age,
        contact_number,
        alternate_mobile_number,
        email_address,
        country,
        user_state,
        city,
        diet_preference,
        zodiac_sign,
        relationship_status,
        medicine_consumption,
        disorders_or_disease,
        purpose_of_yoga,
        personal_notes,
        preferred_date,
        preferred_time,
        appointment_till_date,
        appointment_till_time,
        appointmentstatus,
        payment_mode, payment_status, payment_amount, payment_id, payment_obj
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'not_attended', $20 , $21, $22, $23, $24)
      RETURNING *
      `;

      const { rows } = await pool.query(insertQuery, [
        full_name,
        age,
        contact_number,
        alternate_mobile_number,
        email_address,
        country,
        user_state,
        city,
        diet_preference,
        zodiac_sign,
        relationship_status,
        medicine_consumption,
        disorders_or_disease,
        purpose_of_yoga,
        personal_notes,
        preferred_date,
        preferred_time,
        appointment_till_date,
        appointment_till_time,
        payment_mode,
        payment_status,
        payment_amount,
        payment_id,
        JSON.stringify(payment_obj),
      ]);

      await sendAppointmentConfirmationEmail(req.body);
    }

    res
      .status(200)
      .json({ message: "Consultation record added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error..." });
  }
});

const sendAppointmentConfirmationEmail = async (bookingDetails) => {
  const {
    preferred_date,
    preferred_time,
    appointment_till_time,
    full_name = "N/A",
    email_address,
    city = "N/A",
    user_state = "N/A",
    country = "N/A",
    diet_preference,
    relationship_status,
    purpose_of_yoga,
    personal_notes,
  } = bookingDetails;

  // Convert date to "Day, DD Month, YYYY" format
  const dateObj = new Date(preferred_date);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = dateObj.toLocaleDateString("en-US", options);

  // Convert time to 12-hour format
  const to12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12; // Convert '0' hour to '12'
    return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const formattedPreferredTime = to12HourFormat(preferred_time);
  const formattedAppointmentTillTime = to12HourFormat(appointment_till_time);

  let subject = `Yoga Consultation Appointment for ${full_name}`;

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Yoga Consultation Appointment </title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .header h1 {
          margin: 0;
          color: #333333;
        }
        .content {
          padding: 20px 0;
        }
        .content h2 {
          color: #333333;
        }
        .content p {
          color: #666666;
          line-height: 1.6;
        }
        .footer {
          text-align: center;
          padding: 10px 0;
          border-top: 1px solid #e0e0e0;
          margin-top: 20px;
        }
        .footer p {
          color: #999999;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4caf50;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Consultation Appointment</h1>
        </div>
        <div class="content">
          <h2>Hello ${full_name},</h2>
          <p>Thank you for booking your consultation session with us! We are delighted to confirm your appointment as follows:</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${formattedPreferredTime} to ${formattedAppointmentTillTime}</p>
          <p><strong>Location:</strong> ${city}, ${user_state}, ${country}</p>
          ${
            diet_preference
              ? `<p><strong>Diet Preference:</strong> ${diet_preference}</p>`
              : ""
          }
          ${
            relationship_status
              ? `<p><strong>Relationship Status:</strong> ${relationship_status}</p>`
              : ""
          }
          ${
            purpose_of_yoga
              ? `<p><strong>Purpose of Yoga:</strong> ${purpose_of_yoga}</p>`
              : ""
          }
          ${
            personal_notes
              ? `<p><strong>Personal Notes:</strong> ${personal_notes}</p>`
              : ""
          }
          <p>If you have any questions or need to reschedule, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing us for your yoga journey!</p>
          <p>&copy; ${new Date().getFullYear()} Acharya Shiv. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (email_address) {
    await sendEmail(email_address, subject, htmlContent);
  }
};

app.get("/consultstats", async (req, res) => {
  try {
    // SQL queries
    const statsQuery = `
      SELECT 
        appointmentstatus, 
        COUNT(*) as count
      FROM consultation
      GROUP BY appointmentstatus
    `;

    const totalConsultsQuery = `
      SELECT COUNT(*) as total_appointment FROM consultation
    `;

    const todayConsultsQuery = `
      SELECT COUNT(*) as today_appointments FROM consultation
      WHERE CAST(preferred_date AS DATE) = CURRENT_DATE
    `;

    const totalBlogsQuery = `
      SELECT COUNT(*) as total_blogs FROM blogs
    `;

    const totalActivitiesQuery = `
      SELECT COUNT(*) as total_activities FROM activities
    `;

    // Execute the queries
    const [
      statusResult,
      totalConsultsResult,
      todayResult,
      totalBlogsResult,
      totalActivitiesResult,
    ] = await Promise.all([
      pool.query(statsQuery),
      pool.query(totalConsultsQuery),
      pool.query(todayConsultsQuery),
      pool.query(totalBlogsQuery),
      pool.query(totalActivitiesQuery),
    ]);

    // Convert the status result to an object with status as the key and count as the value
    const statusCounts = statusResult.rows.reduce((acc, row) => {
      acc[row.appointmentstatus] = parseInt(row.count, 10);
      return acc;
    }, {});

    // Get the total appointment count
    const totalAppointments = parseInt(
      totalConsultsResult.rows[0].total_appointment,
      10
    );

    // Get today's appointments count
    const todayAppointments = parseInt(
      todayResult.rows[0].today_appointments,
      10
    );

    // Get the total blogs count
    const totalBlogs = parseInt(totalBlogsResult.rows[0].total_blogs, 10);

    // Get the total activities count
    const totalActivities = parseInt(
      totalActivitiesResult.rows[0].total_activities,
      10
    );

    // Combine the results into the response object
    const stats = {
      ...statusCounts,
      total_appointment: totalAppointments,
      today_appointments: todayAppointments,
      total_blogs: totalBlogs,
      total_activities: totalActivities,
    };

    res.status(200).json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error..." });
  }
});

app.get("/monthlystats", async (req, res) => {
  try {
    const monthlyStatsQuery = `
      SELECT 
        EXTRACT(YEAR FROM created_at) as year,
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) FILTER (WHERE appointmentstatus = 'not_attended') as not_attended,
        COUNT(*) FILTER (WHERE appointmentstatus = 'attended') as attended,
        COUNT(*) FILTER (WHERE appointmentstatus = 'cancelled') as cancelled
      FROM consultation
      GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY year, month;
    `;

    const monthlyStatsResult = await pool.query(monthlyStatsQuery);

    // Generate an array of all months
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    // Extract unique years from the result
    const years = [...new Set(monthlyStatsResult.rows.map((row) => row.year))];

    // Create an object to store monthly stats for each year
    const yearlyStats = {};

    years.forEach((year) => {
      yearlyStats[year] = {};

      allMonths.forEach((month) => {
        const monthRecord = monthlyStatsResult.rows.find(
          (row) => parseInt(row.year) == year && parseInt(row.month) == month
        );
        const monthName = new Date(year, month - 1, 1).toLocaleString(
          "default",
          { month: "short" }
        );
        yearlyStats[year][monthName] = {
          not_attended: monthRecord ? parseInt(monthRecord.not_attended) : 0,
          attended: monthRecord ? parseInt(monthRecord.attended) : 0,
          cancelled: monthRecord ? parseInt(monthRecord.cancelled) : 0,
        };
      });
    });

    res.status(200).json({ yearlyStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error..." });
  }
});

module.exports = app;
