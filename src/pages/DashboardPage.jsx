import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Sprout, MapPin, BrainCircuit, ArrowRight } from "lucide-react";
import "../styles/Dashboard.css";

export default function DashboardPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize independent state directly inside this page component
  const [farmData, setFarmData] = useState({
    lat: "5.6037",
    lng: "-0.1870",
    locationName: "Accra Test Field",
    currentCrop: "Maize",
    fieldSize: "2.5",
  });

  const handleLogout = () => {
    navigate("landing");
    showToast("Signed out successfully.", "info");
  };

  return (
    <div className="app-layout">
      {/* Structural layout components integrated natively inside the view */}
      <Sidebar
        activePage="dashboard"
        setActivePage={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="main-content-wrapper">
        <Header userEmail="elikemejay@gmail.com" />

        <main className="dashboard-page-container">
          <div className="dashboard-view">
            <div className="dashboard-hero-card">
              <h1 className="dashboard-title">Dashboard Overview</h1>
              <p className="dashboard-subtitle">
                Monitor your active farm telemetry, NASA POWER gridded climate
                indicators, and machine learning crop rotation recommendations.
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-header">
                  <MapPin size={16} color="#10b981" /> Pinned Farm Location
                </div>
                <div className="stat-value">{farmData.locationName}</div>
                <span className="stat-footer-tag" style={{ color: "#10b981" }}>
                  Lat: {farmData.lat}, Lng: {farmData.lng}
                </span>
              </div>

              <div className="stat-box">
                <div className="stat-header">
                  <Sprout size={16} color="#3b82f6" /> Current Active Crop
                </div>
                <div className="stat-value">{farmData.currentCrop}</div>
                <span className="stat-footer-tag" style={{ color: "#3b82f6" }}>
                  Field Size: {farmData.fieldSize} Hectares
                </span>
              </div>

              <div className="stat-box">
                <div className="stat-header">
                  <BrainCircuit size={16} color="#f59e0b" /> Inference Engine
                </div>
                <div className="stat-value" style={{ color: "#34d399" }}>
                  ml-cart Active
                </div>
                <span className="stat-footer-tag" style={{ color: "#94a3b8" }}>
                  In-memory Decision Tree ready
                </span>
              </div>
            </div>

            <div className="action-card">
              <h3 className="action-card-title">Quick Navigation</h3>
              <p className="action-card-desc">
                Ready to inspect detailed climate metrics or trigger an AI
                rotation forecast?
              </p>
              <div className="action-btn-group">
                <button
                  className="btn-dash-primary"
                  onClick={() => navigate("map")}
                >
                  Update Farm Coordinates <ArrowRight size={16} />
                </button>
                <button
                  className="btn-dash-secondary"
                  onClick={() => navigate("recommendations")}
                >
                  View AI Rotation Strategy
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
