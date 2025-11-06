import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [greeting, setGreeting] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) setGreeting("Good morning 🌅");
    else if (hour >= 12 && hour < 18) setGreeting("Good afternoon ☀️");
    else if (hour >= 18 && hour < 22) setGreeting("Good evening 🌙");
    else setGreeting("Good night 🌌");
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)",
        color: "#f1f5f9",
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "0.4rem 0.8rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Logout
      </button>

      <h1 style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>
        {greeting}, {user?.name || "friend"} 👋
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#94a3b8" }}>
        Welcome back to your personal dashboard.
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#1e293b",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <WeatherCard />
      </div>
    </div>
  );
}
