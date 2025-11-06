import Greeting from "./components/Greeting";
import Clock from "./components/Clock";
import WeatherCard from "./components/WeatherCard";
import TodoList from "./components/TodoList";

export default function App() {
  return (
    <div className="app-container">
      <div className="header">
        <Greeting />
        <Clock />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <WeatherCard city="Helsinki" />
        </div>
        <div className="card">
          <TodoList />
        </div>
      </div>
    </div>
  );
}
