const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

//dotenv
dotenv.config();

//database connection
connectDB();

//Rest Object
const app = express();

//middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

//routes
// defalut route

app.get("", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to MeAdhikari",
  });
});

//custome route
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server is Running ${PORT}`.bgGreen.white);
});
