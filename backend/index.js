const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const bookmarkRoutes = require("./routes/bookmarks");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected succesfuly"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/bookmarks", bookmarkRoutes);

app.get("/", (req, res) => res.send("Backend is running"));

app.listen(PORT, () => {
  console.log(`Server was started on port http://localhost:${PORT}`);
});
