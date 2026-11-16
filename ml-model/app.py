
from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return "AI Fitness Recommendation API is running!"


@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "Please provide user details."
        }), 400

    try:
        age = int(data.get("age", 20))
        weight = float(data.get("weight", 52))
        height = float(data.get("height", 170))
        goal = data.get("fitnessGoal", "Muscle Gain")
        activity = data.get("activityLevel", "Moderate")

        # Validate user details
        if age <= 0 or age > 120 or weight <= 0 or height <= 0:
            return jsonify({
                "success": False,
                "message": "Please enter valid age, height and weight."
            }), 400

        if goal not in [
            "Muscle Gain",
            "Weight Loss",
            "Fitness",
            "Sports Performance"
        ]:
            return jsonify({
                "success": False,
                "message": "Invalid fitness goal."
            }), 400

        if activity not in ["Low", "Moderate", "High"]:
            return jsonify({
                "success": False,
                "message": "Invalid activity level."
            }), 400

        # BMI calculation
        bmi = weight / ((height / 100) ** 2)

        if bmi < 18.5:
            bmi_status = "Below the standard adult BMI range"
        elif bmi < 25:
            bmi_status = "Within the standard adult BMI range"
        elif bmi < 30:
            bmi_status = "Above the standard adult BMI range"
        else:
            bmi_status = "In the higher adult BMI range"

        # Workout recommendations
        if goal == "Muscle Gain":
            workout = (
                "Follow a strength training program including "
                "squats, bench press, rows and shoulder exercises. "
                "Gradually increase training resistance."
            )

            diet = (
                "Include protein-rich foods such as eggs, milk, "
                "paneer, pulses and chicken. Eat balanced meals "
                "with sufficient carbohydrates and healthy fats."
            )

        elif goal == "Weight Loss":
            workout = (
                "Combine moderate cardio such as walking, cycling "
                "or jogging with strength training. Increase activity "
                "gradually and allow recovery time."
            )

            diet = (
                "Choose balanced meals with vegetables, fruits, "
                "whole grains and adequate protein. Monitor portion "
                "sizes and avoid extreme dieting."
            )

        elif goal == "Sports Performance":
            workout = (
                "Include sport-specific drills, strength training, "
                "speed practice, flexibility and endurance exercises."
            )

            diet = (
                "Include carbohydrates for energy, protein for "
                "muscle recovery, fruits and vegetables. Maintain "
                "adequate hydration."
            )

        else:
            workout = (
                "Follow a balanced fitness routine with full-body "
                "strength training, walking, cardio and flexibility "
                "exercises."
            )

            diet = (
                "Follow a balanced diet containing fruits, vegetables, "
                "whole grains, protein-rich foods and healthy fats."
            )

        # Activity-level adjustments
        if activity == "Low":
            workout += (
                " Start with light exercises and short sessions. "
                "Gradually increase duration and intensity."
            )

        elif activity == "Moderate":
            workout += (
                " Maintain a consistent weekly routine and include "
                "rest and recovery days."
            )

        elif activity == "High":
            workout += (
                " Balance intense sessions with sufficient recovery, "
                "sleep and rest days."
            )

        # Hydration recommendation
        if activity == "High":
            hydration = (
                "Pay extra attention to fluid replacement, especially "
                "during and after intense exercise."
            )
        else:
            hydration = (
                "Drink water regularly throughout the day and "
                "during physical activity."
            )

        # General recovery recommendation
        recovery = (
            "Aim for consistent sleep, proper recovery and gradual "
            "progression in your exercise routine."
        )

        # Final response
        return jsonify({
            "success": True,
            "age": age,
            "height": height,
            "weight": weight,
            "bmi": round(bmi, 2),
            "bmiStatus": bmi_status,
            "fitnessGoal": goal,
            "activityLevel": activity,
            "workoutRecommendation": workout,
            "dietRecommendation": diet,
            "hydrationRecommendation": hydration,
            "recoveryRecommendation": recovery,
            "message": "Personalized recommendations generated successfully!"
        })

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Please enter valid numeric details."
        }), 400

    except Exception as error:
        print("AI Recommendation Error:", error)

        return jsonify({
            "success": False,
            "message": "An unexpected error occurred."
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
