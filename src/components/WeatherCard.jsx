import { useEffect, useState } from "react";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(localStorage.getItem("lastCity") || "Helsinki");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useLocation, setUseLocation] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // === Fetch by city name ===
  async function fetchByCity(name) {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
      setError(null);
      localStorage.setItem("lastCity", data.name);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // === Fetch by coordinates ===
  async function fetchByCoords(lat, lon) {
    try {
      setLoading(true);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  // === UI States ===
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
    <div style={{ textAlign: "center" }}>
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
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            fontSize: "1.3rem",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(180deg)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
        >
          🔄
        </button>
      </div>

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
      <p style={{ textTransform: "capitalize", color: "#94a3b8", marginBottom: "1rem" }}>
        {desc}
      </p>

      {lastUpdated && (
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
          Last updated: {formatTime(lastUpdated)}
        </p>
      )}

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
          style={{
            background: "#6366f1",
            color: "white",
            padding: "0.5rem 0.9rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>
    </div>
  );
}

