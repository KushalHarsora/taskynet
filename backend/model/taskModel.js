const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  tasks: {
    type: [
      {
        taskName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        color: { type: String, required: true },
        status: { type: Boolean, required: true, default: false },
      }
    ], default: []
  },
});

const User = mongoose.model("TaskUser", userSchema);

module.exports = { User };
