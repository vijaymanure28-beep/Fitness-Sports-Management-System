
const express = require("express");

const router = express.Router();

// Generate AI fitness recommendations
router.post("/recommend", async (req, res) => {
    try {
        const response = await fetch(
            "http://127.0.0.1:5001/recommend",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req.body)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: "Unable to connect to Python AI server.",
            error: error.message
        });
    }
});

module.exports = router;
