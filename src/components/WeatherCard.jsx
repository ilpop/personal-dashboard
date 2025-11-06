import { useEffect, useState } from "react";

export default function WeatherCard({ city = "Helsinki" }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        if (data.cod !== 200) {
          throw new Error(data.message || "Failed to fetch weather");
        }

        setWeather(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [city, API_KEY]);

  if (loading)
    return <p>☁️ Loading weather...</p>;
  if (error)
    return <p>⚠️ {error}</p>;

  const { main, weather: details, name } = weather;
  const icon = details?.[0]?.icon;
  const desc = details?.[0]?.description;

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "1.4rem", fontWeight: "600" }}>{name}</h2>
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
      <p style={{ textTransform: "capitalize", color: "#94a3b8" }}>
        {desc}
      </p>
    </div>
  );
}
