import { useEffect, useState } from "react";

const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // 🔑 Add your key here

export default function WeatherCard({ city }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchWeather();
  }, [city]);

  if (!weather) return <div className="bg-slate-800 p-4 rounded-2xl">Loading weather...</div>;
  if (weather.cod !== 200)
    return <div className="bg-slate-800 p-4 rounded-2xl">Weather data unavailable</div>;

  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">{weather.name}</h2>
      <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
      <p className="capitalize text-gray-300">{weather.weather[0].description}</p>
    </div>
  );
}
