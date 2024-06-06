const express = require("express");
const app = express();
const pool = require("../config");
const cors = require("cors");
const Razorpay = require("razorpay");

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get("/payment", async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: "rzp_test_3fG6M6oW2WxZfq",
      key_secret: "RkvrEpC8RUEITTbksQ8W17uC",
    });

    var options = {
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
    });
  } catch (error) {
    console.log(error);
  }
});
module.exports = app;
