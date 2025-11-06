import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import safeStorage from "../utils/safeStorage";
import AnalogClock from "../components/AnalogClock";

export default function Dashboard() {
  const user = JSON.parse(safeStorage.getItem("user"));
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("digital"); // "digital" | "analog"

  const handleLogout = () => {
    safeStorage.removeItem("user");
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

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const formattedDate = now.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setTime(`${formattedDate} — ${formattedTime}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
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
        background: "linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)",
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

      {mode === "digital" ? (
        <p style={{ marginBottom: "1.5rem", color: "#94a3b8", fontSize: "1.1rem" }}>{time}</p>
      ) : (
        <AnalogClock />
      )}

      <button
        onClick={() => setMode(mode === "digital" ? "analog" : "digital")}
        style={{
          background: "#3b82f6",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        Switch to {mode === "digital" ? "Analog" : "Digital"} Mode
      </button>

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
