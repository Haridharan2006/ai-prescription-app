import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  duration: String,
  instruction: String,
});

const prescriptionSchema =
  new mongoose.Schema(
    {
      patientName: String,
      patientAge: String,
      gender: String,
      doctorId: String,
      doctorName: String,
      temperature: String,
      oxygenLevel: String,
      bloodPressure: String,
      pulseRate: String,
      transcript: String,

      symptoms: String,
      diagnosis: String,

      medicines: [medicineSchema],

      advice: String,
    },
    {
      timestamps: true,
    }
  );

const Prescription = mongoose.model(
  "Prescription",
  prescriptionSchema
);

export default Prescription;
