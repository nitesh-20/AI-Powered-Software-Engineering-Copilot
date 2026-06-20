import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import healthRoutes from "./routes/healthRoutes.js";
import repositoryRoutes from "./routes/repositoryRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to DevFlow AI API"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/repositories", repositoryRoutes);

export default app;
