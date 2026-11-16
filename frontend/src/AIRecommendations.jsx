
import { useState } from "react";

function AIRecommendations() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("Muscle Gain");
  const [activityLevel, setActivityLevel] = useState("Moderate");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecommendations = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!age || !weight || !height) {
      setError("Please enter your age, weight and height.");
      return;
    }

    if (
      Number(age) <= 0 ||
      Number(weight) <= 0 ||
      Number(height) <= 0
    ) {
      setError("Please enter valid positive numbers.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            age: Number(age),
            weight: Number(weight),
            height: Number(height),
            fitnessGoal,
            activityLevel
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Unable to get recommendations.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Could not connect to the AI server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-section ai-recommendations">
      <h2>🤖 AI Fitness Recommendations</h2>
      <p>
        Enter your fitness details to receive personalized
        workout and nutrition suggestions.
      </p>

      <form onSubmit={getRecommendations} className="ai-form">
        <input
          type="number"
          placeholder="Age"
          min="1"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          min="1"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Height (cm)"
          min="1"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
        />

        <select
          value={fitnessGoal}
          onChange={(e) => setFitnessGoal(e.target.value)}
        >
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Fitness">General Fitness</option>
          <option value="Sports Performance">Sports Performance</option>
        </select>

        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
        >
          <option value="Low">Low Activity</option>
          <option value="Moderate">Moderate Activity</option>
          <option value="High">High Activity</option>
        </select>

        <button type="submit" className="main-btn" disabled={loading}>
          {loading ? "Generating..." : "Generate AI Recommendations"}
        </button>
      </form>

      {error && <p className="ai-error">{error}</p>}

      {result && (
        <div className="ai-result">
          <h3>Your AI Fitness Results</h3>

          <div className="ai-result-card">
            <span>BMI</span>
            <strong>{result.bmi}</strong>
          </div>

          <div className="ai-result-card">
            <span>Fitness Goal</span>
            <strong>{result.fitnessGoal}</strong>
          </div>

          <div className="ai-result-card">
            <span>Workout Recommendation</span>
            <p>{result.workoutRecommendation}</p>
          </div>

          <div className="ai-result-card">
            <span>Diet Recommendation</span>
            <p>{result.dietRecommendation}</p>
          </div>

          <p className="ai-success">{result.message}</p>
          <p className="ai-note">
            These are general suggestions, not a medical diagnosis
            or a substitute for professional nutrition advice.
          </p>
        </div>
      )}
    </section>
  );
}

export default AIRecommendations;
