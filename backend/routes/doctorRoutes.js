import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// Get all doctors

router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.json(doctors);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add doctor

router.post("/", async (req, res) => {
  try {
    const doctor = await Doctor.create(
      req.body
    );

    res.json(doctor);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;