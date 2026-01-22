const BASE_URL = "http://127.0.0.1:8000";

export async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function signupUser(username, password) {
  const response = await fetch("http://127.0.0.1:8000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.username?.[0] ||
      data.password?.[0] ||
      "Signup failed"
    );
  }

  return data;
}

