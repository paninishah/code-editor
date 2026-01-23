import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { loginUser, signupUser } from "../services/api";
import "./Auth.css";

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

    setLoading(true);

    try {
      if (mode === "login") {
        const data = await loginUser(username, password);

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);

        navigate("/dashboard");
      } else {
        const data = await signupUser(username, password);
        // auto-login after signup
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-dot">⦿</span>
          <span className="auth-name">cord</span>
        </div>

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

        <h2 className="auth-title">
          {mode === "login" ? "Welcome back to cord" : "Create your cord account"}
        </h2>

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
