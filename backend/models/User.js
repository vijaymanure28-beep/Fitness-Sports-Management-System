const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        age: {
            type: Number,
            required: true
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },

        height: {
            type: Number,
            required: true
        },

        weight: {
            type: Number,
            required: true
        },

        fitnessGoal: {
            type: String,
            enum: ["Weight Loss", "Muscle Gain", "Fitness", "Sports Performance"],
            required: true
        },

        activityLevel: {
            type: String,
            enum: ["Low", "Moderate", "High"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);