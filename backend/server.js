import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import employeeRouter from "./routes/employeeRoute.js";
import userRouter from "./routes/userRoute.js";
import jobPostingRouter from "./routes/jobPostingRoute.js";
import 'dotenv/config';

// App configuration
const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
connectDB();

// API Routes
app.use("/api/employee", employeeRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/jobposting", jobPostingRouter); // Ensure this matches your routing

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
