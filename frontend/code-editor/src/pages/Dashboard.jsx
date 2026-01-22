import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [view, setView] = useState("my"); // "my" | "collab"

  return (
    <div className="dashboard-root">

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="welcome-text">Welcome, User</span>
        </div>

        <div className="header-right">
          <button className="icon-btn">🌗</button>
          <button className="icon-btn" onClick={() => navigate("/")}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Toggle */}
      <div className="dashboard-toggle">
        <button
          className={view === "my" ? "active" : ""}
          onClick={() => setView("my")}
        >
          My Rooms
        </button>
        <button
          className={view === "collab" ? "active" : ""}
          onClick={() => setView("collab")}
        >
          Collaborations
        </button>
      </div>

      {/* Rooms Section */}
      <main className="dashboard-main">
        <div className="projects-grid">
          {view === "my" && (
            <>
              <div className="project-card" />
              <div className="project-card" />
              <div className="project-card" />
            </>
          )}

          {view === "collab" && (
            <>
              <div className="project-card" />
              <div className="project-card" />
            </>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fab-container">
        <div className="fab-menu">
          <button
            className="fab-option"
            onClick={() => navigate("/room")}
          >
            Create Room
          </button>
          <button
            className="fab-option"
            onClick={() => setShowJoinModal(true)}
          >
            Join Room
          </button>
        </div>
        <button className="fab">+</button>
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-title">Join Room</h3>

            <input
              className="modal-input"
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </button>

              <button
                className="modal-join"
                onClick={() => {
                  setShowJoinModal(false);
                  navigate("/room");
                }}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
