import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");
  const [page, setPage] = useState("list");
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);
  // Add Task
  const addTask = async () => {
    try {
      await fetch("https://task-manager-backend-73ih.onrender.com/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, priority, dueDate }),
      });

      alert("Task Added Successfully");

      setTask("");
      setPriority("Medium");
      setDueDate("");

      fetchTasks();
      setPage("list");
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(
        "https://task-manager-backend-73ih.onrender.com/tasks",
      );

      const data = await res.json();

      // ✅ Ensure it's always an array
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.log("Error: Not an array", data);
        setTasks([]); // fallback
      }
    } catch (error) {
      console.log(error);
      setTasks([]);
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(
      `https://task-manager-backend-73ih.onrender.com/deleteTask/${id}`,
      {
        method: "DELETE",
      },
    );
    fetchTasks();
  };

  // Update Task
  const updateTask = async (id) => {
    await fetch(
      `https://task-manager-backend-73ih.onrender.com/updateTask/${id}`,
      {
        method: "PUT",
      },
    );
    fetchTasks();
  };

  // Toggle Important
  const toggleImportant = async (id) => {
    await fetch(
      `https://task-manager-backend-73ih.onrender.com/toggleImportant/${id}`,
      {
        method: "PUT",
      },
    );
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Task Manager📝</h1>

      {/* ---------- LIST PAGE ---------- */}
      {page === "list" && (
        <>
          <button className="add-btn" onClick={() => setPage("add")}>
            ➕ Add Task
          </button>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🔆 Light Mode" : "🌙 Dark Mode"}
          </button>
          <br />
          <br />
          {/* Search */}
          <label>
            <b>Search tasks</b>
          </label>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <br />
          <br />

          {/* Sort */}
          <label>
            <b>Sort tasks</b>
          </label>
          <select onChange={(e) => setSortType(e.target.value)}>
            <option value="">Sort By</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>

          <br />
          <br />

          <label>
            <b>Filter tasks</b>
          </label>
          <br />

          <button
            className={`filter-btn ${filter === "All" ? "filter-active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            className={`filter-btn ${filter === "Pending" ? "filter-active" : ""}`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>

          <button
            className={`filter-btn ${filter === "Completed" ? "filter-active" : ""}`}
            onClick={() => setFilter("Completed")}
          >
            Completed
          </button>

          <br />
          <br />
          <h2>Task List</h2>
          {/* TASK LIST */}
          {tasks
            .filter((t) => {
              const matchesSearch = t.task
                .toLowerCase()
                .includes(search.toLowerCase());

              const matchesFilter =
                filter === "All" ||
                (filter === "Pending" && t.status === "Pending") ||
                (filter === "Completed" && t.status === "Completed");

              return matchesSearch && matchesFilter;
            })
            .sort((a, b) => {
              if (sortType === "priority") {
                const order = { High: 1, Medium: 2, Low: 3 };
                return order[a.priority] - order[b.priority];
              }
              if (sortType === "dueDate") {
                return new Date(a.dueDate) - new Date(b.dueDate);
              }
              if (sortType === "status") {
                const order = { Pending: 1, Completed: 2 };
                return order[a.status] - order[b.status];
              }
              return 0;
            })
            .map((t) => (
              <div className="task-card" key={t._id}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* ⭐ STAR */}
                  <span className="star" onClick={() => toggleImportant(t._id)}>
                    {t.important ? "⭐" : "☆"}
                  </span>

                  <div className="task-info">
                    {/* Task */}
                    <span
                      className={t.status === "Completed" ? "completed" : ""}
                    >
                      {t.task}
                    </span>

                    {/* Priority */}
                    <span
                      className={
                        t.priority === "High"
                          ? "high"
                          : t.priority === "Medium"
                            ? "medium"
                            : "low"
                      }
                    >
                      {t.priority}
                    </span>

                    {/* Due Date */}
                    <span className="due-date">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div>
                  <button onClick={() => updateTask(t._id)}>
                    {t.status === "Completed" ? "↩ " : "✔ "}
                  </button>
                  <button onClick={() => deleteTask(t._id)}>🗑</button>
                </div>
              </div>
            ))}
        </>
      )}

      {/* ---------- ADD PAGE ---------- */}
      {page === "add" && (
        <>
          <button className="back-btn" onClick={() => setPage("list")}>
            ⬅ Back
          </button>

          <h2>Add Task</h2>

          <label>
            <b>Enter Task</b>
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <br />
          <br />

          <label>
            <b>Priority of the Task</b>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <br />
          <br />

          <label>
            <b>Due Date</b>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <br />
          <br />

          <button className="add-btn" onClick={addTask}>
            Add Task
          </button>
        </>
      )}
    </div>
  );
}

export default App;