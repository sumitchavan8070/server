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
app.use("/api/v1/auth/posts", require("./routes/postRoutes"));

app.use("/api/v1/auth/exam-categories", require("./routes/examCategoryRoutes")); //DONE
app.use("/api/v1/auth/subcategories", require("./routes/subExamTypeRoutes")); // Done
app.use("/api/v1/auth/years", require("./routes/examYearRoutes")); // Done , for frontend
app.use(
  "/api/v1/auth/question-papers",
  require("./routes/questionPaperRoutes")
);

app.use("/api/v1/auth/subjects", require("./routes/subjectRoutes")); // Include subject routes

app.use("/api/v1/auth/groups", require("./routes/groupRoutes"));

//leaderboard
app.use("/api/v1/auth/leaderboard", require("./routes/leaderboardRoutes"));

app.use("/api/v1/auth/customtest", require("./routes/customTestRoutes"));

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server is Running ${PORT}`.bgGreen.white);
});
