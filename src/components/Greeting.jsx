export default function Greeting() {
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return "Good morning 🌅";
    if (hour < 18) return "Good afternoon ☀️";
    return "Good evening 🌙";
  };

  return <h1 className="text-3xl font-bold">{getGreeting()}</h1>;
}
