
const express = require("express");
const mongoose = require("mongoose");
const Sport = require("../models/Sport");

const router = express.Router();

// Test sports route
router.get("/test", (req, res) => {
  res.send("Sports route is working!");
});

// Save sports activity
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      sportName,
      duration,
      caloriesBurned
    } = req.body;

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !sportName ||
      !duration ||
      Number(duration) <= 0 ||
      caloriesBurned === undefined ||
      Number(caloriesBurned) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid sports details."
      });
    }

    const sport = await Sport.create({
      userId,
      sportName,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned)
    });

    res.status(201).json({
      message: "Sports activity saved successfully!",
      sport
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get sports history for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID."
      });
    }

    const sports = await Sport.find({ userId })
      .sort({ createdAt: -1 });

    res.json(sports);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
