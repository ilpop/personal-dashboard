import { useState } from "react";
import safeStorage from "../utils/safeStorage";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // ✅ Get users safely with default empty array
    let users = [];
    try {
      const storedUsers = safeStorage.getItem("users");
      users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (err) {
      console.warn("Could not parse users:", err);
      users = [];
    }

    // Check for duplicate email
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      setError("User already exists with that email");
      return;
    }

    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);

    // ✅ Save to storage
    safeStorage.setItem("users", JSON.stringify(users));
    safeStorage.setItem("user", JSON.stringify(newUser));

    // Redirect to dashboard
    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={{ display: "inline-block", textAlign: "left" }}>
        <label>
          Name: <br />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Email: <br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password: <br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Sign Up
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
