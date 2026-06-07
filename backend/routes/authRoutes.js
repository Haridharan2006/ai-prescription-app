import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

router.post("/login", async (req, res) => {

  try {

    const { doctorId, password } = req.body;

    const doctor =
      await Doctor.findOne({
        doctorId,
        password
      });

    if (!doctor) {

      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.json({
      success: true,
      doctor
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
});

export default router;