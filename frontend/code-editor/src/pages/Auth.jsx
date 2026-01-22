import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/Button";
import "./Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();


  return (
    <div className="auth-root">
      <div className="auth-card">

        <div className="auth-toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <h2 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>

        <div className="auth-form">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />

          <Button onClick={() => navigate("/dashboard")}>
            {mode === "login" ? "Login" : "Sign Up"}
          </Button>
        </div>

      </div>
    </div>
  );
}
