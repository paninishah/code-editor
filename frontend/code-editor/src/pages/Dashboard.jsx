import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import RoomCard from "../components/RoomCard";
import "./Dashboard.css";
import { createRoom, joinRoom, fetchDashboard } from "../services/rooms";

export default function Dashboard() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [view, setView] = useState("my");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchDashboard()
      .then(setRooms)
      .catch(() => alert("Failed to load dashboard"));
  }, []);

  const myRooms = rooms.filter((r) => r.role === "owner");
  const collabRooms = rooms.filter((r) => r.role === "collaborator");
  const visibleRooms = view === "my" ? myRooms : collabRooms;

  function handleSignOut() {
    localStorage.clear();
    navigate("/");
  }

  async function handleCreateRoom() {
    try {
      const data = await createRoom("My Room");
      navigate(`/room/${data.id}`);
    } catch {
      alert("Could not create room");
    }
  }

  async function handleJoinRoom() {
    if (!roomCode) return;

    try {
      await joinRoom(roomCode);
      navigate(`/room/${roomCode}`);
    } catch {
      alert("Invalid room code");
    }
  }

  async function handleDeleteRoom(roomId) {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/workspace/delete/${roomId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch {
      alert("Failed to delete room");
    }
  }

  function handleRenameRoom(roomId, newName) {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, name: newName } : r
      )
    );
  }

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h2>Welcome, {username} &gt;&gt;&gt;</h2>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </header>

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

      <main className="dashboard-main">
        <div className="projects-grid">
          {visibleRooms.length === 0 && (
            <p style={{ opacity: 0.6 }}>No rooms here yet.</p>
          )}

          {visibleRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onOpen={() => navigate(`/room/${room.id}`)}
              onDelete={() => handleDeleteRoom(room.id)}
              onRename={handleRenameRoom}
            />
          ))}
        </div>
      </main>

      <div className="fab-container">
        <div className="fab-menu">
          <button className="fab-option" onClick={handleCreateRoom}>
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
              <button className="modal-join" onClick={handleJoinRoom}>
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
