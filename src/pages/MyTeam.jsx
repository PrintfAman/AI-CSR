import React from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa"; // driver icon

const teammates = [
  {
    name: "Amanpreet Singh Khanna",
    role: "Team Leader / Frontend Developer",
    delay: 0.2,
  },
  {
    name: "Aakarshit Thakur",
    role: "Backend Developer",
    delay: 0.4,
  },
  {
    name: "Amitoshdeep Singh",
    role: "FRONTEND DEVELOPER & TESTER",
    delay: 0.6,
  },
  {
    name: "Akshat",
    role: "UI/UX Designer",
    delay: 0.8,
  },
];

export default function MyTeam() {
  return (
    <div className="flex flex-col justify-center items-center p-8 text-white min-h-screen relative overflow-hidden">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-azonix text-3xl mb-8 text-red-500 tracking-wide"
      >
        🏎️ MY TEAM
      </motion.h1>

      {/* Team Leader Section - same size & layout as others */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-gradient-to-br from-black/60 via-red-950/20 to-black/60 border border-red-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-red-800/50 transition w-full max-w-xs md:max-w-sm mb-6"
      >
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-4xl text-white/60" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Amanpreet Singh Khanna
            </h3>
            <p className="text-gray-300 text-sm">
              Team Leader / Frontend Developer
            </p>
          </div>
        </div>
      </motion.div>

      {/* Teammates Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teammates.slice(1).map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: member.delay, duration: 0.6 }}
            className="bg-gradient-to-br from-black/60 via-red-950/20 to-black/60 border border-red-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-red-800/50 transition w-full max-w-xs md:max-w-sm"
          >
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-4xl text-white/60" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-gray-300 text-sm">{member.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
