import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AiSetup() {
  const [loading, setLoading] = useState(false);
  const [setup, setSetup] = useState(null);

  const fetchSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/ai-recommend");
      const data = await response.json();
      setSetup(data);
    } catch (error) {
      console.error("Error fetching AI setup:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full text-white items-center p-10">
      <h1 className="text-3xl font-bold mb-6">AI Recommended Car Setup</h1>
      <button
        onClick={fetchSetup}
        className="bg-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
      >
        {loading ? "Generating..." : "Generate Setup"}
      </button>

      {setup && (
        <motion.div
          className="mt-8 bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-[900px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 1. Aerodynamics */}
          <h2 className="text-xl font-semibold border-b border-red-600 mb-4">1. Aerodynamics</h2>
          <p>Front Wing Angle: <span className="font-bold">{setup.aerodynamics.frontWing}</span></p>
          <p>Rear Wing Angle: <span className="font-bold">{setup.aerodynamics.rearWing}</span></p>

          {/* 2. Suspension Geometry */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">2. Suspension Geometry</h2>
          <p>Front Camber: <span className="font-bold">{setup.suspensionGeometry.frontCamber}</span></p>
          <p>Rear Camber: <span className="font-bold">{setup.suspensionGeometry.rearCamber}</span></p>
          <p>Front Toe: <span className="font-bold">{setup.suspensionGeometry.frontToe}</span></p>
          <p>Rear Toe: <span className="font-bold">{setup.suspensionGeometry.rearToe}</span></p>

          {/* 3. Suspension */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">3. Suspension</h2>
          <p>Front Suspension: <span className="font-bold">{setup.suspension.frontSuspension}</span></p>
          <p>Rear Suspension: <span className="font-bold">{setup.suspension.rearSuspension}</span></p>
          <p>Front Anti-Roll Bar: <span className="font-bold">{setup.suspension.frontAntiRollBar}</span></p>
          <p>Rear Anti-Roll Bar: <span className="font-bold">{setup.suspension.rearAntiRollBar}</span></p>
          <p>Front Ride Height: <span className="font-bold">{setup.suspension.frontRideHeight}</span></p>
          <p>Rear Ride Height: <span className="font-bold">{setup.suspension.rearRideHeight}</span></p>

          {/* 4. Brakes */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">4. Brakes</h2>
          <p>Brake Pressure: <span className="font-bold">{setup.brakes.pressure}</span></p>
          <p>Brake Bias: <span className="font-bold">{setup.brakes.bias}</span></p>

          {/* 5. Differential */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">5. Differential</h2>
          <p>On-Throttle Differential: <span className="font-bold">{setup.differential.onThrottle}</span></p>
          <p>Off-Throttle Differential: <span className="font-bold">{setup.differential.offThrottle}</span></p>

          {/* 6. Tyres */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">6. Tyres</h2>
          <p>Tyre Pressure (Front/Rear): <span className="font-bold">{setup.tyres.pressure}</span></p>
          <p>Tyre Compound: <span className="font-bold">{setup.tyres.compound}</span></p>

          {/* 7. Transmission */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">7. Transmission</h2>
          <p>Gear Ratios: <span className="font-bold">{setup.transmission.gearRatios}</span></p>

          {/* 8. Weight & Balance */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">8. Weight & Balance</h2>
          <p>Ballast / Weight Distribution: <span className="font-bold">{setup.weightBalance.ballast}</span></p>

          {/* 9. Fuel & Energy */}
          <h2 className="text-xl font-semibold border-b border-red-600 mt-6 mb-4">9. Fuel & Energy</h2>
          <p>Fuel Load: <span className="font-bold">{setup.fuelAndEnergy.fuelLoad}</span></p>
          <p>ERS Deployment Mode: <span className="font-bold">{setup.fuelAndEnergy.ersMode}</span></p>
        </motion.div>
      )}
    </div>
  );
}
    