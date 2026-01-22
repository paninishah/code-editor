const BASE_URL = "http://127.0.0.1:8000/api/workspace";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createRoom(name) {
  const res = await fetch(`${BASE_URL}/create/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Create room failed");
  return res.json();
}

export async function joinRoom(roomId) {
  const res = await fetch(`${BASE_URL}/join/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ roomId }),
  });

  if (!res.ok) throw new Error("Join room failed");
  return res.json();
}

export async function fetchDashboard() {
  const res = await fetch(`${BASE_URL}/`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Fetch dashboard failed");
  return res.json();
}
