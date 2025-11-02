import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BiSolidDashboard } from "react-icons/bi";
import { GiArtificialHive } from "react-icons/gi";
import { FaGlobeAmericas, FaTools } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";

function Navbar() {
  const [canViewAI, setCanViewAI] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("aiAccess");
    setCanViewAI(access === "true");
  }, []);

  return (
    <div
      className='flex flex-col p-4
      bg-red-900/20 backdrop-blur-2xl
      h-4/5 w-80
      border-r-4 border-b-4 border-t-2
      border-red-500/20
      rounded-2xl'>

      <NavLink to={`/`} className='text-2xl font-azonix border-b-2 border-white/10 px-2.5 py-1'>
        AI - CSR
      </NavLink>

      <ul className='p-2.5'>

        <NavLink
          to={`/dashboard`}
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2 ${isActive ? "bg-white/10" : ""}`
          }>
          <BiSolidDashboard />
          <p>Dashboard</p>
        </NavLink>

        <NavLink
          to={`/tracks`}
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2 ${isActive ? "bg-white/10" : ""}`
          }>
          <FaGlobeAmericas />
          <p>Tracks</p>
        </NavLink>

        {canViewAI && (
          <NavLink
            to={`/engineer`}
            className={({ isActive }) =>
              `flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2 ${isActive ? "bg-white/10" : ""}`
            }>
            <GiArtificialHive />
            <p>ASK AI</p>
          </NavLink>
        )}
             <NavLink
        to={`/pit`}
        className={ ({isActive})=> `duration-900 flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2

        ${isActive? "bg-white/10":""}`}>

          <FaTools />
          <p>Pit Stop</p>
        </NavLink>

        <NavLink
  to={`/myteam`}
  className={({ isActive }) => `flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2
  ${isActive ? "bg-white/10" : ""}`}>

  <FaUsers /> {/* import this at top from react-icons/fa */}
  <p>My Team</p>
</NavLink>


      </ul>
    </div>
  );
}

export default Navbar;
