const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

//@route POST /api/subscribe
//@des handle newsletter subscription
//@access Public
router.post("/", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    //check if the email already subscribed
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      return res.status(400).json({ message: "Email already subscribed" });
    }
    //create a new subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
