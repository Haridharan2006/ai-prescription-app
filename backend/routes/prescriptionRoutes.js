import dotenv from "dotenv";
dotenv.config();

import express from "express";
import OpenAI from "openai";

import Prescription from "../models/Prescription.js";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/generate", async (req, res) => {
  try {
    const { transcript } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an expert medical prescription assistant.

A doctor will dictate:
- symptoms
- diagnosis
- medicines
- dosage
- advice

Your job is to extract and structure the information carefully.

IMPORTANT:
- Return ONLY valid JSON
- Detect multiple medicines correctly
- Keep dosage instructions complete
- Keep advice detailed
Extract vitals if mentioned:
- temperature
- oxygen level
- blood pressure
- pulse rate
Format:
{
  "symptoms": "",
  "diagnosis": "",

  "temperature": "",
  "oxygenLevel": "",
  "bloodPressure": "",
  "pulseRate": "",

  "medicines": [
    {
      "name": "",
      "dosage": "",
      "duration": "",
      "instruction": ""
    }
  ],

  "advice": ""
}
          `,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      temperature: 0.3,
    });

    const text =
      completion.choices[0].message.content;

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const prescription = JSON.parse(cleanedText);

    res.json(prescription);

  } catch (error) {
    console.error("GROQ ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/save", async (req, res) => {
  try {
    const prescription =
      await Prescription.create(req.body);

    res.status(201).json(prescription);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save prescription",
    });
  }
});

export default router;
