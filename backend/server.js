const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/taskmanager")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

// Add Task API
app.post("/addTask", async (req, res) => {
  try {
    const { task, priority, dueDate } = req.body;

    const newTask = new Task({
      task,
      priority,
      dueDate,
    });

    const savedTask = await newTask.save();

    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
app.delete("/deleteTask/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Task.findByIdAndDelete(id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
app.put("/updateTask/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // toggle status
    task.status = task.status === "Completed" ? "Pending" : "Completed";

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Important
app.put("/toggleImportant/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    task.important = !task.important;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
