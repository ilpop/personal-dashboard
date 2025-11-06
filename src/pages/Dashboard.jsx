import { useEffect, useState } from "react";
import WeatherCard from "../components/WeatherCard";
import safeStorage from "../utils/safeStorage";
import AnalogClock from "../components/AnalogClock";
import NotesWidget from "../components/NotesWidget";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("digital"); // "digital" | "analog"
  const [error, setError] = useState(null);

  // 🔒 Load user safely
  useEffect(() => {
    try {
      const storedUser = safeStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email) setUser(parsed);
        else console.warn("Stored user missing email:", parsed);
      } else {
        console.warn("No stored user found in safeStorage.");
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError("Could not load user data.");
    }
  }, []);

  const handleLogout = () => {
    safeStorage.removeItem("user");
    window.location.reload();
  };

  // 🕹️ Load saved clock mode
  useEffect(() => {
    if (user?.email) {
      try {
        const savedMode = safeStorage.getItem(`clockMode_${user.email}`);
        if (savedMode) setMode(savedMode);
      } catch (err) {
        console.error("Error loading clock mode:", err);
      }
    }
  }, [user?.email]);

  // 💾 Save mode when changed
  useEffect(() => {
    if (user?.email) {
      try {
        safeStorage.setItem(`clockMode_${user.email}`, mode);
      } catch (err) {
        console.error("Error saving clock mode:", err);
      }
    }
  }, [mode, user?.email]);

  // ☀️ Greeting based on time of day
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good morning 🌅");
    else if (hour >= 12 && hour < 18) setGreeting("Good afternoon ☀️");
    else if (hour >= 18 && hour < 22) setGreeting("Good evening 🌙");
    else setGreeting("Good night 🌌");
  }, []);

  // ⏰ Live clock
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

  const toggleClockMode = () => {
    setMode(mode === "digital" ? "analog" : "digital");
  };

  // 🧩 Error fallback
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fca5a5",
          fontSize: "1.2rem",
        }}
      >
        <div>
          <h2>Something went wrong 😢</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 🚀 Show loader if user is still null
  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)",
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

  // 🌌 Main dashboard
  try {
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

        {mode === "digital" ? (
          <p
            style={{
              marginBottom: "1.5rem",
              color: "#94a3b8",
              fontSize: "1.1rem",
            }}
          >
            {time}
          </p>
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

        {user?.email && <NotesWidget userEmail={user.email} />}
      </div>
    );
  } catch (err) {
    console.error("Dashboard render error:", err);
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "20px",
          background:
            "linear-gradient(135deg, rgba(30,41,59,1) 0%, rgba(15,23,42,1) 100%)",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Something went wrong 😢</h2>
          <pre style={{ color: "lightgray" }}>{err.message}</pre>
        </div>
      </div>
    );
  }
}
