const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectdb = require("./config/DbConnection");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use(express.json());
// Load environment variables from .env file
dotenv.config();

// Connection to mongodb
connectdb();

// Home route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

app.use("/api/category", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/item", itemRoutes);

const port = process.env.PORT || 8800;

// Connecting to express server
app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});
