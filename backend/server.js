import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/prescription", prescriptionRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(
  "/api/doctors",
  doctorRoutes
);
app.use("/api/auth", authRoutes);