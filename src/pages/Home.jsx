import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoSparkles } from "react-icons/io5";
import { RiAiGenerate2 } from "react-icons/ri";
import { GiArtificialHive } from "react-icons/gi";
import { FaHistory, FaTrash } from "react-icons/fa";

// Components
import Player from "../components/Player";
import SelectField from "../components/SelectField";

function Home() {
  const navigate = useNavigate();
  const [getStart, setGetStart] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [setupHistory, setSetupHistory] = useState([]);

  // ✅ Load setup history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("setupHistory") || "[]");
    setSetupHistory(history.slice(0, 5)); // Show last 5 setups
  }, []);

  // ✅ Fetch track data from backend
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📡 Fetching tracks from backend...");

        const response = await fetch("http://localhost:5000/tracks");

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("✅ Tracks loaded:", data);
        setTracks(data);
      } catch (error) {
        console.error("❌ Error fetching tracks:", error);
        setError("Failed to load tracks. Using default list.");
        setTracks([
          "Bahrain", "Saudi Arabia", "Australia", "Japan", "China", "Miami",
          "Imola", "Monaco", "Canada", "Spain", "Austria", "Great Britain",
          "Hungary", "Belgium", "Netherlands", "Italy", "Azerbaijan",
          "Singapore", "USA", "Mexico", "Brazil", "Las Vegas", "Qatar", "Abu Dhabi"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // ✅ Save setup to history
  const saveToHistory = (trackName, weather) => {
    const newSetup = {
      id: Date.now(),
      trackName,
      weather,
      date: new Date().toLocaleString(),
    };

    const history = JSON.parse(localStorage.getItem("setupHistory") || "[]");
    const updatedHistory = [newSetup, ...history].slice(0, 10); // Keep last 10
    localStorage.setItem("setupHistory", JSON.stringify(updatedHistory));
    setSetupHistory(updatedHistory.slice(0, 5));
  };

  // ✅ Delete setup from history
  const deleteFromHistory = (id) => {
    const history = JSON.parse(localStorage.getItem("setupHistory") || "[]");
    const updatedHistory = history.filter(setup => setup.id !== id);
    localStorage.setItem("setupHistory", JSON.stringify(updatedHistory));
    setSetupHistory(updatedHistory.slice(0, 5));
  };

  // ✅ Load setup from history
  const loadSetup = (setup) => {
    setSelectedTrack(setup.trackName);
    setSelectedWeather(setup.weather);
    setGetStart(true);
  };

  // ✅ Handle recommendation generation
  const handleGenerateRecommendations = async (e) => {
    e.preventDefault();
    console.log("🔥 Button clicked!");
    console.log("📍 Selected Track:", selectedTrack);
    console.log("🌤️ Selected Weather:", selectedWeather);

    if (!selectedTrack || !selectedWeather) {
      alert("Please select both track and weather!");
      return;
    }

    try {
      console.log("📡 Sending request to http://localhost:5000/result");

      const response = await fetch("http://localhost:5000/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackName: selectedTrack,
          weather: selectedWeather,
        }),
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("📊 Data received:", data);

      if (data.success) {
        console.log("✅ Success! Navigating to /results");
        saveToHistory(selectedTrack, selectedWeather); // Save to history
        navigate("/results", { state: { results: data } });
      } else {
        alert("Failed to get recommendations from AI");
      }
    } catch (error) {
      console.error("❌ Error occurred:", error);
      alert("Error connecting to server. Please check if backend is running on port 5000.");
    }
  };

  // ✅ Handle AI Analysis Navigation
  const handleViewAIAnalysis = () => {
    if (!selectedTrack || !selectedWeather) {
      alert("Please select both track and weather!");
      return;
    }

    console.log("🤖 Navigating to AI Analysis for:", selectedTrack, selectedWeather);

    localStorage.setItem("aiRecommenderVisible", "true");

    navigate("/aiexplanation", {
      state: { trackName: selectedTrack, weather: selectedWeather },
    });
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center p-4 min-h-full w-full relative overflow-hidden">
      <Player customClass="absolute top-0 right-0" />

      {/* ✅ F1 Logo */}
      
      
      {/* INTRO */}
      <motion.div
        animate={{ y: getStart ? -10 : 0, scale: getStart ? 0.9 : 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
        className="commonBg text-center z-10"
      >
        <motion.img
          src="/imgs/f1.png"
          alt="F1 Logo"
          className="w-44 h-44 mx-auto mb-4 object-contain"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.h1
          className="font-azonix text-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          AI - CAR SETUP RECOMMENDER
        </motion.h1>

        <motion.p
          className="text-white/50 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Get your optimal F1 car setup instantly — track, weather, and AI logic combined
        </motion.p>

        <motion.ul
          className="flex gap-5 justify-center mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button className="commonBtn flex items-center gap-2" onClick={() => setGetStart(!getStart)}>
            <IoSparkles className="text-lg" />
            {getStart ? "RESET" : "GET STARTED"}
          </button>
        </motion.ul>
      </motion.div>

      {/* FORM DIV */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: getStart ? 1 : 0, y: getStart ? 0 : 80 }}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
        className="commonBg text-center z-0"
      >
        <motion.h2
          className="font-azonix text-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: getStart ? 1 : 0, scale: getStart ? 1 : 0.9 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          ENTER TRACK & WEATHER INFO
        </motion.h2>

        <ul className="flex gap-5 flex-wrap justify-center items-center text-sm mt-5">
          {/* Track Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: getStart ? 1 : 0, y: getStart ? 0 : 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {loading ? (
              <p className="text-white/50">Loading tracks...</p>
            ) : (
              <SelectField
                label="SELECT YOUR TRACK"
                name="track"
                options={tracks}
                className="commonDropDowns"
                onChange={(e) => setSelectedTrack(e.target.value)}
                value={selectedTrack}
              />
            )}
          </motion.div>

          {/* Weather Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: getStart ? 1 : 0, y: getStart ? 0 : 20 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <SelectField
              label="SELECT THE WEATHER"
              name="weather"
              options={["Dry", "Rainy", "Foggy"]}
              className="commonDropDowns"
              onChange={(e) => setSelectedWeather(e.target.value)}
              value={selectedWeather}
            />
          </motion.div>

          {/* Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateRecommendations}
            className="commonBtn flex items-center gap-4 cursor-pointer"
          >
            <RiAiGenerate2 className="text-xl" />
            GET RECOMMENDATIONS
          </motion.button>
        </ul>
      </motion.div>

      {/* ✅ SETUP HISTORY SECTION */}
      {setupHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="commonBg w-full max-w-4xl z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <FaHistory className="text-red-500 text-xl" />
            <h2 className="font-azonix text-lg text-white">RECENT SETUPS</h2>
          </div>

          <div className="space-y-3">
            {setupHistory.map((setup) => (
              <motion.div
                key={setup.id}
                whileHover={{ scale: 1.02 }}
                className="bg-black/30 border border-red-900/50 rounded-lg p-4 flex items-center justify-between hover:bg-black/40 transition-all"
              >
                <div className="flex-1 cursor-pointer" onClick={() => loadSetup(setup)}>
                  <p className="text-white font-bold">{setup.trackName}</p>
                  <p className="text-gray-400 text-sm">
                    {setup.weather} • {setup.date}
                  </p>
                </div>
                <button
                  onClick={() => deleteFromHistory(setup.id)}
                  className="text-red-500 hover:text-red-400 transition-colors p-2"
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Home;