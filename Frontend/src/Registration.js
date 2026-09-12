import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Calendar, Target, Scale, Ruler, Activity } from "lucide-react";

export default function Registration() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("register"); // "register" | "login"
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondPassword, setSecondPassword] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    gender: "male",
    age: "21",
    height: "170",
    weight: "50",
    activity: "1.375",
    goal: "loss",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "password" && mode === "register") {
        if (secondPassword && value !== secondPassword) {
          setError("Passwords do not match!");
        } else {
          setError("");
        }
      }

      return updated;
    });
  };

  const handleSecondPasswordChange = (e) => {
    const value = e.target.value;
    setSecondPassword(value);

    if (value && formData.password !== value) {
      setError("Passwords do not match!");
    } else {
      setError("");
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (formData.password !== secondPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.email && formData.password && formData.username) {
      setError("");
      setStep(2);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const payload = {
      user: {
        Email: String(formData.email).trim(),
        Password: String(formData.password).trim(),
        email: String(formData.email).trim(),
        password: String(formData.password).trim()
      },
      Email: String(formData.email).trim(),
      Password: String(formData.password).trim(),
      email: String(formData.email).trim(),
      password: String(formData.password).trim()
    };
  
    try {
      const response = await fetch(
        "https://kaleigh-remindful-actinically.ngrok-free.dev/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log("Server Login Error:", errorData);
  
        if (errorData?.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join(" | ");
          throw new Error(errorMessages);
        }
  
        throw new Error(
          errorData?.message || errorData?.title || `Login failed: ${response.status}`
        );
      }
  
      const data = await response.json();
      
      const token = data.token || data.tokenData || data.accessToken;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      
      localStorage.setItem("userData", JSON.stringify(data.user || data));
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const payload = {
      Username: String(formData.username),
      Email: String(formData.email),
      Password: String(formData.password),
      Gender: String(formData.gender),
      Age: String(formData.age),
      Height: String(formData.height),
      Weight: String(formData.weight),
      ActivityLevel: String(formData.activity),
      Goal: String(formData.goal),
      TargetCalories: "2000"
    };
  
    try {
      const response = await fetch(
        "https://kaleigh-remindful-actinically.ngrok-free.dev/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true"
          },
          body: JSON.stringify(payload)
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg = JSON.stringify(errorData || "").toLowerCase();
        if (
          response.status === 409 || 
          errorMsg.includes("already exist") || 
          errorMsg.includes("already registered") ||
          errorMsg.includes("taken")
        ) {
          throw new Error("User with this email or username already exists!");
        }
  
        if (errorData?.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join(" | ");
          throw new Error(errorMessages);
        }
  
        throw new Error(errorData?.message || errorData?.title || `Error: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.token) localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user || payload));
      
      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <div style={styles.modeSwitch}>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setStep(1);
              setError("");
            }}
            style={{
              ...styles.switchBtn,
              fontWeight: mode === "register" ? "bold" : "normal",
              color: mode === "register" ? "#5a6b28" : "#888",
            }}
          >
            Registration
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              ...styles.switchBtn,
              fontWeight: mode === "login" ? "bold" : "normal",
              color: mode === "login" ? "#5a6b28" : "#888",
            }}
          >
            Login
          </button>
        </div>

        {mode === "register" && (
          <div style={styles.stepperContainer}>
            <div
              style={{
                ...styles.stepCircle,
                backgroundColor: step >= 1 ? "#5a6b28" : "#e0e2d8",
                color: step >= 1 ? "#fff" : "#666",
              }}
            >
              1
            </div>
            <div style={styles.stepLine} />
            <div
              style={{
                ...styles.stepCircle,
                backgroundColor: step === 2 ? "#5a6b28" : "#e0e2d8",
                color: step === 2 ? "#fff" : "#666",
              }}
            >
              2
            </div>
          </div>
        )}

        {error && <p style={styles.errorMessage}>{error}</p>}

        {mode === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        )}

        {mode === "register" && step === 1 && (
          <form onSubmit={handleNextStep}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.icon} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} style={styles.icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.icon} />
                <input
                  type="password"
                  name="secondPassword"
                  placeholder="••••••••"
                  value={secondPassword}
                  onChange={handleSecondPasswordChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              Next →
            </button>
          </form>
        )}

        {mode === "register" && step === 2 && (
          <form onSubmit={handleRegisterSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Gender</label>
              <div style={styles.genderContainer}>
                <button
                  type="button"
                  style={{
                    ...styles.genderBtn,
                    backgroundColor: formData.gender === "male" ? "#5a6b28" : "#f0f2e9",
                    color: formData.gender === "male" ? "#fff" : "#333",
                  }}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: "male" }))}
                >
                  Male
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.genderBtn,
                    backgroundColor: formData.gender === "female" ? "#5a6b28" : "#f0f2e9",
                    color: formData.gender === "female" ? "#fff" : "#333",
                  }}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: "female" }))}
                >
                  Female
                </button>
              </div>
            </div>

            <div style={styles.grid2Col}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Age</label>
                <div style={styles.inputWrapper}>
                  <Calendar size={18} style={styles.icon} />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Goal</label>
                <div style={styles.inputWrapper}>
                  <Target size={18} style={styles.icon} />
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="loss">Weight Loss</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Weight Gain</option>
                  </select>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Weight</label>
                <div style={styles.inputWrapper}>
                  <Scale size={18} style={styles.icon} />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    style={{ ...styles.input, paddingRight: "40px" }}
                  />
                  <span style={styles.unitSuffix}>kg</span>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Height</label>
                <div style={styles.inputWrapper}>
                  <Ruler size={18} style={styles.icon} />
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    style={{ ...styles.input, paddingRight: "40px" }}
                  />
                  <span style={styles.unitSuffix}>cm</span>
                </div>
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Activity Level</label>
              <div style={styles.inputWrapper}>
                <Activity size={18} style={styles.icon} />
                <select
                  name="activity"
                  value={formData.activity}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="1.2">Sedentary (little/no exercise)</option>
                  <option value="1.375">Lightly active (1-3 days/week)</option>
                  <option value="1.55">Moderately active (3-5 days/week)</option>
                  <option value="1.725">Very active (6-7 days/week)</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#eef0e5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    backgroundColor: "#f8f9f4",
    borderRadius: "24px",
    padding: "36px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  },
  modeSwitch: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  switchBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
  },
  stepperContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "28px",
  },
  stepCircle: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "background-color 0.3s",
  },
  stepLine: {
    width: "100px",
    height: "2px",
    backgroundColor: "#d1d5c2",
  },
  fieldGroup: {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: "14px",
    color: "#7a8268",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: "20px",
    border: "1px solid #e0e2d8",
    backgroundColor: "#eef0e5",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    borderRadius: "20px",
    border: "1px solid #e0e2d8",
    backgroundColor: "#eef0e5",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    appearance: "none",
    cursor: "pointer",
  },
  unitSuffix: {
    position: "absolute",
    right: "16px",
    fontSize: "13px",
    color: "#666",
    pointerEvents: "none",
  },
  genderContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  genderBtn: {
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #e0e2d8",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  grid2Col: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#f5a823",
    color: "#1c2510",
    border: "none",
    borderRadius: "24px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
  },
  errorMessage: {
    color: "red",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "12px",
    fontWeight: "500",
  },
};