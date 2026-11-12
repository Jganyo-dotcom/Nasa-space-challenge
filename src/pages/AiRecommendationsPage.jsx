import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  BrainCircuit,
  Sprout,
  ArrowRight,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import "../styles/AiRecommendations.css";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://nasa-space-challenge-backend.onrender.com/api";

export default function AiRecommendationsPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("farmer@spaceapps.org");

  const [farmData, setFarmData] = useState({
    currentCrop: "Maize",
    fieldSize: "2.5 Hectares",
    locationName: "Accra Test Field",
    coordinates: { lat: 5.6037, lng: -0.187 },
  });

  const [climateSummary, setClimateSummary] = useState({
    averageTemperatureC: 26.6,
    totalPrecipitationMm: 1644.1,
    averageSolarRadiation: 17.13,
  });

  const [result, setResult] = useState({
    recommendedCrop: "Analyzing...",
    confidence: "Dynamic Leaf Assessment",
    yieldImpact: "+24%",
    waterEfficiency: "+38%",
    reasoning: "Fetching localized NASA POWER meteorological data...",
    modelEngine: "",
  });

  useEffect(() => {
    // Load user email/username from local storage
    const storedUser = localStorage.getItem("field_shift_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) setUserEmail(parsed.email);
        else if (parsed.name) setUserEmail(parsed.name);
      } catch (e) {
        console.error(e);
      }
    }

    // Check if we already fetched this session to prevent remount loops
    const cachedData = sessionStorage.getItem("field_shift_ai_cache");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setFarmData(parsed.farmData);
        setClimateSummary(parsed.climateSummary);
        setResult(parsed.result);
        setLoading(false);
        return; // Exit immediately, no duplicate network request
      } catch (e) {
        sessionStorage.removeItem("field_shift_ai_cache");
      }
    }

    fetchInferenceData(false);
  }, []);

  const fetchInferenceData = async (isManualRefresh = false) => {
    setLoading(true);
    const token = localStorage.getItem("field_shift_token");

    try {
      const response = await fetch(`${API_BASE_URL}/climate-recommendations`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to run ml-cart inference.");
      }

      const newFarmData = data.farmDetails || farmData;
      const newClimateSummary = data.climateSummary || climateSummary;
      const newResult = {
        recommendedCrop:
          data.aiRecommendation?.suggestedAdaptiveCrop ||
          "Maize / Plantain Intercrop",
        confidence: data.aiRecommendation?.confidenceScore || "95.4%",
        yieldImpact: "+26%",
        waterEfficiency: "+40%",
        reasoning: data.aiRecommendation?.reasoning || "",
        modelEngine: data.aiRecommendation?.modelEngine || "",
      };

      setFarmData(newFarmData);
      setClimateSummary(newClimateSummary);
      setResult(newResult);

      // Cache the result in sessionStorage so remounts won't trigger re-fetching
      sessionStorage.setItem(
        "field_shift_ai_cache",
        JSON.stringify({
          farmData: newFarmData,
          climateSummary: newClimateSummary,
          result: newResult,
        }),
      );

      if (isManualRefresh && showToast) {
        showToast(
          "ml-cart inference re-evaluated successfully via NASA POWER!",
          "success",
        );
      }
    } catch (err) {
      if (showToast) showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = () => {
    sessionStorage.removeItem("field_shift_ai_cache");
    fetchInferenceData(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("field_shift_token");
    localStorage.removeItem("field_shift_user");
    navigate("landing");
    if (showToast) showToast("Signed out successfully.", "info");
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage="recommendations"
        setActivePage={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="main-content-wrapper">
        <Header userEmail={userEmail} />

        <main
          className="dashboard-page-container"
          style={{ paddingTop: "0px", marginTop: "0px" }}
        >
          <div className="ai-view" style={{ paddingTop: "0px" }}>
            <div
              className="ai-header-row"
              style={{ marginTop: "0px", paddingTop: "0px" }}
            >
              <div className="ai-header">
                <h1 style={{ marginTop: "0px", color: "#0f172a" }}>
                  AI Crop Rotation Decision Engine
                </h1>
                <p>
                  Powered by Node.js{" "}
                  <code style={{ color: "#059669" }}>ml-cart</code> in-memory
                  decision tree classifier and live NASA POWER data.
                </p>
              </div>
              <button
                className="btn-run-ml"
                onClick={handleManualRefresh}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Running ML Inference..." : "Refresh Inference"}
              </button>
            </div>

            {loading && !climateSummary ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "60px",
                }}
              >
                <Loader2
                  size={36}
                  className="animate-spin"
                  style={{ color: "#10b981" }}
                />
                <span
                  style={{
                    marginLeft: "12px",
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Evaluating agroclimate metrics through decision tree...
                </span>
              </div>
            ) : (
              <>
                <div className="ai-strategy-card">
                  <span className="ai-tag-label">
                    Recommended Rotation Strategy ({farmData.locationName})
                  </span>

                  <div className="rotation-flow">
                    <div className="rotation-box">
                      <span>Current Cultivar</span>
                      <span>{farmData.currentCrop}</span>
                    </div>
                    <ArrowRight size={22} color="#10b981" />
                    <div className="rotation-box highlight">
                      <span>AI Recommended Target</span>
                      <span>{result.recommendedCrop}</span>
                    </div>
                  </div>

                  <p className="ai-reasoning-text">{result.reasoning}</p>
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "11px",
                      color: "#64748b",
                      fontStyle: "italic",
                    }}
                  >
                    Engine: {result.modelEngine}
                  </div>
                </div>

                <div className="ai-metrics-grid">
                  <div className="ai-metric-box">
                    <span>Average Temperature</span>
                    <div style={{ color: "#f59e0b" }}>
                      {climateSummary.averageTemperatureC} °C
                    </div>
                  </div>
                  <div className="ai-metric-box">
                    <span>Total Precipitation</span>
                    <div style={{ color: "#3b82f6" }}>
                      {climateSummary.totalPrecipitationMm} mm
                    </div>
                  </div>
                  <div className="ai-metric-box">
                    <span>Solar Radiation</span>
                    <div style={{ color: "#059669" }}>
                      {climateSummary.averageSolarRadiation} kWh/m²
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
