const express = require("express");
const mongoose = require("mongoose");
const Diet = require("../models/Diet");

const router = express.Router();

// Test diet route
router.get("/test", (req, res) => {
  res.send("Diet route is working!");
});

// Save food entry
router.post("/", async (req, res) => {
  try {
    const { userId, foodName, calories, protein } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !foodName ||
      calories === undefined ||
      protein === undefined ||
      Number(calories) < 0 ||
      Number(protein) < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid food details."
      });
    }

    const diet = await Diet.create({
      userId,
      foodName,
      calories: Number(calories),
      protein: Number(protein)
    });

    res.status(201).json({
      message: "Food entry saved successfully!",
      diet
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get food entries for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID."
      });
    }

    const diets = await Diet.find({ userId })
      .sort({ createdAt: -1 });

    res.json(diets);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;