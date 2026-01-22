import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Auth.css";
import { loginUser } from "../services/api";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    if (mode === "signup") {
      // TEMP: signup not wired yet
      setError("Signup not enabled yet");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(username, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">

        {/* Toggle */}
        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Title */}
        <h2 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>

        {/* Form */}
        <div className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </Button>
        </div>

      </div>
    </div>
  );
}
