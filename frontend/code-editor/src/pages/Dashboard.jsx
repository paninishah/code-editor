import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  
  return (
    <div className="dashboard-root">

      {/* Top bar */}
      <header className="dashboard-header">
        <div className="header-right">
          <button className="icon-btn">🌗</button>
          <button className="icon-btn" onClick={() => navigate("/auth")}>Sign Out</button>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">

        <h2 className="section-title">Recently Saved Projects</h2>

        <div className="projects-grid">
          <div className="project-card" />
          <div className="project-card" />
          <div className="project-card" />
          <div className="project-card" />
        </div>

      </main>

      {/* Floating Action Button */}
      <div className="fab-container">
        <div className="fab-menu">
          <button className="fab-option" onClick={() => navigate("/room")}>Create Room</button>
          <button className="fab-option">Join Room</button>
        </div>
        <button className="fab">+</button>
      </div>

    </div>
  );
}
