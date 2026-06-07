import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    unique: true
  },

  doctorName: {
    type: String,
    required: true
  },

  specialization: {
    type: String,
    default: ""
  },

  password: {
    type: String,
    required: true
  }
});

export default mongoose.model(
  "Doctor",
  doctorSchema
);