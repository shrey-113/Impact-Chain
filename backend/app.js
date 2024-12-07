const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const router = require("./routes/index");

const app = express();
config();
// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router.users);

const PORT = process.env.PORT || 3000;
// MongoDB Connection
const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase"; // Replace 'mydatabase' with your DB name
mongoose
  .connect(mongoURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("MongoDB connected successfully");
  })
  .catch((err) => console.error("MongoDB connection error:", err));
