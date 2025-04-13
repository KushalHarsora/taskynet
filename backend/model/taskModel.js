const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  status: { type: Boolean, required: true },
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

module.exports = { User, Task };