const express = require("express");
const mongoose = require("mongoose");
const Workout = require("../models/Workout");

const router = express.Router();

// Test workout route
router.get("/test", (req, res) => {
  res.send("Workout route is working!");
});

// Save a workout
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      exercise,
      muscleGroup,
      sets,
      reps,
      weight
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !exercise ||
      !muscleGroup ||
      !sets ||
      !reps ||
      weight === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all workout details."
      });
    }

    const workout = await Workout.create({
      userId,
      exercise,
      muscleGroup,
      sets,
      reps,
      weight
    });

    res.status(201).json({
      message: "Workout saved successfully!",
      workout
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get workouts for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID."
      });
    }

    const workouts = await Workout.find({ userId })
      .sort({ createdAt: -1 });

    res.json(workouts);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
