import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import safeStorage from "../utils/safeStorage";
import AnalogClock from "../components/AnalogClock";
import NotesWidget from "../components/NotesWidget";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("digital");

  useEffect(() => {
    try {
      const storedUser = safeStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email) setUser(parsed);
      }
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }, []);

  const handleLogout = () => {
    safeStorage.removeItem("user");
    window.location.reload();
  };

  useEffect(() => {
    if (user?.email) {
      const savedMode = safeStorage.getItem(`clockMode_${user.email}`);
      if (savedMode) setMode(savedMode);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) safeStorage.setItem(`clockMode_${user.email}`, mode);
  }, [mode, user?.email]);

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

  const toggleClockMode = () => setMode(mode === "digital" ? "analog" : "digital");

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, rgba(30,41,59,1), rgba(15,23,42,1))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#f1f5f9",
          fontSize: "1.2rem",
        }}
      >
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#f1f5f9",
        overflowX: "hidden",
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
          boxShadow: "0 0 10px rgba(239,68,68,0.4)",
          transition: "transform 0.2s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 0 16px rgba(239,68,68,0.6)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 0 10px rgba(239,68,68,0.4)";
        }}
      >
        Logout
      </button>

      <h1 className="fade-down" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        {greeting}, {user?.name || "friend"} 👋
      </h1>

      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="left-col">
          <div className="glass-card fade-up">
            {mode === "digital" ? (
              <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>{time}</p>
            ) : (
              <AnalogClock />
            )}
            <button
              onClick={toggleClockMode}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Switch to {mode === "digital" ? "Analog" : "Digital"} Mode
            </button>
          </div>

          <div className="glass-card fade-up" style={{ animationDelay: "0.3s" }}>
            <WeatherCard />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          <div className="glass-card fade-up" style={{ animationDelay: "0.6s" }}>
            <NotesWidget userEmail={user?.email} />
          </div>
        </div>
      </div>

      {/* 🎬 ANIMATIONS & STYLING */}
      <style>
        {`
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            width: 100%;
            max-width: 1000px;
          }

          @media (min-width: 768px) {
            .dashboard-grid {
              grid-template-columns: 1fr 1fr;
              align-items: start;
              gap: 1.5rem;
            }
          }

          .glass-card {
            background: rgba(30,41,59,0.7);
            border-radius: 12px;
            padding: 1.25rem;
            box-shadow: 0 6px 16px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .glass-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px rgba(59,130,246,0.3);
          }

          /* Animations */
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeDown {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .fade-up {
            opacity: 0;
            animation: fadeUp 0.8s ease forwards;
          }
          .fade-down {
            opacity: 0;
            animation: fadeDown 0.8s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
