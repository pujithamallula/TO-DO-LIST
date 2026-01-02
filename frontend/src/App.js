import { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // ✅ Alert message state
  const [showAlert, setShowAlert] = useState(false);
  const timerRef = useRef(null);

  // Fetch todos
  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!task.trim()) return;

    const res = await fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });

    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setTask("");
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  };

  // Mark todo as done + show alert
  const markDone = async (id) => {
    const res = await fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
    });

    const updatedTodo = await res.json();

    setTodos(
      todos.map((todo) =>
        todo._id === id ? updatedTodo : todo
      )
    );

    // ✅ Show alert
    setShowAlert(true);

    // Clear previous timer if exists
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Hide alert after 20 seconds
    timerRef.current = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      {/* ✅ Center alert popup */}
      {showAlert && (
        <div className="alert-overlay">
          <div className="alert-box">
            <h2>🎉 Great job! </h2>
            <p>Task completed.Keep up the good work!</p>
          </div>
        </div>
      )}

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={todo.completed ? "completed" : ""}
          >
            <span className="todo-text">{todo.text}</span>

            {!todo.completed && (
              <button
                className="done-btn"
                onClick={() => markDone(todo._id)}
              >
                Done
              </button>
            )}

            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;