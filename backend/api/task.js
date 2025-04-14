const { User } = require("../model/taskModel");
const express = require("express");

const router = express.Router();

// get all tasks
router.get("/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const sortedTasks = user.tasks.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return res.status(200).json({ tasks: sortedTasks });
    } catch (error) {
        console.error("Add Task Error: ", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});


// add task
router.post("/add", async (req, res) => {
    try {
        const { data, email } = req.body;
        console.log("Add Task Request:", data, email);

        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).json({ message: "User Not Found" });
        }

        user.tasks.push({
            taskName: data.taskName,
            color: data.color,
            status: false,
            createdAt: new Date(),
        });

        const addedNewTask = await user.save();

        if (addedNewTask) {
            res.status(200).json({ message: "Task added successfully" });
        }
    } catch (error) {
        console.error("Add Task Error: ", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// delete task
router.delete("/delete/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const { id } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.tasks = user.tasks.filter(task => task._id.toString() !== id);

        const deletedTask = await user.save();
        if (deletedTask) return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Add Task Error: ", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// mark as completed
router.post("/complete/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const { id } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const task = user.tasks.find(task => task._id.toString() === id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = true;

        const completedTask = await user.save();

        if (completedTask) return res.status(200).json({ message: "Task marked as completed" });
    } catch (error) {
        console.error("Mark Complete Task Error: ", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
