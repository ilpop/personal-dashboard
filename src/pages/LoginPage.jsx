import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import safeStorage from "../utils/safeStorage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(safeStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      safeStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/"; // 👈 force redirect after login
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="app-container" style={{ textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "salmon" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
