const express = require("express");
const app = express();
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Connection to mongodb
connectdb();

const port = process.env.PORT || 8800;

// Connecting to express server
app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});

app.use(express.json());
