require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// =======================
// Schema
// =======================
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// =======================
// Routes
// =======================

// ✅ Get todos for a specific user
app.get("/todos/:userId", async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ✅ Add todo for a user
app.post("/todos", async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ error: "Text and userId required" });
    }

    const todo = new Todo({ text, userId });
    await todo.save();

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// ✅ Mark todo as completed
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// ✅ Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// =======================
// Start Server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
