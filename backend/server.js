require('dotenv').config(); // This will load the .env variables

const express = require('express');
const path = require('path');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;


app.get("/", (req, res) => {
  const htmlFile = path.join(__dirname, 'index.html');
  res.sendFile(htmlFile);
})

app.listen(port, () => console.log(`Server running on port ${port}`));