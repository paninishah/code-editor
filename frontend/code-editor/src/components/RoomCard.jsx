import { useState } from "react";

export default function RoomCard({ room, onOpen, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(room.name);

  async function saveRename() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === room.name) {
      setEditing(false);
      setName(room.name);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/workspace/${room.id}/rename/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ name: trimmed }),
        }
      );

      if (!res.ok) throw new Error();

      onRename(room.id, trimmed);
      setEditing(false);
    } catch {
      alert("Rename failed");
      setName(room.name);
      setEditing(false);
    }
  }

  return (
    <div className="room-card">
      {editing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveRename}
          onKeyDown={(e) => e.key === "Enter" && saveRename()}
          autoFocus
        />
      ) : (
        <h3 onClick={onOpen}>{room.name}</h3>
      )}

      <p className="room-owner">
        {room.role === "owner" ? "You" : room.owner}
      </p>

      {room.role === "owner" && (
        <div className="room-actions">
          <button onClick={() => setEditing(true)}>Rename</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
