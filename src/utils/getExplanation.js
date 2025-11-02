const API_BASE_URL = "http://localhost:5000"; // backend URL

export async function getExplanation(setup) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setup }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Backend Error:", text);
      throw new Error("Failed to fetch explanation");
    }

    const data = await response.json();
    console.log("✅ Backend data received:", data);
    return data.explanation || "No explanation returned from backend.";
  } catch (error) {
    console.error("⚠️ Error in getExplanation:", error);
    return "Error fetching explanation. Please ensure backend is running.";
  }
}
