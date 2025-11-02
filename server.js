import express from "express";
import cors from "cors";
import OpenAI from "openai"; 
import axios from "axios";

const app = express();

// ✅ CORS - Allow ALL localhost ports for development
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ All F1 Tracks
const tracks = [
  "Bahrain", "Saudi Arabia", "Australia", "Japan", "China", "Miami", "Imola",
  "Monaco", "Canada", "Spain", "Austria", "Great Britain", "Hungary", "Belgium",
  "Netherlands", "Italy", "Azerbaijan", "Singapore", "USA", "Mexico", "Brazil",
  "Las Vegas", "Qatar", "Abu Dhabi", "Monza", "Silverstone", "Spa", "Suzuka"
];

// ✅ Health Check
app.get("/", (req, res) => {
  res.json({ 
    message: "✅ F1 Setup Backend is running!", 
    status: "OK",
    endpoints: {
      tracks: "GET /tracks",
      recommendations: "POST /result",
      chat: "POST /ask-engineer"
    }
  });
});

// ✅ Get all tracks
app.get("/tracks", (req, res) => {
  console.log("📍 Tracks requested");
  res.json(tracks);
});

// ✅ AI Setup Route
app.post("/result", (req, res) => {
  console.log("🏎️  Setup request received:", req.body);
  
  const { trackName, weather } = req.body;
  
  if (!trackName || !weather) {
    return res.status(400).json({ 
      success: false, 
      error: "Track name and weather are required" 
    });
  }

  let recommendations = [];
  let explanation = "";
  let setupDetails = {
    downforce: "Medium",
    suspension: "Medium",
    tirePressure: "23.0 PSI",
    brakeBias: "56%",
    notes: "Balanced setup for optimal performance."
  };

  const track = trackName.toLowerCase();

  // COMPLETE SWITCH STATEMENT WITH ALL TRACKS
  if (track.includes("monza") || track.includes("italy")) {
    explanation = "Monza is all about straight-line speed with minimal corners. The Temple of Speed requires very low downforce to maximize velocity on the long straights.";
    setupDetails = {
      downforce: "Very Low",
      suspension: "Stiff",
      tirePressure: "22.5 PSI",
      brakeBias: "59%",
      notes: "Minimize drag, focus on straight-line speed."
    };
    recommendations = [
      "Use very low downforce to maximize top speed on straights (340+ km/h possible).",
      "Stiffer suspension for stability under heavy braking into chicanes.",
      "Increase front brake bias (58-60%) for late braking.",
      "Run lower tire pressures for better traction out of slow corners."
    ];
  } else if (track.includes("monaco")) {
    explanation = "Monaco demands maximum downforce and precise handling through the tightest corners in F1.";
    setupDetails = {
      downforce: "Maximum",
      suspension: "Very Soft",
      tirePressure: "21.5 PSI",
      brakeBias: "60%",
      notes: "Prioritize cornering grip over top speed."
    };
    recommendations = [
      "Use maximum downforce for tight corners.",
      "Softer suspension for better grip on bumpy streets.",
      "High front brake bias for precise braking at hairpins.",
      "Lower tire pressures for maximum mechanical grip."
    ];
  } else if (track.includes("silverstone") || track.includes("great britain")) {
    explanation = "Silverstone features fast, flowing corners requiring high downforce and responsive handling.";
    setupDetails = {
      downforce: "High",
      suspension: "Medium-Stiff",
      tirePressure: "22.8 PSI",
      brakeBias: "57%",
      notes: "Balance between high-speed stability and cornering grip."
    };
    recommendations = [
      "High downforce for fast corners like Maggots-Becketts.",
      "Medium-stiff suspension for high-speed stability.",
      "Balanced brake bias for varied corner speeds.",
      "Slightly lower tire pressures for better lateral grip."
    ];
  } else if (track.includes("spa") || track.includes("belgium")) {
    explanation = "Spa requires a compromise between low drag for straights and downforce for Eau Rouge.";
    setupDetails = {
      downforce: "Medium-Low",
      suspension: "Medium",
      tirePressure: "23.2 PSI",
      brakeBias: "56%",
      notes: "Balanced setup for both straights and fast corners."
    };
    recommendations = [
      "Medium-low downforce for Kemmel straight speed.",
      "Balanced suspension for varied corner types.",
      "Standard brake bias with slight rear preference.",
      "Monitor weather - rain common at Spa."
    ];
  } else if (track.includes("suzuka") || track.includes("japan")) {
    explanation = "Suzuka is technical requiring high downforce and excellent balance through the esses.";
    setupDetails = {
      downforce: "High",
      suspension: "Medium",
      tirePressure: "22.5 PSI",
      brakeBias: "58%",
      notes: "Prioritize mid-corner stability and traction."
    };
    recommendations = [
      "High downforce for the challenging esses section.",
      "Balanced suspension for technical corners.",
      "Slightly forward brake bias for heavy braking zones.",
      "Lower tire pressures for better mechanical grip."
    ];
  } else if (track.includes("singapore")) {
    explanation = "Singapore is a street circuit with many slow corners and heavy braking zones.";
    setupDetails = {
      downforce: "Very High",
      suspension: "Soft",
      tirePressure: "21.8 PSI",
      brakeBias: "59%",
      notes: "Maximum grip for tight corners and hard braking."
    };
    recommendations = [
      "Very high downforce for slow-speed corners.",
      "Soft suspension for street circuit bumps.",
      "Forward brake bias for numerous heavy braking zones.",
      "Lower tire pressures for mechanical grip."
    ];
  } else if (track.includes("bahrain")) {
    explanation = "Bahrain features long straights with abrasive surface causing high tire wear.";
    setupDetails = {
      downforce: "Medium",
      suspension: "Medium-Stiff",
      tirePressure: "23.5 PSI",
      brakeBias: "57%",
      notes: "Balance speed with tire conservation."
    };
    recommendations = [
      "Medium downforce balancing straights and corners.",
      "Medium-stiff suspension for stability.",
      "Balanced brake bias for varied corner types.",
      "Higher tire pressures to manage wear on abrasive surface."
    ];
  } else if (track.includes("miami")) {
    explanation = "Miami features high-speed sections and tight chicanes on bumpy street surface.";
    setupDetails = {
      downforce: "Medium-High",
      suspension: "Medium-Soft",
      tirePressure: "22.2 PSI",
      brakeBias: "58%",
      notes: "Versatile setup for mixed corner speeds."
    };
    recommendations = [
      "Medium-high downforce for street circuit characteristics.",
      "Medium-soft suspension for bumpy surface.",
      "Forward brake bias for hard braking into chicanes.",
      "Manage brake and tire temperatures in Florida heat."
    ];
  } else if (track.includes("hungary")) {
    explanation = "Hungaroring is tight and twisty requiring maximum downforce like Monaco.";
    setupDetails = {
      downforce: "Very High",
      suspension: "Soft",
      tirePressure: "21.5 PSI",
      brakeBias: "58%",
      notes: "Prioritize cornering over top speed."
    };
    recommendations = [
      "Very high downforce for slow-speed corners.",
      "Soft suspension for better mechanical grip.",
      "Balanced brake bias for constant braking.",
      "Setup for qualifying - overtaking very difficult."
    ];
  } else if (track.includes("netherlands") || track.includes("zandvoort")) {
    explanation = "Zandvoort features banked corners requiring high downforce and stiff suspension.";
    setupDetails = {
      downforce: "High",
      suspension: "Stiff",
      tirePressure: "23.0 PSI",
      brakeBias: "57%",
      notes: "Stiff suspension for extreme lateral loads in banking."
    };
    recommendations = [
      "High downforce to exploit banked corners.",
      "Stiff suspension to handle high lateral G-forces.",
      "Standard tire pressures for consistency.",
      "Qualifying crucial on narrow track."
    ];
  } else if (track.includes("canada") || track.includes("montreal")) {
    explanation = "Montreal requires low downforce for long straights with heavy braking zones.";
    setupDetails = {
      downforce: "Low",
      suspension: "Medium-Soft",
      tirePressure: "22.5 PSI",
      brakeBias: "59%",
      notes: "Low drag for speed, brake cooling critical."
    };
    recommendations = [
      "Low downforce for maximum straight-line speed.",
      "Forward brake bias for extreme braking zones.",
      "Brake cooling CRITICAL - most demanding for brakes.",
      "Watch for brake failures - manage temperatures carefully."
    ];
  } else if (track.includes("austria")) {
    explanation = "Red Bull Ring is short with fast corners and elevation changes.";
    setupDetails = {
      downforce: "Medium-Low",
      suspension: "Medium",
      tirePressure: "23.0 PSI",
      brakeBias: "56%",
      notes: "Balance for fast corners and short straights."
    };
    recommendations = [
      "Medium-low downforce for fast-flowing layout.",
      "Balanced suspension for elevation changes.",
      "Watch track limits at Turns 9 and 10.",
      "Short lap means constant traffic in qualifying."
    ];
  } else if (track.includes("brazil") || track.includes("interlagos")) {
    explanation = "Interlagos runs anti-clockwise with dramatic elevation and unpredictable weather.";
    setupDetails = {
      downforce: "High",
      suspension: "Medium-Soft",
      tirePressure: "22.5 PSI",
      brakeBias: "57%",
      notes: "High downforce for technical layout."
    };
    recommendations = [
      "High downforce for technical sections and elevation.",
      "Medium-soft suspension for bumpy surface.",
      "Watch weather closely - rain can arrive suddenly.",
      "Anti-clockwise layout affects tire management."
    ];
  } else if (track.includes("mexico")) {
    explanation = "High altitude reduces air density affecting power and downforce.";
    setupDetails = {
      downforce: "High",
      suspension: "Medium-Stiff",
      tirePressure: "23.5 PSI",
      brakeBias: "58%",
      notes: "Compensate for thin air with higher downforce."
    };
    recommendations = [
      "Higher downforce to compensate for thin air.",
      "Forward brake bias - reduced engine braking.",
      "Brake cooling important despite reduced air density.",
      "Expect slower lap times due to altitude effects."
    ];
  } else if (track.includes("usa") || track.includes("austin") || track.includes("cota")) {
    explanation = "COTA features challenging first sector and varied terrain.";
    setupDetails = {
      downforce: "Medium-High",
      suspension: "Medium",
      tirePressure: "22.8 PSI",
      brakeBias: "57%",
      notes: "Versatile setup for varied corner types."
    };
    recommendations = [
      "Medium-high downforce for technical first sector.",
      "Balanced suspension for varied terrain.",
      "Turn 1 uphill makes braking point difficult to judge.",
      "Bumpy surface especially at Turn 1 and Turn 9."
    ];
  } else if (track.includes("las vegas") || track.includes("vegas")) {
    explanation = "Fastest street circuit with incredible speeds down The Strip.";
    setupDetails = {
      downforce: "Low",
      suspension: "Medium-Stiff",
      tirePressure: "22.0 PSI",
      brakeBias: "59%",
      notes: "Ultra-low drag for incredible top speeds."
    };
    recommendations = [
      "Low downforce for maximum speed on The Strip (342+ km/h).",
      "Cold track temperatures make warming tires challenging.",
      "Most corners are 90-degrees - focus on braking.",
      "Night race visibility different - watch for glare."
    ];
  } else if (track.includes("qatar") || track.includes("losail")) {
    explanation = "Losail has most abrasive surface in F1 causing extreme tire wear.";
    setupDetails = {
      downforce: "Medium-High",
      suspension: "Medium",
      tirePressure: "24.0 PSI",
      brakeBias: "56%",
      notes: "Higher pressures essential for wear management."
    };
    recommendations = [
      "Medium-high downforce for fast corners.",
      "HIGHER tire pressures (23.5-24.5 PSI) for wear management.",
      "Expect 2-3 stop strategies - surface destroys tires.",
      "Curb-riding necessary but damages tires further."
    ];
  } else if (track.includes("abu dhabi") || track.includes("yas")) {
    explanation = "Yas Marina transitions from day to night with technical sections.";
    setupDetails = {
      downforce: "High",
      suspension: "Medium",
      tirePressure: "22.5 PSI",
      brakeBias: "57%",
      notes: "Adapt to changing light and temperature."
    };
    recommendations = [
      "High downforce for slow-speed technical sections.",
      "Track temperature drops 10-15°C during race.",
      "Hotel section very tight under artificial lights.",
      "Season finale pressure affects strategy."
    ];
  } else if (track.includes("azerbaijan") || track.includes("baku")) {
    explanation = "Most extreme circuit - narrowest section and longest straight (2.2km).";
    setupDetails = {
      downforce: "Low",
      suspension: "Soft",
      tirePressure: "21.5 PSI",
      brakeBias: "60%",
      notes: "Low drag essential despite tight castle section."
    };
    recommendations = [
      "Low downforce mandatory for 2.2km straight at 350+ km/h.",
      "Castle section narrowest in F1 at 7.6m - precision critical.",
      "Expect safety cars - narrow track and walls everywhere.",
      "Slipstream effect extreme - worth 0.3-0.4 seconds."
    ];
  } else if (track.includes("saudi") || track.includes("jeddah")) {
    explanation = "Fastest street circuit with average speeds over 250 km/h.";
    setupDetails = {
      downforce: "Medium",
      suspension: "Medium-Stiff",
      tirePressure: "22.8 PSI",
      brakeBias: "57%",
      notes: "Balance high-speed stability with street demands."
    };
    recommendations = [
      "Medium downforce for high-speed street corners.",
      "Turn 13 blind and flat-out at 300+ km/h.",
      "Walls everywhere - no margin for error.",
      "Expect multiple safety car periods."
    ];
  } else if (track.includes("australia") || track.includes("melbourne") || track.includes("albert")) {
    explanation = "Fast semi-street circuit with mix of high and low-speed corners.";
    setupDetails = {
      downforce: "Medium-High",
      suspension: "Medium",
      tirePressure: "22.5 PSI",
      brakeBias: "57%",
      notes: "Season opener means limited preparation."
    };
    recommendations = [
      "Medium-high downforce for varied corner speeds.",
      "Season opener - limited running to get setup right.",
      "Turn 1 often chaotic on first lap.",
      "Weather unpredictable in March - rain possible."
    ];
  } else if (track.includes("china") || track.includes("shanghai")) {
    explanation = "Shanghai features unique 270-degree Turn 1 and diverse layout.";
    setupDetails = {
      downforce: "Medium-High",
      suspension: "Medium",
      tirePressure: "23.0 PSI",
      brakeBias: "57%",
      notes: "Turn 1 exit speed affects entire lap."
    };
    recommendations = [
      "Turn 1 unique 270-degree corner - carry maximum speed.",
      "Turns 7-8-9 very technical - good rhythm essential.",
      "Back straight main overtaking zone.",
      "Weather variable - rain possible."
    ];
  } else if (track.includes("imola")) {
    explanation = "Historic narrow circuit with old-school character and limited overtaking.";
    setupDetails = {
      downforce: "High",
      suspension: "Medium-Stiff",
      tirePressure: "22.5 PSI",
      brakeBias: "58%",
      notes: "Qualifying crucial due to overtaking difficulty."
    };
    recommendations = [
      "High downforce essential for qualifying pace.",
      "Variante Alta (Turn 2) very challenging.",
      "Very narrow - wheel-to-wheel racing difficult.",
      "Sprint format often used - limited practice time."
    ];
  } else if (track.includes("spain") || track.includes("barcelona") || track.includes("catalunya")) {
    explanation = "Ultimate benchmark circuit testing every aspect of car performance.";
    setupDetails = {
      downforce: "Medium-High",
      suspension: "Medium",
      tirePressure: "23.0 PSI",
      brakeBias: "57%",
      notes: "Reveals overall package strengths and weaknesses."
    };
    recommendations = [
      "Medium-high downforce for all-round performance.",
      "Turn 3 high-speed challenge requires downforce and bravery.",
      "Pre-season testing venue - teams know circuit intimately.",
      "Exposes car weaknesses across all performance areas."
    ];
  } else {
    explanation = `${trackName} requires a balanced approach with careful setup optimization based on track characteristics.`;
    recommendations = [
      "Analyze telemetry data for optimal setup direction.",
      "Balance downforce between straights and corners.",
      "Adjust suspension based on track surface conditions.",
      "Fine-tune brake bias for driver preference and confidence."
    ];
  }

  // ✅ Weather adjustments
  const weatherLower = weather.toLowerCase();
  if (weatherLower === "rainy" || weatherLower === "wet") {
    explanation += "\n\nWET WEATHER ALERT: Significant setup changes required for rain conditions. Safety and grip take absolute priority.";
    setupDetails.downforce = "Maximum";
    setupDetails.suspension = "Softer";
    setupDetails.tirePressure = "20.5 PSI";
    const currentBias = parseInt(setupDetails.brakeBias);
    setupDetails.brakeBias = (currentBias - 2) + "%";
    setupDetails.notes = "WET WEATHER SETUP: Maximum grip and stability prioritized.";
    
    recommendations.unshift("SWITCH TO INTERMEDIATE/WET TIRES based on standing water levels.");
    recommendations.push("Reduce brake bias rearward to prevent front locking.");
    recommendations.push("Softer suspension for better water displacement.");
    recommendations.push("Lower tire pressures (20-21 PSI) for increased contact patch.");
  } else if (weatherLower === "foggy") {
    explanation += "\n\nFOGGY CONDITIONS: Visibility is primary concern.";
    setupDetails.notes += " Foggy conditions require visibility management.";
    recommendations.push("Reduce following distance - visibility may be under 50 meters.");
    recommendations.push("Use full wet setup if fog accompanies damp track.");
  }

  console.log("✅ Sending complete recommendations for:", trackName);

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ 
    success: true, 
    trackName, 
    weather, 
    explanation, 
    recommendations, 
    setupDetails 
  });
});

// ✅ Enhanced AI Engineer Chat Route
app.post("/ask-engineer", async (req, res) => {
  console.log("💬 Engineer chat request:", req.body);
  
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ 
      success: false, 
      error: "Message is required" 
    });
  }

  try {
    const reply = getF1Response(message);
    res.json({ 
      success: true, 
      reply 
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({ 
      success: false, 
      error: "AI engineer error" 
    });
  }
});

// ✅ Comprehensive F1 Response Function
function getF1Response(message) {
  const msgLower = message.toLowerCase();

  // TIRE MANAGEMENT
  if (msgLower.includes("tire") || msgLower.includes("tyre")) {
    if (msgLower.includes("manage") || msgLower.includes("save") || msgLower.includes("preserve")) {
      return "🛞 Tire Management Tips:\n• Smooth inputs - avoid aggressive steering/braking\n• Lift and coast before braking zones\n• Use higher gears in slow corners to reduce wheelspin\n• Stay off curbs when possible\n• Monitor temps: <100°C = underheating, >110°C = overheating\n• Soft: 10-15 laps, Medium: 20-30 laps, Hard: 30-40+ laps";
    }
    if (msgLower.includes("compound") || msgLower.includes("choice") || msgLower.includes("choose")) {
      return "🛞 Tire Compound Selection:\n• Soft (Red): Fastest but wears quickly, best for qualifying & short stints\n• Medium (Yellow): Balanced performance, versatile for most strategies\n• Hard (White): Slowest but longest life, for high-deg tracks\n• Intermediate (Green): Light rain, damp track\n• Wet (Blue): Heavy rain, standing water\n\nTrack temp matters: Hot = use harder, Cold = use softer!";
    }
    if (msgLower.includes("pressure")) {
      return "🛞 Tire Pressure Guide:\n• Standard: 23.0-23.5 PSI\n• Street circuits: 21.5-22.5 PSI (more grip)\n• Wet conditions: 20.0-21.0 PSI (larger contact patch)\n• High speed tracks: 23.5-24.0 PSI\n• Qatar/Bahrain: 24.0+ PSI (high wear tracks)\n\nLower = more grip but overheating risk. Higher = less grip but cooler temps.";
    }
    if (msgLower.includes("warm") || msgLower.includes("temperature")) {
      return "🛞 Tire Temperature Management:\n• Optimal window: 100-110°C\n• Too cold (<90°C): Weave on straights, aggressive turn-in\n• Too hot (>115°C): Lift earlier, smoother inputs, avoid curbs\n• Front cold: Late braking, aggressive steering\n• Rear cold: Hard acceleration, controlled slides\n• Out-lap: Push hard to generate heat quickly";
    }
    return "🛞 Tire questions? Ask about: tire management, compound choice, tire pressure, warming tires, or tire deg!";
  }

  // BRAKING
  if (msgLower.includes("brake") || msgLower.includes("braking")) {
    if (msgLower.includes("bias") || msgLower.includes("balance")) {
      return "🔴 Brake Bias Setup:\n• Forward (58-60%): Heavy braking zones, street circuits, unstable rear\n• Balanced (54-57%): Most tracks, neutral handling\n• Rearward (50-53%): Low-speed corners, rotation needed\n\nAdjust by feel: Front locking = too forward, Rear locking = too rearward\nCanada/Singapore need most forward bias (59-60%)!";
    }
    if (msgLower.includes("lock") || msgLower.includes("flat spot")) {
      return "🔴 Preventing Brake Lock-ups:\n• Reduce brake pressure gradually as speed decreases\n• Shift up before braking to reduce engine braking\n• Lower brake bias if front locks\n• ABS doesn't exist in F1 - it's all driver feel!\n• Cold brakes lock easier - warm them up!\n• Wet conditions: Reduce bias 2-3% rearward";
    }
    if (msgLower.includes("cool") || msgLower.includes("overheat") || msgLower.includes("temperature")) {
      return "🔴 Brake Cooling Management:\n• Open brake ducts: More cooling but less aero (Monaco, Canada, Singapore)\n• Closed ducts: Less cooling but more downforce (Monza, Spa)\n• Lift and coast to reduce brake load\n• Canada most demanding - brake failures common!\n• Monitor temps: >1000°C = danger zone";
    }
    return "🔴 Brake questions? Ask about: brake bias, brake locking, brake cooling, or brake temperature!";
  }

  // DOWNFORCE
  if (msgLower.includes("downforce") || msgLower.includes("wing") || msgLower.includes("aero")) {
    if (msgLower.includes("how much") || msgLower.includes("level") || msgLower.includes("setting")) {
      return "✈️ Downforce Levels by Track:\n• Very Low (15-20%): Monza, Baku - straight speed priority\n• Low (30-40%): Canada, Las Vegas, Spa - balanced\n• Medium (50-60%): Most tracks - versatile\n• High (70-85%): Silverstone, Suzuka, Barcelona\n• Very High (90-100%): Monaco, Singapore, Hungary\n\nMore downforce = faster corners but slower straights!\nQualifying: Add 5-10% more than race setup.";
    }
    if (msgLower.includes("balance") || msgLower.includes("front") || msgLower.includes("rear")) {
      return "✈️ Aero Balance:\n• 50-52% front: Neutral, balanced car\n• 54-56% front: More front grip, stable under braking\n• 48-50% front: More rear grip, better traction, twitchy\n\nAdjust front wing in 1-2 click increments\nUndersteering? Add front wing\nOversteering? Remove front wing or add rear";
    }
    if (msgLower.includes("drs")) {
      return "✈️ DRS (Drag Reduction System):\n• Opens rear wing flap to reduce drag by 10-15%\n• Gains 10-15 km/h on straights\n• Only available when <1 second behind car ahead\n• Automatic deactivation when braking\n• Worth 0.3-0.5 seconds per activation\n• Monza/Baku: Massive advantage (15+ km/h)\n• Monaco: Minimal benefit (narrow, slow)";
    }
    return "✈️ Downforce questions? Ask about: downforce levels, aero balance, front/rear wing, or DRS!";
  }

  // SUSPENSION
  if (msgLower.includes("suspension") || msgLower.includes("stiff") || msgLower.includes("soft")) {
    if (msgLower.includes("stiff")) {
      return "⚙️ Stiff Suspension:\n• Benefits: High-speed stability, less porpoising, better aero platform\n• Drawbacks: Less mechanical grip, harsh over bumps\n• Use on: Smooth tracks (Bahrain, Abu Dhabi), high-speed circuits\n• Avoid on: Bumpy streets (Monaco, Singapore, Baku)\n\nStiff = speed but less grip!";
    }
    if (msgLower.includes("soft")) {
      return "⚙️ Soft Suspension:\n• Benefits: More mechanical grip, better over bumps, forgiving\n• Drawbacks: Less stable, more pitch/roll, slower aero\n• Use on: Street circuits, bumpy tracks, low-speed corners\n• Tracks: Monaco, Singapore, Montreal, Baku\n\nSoft = grip but less stable!";
    }
    if (msgLower.includes("ride height")) {
      return "⚙️ Ride Height:\n• Low (25-30mm): Maximum downforce, smooth tracks only\n• Medium (30-35mm): Balanced, most tracks\n• High (35-40mm): Street circuits, bumpy surfaces\n\nFront lower than rear for better balance\nToo low = floor damage + porpoising\nStreet circuits need 35-40mm minimum!";
    }
    return "⚙️ Suspension questions? Ask about: stiff suspension, soft suspension, ride height, or dampers!";
  }

  // STRATEGY
  if (msgLower.includes("strategy") || msgLower.includes("pit") || msgLower.includes("stop")) {
    if (msgLower.includes("undercut") || msgLower.includes("overcut")) {
      return "📊 Undercut vs Overcut:\n• Undercut: Pit early, use fresh tires to gain time (worth 0.3-0.5s/lap)\n• Works when: Track evolution strong, clear air available\n• Overcut: Stay out longer, hope others lose time in traffic\n• Works when: Tire deg low, traffic heavy\n\nUndercut is usually stronger - that's why leaders pit first!\nGap needed to cover: 20-25 seconds for pit stop";
    }
    if (msgLower.includes("one") || msgLower.includes("two") || msgLower.includes("how many")) {
      return "📊 Pit Stop Strategy:\n• 1-stop: Low deg tracks (Sochi, Barcelona), when possible\n• 2-stop: Standard for most races, flexible\n• 3-stop: High deg (Qatar, Bahrain) or safety car chaos\n\nTire delta matters:\n• Soft to Medium: 0.3-0.5s/lap\n• Medium to Hard: 0.5-0.8s/lap\n\nAlways cover the car behind if <3 seconds!";
    }
    if (msgLower.includes("safety car") || msgLower.includes("vsc")) {
      return "📊 Safety Car Strategy:\n• Free pit stop = pit immediately if you haven't yet!\n• Already pitted = stay out, gain positions\n• VSC: Half benefit of full SC, still worth pitting\n• Leaders disadvantage: Lose time to those behind\n\nLost time under SC: ~20 seconds\nNormal pit: ~23-25 seconds\nNet gain: 3-5 seconds!";
    }
    return "📊 Strategy questions? Ask about: undercut, overcut, pit stops, safety car strategy, or tire strategy!";
  }

  // WEATHER
  if (msgLower.includes("rain") || msgLower.includes("wet") || msgLower.includes("weather")) {
    if (msgLower.includes("setup")) {
      return "🌧️ Wet Weather Setup:\n• Downforce: Maximum (100%)\n• Suspension: Softer than dry\n• Tire Pressure: 20.0-21.0 PSI\n• Brake Bias: 2-3% rearward (prevent front lock)\n• Ride Height: Higher (avoid aquaplaning)\n• Wings: Maximum angle on both ends\n\nSafety and grip > speed in wet!";
    }
    if (msgLower.includes("inter") || msgLower.includes("full wet") || msgLower.includes("tire")) {
      return "🌧️ Wet Tire Choice:\n• Intermediates (Green): Damp track, light rain, drying conditions\n• Full Wets (Blue): Heavy rain, standing water (>3mm)\n• Cross-over point: When puddles form = Full Wets\n• Inters overheat on dry line = 1-2s/lap slower\n• Wets on drying = 3-4s/lap slower\n\nWrong choice can cost 5+ seconds per lap!";
    }
    if (msgLower.includes("drive") || msgLower.includes("racing line")) {
      return "🌧️ Wet Driving Tips:\n• Avoid painted lines & metal (zero grip!)\n• Look for drier patches off racing line\n• Smooth inputs - NO sudden movements\n• Brake earlier and softer\n• Short shift to avoid wheelspin\n• Follow spray = follow grip\n• Stay patient - crashes happen behind!";
    }
    return "🌧️ Rain questions? Ask about: wet setup, intermediate vs full wet tires, or wet driving tips!";
  }

  // ERS & POWER
  if (msgLower.includes("ers") || msgLower.includes("energy") || msgLower.includes("battery") || msgLower.includes("power")) {
    if (msgLower.includes("deploy") || msgLower.includes("use") || msgLower.includes("modes")) {
      return "⚡ ERS Deployment:\n• Qualifying: Full attack, use everything!\n• Race start: Overtake mode lap 1\n• Normal racing: Balanced/Medium mode\n• Defending: Overtake mode when needed\n• Overtaking: Full beans on straight\n\nYou have ~30-35 seconds of full power per lap\nSave it for DRS zones and overtakes!";
    }
    if (msgLower.includes("harvest") || msgLower.includes("charge") || msgLower.includes("regen")) {
      return "⚡ ERS Harvesting:\n• Harvests under braking (MGU-K) and from exhaust (MGU-H)\n• Heavy braking zones = max harvest\n• Off-throttle in high-speed corners = extra harvest\n• You can harvest 4MJ per lap (regulations)\n• Deploy up to 4MJ per lap on track\n• Save mode: Harvest more, deploy less\n\nBrake earlier = harvest more energy!";
    }
    return "⚡ ERS questions? Ask about: ERS deployment, overtake mode, harvesting, or energy management!";
  }

  // SPECIFIC TRACKS
  if (msgLower.includes("monaco")) {
    return "🇲🇨 Monaco Tips:\n• Qualifying is 90% of the race - nail that lap!\n• Maximum downforce (100%)\n• Very soft suspension for bumps\n• High brake bias (60%)\n• Tire pressure: 21.5 PSI\n• Overtaking nearly impossible\n• Turn 1 (Sainte Devote) & Swimming Pool are key\n• One mistake = wall. No run-off!";
  }
  if (msgLower.includes("monza") || msgLower.includes("italy")) {
    return "🇮🇹 Monza - Temple of Speed:\n• Very low downforce (15-20%)\n• Stiff suspension\n• Top speed: 340+ km/h possible\n• Late braking into chicanes\n• Tire pressure: 22.5 PSI\n• Brake bias: 59%\n• Slipstream worth 0.5+ seconds\n• Chicanes are overtaking zones";
  }
  if (msgLower.includes("spa") || msgLower.includes("belgium")) {
    return "🇧🇪 Spa-Francorchamps:\n• Medium-low downforce compromise\n• Eau Rouge flat out = brave moment\n• 2.2km Kemmel straight for overtaking\n• Weather unpredictable - be ready!\n• Tire pressure: 23.2 PSI\n• Brake bias: 56%\n• Most driver-favorite track\n• Elevation changes are extreme";
  }
  if (msgLower.includes("silverstone") || msgLower.includes("great britain") || msgLower.includes("british")) {
    return "🇬🇧 Silverstone:\n• High downforce (80-85%)\n• Maggots-Becketts complex is epic\n• Copse corner at 290+ km/h\n• Fast flowing layout\n• Tire pressure: 22.8 PSI\n• Brake bias: 57%\n• Expect rain at any moment\n• Qualifying crucial for British GP";
  }
  if (msgLower.includes("suzuka") || msgLower.includes("japan")) {
    return "🇯🇵 Suzuka:\n• High downforce (80-85%)\n• Figure-8 layout is unique\n• Esses section is technical masterpiece\n• 130R corner legendary\n• Tire pressure: 22.5 PSI\n• Brake bias: 58%\n• Drivers' favorite track\n• First sector defines your lap";
  }
  if (msgLower.includes("singapore")) {
    return "🇸🇬 Singapore:\n• Very high downforce (95-100%)\n• Soft suspension for bumps\n• 23 corners, most in F1\n• Night race under lights\n• Tire pressure: 21.8 PSI\n• Brake bias: 59%\n• Physical challenge - 2hr race\n• Safety cars common";
  }
  if (msgLower.includes("baku") || msgLower.includes("azerbaijan")) {
    return "🇦🇿 Baku:\n• Most extreme track in F1\n• Low downforce for 2.2km straight\n• Castle section narrowest in F1 (7.6m)\n• Top speed: 350+ km/h\n• Tire pressure: 21.5 PSI\n• Brake bias: 60%\n• Safety car guaranteed\n• Slipstream worth 0.4s";
  }
  if (msgLower.includes("canada") || msgLower.includes("montreal")) {
    return "🇨🇦 Montreal:\n• Low downforce for straights\n• Brake cooling CRITICAL - failures common\n• Wall of Champions catches everyone\n• Tire pressure: 22.5 PSI\n• Brake bias: 59% (most forward)\n• Expect safety cars\n• Heavy braking zones\n• Short gearing needed";
  }

  // DRIVING TECHNIQUES
  if (msgLower.includes("racing line") || msgLower.includes("apex") || msgLower.includes("corner")) {
    return "🏁 Racing Line Basics:\n• Entry: Brake in straight line, outside of track\n• Turn-in: Smooth steering input, hit apex\n• Apex: Geometric middle of corner, max grip\n• Exit: Unwind steering, full throttle, use all track\n\nSlow in, fast out = better lap times\nExit speed > Entry speed on most corners!";
  }

  if (msgLower.includes("overtake") || msgLower.includes("overtaking") || msgLower.includes("pass")) {
    return "🏁 Overtaking Tips:\n• DRS zones are prime opportunities\n• Slipstream on straights (0.3-0.5s gain)\n• Late braking into heavy zones\n• Switchback: Fake outside, go inside\n• Exit speed: Better exit = pass on straight\n• Aggressive but fair\n• DRS + slipstream = 15+ km/h advantage\n\nBe patient - one chance is all you need!";
  }

  if (msgLower.includes("quali") || msgLower.includes("qualifying")) {
    return "⏱️ Qualifying Strategy:\n• Q1: Safe lap to progress, save tires\n• Q2: Critical - tire choice for race start\n• Q3: Full attack mode - everything on the line\n• Out-lap: Push hard to warm tires\n• Hot lap: No mistakes, perfect execution\n• Cool-down: Manage temps for next run\n\nMonaco/Hungary: Quali is 90% of result!";
  }

  if (msgLower.includes("start") || msgLower.includes("launch") || msgLower.includes("lights")) {
    return "🚦 Race Start Tips:\n• Clutch bite point practice in formation lap\n• Watch lights not other cars\n• Full throttle at lights out\n• Wheel spin = time lost\n• Turn 1 is chaos - be aware!\n• Overtake mode + full ERS deployment\n• Cold tires = be careful\n• First lap is worth 0.3-0.5s per position!";
  }

  // GENERAL HELP
  if (msgLower.includes("help") || msgLower.includes("what can you")) {
    return "🏎️ I'm your F1 Race Engineer! Ask me about:\n\n🛞 Tires: management, compounds, pressure\n🔴 Brakes: bias, cooling, locking\n✈️ Aero: downforce, DRS, balance\n⚙️ Setup: suspension, ride height\n📊 Strategy: pit stops, undercut, safety cars\n🌧️ Weather: wet setup, tire choice\n⚡ ERS: deployment, harvesting\n🏁 Tracks: Monaco, Monza, Spa, Silverstone, etc.\n🏎️ Driving: racing line, overtaking, starts\n\nWhat would you like to know?";
  }

  // GREETINGS
  if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("hey")) {
    return "👋 Hey Racer! Ready to dominate the track? I'm your AI Race Engineer - ask me anything about F1 setups, strategy, tracks, or racing techniques! What do you need help with?";
  }

  if (msgLower.includes("thanks") || msgLower.includes("thank")) {
    return "🏆 No problem! Keep pushing for that podium finish! Box box if you need anything else! 🏎️💨";
  }

  // DEFAULT RESPONSE
  return "🤔 I can help with F1 topics like:\n• Tire management & compounds\n• Brake bias & cooling\n• Downforce levels & aero\n• Race strategy & pit stops\n• Wet weather setup\n• Track-specific advice\n• ERS & power management\n• Driving techniques\n\nTry asking: 'How to manage tires?' or 'Monaco setup tips?' or just type 'help'!";
}

// ✅ Error handling
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("🏎️  F1 CAR SETUP RECOMMENDER - BACKEND SERVER");
  console.log("=".repeat(60));
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`📍 Tracks: http://localhost:${PORT}/tracks`);
  console.log(`🏁 Setup: http://localhost:${PORT}/result`);
  console.log(`💬 Chat: http://localhost:${PORT}/ask-engineer`);
  console.log(`🌍 CORS: Enabled (development mode)`);
  console.log("=".repeat(60));
});