const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const path = require("path");

// Routes
const admin = require("./routes/admin");
const consult = require("./routes/consult");
const razorpay = require("./routes/razorpay");
const activity = require("./routes/activity");
const blog = require("./routes/blog");
const customer = require("./routes/customer");
const courses = require("./routes/courses");



app.use(express.json()); // Middleware para parsear el body
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


require("dotenv").config();

//ALl Routes
app.use("/api", admin);
app.use("/api", consult);
app.use("/api", razorpay);
app.use("/api", activity);
app.use("/api", blog);
app.use("/api", customer);
app.use("/api", courses);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
