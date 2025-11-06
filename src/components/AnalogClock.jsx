import { useEffect, useState } from "react";

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6; // 360 / 60
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div
      style={{
        position: "relative",
        width: "180px",
        height: "180px",
        border: "6px solid #f1f5f9",
        borderRadius: "50%",
        margin: "1rem auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* Hour hand */}
      <div
        style={{
          position: "absolute",
          width: "4px",
          height: "50px",
          background: "#f1f5f9",
          top: "40px",
          left: "calc(50% - 2px)",
          transformOrigin: "bottom center",
          transform: `rotate(${hourDeg}deg)`,
          borderRadius: "2px",
        }}
      />
      {/* Minute hand */}
      <div
        style={{
          position: "absolute",
          width: "3px",
          height: "70px",
          background: "#94a3b8",
          top: "20px",
          left: "calc(50% - 1.5px)",
          transformOrigin: "bottom center",
          transform: `rotate(${minuteDeg}deg)`,
          borderRadius: "2px",
        }}
      />
      {/* Second hand */}
      <div
        style={{
          position: "absolute",
          width: "2px",
          height: "80px",
          background: "#ef4444",
          top: "10px",
          left: "calc(50% - 1px)",
          transformOrigin: "bottom center",
          transform: `rotate(${secondDeg}deg)`,
          borderRadius: "1px",
        }}
      />
      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          background: "#ef4444",
          borderRadius: "50%",
          top: "calc(50% - 5px)",
          left: "calc(50% - 5px)",
        }}
      />
    </div>
  );
}
