import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Player from "../components/Player";

function AIExplanation() {
  const location = useLocation();
  const { trackName, weather } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    if (!trackName || !weather) return;

    // ✅ Give access to AI Recommender when this page loads successfully
    localStorage.setItem("aiAccess", "true");

    setLoading(true);

    // Generate detailed AI insights based on weather
    let baseIntro = `AI Analysis for ${trackName} (${weather} Conditions): `;
    let text = "";

    if (weather === "Dry") {
      text = `${baseIntro}Under dry conditions, the ${trackName} circuit demands exceptional aerodynamic balance and efficient tire management. 
      The AI recommends medium downforce levels to maintain corner stability while maximizing top speed on straights. 
      Suspension should be moderately stiff to handle high-speed corners effectively, but not too rigid to avoid traction loss. 
      Braking zones require precise modulation to prevent overheating during longer stints. 
      Differential settings must ensure smooth acceleration while minimizing understeer on tight turns. 
      Tire pressures should be optimized for even wear across all four corners. 
      Fuel mapping can be slightly aggressive to capitalize on clean track conditions. 
      AI predicts that maintaining consistent lap pace, coupled with strategic DRS utilization, provides the best race performance and tire longevity across the entire stint.`;
    } else if (weather === "Rainy") {
      text = `${baseIntro}Wet conditions at ${trackName} completely transform the handling dynamics. 
      The AI suggests increasing aerodynamic downforce to maximize grip, and softening suspension to maintain tire contact over puddles. 
      Tire selection must prioritize wet compounds with proper water dispersion. 
      Brake bias should shift slightly rearward to prevent front locking in wet zones. 
      Throttle application must be smoother to reduce wheelspin during acceleration. 
      Drivers should use higher gears in low-speed corners to maintain stability. 
      Visibility becomes a key factor; hence, maintaining consistent racing lines helps prevent aquaplaning. 
      Fuel consumption rises marginally due to reduced speeds and prolonged braking. 
      The AI also recommends adaptive pit strategies for potential drying conditions or mid-race weather transitions.`;
    } else if (weather === "Foggy") {
      text = `${baseIntro}Fog introduces unique visibility and temperature challenges at ${trackName}. 
      The AI advises prioritizing predictability over raw pace. 
      Mid-range downforce ensures control through blind corners without excessive drag. 
      Brake bias should shift slightly rearward to prevent lockups under uncertain braking points. 
      Tire pressures should be slightly increased to retain heat in cooler air conditions. 
      Communication between driver and engineer becomes vital for anticipating braking markers. 
      Electronic aids such as traction and stability control should be fine-tuned for smoother engagement. 
      The AI also recommends conservative fuel mapping, as fog can extend safety car periods or delay starts. 
      Maintaining calm rhythm and smooth inputs will deliver consistency and minimize errors in these low-visibility sessions.`;
    }

    setTimeout(() => {
      setAnalysis(text);
      setLoading(false);
    }, 1000);
  }, [trackName, weather]);

  return (
    <div className="flex flex-col gap-8 justify-center items-center p-4 min-h-full w-full relative overflow-hidden">
      {/* Hyperspeed Background */}
      <Player customClass="absolute top-0 right-0" />

      {/* Header Section */}
      <motion.div
        className="commonBg text-center z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="font-azonix text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI ANALYSIS & INSIGHTS
        </motion.h1>

        <motion.p
          className="text-white/50 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Detailed AI breakdown of your car setup based on track & weather
        </motion.p>
      </motion.div>

      {/* Analysis Box */}
      <motion.div
        className="commonBg text-center z-10 p-6 max-w-3xl"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {loading ? (
          <motion.p
            className="text-white/40 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              repeatType: "reverse",
            }}
          >
            🔍 Generating AI insights...
          </motion.p>
        ) : (
          <motion.div
            className="text-sm text-white/80 text-justify leading-relaxed bg-white/5 p-4 rounded-2xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {analysis}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default AIExplanation;
