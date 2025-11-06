import { useEffect, useState } from "react";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Helsinki");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useLocation, setUseLocation] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather by city name
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Fetch weather by geolocation
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
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // On mount, try geolocation
  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API key in .env");
      setLoading(false);
      return;
    }

    if (navigator.geolocation && useLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchByCoords(latitude, longitude);
        },
        (err) => {
          console.warn("Geolocation blocked:", err.message);
          setUseLocation(false);
          fetchByCity(city);
        }
      );
    } else {
      fetchByCity(city);
    }
  }, [API_KEY, useLocation]);

  // Submit handler for manual city input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchByCity(city);
  };

  // UI States
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
      <h2 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "0.5rem" }}>
        {name}
      </h2>
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

      {/* Manual city input */}
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
