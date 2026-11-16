import { useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";
const AI_API = `${API}/ai`;

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  const [loginMessage, setLoginMessage] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  // Workout tracking
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("Chest");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [workoutWeight, setWorkoutWeight] = useState("");
  const [workoutMessage, setWorkoutMessage] = useState("");
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  // Diet tracking
  const [meals, setMeals] = useState([]);
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [dietMessage, setDietMessage] = useState("");
  const [loadingMeals, setLoadingMeals] = useState(false);

  // Sports management
  const [sports, setSports] = useState([]);
  const [sportName, setSportName] = useState("Cricket");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [sportMessage, setSportMessage] = useState("");
  const [loadingSports, setLoadingSports] = useState(false);

  // AI recommendation inputs and results
  const [aiAge, setAiAge] = useState("");
  const [aiHeight, setAiHeight] = useState("");
  const [aiWeight, setAiWeight] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("Muscle Gain");
  const [activityLevel, setActivityLevel] = useState("Moderate");
  const [aiResult, setAiResult] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  // Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage("Registering...");

    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          gender: "Male",
          fitnessGoal: "Muscle Gain",
          activityLevel: "Moderate"
        })
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterMessage("Registration successful! Please log in.");
        setShowRegister(false);
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setHeight("");
        setWeight("");
      } else {
        setRegisterMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      setRegisterMessage("Cannot connect to backend server.");
    }
  };

  // Load workouts
  const loadWorkouts = async (id) => {
    setLoadingWorkouts(true);

    try {
      const response = await fetch(`${API}/workouts/${id}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setWorkouts(data);
      } else {
        setWorkoutMessage(data.message || "Could not load workouts.");
      }
    } catch (error) {
      console.error(error);
      setWorkoutMessage("Unable to load workout history.");
    } finally {
      setLoadingWorkouts(false);
    }
  };

  // Load diet history
  const loadMeals = async (id) => {
    setLoadingMeals(true);

    try {
      const response = await fetch(`${API}/diets/${id}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setMeals(data);
      } else {
        setDietMessage(data.message || "Could not load diet history.");
      }
    } catch (error) {
      console.error(error);
      setDietMessage("Unable to load diet history.");
    } finally {
      setLoadingMeals(false);
    }
  };

  // Load sports history
  const loadSports = async (id) => {
    setLoadingSports(true);

    try {
      const response = await fetch(`${API}/sports/${id}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setSports(data);
      } else {
        setSportMessage(data.message || "Could not load sports history.");
      }
    } catch (error) {
      console.error(error);
      setSportMessage("Unable to load sports history.");
    } finally {
      setLoadingSports(false);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("Logging in...");

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.userId) {
          setLoginMessage("Login response is missing the user ID.");
          return;
        }

        setUserId(data.userId);
        setUserName(data.name || email.split("@")[0]);
        setLoginMessage("");
        setShowDashboard(true);

        await Promise.all([
          loadWorkouts(data.userId),
          loadMeals(data.userId),
          loadSports(data.userId)
        ]);
      } else {
        setLoginMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      setLoginMessage("Cannot connect to backend server.");
    }
  };

  // Save workout
  const addWorkout = async (e) => {
    e.preventDefault();

    if (
      !userId ||
      !exercise.trim() ||
      !muscleGroup ||
      sets === "" ||
      reps === "" ||
      workoutWeight === "" ||
      Number(sets) < 1 ||
      Number(reps) < 1 ||
      Number(workoutWeight) < 0
    ) {
      setWorkoutMessage("Please enter valid workout details.");
      return;
    }

    setWorkoutMessage("Saving workout...");

    try {
      const response = await fetch(`${API}/workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          exercise: exercise.trim(),
          muscleGroup,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(workoutWeight)
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.workout) {
          setWorkouts((previous) => [data.workout, ...previous]);
        } else {
          await loadWorkouts(userId);
        }

        setExercise("");
        setSets("");
        setReps("");
        setWorkoutWeight("");
        setWorkoutMessage("Workout saved successfully!");
      } else {
        setWorkoutMessage(data.message || "Could not save workout.");
      }
    } catch (error) {
      console.error(error);
      setWorkoutMessage("Cannot connect to backend server.");
    }
  };

  // Save food
  const addMeal = async (e) => {
    e.preventDefault();

    if (
      !userId ||
      !food.trim() ||
      calories === "" ||
      protein === "" ||
      Number(calories) < 0 ||
      Number(protein) < 0
    ) {
      setDietMessage("Please enter valid food details.");
      return;
    }

    setDietMessage("Saving food...");

    try {
      const response = await fetch(`${API}/diets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          foodName: food.trim(),
          calories: Number(calories),
          protein: Number(protein)
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.diet) {
          setMeals((previous) => [data.diet, ...previous]);
        } else {
          await loadMeals(userId);
        }

        setFood("");
        setCalories("");
        setProtein("");
        setDietMessage("Food saved successfully!");
      } else {
        setDietMessage(data.message || "Could not save food.");
      }
    } catch (error) {
      console.error(error);
      setDietMessage("Cannot connect to backend server.");
    }
  };

  // Save sports activity
  const addSport = async (e) => {
    e.preventDefault();

    if (
      !userId ||
      !sportName ||
      duration === "" ||
      caloriesBurned === "" ||
      Number(duration) <= 0 ||
      Number(caloriesBurned) < 0
    ) {
      setSportMessage("Please enter valid sports details.");
      return;
    }

    setSportMessage("Saving sports activity...");

    try {
      const response = await fetch(`${API}/sports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sportName,
          duration: Number(duration),
          caloriesBurned: Number(caloriesBurned)
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.sport) {
          setSports((previous) => [data.sport, ...previous]);
        } else {
          await loadSports(userId);
        }

        setDuration("");
        setCaloriesBurned("");
        setSportMessage("Sports activity saved successfully!");
      } else {
        setSportMessage(data.message || "Could not save sports activity.");
      }
    } catch (error) {
      console.error(error);
      setSportMessage("Cannot connect to backend server.");
    }
  };

  // Generate AI fitness recommendations
  const getAIRecommendations = async (e) => {
    e.preventDefault();

    if (
      aiAge === "" ||
      aiHeight === "" ||
      aiWeight === "" ||
      Number(aiAge) <= 0 ||
      Number(aiHeight) <= 0 ||
      Number(aiWeight) <= 0
    ) {
      setAiMessage("Please enter a valid age, height and weight.");
      setAiResult(null);
      return;
    }

    setLoadingAI(true);
    setAiMessage("Generating personalized recommendations...");
    setAiResult(null);

    try {
      const response = await fetch(`${AI_API}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(aiAge),
          height: Number(aiHeight),
          weight: Number(aiWeight),
          fitnessGoal,
          activityLevel
        })
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Could not generate recommendations."
        );
      }

      setAiResult(data);
      setAiMessage(
        data.message || "Recommendations generated successfully!"
      );
    } catch (error) {
      console.error("AI recommendation error:", error);
      setAiMessage(
        error.message ||
        "Cannot connect to the AI service. Make sure the Python server is running on port 5001."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // Dashboard totals
  const totalCalories = meals.reduce(
    (sum, item) => sum + Number(item.calories || 0),
    0
  );

  const totalProtein = meals.reduce(
    (sum, item) => sum + Number(item.protein || 0),
    0
  );

  const totalSets = workouts.reduce(
    (sum, item) => sum + Number(item.sets || 0),
    0
  );

  const totalSportsCalories = sports.reduce(
    (sum, item) => sum + Number(item.caloriesBurned || 0),
    0
  );

  // Logout
  const handleLogout = () => {
    setShowDashboard(false);
    setUserId("");
    setUserName("");
    setWorkouts([]);
    setMeals([]);
    setSports([]);
    setEmail("");
    setPassword("");
    setLoginMessage("");
    setWorkoutMessage("");
    setDietMessage("");
    setSportMessage("");
    setAiMessage("");
    setAiResult(null);
  };

  // Dashboard
  if (showDashboard) {
    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <h2>FitSports</h2>
          <div>
            <span className="user-welcome">
              Welcome, {userName}
            </span>
            <button className="main-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-heading">
            <h1>Fitness Dashboard</h1>
            <p>Track your fitness journey and progress.</p>
          </div>

          {/* Summary cards */}
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="dashboard-icon">🏋️</div>
              <h3>Workout Sessions</h3>
              <h2>{workouts.length}</h2>
              <p>Saved workout entries</p>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon">💪</div>
              <h3>Total Sets</h3>
              <h2>{totalSets}</h2>
              <p>Across saved workouts</p>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon">🔥</div>
              <h3>Calories Consumed</h3>
              <h2>{totalCalories}</h2>
              <p>Recorded food calories</p>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon">🥚</div>
              <h3>Protein Intake</h3>
              <h2>{totalProtein} g</h2>
              <p>Recorded protein</p>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon">🏃</div>
              <h3>Sports Activities</h3>
              <h2>{sports.length}</h2>
              <p>Saved sports entries</p>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-icon">⚡</div>
              <h3>Sports Calories Burned</h3>
              <h2>{totalSportsCalories}</h2>
              <p>Recorded calories burned</p>
            </div>
          </div>

          {/* Profile */}
          <section className="dashboard-section">
            <h2>My Fitness Profile</h2>

            <div className="profile-grid">
              <div className="profile-item">
                <span>Name</span>
                <strong>{userName}</strong>
              </div>

              <div className="profile-item">
                <span>Email</span>
                <strong>{email}</strong>
              </div>

              <div className="profile-item">
                <span>User ID</span>
                <strong>{userId}</strong>
              </div>

              <div className="profile-item">
                <span>Sports Activities</span>
                <strong>{sports.length}</strong>
              </div>
            </div>
          </section>

          {/* Workout tracking */}
          <section className="dashboard-section">
            <h2>Workout Tracking</h2>
            <p>Record your daily exercises.</p>

            <form className="tracking-form" onSubmit={addWorkout}>
              <input
                type="text"
                placeholder="Exercise name"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                required
              />

              <select
                className="dashboard-select"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
              >
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Biceps">Biceps</option>
                <option value="Triceps">Triceps</option>
                <option value="Legs">Legs</option>
                <option value="Abs">Abs</option>
                <option value="Full Body">Full Body</option>
              </select>

              <input
                type="number"
                placeholder="Sets"
                min="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Reps"
                min="1"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Weight (kg)"
                min="0"
                step="0.5"
                value={workoutWeight}
                onChange={(e) => setWorkoutWeight(e.target.value)}
                required
              />

              <button type="submit" className="main-btn">
                Save Workout
              </button>
            </form>

            {workoutMessage && <p>{workoutMessage}</p>}

            <div className="activity-list">
              <h3>Workout History</h3>

              {loadingWorkouts ? (
                <p>Loading workout history...</p>
              ) : workouts.length === 0 ? (
                <p>No workouts recorded yet.</p>
              ) : (
                workouts.map((item) => (
                  <div className="activity-item" key={item._id}>
                    <strong>
                      {item.exercise} - {item.muscleGroup}
                    </strong>
                    <span>
                      {item.sets} sets × {item.reps} reps · {item.weight} kg
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Diet tracking */}
          <section className="dashboard-section">
            <h2>Diet &amp; Nutrition</h2>
            <p>Record your food and nutrition intake.</p>

            <form className="tracking-form" onSubmit={addMeal}>
              <input
                type="text"
                placeholder="Food name"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Calories"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Protein (g)"
                min="0"
                step="0.1"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                required
              />

              <button type="submit" className="main-btn">
                Add Food
              </button>
            </form>

            {dietMessage && <p>{dietMessage}</p>}

            <div className="profile-grid">
              <div className="profile-item">
                <span>Total Calories</span>
                <strong>{totalCalories} kcal</strong>
              </div>

              <div className="profile-item">
                <span>Total Protein</span>
                <strong>{totalProtein} g</strong>
              </div>
            </div>

            <div className="activity-list">
              <h3>Diet History</h3>

              {loadingMeals ? (
                <p>Loading diet history...</p>
              ) : meals.length === 0 ? (
                <p>No food entries recorded yet.</p>
              ) : (
                meals.map((item) => (
                  <div className="activity-item" key={item._id}>
                    <strong>{item.foodName}</strong>
                    <span>
                      {item.calories} kcal · {item.protein} g protein
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Sports management */}
          <section className="dashboard-section">
            <h2>Sports Management</h2>
            <p>Record and monitor your sports activities.</p>

            <form className="tracking-form" onSubmit={addSport}>
              <select
                className="dashboard-select"
                value={sportName}
                onChange={(e) => setSportName(e.target.value)}
              >
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Badminton">Badminton</option>
                <option value="Basketball">Basketball</option>
                <option value="Volleyball">Volleyball</option>
                <option value="Running">Running</option>
                <option value="Swimming">Swimming</option>
                <option value="Tennis">Tennis</option>
                <option value="Cycling">Cycling</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="number"
                placeholder="Duration (minutes)"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Calories burned"
                min="0"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                required
              />

              <button type="submit" className="main-btn">
                Save Sports Activity
              </button>
            </form>

            {sportMessage && <p>{sportMessage}</p>}

            <div className="profile-grid">
              <div className="profile-item">
                <span>Total Sports Activities</span>
                <strong>{sports.length}</strong>
              </div>

              <div className="profile-item">
                <span>Total Calories Burned</span>
                <strong>{totalSportsCalories} kcal</strong>
              </div>
            </div>

            <div className="activity-list">
              <h3>Sports History</h3>

              {loadingSports ? (
                <p>Loading sports history...</p>
              ) : sports.length === 0 ? (
                <p>No sports activities recorded yet.</p>
              ) : (
                sports.map((item) => (
                  <div className="activity-item" key={item._id}>
                    <strong>{item.sportName}</strong>
                    <span>
                      {item.duration} minutes · {item.caloriesBurned} kcal burned
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* AI recommendations */}
          <section className="dashboard-section ai-section">
            <h2>AI Fitness Recommendations</h2>
            <p>
              Enter your details to generate personalized workout and
              nutrition guidance.
            </p>

            <form
              className="tracking-form"
              onSubmit={getAIRecommendations}
            >
              <input
                type="number"
                placeholder="Age (years)"
                min="1"
                value={aiAge}
                onChange={(e) => setAiAge(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Height (cm)"
                min="1"
                step="0.1"
                value={aiHeight}
                onChange={(e) => setAiHeight(e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Weight (kg)"
                min="1"
                step="0.1"
                value={aiWeight}
                onChange={(e) => setAiWeight(e.target.value)}
                required
              />

              <select
                className="dashboard-select"
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Fitness">General Fitness</option>
                <option value="Sports Performance">
                  Sports Performance
                </option>
              </select>

              <select
                className="dashboard-select"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="Low">Low Activity</option>
                <option value="Moderate">Moderate Activity</option>
                <option value="High">High Activity</option>
              </select>

              <button
                type="submit"
                className="main-btn"
                disabled={loadingAI}
              >
                {loadingAI
                  ? "Generating..."
                  : "Generate AI Recommendations"}
              </button>
            </form>

            {aiMessage && (
              <p className="ai-message" role="status">
                {aiMessage}
              </p>
            )}

            {aiResult && (
              <div className="ai-results">
                {aiResult.bmi !== undefined && (
                  <div className="profile-item">
                    <span>Body Mass Index (BMI)</span>
                    <strong>
                      {Number(aiResult.bmi).toFixed(2)}
                    </strong>
                  </div>
                )}

                {aiResult.fitnessGoal && (
                  <div className="profile-item">
                    <span>Selected Fitness Goal</span>
                    <strong>{aiResult.fitnessGoal}</strong>
                  </div>
                )}

                {aiResult.workoutRecommendation && (
                  <div className="ai-result-item">
                    <h3>Workout Recommendation</h3>
                    <p>{aiResult.workoutRecommendation}</p>
                  </div>
                )}

                {aiResult.dietRecommendation && (
                  <div className="ai-result-item">
                    <h3>Diet Recommendation</h3>
                    <p>{aiResult.dietRecommendation}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <footer className="dashboard-footer">
            AI-Enabled Fitness and Sports Management System
          </footer>
        </main>
      </div>
    );
  }

  // Login and registration
  return (
    <div className="app-container">
      <div className="hero-content">
        <h1>AI-Enabled Fitness &amp; Sports</h1>
        <p>
          Your fitness journey starts here.
          Track workouts, nutrition and sports activities.
        </p>
      </div>

      <div className="form-container">
        {showRegister ? (
          <>
            <h2>Create Account</h2>
            <p>Register to start your fitness journey.</p>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

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
                placeholder="Height (cm)"
                min="1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
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

              <button type="submit" className="main-btn">
                Register
              </button>
            </form>

            {registerMessage && <p>{registerMessage}</p>}

            <p>
              Already have an account?{" "}
              <button
                className="text-btn"
                onClick={() => {
                  setShowRegister(false);
                  setRegisterMessage("");
                }}
              >
                Login
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Welcome Back</h2>
            <p>Login to access your fitness dashboard.</p>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="main-btn">
                Login
              </button>
            </form>

            {loginMessage && <p>{loginMessage}</p>}

            <p>
              Don't have an account?{" "}
              <button
                className="text-btn"
                onClick={() => {
                  setShowRegister(true);
                  setLoginMessage("");
                  setRegisterMessage("");
                }}
              >
                Register
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;