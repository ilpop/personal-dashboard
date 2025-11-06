import { useEffect, useState } from "react";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(localStorage.getItem("lastCity") || "Helsinki");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useLocation, setUseLocation] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [animateData, setAnimateData] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // === Fetch by city name ===
  async function fetchByCity(name) {
    try {
      setRefreshing(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
      setError(null);
      localStorage.setItem("lastCity", data.name);
      setLastUpdated(new Date());
      setAnimateData(true);
      setTimeout(() => setAnimateData(false), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 500);
    }
  }

  // === Fetch by coordinates ===
  async function fetchByCoords(lat, lon) {
    try {
      setRefreshing(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
      setCity(data.name);
      localStorage.setItem("lastCity", data.name);
      setError(null);
      setLastUpdated(new Date());
      setAnimateData(true);
      setTimeout(() => setAnimateData(false), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 500);
    }
  }

  // === Try geolocation first, fallback to saved or default city ===
  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API key in .env");
      setLoading(false);
      return;
    }

    const savedCity = localStorage.getItem("lastCity");
    if (navigator.geolocation && useLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchByCoords(latitude, longitude);
        },
        () => {
          setUseLocation(false);
          fetchByCity(savedCity || city);
        }
      );
    } else {
      fetchByCity(savedCity || city);
    }
  }, [API_KEY, useLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchByCity(city);
  };

  const handleRefresh = () => {
    const savedCity = localStorage.getItem("lastCity") || city;
    fetchByCity(savedCity);
  };

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : null;

  if (loading) return <p>☁️ Loading weather...</p>;
  if (error)
    return (
      <div style={{ textAlign: "center" }}>
        <p>⚠️ {error}</p>
        <button onClick={() => fetchByCity(city)}>Try Again</button>
      </div>
    );

  const { main, weather: details, name } = weather;
  const icon = details?.[0]?.icon;
  const desc = details?.[0]?.description;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      {/* === Weather Info with fade/blur animation === */}
      <div className={`weather-info ${refreshing ? "refreshing" : "active"}`}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            {name}
          </h2>
          <button
            onClick={handleRefresh}
            title="Refresh weather"
            className={`refresh-btn ${refreshing ? "spinning" : ""}`}
          >
            🔄
          </button>
        </div>

        <div className={`fadeup ${animateData ? "animate" : ""}`}>
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={desc}
              style={{ width: "80px", height: "80px" }}
            />
          )}
          <p style={{ fontSize: "2rem", margin: "0.2rem 0" }}>
            {Math.round(main.temp)}°C
          </p>
          <p
            style={{
              textTransform: "capitalize",
              color: "#94a3b8",
              marginBottom: "1rem",
            }}
          >
            {desc}
          </p>
        </div>

        {lastUpdated && (
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
            Last updated: {formatTime(lastUpdated)}
          </p>
        )}
      </div>

      {/* === Search Form === */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          style={{
            padding: "0.5rem 0.7rem",
            background: "#334155",
            color: "#f1f5f9",
            border: "none",
            borderRadius: "8px",
          }}
        />
        <button
          type="submit"
          className={`search-btn ${refreshing ? "pulsing" : ""}`}
        >
          Search
        </button>
      </form>

      {/* === Animations === */}
      <style>
        {`
          .weather-info {
            transition: opacity 0.6s ease, filter 0.6s ease;
          }
          .weather-info.refreshing {
            opacity: 0.5;
            filter: blur(3px);
          }
          .weather-info.active {
            opacity: 1;
            filter: blur(0);
          }

          .fadeup {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.6s ease;
          }
          .fadeup.animate {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeUp 0.8s ease forwards;
          }

          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .refresh-btn {
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 1.3rem;
            cursor: pointer;
            transition: transform 0.4s ease, color 0.3s ease;
          }
          .refresh-btn:hover {
            color: #60a5fa;
            transform: rotate(180deg);
          }
          .refresh-btn.spinning {
            animation: spin 1s linear infinite;
          }

          .search-btn {
            background: #6366f1;
            color: white;
            padding: 0.5rem 0.9rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease, background 0.3s ease;
          }
          .search-btn:hover {
            background: #4f46e5;
            transform: scale(1.05);
          }
          .search-btn.pulsing {
            animation: pulse 0.8s ease-in-out infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}
