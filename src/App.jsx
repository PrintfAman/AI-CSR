import React from 'react'
import { Routes, Route } from 'react-router-dom'
import EngineerChat from "./pages/EngineerChat"; // import at top

// Components
import Hyperspeed from './components/Hyperspeed'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RealHome from './pages/RealHome'
import Results from './pages/Results'
import Tracks from './pages/Tracks'
import AIExplanation from './pages/AIExplanation'
import PitStop from './pages/pitStop'
import MyTeam from "./pages/MyTeam";






function App() {
  return (
    <div
    data-scroll-container
    className='h-screen w-screen bg-black relative overflow-x-hidden text-white font-montserrat cursor-default'>

      <div className='h-screen w-screen absolute top-0 left-0 overflow-hidden'>
        <Hyperspeed
          effectOptions={{
          onSpeedUp: () => { },
          onSlowDown: () => { },
          distortion: 'turbulentDistortion',
          length: 400,
          roadWidth: 20,
          islandWidth: 2,
          lanesPerRoad: 4,
          fov: 90,
          fovSpeedUp: 150,
          speedUp: 2,
          carLightsFade: 0.4,
          totalSideLightSticks: 20,
          lightPairsPerRoadWay: 40,
          shoulderLinesWidthPercentage: 0.05,
          brokenLinesWidthPercentage: 0.1,
          brokenLinesLengthPercentage: 0.5,
          lightStickWidth: [0.12, 0.5],
          lightStickHeight: [1.3, 1.7],
          movingAwaySpeed: [60, 80],
          movingCloserSpeed: [-120, -160],
          carLightsLength: [400 * 0.03, 400 * 0.2],
          carLightsRadius: [0.05, 0.14],
          carWidthPercentage: [0.3, 0.5],
          carShiftX: [-0.8, 0.8],
          carFloorSeparation: [0, 5],
          colors: {
            roadColor: 0x0d0d0d,
            islandColor: 0x1a1a1a,
            background: 0x000000,
            shoulderLines: 0xb30000,
            brokenLines: 0xff1e00,
            leftCars: [0xd90429, 0xff1e00, 0x9b0000],
            rightCars: [0xcccccc, 0x999999, 0xe5e5e5],
            sticks: 0xff1e00
          }
        }}
        />
      </div>

      <div
      className='
      flex relative
      z-10 min-h-screen h-full
      p-4
      '>

        {/* NAV DIV */}
        <div
        className='
        flex items-center py-4 pr-4
        '>
          <Navbar/>
        </div>

        <ScrollToTop />

        <Routes>
  <Route path='/' element={<RealHome />} />
  <Route path='/dashboard' element={<Home />} />
  <Route path='/results' element={<Results/>} />
  <Route path='/tracks' element={<Tracks/>} />
  <Route path='/aiexplanation' element={<AIExplanation />} />
 <Route path='/pit' element={<PitStop/>} />
 <Route path="/engineer" element={<EngineerChat/>} />
 <Route path="/myteam" element={<MyTeam />} />
  

</Routes>


      </div>

    </div>
  )
}

export default App