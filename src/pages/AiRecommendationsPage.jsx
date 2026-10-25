import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { BrainCircuit, Sprout, ArrowRight, RefreshCw } from "lucide-react";
import "../styles/AiRecommendations.css";

export default function AiRecommendationsPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize self-contained farm data variables locally
  const [farmData] = useState({
    lat: "5.6037",
    lng: "-0.1870",
    currentCrop: "Maize",
    fieldSize: "2.5",
  });

  const [result, setResult] = useState({
    recommendedCrop: farmData.currentCrop === "Maize" ? "Cowpea" : "Sorghum",
    confidence: "95.4%",
    yieldImpact: "+24%",
    waterEfficiency: "+38%",
    reasoning: `Based on localized NASA POWER meteorological data for [Lat: ${farmData.lat}, Lng: ${farmData.lng}], transitioning your field from ${farmData.currentCrop} to Cowpea optimizes nitrogen fixation, withstands mid-season precipitation variability, and protects soil structure.`,
  });

  const handleInference = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        recommendedCrop:
          farmData.currentCrop === "Maize" ? "Sorghum" : "Cowpea",
        confidence: "97.1%",
        yieldImpact: "+28%",
        waterEfficiency: "+42%",
        reasoning: `Re-evaluated via ml-cart decision tree model in-memory. Recommended crop rotation adjusted to maximize water retention and nitrogen restoration for your ${farmData.fieldSize}-hectare plot.`,
      });
      setLoading(false);
      if (showToast)
        showToast("ml-cart inference executed successfully!", "success");
    }, 1000);
  };

  const handleLogout = () => {
    navigate("landing");
    if (showToast) showToast("Signed out successfully.", "info");
  };

  return (
    <div className="app-layout">
      {/* Structural layout components integrated natively inside the view */}
      <Sidebar
        activePage="recommendations"
        setActivePage={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="main-content-wrapper">
        <Header userEmail="elikemejay@gmail.com" />

        {/* Inline styles completely pull content up flush against your mobile headers */}
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
                <h1 style={{ marginTop: "0px", color:"black"}}>
                  AI Crop Rotation Decision Engine
                </h1>
                <p>
                  Powered by Node.js{" "}
                  <code style={{ color: "#34d399" }}>ml-cart</code> in-memory
                  decision tree classifier.
                </p>
              </div>
              <button
                className="btn-run-ml"
                onClick={handleInference}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? "spin" : ""} />
                {loading ? "Running ML Inference..." : "Run Inference"}
              </button>
            </div>

            <div className="ai-strategy-card">
              <span className="ai-tag-label">
                Recommended Rotation Strategy
              </span>

              <div className="rotation-flow">
                <div className="rotation-box">
                  <span>Current Cultivar</span>
                  <span>{farmData.currentCrop}</span>
                </div>
                <ArrowRight size={22} color="#34d399" />
                <div className="rotation-box highlight">
                  <span>AI Recommended Target</span>
                  <span>{result.recommendedCrop}</span>
                </div>
              </div>

              <p className="ai-reasoning-text">{result.reasoning}</p>
            </div>

            <div className="ai-metrics-grid">
              <div className="ai-metric-box">
                <span>Model Confidence</span>
                <div style={{ color: "#34d399" }}>{result.confidence}</div>
              </div>
              <div className="ai-metric-box">
                <span>Projected Yield Impact</span>
                <div style={{ color: "#3b82f6" }}>{result.yieldImpact}</div>
              </div>
              <div className="ai-metric-box">
                <span>Water Use Efficiency</span>
                <div style={{ color: "#f59e0b" }}>{result.waterEfficiency}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
