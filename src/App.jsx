import WeatherCard from "./components/WeatherCard";
import TodoList from "./components/TodoList";
import Clock from "./components/Clock";
import Greeting from "./components/Greeting";

export default function App() {
  return (
    <div className="min-h-screen p-6 flex flex-col gap-6 items-center">
      <div className="text-center">
        <Greeting />
        <Clock />
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <WeatherCard city="Helsinki" />
        <TodoList />
      </div>
    </div>
  );
}
