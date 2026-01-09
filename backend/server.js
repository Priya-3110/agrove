const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROOT HEALTH CHECK (FIXES Cannot GET /)
app.get("/", (req, res) => {
  res.send("Agrove Backend is Running ✅");
});

// ✅ API ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/farms", require("./routes/farms"));
app.use("/api/advisory", require("./routes/advisory"));
app.use("/api/activities", require("./routes/activities"));
app.use("/api/weather", require("./routes/weather"));

// ✅ USE PORT FROM ENV (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
