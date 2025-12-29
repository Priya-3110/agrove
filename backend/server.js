const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/farms", require("./routes/farms"));
app.use("/api/advisory", require("./routes/advisory"));
app.use("/api/activities", require("./routes/activities"));


app.listen(5000, () => console.log("Server running"));
