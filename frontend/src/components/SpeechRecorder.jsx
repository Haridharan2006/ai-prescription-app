import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import belLogo from "C:/Users/harid/Downloads/Projects/Internship project/ai-prescription-app/frontend/src/assets/bel-logo.png";
import {Mic,MicOff,FileText,Download,Save,RefreshCw,Activity,User,Pill,Stethoscope} from "lucide-react";
const SpeechRecorder = () => {
  // =========================
  // STATES
  // =========================
  const [loginDoctorId, setLoginDoctorId] =
  useState("");

  const [password, setPassword] =
    useState("");

  const [doctor, setDoctor] =
    useState(null);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);
  const [doctorId, setDoctorId] =
    useState("");

  const [doctorName, setDoctorName] =
    useState("");

  const [doctors, setDoctors] =
    useState([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  // Patient Details
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [gender, setGender] = useState("");
  // Vitals
  const [temperature, setTemperature] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [pulseRate, setPulseRate] = useState("");
  // Speech Recognition
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  // =========================
  // SPEECH RECOGNITION
  // =========================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition not supported"
      );

      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {

      let interimTranscript = "";
      let finalTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        const transcriptPiece = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + " ";
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript((prev) => {

        // Remove previous interim text
        const cleanedPrev =
          prev.replace(
            /\[interim\].*/g,
            ""
          );

        return (
          cleanedPrev +
          finalTranscript +
          (interimTranscript
            ? `[interim]${interimTranscript}`
            : "")
        );
      });
    };

    recognition.onerror = (event) => {

      const ignoredErrors = [
        "no-speech",
        "network",
        "aborted",
      ];

      if (
        !ignoredErrors.includes(
          event.error
        )
      ) {
        console.error(
          "Speech error:",
          event.error
        );
      }
    };

    recognition.onend = () => {

      if (isListeningRef.current) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

  }, []);
  useEffect(() => {

    axios
      .get("http://localhost:5000/api/doctors")
      .then((res) => {

        setDoctors(res.data);

      })
      .catch((err) => {

        console.error(
          "Failed to load doctors",
          err
        );

      });

  }, []);
  // =========================
  // START LISTENING
  // =========================
  const startListening = () => {

    if (!isListeningRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      isListeningRef.current = true;
    }
  };
  // =========================
  // STOP LISTENING
  // =========================
  const stopListening = () => {
    recognitionRef.current.stop();
    setIsListening(false);
    isListeningRef.current = false;
  };
  // =========================
  // GENERATE PRESCRIPTION
  // =========================
  const generatePrescription =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.post(
            "http://localhost:5000/api/prescription/generate",
            {
              transcript,
            }
          );

        setPrescription(
          response.data
        );

        // Auto Fill Vitals

        setTemperature(
          response.data.temperature ||
            ""
        );

        setOxygenLevel(
          response.data.oxygenLevel ||
            ""
        );

        setBloodPressure(
          response.data.bloodPressure ||
            ""
        );

        setPulseRate(
          response.data.pulseRate ||
            ""
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to generate prescription"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // EDITABLE FIELDS
  // =========================
  const handleChange = (
    field,
    value
  ) => {

    setPrescription({
      ...prescription,
      [field]: value,
    });
  };
  // =========================
  // MEDICINE CHANGE
  // =========================
  const handleMedicineChange = (
    index,
    field,
    value
  ) => {

    const updatedMedicines = [
      ...prescription.medicines,
    ];

    updatedMedicines[index][field] =
      value;

    setPrescription({
      ...prescription,
      medicines: updatedMedicines,
    });
  };
  // =========================
  // ADD MEDICINE
  // =========================
  const addMedicine = () => {

    setPrescription({
      ...prescription,
      medicines: [
        ...prescription.medicines,
        {
          name: "",
          dosage: "",
          duration: "",
          instruction: ""
        },
      ],
    });
  };
  // =========================
  // REMOVE MEDICINE
  // =========================
  const removeMedicine = (
    index
  ) => {

    const updatedMedicines =
      prescription.medicines.filter(
        (_, i) => i !== index
      );

    setPrescription({
      ...prescription,
      medicines: updatedMedicines,
    });
  };
  // =========================
  // RESET
  // =========================
  const resetPrescription = () => {

    setTranscript("");

    setPrescription(null);

    setTemperature("");

    setOxygenLevel("");

    setBloodPressure("");

    setPulseRate("");
  };
  // =========================
  // SAVE TO DB
  // =========================
  const savePrescription =
    async () => {

      try {

        await axios.post(
          "http://localhost:5000/api/prescription/save",
          {
            patientName,
            patientAge,
            gender,

            doctorId,
            doctorName,
            
            transcript,

            temperature,
            oxygenLevel,
            bloodPressure,
            pulseRate,

            symptoms:
              prescription.symptoms,

            diagnosis:
              prescription.diagnosis,

            medicines:
              prescription.medicines,

            advice:
              prescription.advice,
          }
        );

        alert(
          "Prescription Saved"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to save prescription"
        );
      }
    };
  // =========================
  // IMAGE TO BASE64
  // =========================
  const getBase64Image = (
    imgUrl
  ) => {

    return new Promise(
      (resolve, reject) => {

        const img = new Image();

        img.crossOrigin =
          "Anonymous";

        img.onload = () => {

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            img.width;

          canvas.height =
            img.height;

          const ctx =
            canvas.getContext("2d");

          ctx.drawImage(
            img,
            0,
            0
          );

          const dataURL =
            canvas.toDataURL(
              "image/jpeg"
            );

          resolve(dataURL);
        };

        img.onerror = (error) =>
          reject(error);

        img.src = imgUrl;
      }
    );
  };
  // =========================
  // DOWNLOAD PDF
  // =========================
  const downloadPDF =
    async () => {

      try {
        const jsPDF =
          (
            await import(
              "jspdf"
            )
          ).default;

        const pdf = new jsPDF();

        const primaryColor = [
          0,
          102,
          204,
        ];

        // Header

        pdf.setFillColor(
          ...primaryColor
        );

        pdf.rect(
          0,
          0,
          210,
          40,
          "F"
        );

        // Logo

        const logoBase64 =
          await getBase64Image(
            belLogo
          );

        pdf.addImage(
          logoBase64,
          "PNG",
          10,
          10,
          38,
          16
        );

        // Hospital Name

        pdf.setTextColor(
          255,
          255,
          255
        );

        pdf.setFontSize(24);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "BEL Hospital",
          78,
          17
        );

        pdf.setFontSize(11);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.text(
          "Bharat Electronics Limited Medical Center",
          52,
          28
        );

        // Reset text color

        pdf.setTextColor(0,0,0);
        
        //newchange
        pdf.setFontSize(11);

        pdf.setTextColor(255,255,255);

        pdf.setFontSize(10);

        pdf.text(
          `Doctor: ${doctorName || "N/A"}`,
          145,
          15
        );

        pdf.text(
          `Doctor ID: ${doctorId || "N/A"}`,
          145,
          25
        );
        // Title
        pdf.setTextColor(0,0,0);
        pdf.setFontSize(18);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Medical Prescription",
          70,
          58
        );

        // Prescription ID

        const prescriptionId =
          "RX-" +
          Math.floor(
            Math.random() * 100000
          );

        pdf.setFontSize(11);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.text(
          `Prescription ID: ${prescriptionId}`,
          20,
          72
        );

        pdf.text(
          `Date: ${new Date().toLocaleDateString()}`,
          150,
          72
        );

        // =========================
        // PATIENT DETAILS
        // =========================

        pdf.setDrawColor(
          ...primaryColor
        );

        pdf.rect(
          20,
          82,
          170,
          30
        );

        pdf.setFontSize(14);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Patient Details",
          25,
          92
        );

        pdf.setFontSize(12);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.text(
          `Name: ${patientName}`,
          25,
          102
        );

        pdf.text(
          `Age: ${patientAge}`,
          90,
          102
        );

        pdf.text(
          `Gender: ${gender}`,
          140,
          102
        );

        // =========================
        // VITALS
        // =========================

        pdf.setFontSize(16);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Patient Vitals",
          20,
          130
        );

        pdf.line(
          20,
          133,
          70,
          133
        );

        let vitalsY = 142;

        // Table Header

        pdf.setFillColor(
          220,
          230,
          242
        );

        pdf.rect(
          20,
          vitalsY,
          170,
          10,
          "F"
        );

        pdf.setFontSize(12);

        pdf.text(
          "Vital",
          30,
          vitalsY + 7
        );

        pdf.text(
          "Value",
          120,
          vitalsY + 7
        );

        vitalsY += 10;

        // Table Rows

        const vitals = [
          [
            "Temperature",
            `${temperature} °F`,
          ],

          [
            "Oxygen Level",
            `${oxygenLevel}%`,
          ],

          [
            "Blood Pressure",
            bloodPressure,
          ],

          [
            "Pulse Rate",
            pulseRate,
          ],
        ];

        pdf.setFont(
          "helvetica",
          "normal"
        );

        vitals.forEach(
          (vital) => {

            pdf.rect(
              20,
              vitalsY,
              170,
              12
            );

            pdf.text(
              vital[0],
              30,
              vitalsY + 8
            );

            pdf.text(
              vital[1],
              120,
              vitalsY + 8
            );

            vitalsY += 12;
          }
        );
        // =========================
        // SYMPTOMS
        // =========================
        const symptomsY =
          vitalsY + 20;

        pdf.setFontSize(16);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Symptoms",
          20,
          symptomsY
        );

        pdf.line(
          20,
          symptomsY + 3,
          60,
          symptomsY + 3
        );

        pdf.setFontSize(12);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        const symptomsText =
          pdf.splitTextToSize(
            prescription
              ?.symptoms || "",
            170
          );

        pdf.text(
          symptomsText,
          20,
          symptomsY + 15
        );

        // =========================
        // DIAGNOSIS
        // =========================

        const diagnosisY =
          symptomsY +
          25 +
          (symptomsText.length *
            6);

        pdf.setFontSize(16);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Diagnosis",
          20,
          diagnosisY
        );

        pdf.line(
          20,
          diagnosisY + 3,
          65,
          diagnosisY + 3
        );

        pdf.setFontSize(12);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        const diagnosisText =
          pdf.splitTextToSize(
            prescription
              ?.diagnosis || "",
            170
          );

        pdf.text(
          diagnosisText,
          20,
          diagnosisY + 15
        );

        // =========================
        // MEDICINES
        // =========================

        let medicinesY =
          diagnosisY +
          25 +
          (diagnosisText.length *
            6);

        // Page Break

        if (
          medicinesY > 220
        ) {

          pdf.addPage();

          medicinesY = 30;
        }

        pdf.setFontSize(16);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Medicines",
          20,
          medicinesY
        );

        pdf.line(
          20,
          medicinesY + 3,
          65,
          medicinesY + 3
        );

        let tableY =
          medicinesY + 15;

        // Table Header

        pdf.setFillColor(
          220,
          230,
          242
        );

        pdf.rect(
          20,
          tableY,
          170,
          10,
          "F"
        );

        pdf.setFontSize(12);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text("S.No", 22, tableY + 7);

        pdf.text("Medicine", 40, tableY + 7);

        pdf.text("Dosage", 95, tableY + 7);

        pdf.text("Duration", 130, tableY + 7);

        pdf.text("Instruction", 165, tableY + 7);

        tableY += 10;

        // Rows

        pdf.setFont(
          "helvetica",
          "normal"
        );

        prescription?.medicines?.forEach(
          (
            medicine,
            index
          ) => {

            if (
              tableY > 260
            ) {

              pdf.addPage();

              tableY = 30;
            }

            pdf.rect(
              20,
              tableY,
              170,
              12
            );

            pdf.text(
              `${index + 1}`,
              28,
              tableY + 8
            );

            pdf.text(
              medicine.name || "",
              40,
              tableY + 8
            );

            pdf.text(
              medicine.dosage || "",
              95,
              tableY + 8
            );

            pdf.text(
              medicine.duration || "",
              130,
              tableY + 8
            );

            pdf.text(
              medicine.instruction || "",
              165,
              tableY + 8
            );

            tableY += 14;
          }
        );

        // =========================
        // ADVICE
        // =========================

        let adviceY =
          tableY + 20;

        if (
          adviceY > 240
        ) {

          pdf.addPage();

          adviceY = 30;
        }

        pdf.setFontSize(16);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.text(
          "Advice",
          20,
          adviceY
        );

        pdf.line(
          20,
          adviceY + 3,
          50,
          adviceY + 3
        );

        pdf.setFontSize(12);

        pdf.setFont(
          "helvetica",
          "normal"
        );

        const adviceText =
          pdf.splitTextToSize(
            prescription
              ?.advice || "",
            170
          );

        pdf.text(
          adviceText,
          20,
          adviceY + 15
        );
        //signature
        // =========================
        // DOCTOR SIGNATURE
        // =========================

        let signatureY =
          adviceY +
          25 +
          (adviceText.length * 6);

        // If signature goes beyond page, create new page

        if (signatureY > 240) {

          pdf.addPage();

          signatureY = 40;
        }

        pdf.setTextColor(0, 0, 0);

        pdf.setFontSize(12);

        pdf.line(
          130,
          signatureY,
          190,
          signatureY
        );

        pdf.text(
          doctorName || "",
          140,
          signatureY + 10
        );

        pdf.text(
          `Doctor ID: ${doctorId || ""}`,
          135,
          signatureY + 18
        );

        pdf.text(
          "Authorized Medical Practitioner",
          115,
          signatureY + 26
        );
        // Footer

        pdf.setFontSize(10);

        pdf.setTextColor(120);

        pdf.text(
          "BEL Hospital - AI Prescription System",
          60,
          pdf.internal.pageSize.height - 10
        );

        // Save

        pdf.save(
          `${patientName || "prescription"}.pdf`
        );

      } catch (error) {

        console.error(
          "PDF ERROR:",
          error
        );
      }
    };
    const loginDoctor = async () => {

      try {

        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            doctorId: loginDoctorId,
            password
          }
        );

        setDoctor(res.data.doctor);

        setDoctorName(
          res.data.doctor.doctorName
        );

        setDoctorId(
          res.data.doctor.doctorId
        );

        setIsLoggedIn(true);

      } catch {

        alert("Invalid Login");
      }
    };
    const logout = () => {

      setDoctor(null);

      setDoctorId("");

      setDoctorName("");

      setIsLoggedIn(false);
    };
    return  (
      !isLoggedIn ? (

        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center p-6">

          <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl">

            {/* LEFT SIDE */}

            <div className="bg-gradient-to-br from-blue-700 to-cyan-600 text-white p-12 flex flex-col justify-center">

              <img
                src={belLogo}
                alt="BEL Logo"
                className="w-28 mb-6"
              />

              <h1 className="text-5xl font-bold mb-4">
                BEL Hospital
              </h1>

              <p className="text-xl text-blue-100 mb-8">
                AI Powered Prescription Management System
              </p>

              <div className="space-y-4">

                <div className="bg-white/10 p-4 rounded-xl">
                  🎤 Live Voice Consultation Recording
                </div>

                <div className="bg-white/10 p-4 rounded-xl">
                  🤖 AI Generated Prescriptions
                </div>

                <div className="bg-white/10 p-4 rounded-xl">
                  📄 Professional PDF Generation
                </div>

                <div className="bg-white/10 p-4 rounded-xl">
                  ☁️ Cloud Based Storage
                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="p-12 flex flex-col justify-center">

              <div className="max-w-md mx-auto w-full">

                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Doctor Login
                </h2>

                <p className="text-gray-500 mb-8">
                  Sign in to access the BEL Prescription Portal
                </p>

                <div className="space-y-5">

                  <div>

                    <label className="block mb-2 font-medium text-gray-700">
                      Doctor ID
                    </label>

                    <input
                      type="text"
                      placeholder="Enter Doctor ID"
                      value={loginDoctorId}
                      onChange={(e) =>
                        setLoginDoctorId(e.target.value)
                      }
                      className="w-full border border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />

                  </div>

                  <div>

                    <label className="block mb-2 font-medium text-gray-700">
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="w-full border border-gray-300 p-4 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
                    />

                  </div>

                  <button
                    onClick={loginDoctor}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all"
                  >
                    Login
                  </button>

                </div>

                

              </div>

            </div>

          </div>

        </div>

      ) : (
      
      <div className="min-h-screen bg-slate-100">

        {/* HEADER */}

        <div className="sticky top-0 z-50 bg-white shadow-md border-b">

          <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <img
                src={belLogo}
                alt="BEL Logo"
                className="w-16 h-16 object-contain"
              />

              <div>

                <h1 className="text-3xl font-bold text-blue-700">
                  BEL Hospital
                </h1>

                <p className="text-gray-500">
                  AI Prescription Management System
                </p>

              </div>
            </div>
            <div className="flex items-center gap-6">

              <div>

                <p className="font-semibold">
                  {doctor?.doctorName}
                </p>

                <p className="text-sm text-gray-500">
                  {doctor?.doctorId}
                </p>

              </div>

              <div
                className={`w-3 h-3 rounded-full ${
                  isListening
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-500"
                }`}
              />

              <span className="font-medium text-gray-700">

                {isListening
                  ? "Recording Active"
                  : "Ready"}

              </span>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
              >
                Logout
              </button>

            </div>
          </div>
        </div>

        <div className="max-w-[1800px] mx-auto p-8">

          {/* ACTION BUTTONS */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

            <button
              onClick={startListening}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl shadow-lg"
            >
              Start Recording
            </button>

            <button
              onClick={stopListening}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-lg"
            >
              Stop Recording
            </button>

            <button
              onClick={generatePrescription}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-lg"
            >
              {loading
                ? "Generating..."
                : "Generate"}
            </button>

            <button
              onClick={downloadPDF}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-2xl shadow-lg"
            >
              Export PDF
            </button>

            <button
              onClick={savePrescription}
              className="bg-cyan-700 hover:bg-cyan-800 text-white p-4 rounded-2xl shadow-lg"
            >
              Save
            </button>

            <button
              onClick={resetPrescription}
              className="bg-gray-700 hover:bg-gray-800 text-white p-4 rounded-2xl shadow-lg"
            >
              Reset
            </button>

          </div>

          {/* TOP DASHBOARD */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">

            {/* PATIENT + VITALS */}

            <div className="xl:col-span-1 space-y-8">
            <div className="bg-white rounded-xl p-4 shadow">

              <h3 className="font-bold">
                Logged In Doctor
              </h3>

              <p>{doctor?.doctorName}</p>

              <p>ID: {doctor?.doctorId}</p>

              <p>
                {doctor?.specialization}
              </p>

            </div>

              {/* PATIENT */}

              <div className="bg-white rounded-3xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                  Patient Information
                </h2>

                <div className="space-y-4">

                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={patientName}
                    onChange={(e) =>
                      setPatientName(e.target.value)
                    }
                    className="w-full border p-4 rounded-xl"
                  />

                  <input
                    type="number"
                    placeholder="Age"
                    value={patientAge}
                    onChange={(e) =>
                      setPatientAge(e.target.value)
                    }
                    className="w-full border p-4 rounded-xl"
                  />

                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value)
                    }
                    className="w-full border p-4 rounded-xl"
                  >
                    <option value="">
                      Select Gender
                    </option>
                    <option value="Male">
                      Male
                    </option>
                    <option value="Female">
                      Female
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>
              </div>

              {/* VITALS */}

              <div className="bg-white rounded-3xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-6 text-slate-800">
                  Patient Vitals
                </h2>

                <div className="grid grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Temperature"
                    value={temperature}
                    onChange={(e) =>
                      setTemperature(e.target.value)
                    }
                    className="border p-4 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Oxygen Level"
                    value={oxygenLevel}
                    onChange={(e) =>
                      setOxygenLevel(e.target.value)
                    }
                    className="border p-4 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Blood Pressure"
                    value={bloodPressure}
                    onChange={(e) =>
                      setBloodPressure(e.target.value)
                    }
                    className="border p-4 rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Pulse Rate"
                    value={pulseRate}
                    onChange={(e) =>
                      setPulseRate(e.target.value)
                    }
                    className="border p-4 rounded-xl"
                  />

                </div>
              </div>

            </div>

            {/* LIVE TRANSCRIPT */}

            <div className="xl:col-span-2">

            <div className="bg-white rounded-3xl shadow-lg h-full p-6 border border-gray-200">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800">
                    Live Consultation Transcript
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Real-time voice transcription of doctor's consultation
                  </p>

                </div>

                <div className="flex items-center gap-2">

                  <div
                    className={`w-3 h-3 rounded-full ${
                      isListening
                        ? "bg-red-500 animate-pulse"
                        : "bg-gray-400"
                    }`}
                  />

                  <span className="text-sm font-medium text-gray-600">

                    {isListening
                      ? "Recording"
                      : "Idle"}

                  </span>

                </div>

              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[600px] max-h-[600px] overflow-y-auto">

                {transcript ? (

                  <p className="text-slate-700 text-lg leading-8 whitespace-pre-wrap">
                    {transcript.replace(/\[interim\]/g, "")}
                  </p>

                ) : (

                  <div className="h-full flex flex-col items-center justify-center text-center">

                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">

                      🎤

                    </div>

                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      Waiting for Consultation
                    </h3>

                    <p className="text-gray-500">
                      Start recording to capture the doctor's speech in real time.
                    </p>

                  </div>

                )}

              </div>

            </div>

            </div>

          </div>

          {/* PRESCRIPTION */}

          {prescription && (

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h2 className="text-3xl font-bold mb-8 text-slate-800">
                Generated Prescription
              </h2>

              {/* SYMPTOMS */}

              <div className="mb-8">

                <label className="font-semibold text-lg">
                  Symptoms
                </label>

                <textarea
                  value={prescription.symptoms}
                  onChange={(e) =>
                    handleChange(
                      "symptoms",
                      e.target.value
                    )
                  }
                  className="w-full border p-4 rounded-xl mt-2 min-h-[150px]"
                />

              </div>

              {/* DIAGNOSIS */}

              <div className="mb-8">

                <label className="font-semibold text-lg">
                  Diagnosis
                </label>

                <textarea
                  value={prescription.diagnosis}
                  onChange={(e) =>
                    handleChange(
                      "diagnosis",
                      e.target.value
                    )
                  }
                  className="w-full border p-4 rounded-xl mt-2 min-h-[150px]"
                />

              </div>

              {/* MEDICINES */}

              <div className="mb-8">

                <div className="flex justify-between items-center mb-4">

                  <h3 className="text-2xl font-bold">
                    Medicines
                  </h3>

                  <button
                    onClick={addMedicine}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  >
                    Add Medicine
                  </button>

                </div>

                {prescription.medicines.map(
                  (medicine, index) => (

                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 bg-slate-50 p-4 rounded-2xl border"
                    >

                      <input
                        type="text"
                        placeholder="Medicine Name"
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-xl"
                      />

                      <input
                        type="text"
                        placeholder="Dosage"
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-xl"
                      />

                      <input
                        type="text"
                        placeholder="Duration"
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-xl"
                      />

                      <input
                        type="text"
                        placeholder="Instruction"
                        value={medicine.instruction}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "instruction",
                            e.target.value
                          )
                        }
                        className="border p-3 rounded-xl"
                      />
                      <button
                        onClick={() => removeMedicine(index)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>

              {/* ADVICE */}

              <div>

                <label className="font-semibold text-lg">
                  Advice
                </label>

                <textarea
                  value={prescription.advice}
                  onChange={(e) =>
                    handleChange(
                      "advice",
                      e.target.value
                    )
                  }
                  className="w-full border p-4 rounded-xl mt-2 min-h-[180px]"
                />

              </div>

            </div>
          )}

        </div>
      </div>
    ));
};

export default SpeechRecorder;