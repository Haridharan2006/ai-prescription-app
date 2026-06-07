import mongoose from "mongoose";
import dotenv from "dotenv";

import Doctor from "./models/Doctor.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {

    console.log("MongoDB Connected");

    await Doctor.deleteMany();

    await Doctor.insertMany([
      {
        doctorName: "Dr. Rajesh Kumar",
        doctorId: "BEL101",
        department: "General Medicine",
        specialization: "Physician",
      },

      {
        doctorName: "Dr. Priya Sharma",
        doctorId: "BEL102",
        department: "Cardiology",
        specialization: "Cardiologist",
      },

      {
        doctorName: "Dr. Arun Nair",
        doctorId: "BEL103",
        department: "Neurology",
        specialization: "Neurologist",
      },
    ]);

    console.log("Doctors Seeded");

    process.exit();

  })
  .catch((err) => {
    console.log(err);
  });