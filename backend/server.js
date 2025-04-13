require('dotenv').config();
const express = require('express');
const loginRoutes = require("./api/auth/login");
const registerRoutes = require("./api/auth/register")
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const path = require('path');
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error: ", err);
});

app.use("/api/auth/login", loginRoutes);
app.use("/api/auth/register", registerRoutes);


app.get("/", (req, res) => {
  const htmlFile = path.join(__dirname, 'index.html');
  res.sendFile(htmlFile);
})

app.listen(port, () => console.log(`Server running on port ${port}`));