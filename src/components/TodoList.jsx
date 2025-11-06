import { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow w-full">
      <h2 className="text-xl font-semibold mb-3">To-do List ✅</h2>
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-slate-700 border border-slate-600"
          placeholder="Add task..."
        />
        <button
          onClick={addTodo}
          className="bg-indigo-600 px-3 py-2 rounded hover:bg-indigo-500"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-slate-700 p-2 rounded"
          >
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`flex-1 cursor-pointer ${
                todo.done ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
