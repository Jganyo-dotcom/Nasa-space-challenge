import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { CloudSun, Thermometer, Droplets, Sun, Activity } from "lucide-react";
import "../styles/ClimateData.css";

export default function ClimateDataPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize self-contained farm data variables locally
  const [farmData] = useState({
    lat: "5.6037",
    lng: "-0.1870",
    locationName: "Accra Test Field",
  });

  const handleLogout = () => {
    navigate("landing");
    if (showToast) showToast("Signed out successfully.", "info");
  };

  return (
    <div className="app-layout">
      {/* Universal sidebar panel injected directly into the view hierarchy */}
      <Sidebar
        activePage="climate"
        setActivePage={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="main-content-wrapper">
        <Header userEmail="elikemejay@gmail.com" />

        <main className="dashboard-page-container">
          <div className="climate-view">
            <div className="climate-header">
              <h1>NASA POWER Climate Telemetry</h1>
              <p>
                Agroclimatology Community (community=AG) metrics retrieved for
                coordinates [{farmData.lat}, {farmData.lng}].
              </p>
            </div>

            <div className="climate-metrics-grid">
              <div className="climate-metric-card">
                <div
                  className="climate-metric-top"
                  style={{ color: "#f59e0b" }}
                >
                  <Thermometer size={18} /> Avg Temperature (T2M)
                </div>
                <div className="climate-metric-val">28.4 °C</div>
                <div className="climate-metric-sub">
                  Optimal for tropical cereal growth
                </div>
              </div>

              <div className="climate-metric-card">
                <div
                  className="climate-metric-top"
                  style={{ color: "#3b82f6" }}
                >
                  <Droplets size={18} /> Annual Precipitation
                </div>
                <div className="climate-metric-val">840 mm</div>
                <div className="climate-metric-sub">
                  Corrected precipitation (PRECTOTCORR)
                </div>
              </div>

              <div className="climate-metric-card">
                <div
                  className="climate-metric-top"
                  style={{ color: "#10b981" }}
                >
                  <CloudSun size={18} /> Relative Humidity
                </div>
                <div className="climate-metric-val">68 %</div>
                <div className="climate-metric-sub">
                  Surface humidity (RH2M)
                </div>
              </div>

              <div className="climate-metric-card">
                <div
                  className="climate-metric-top"
                  style={{ color: "#f59e0b" }}
                >
                  <Sun size={18} /> Solar Radiation
                </div>
                <div className="climate-metric-val">21.2 kWh/m²</div>
                <div className="climate-metric-sub">
                  All Sky Surface Shortwave Flux
                </div>
              </div>
            </div>

            <div className="sentinel-card">
              <h3 className="sentinel-title">
                <Activity size={18} color="#10b981" /> Sentinel Cleaning &
                Pre-processing
              </h3>
              <p className="sentinel-text">
                All daily time-series records fetched from the NASA POWER API
                are automatically scanned and filtered to remove NASA's{" "}
                <span className="sentinel-code">-999</span> null sentinels
                before being passed directly into our in-memory Node.js{" "}
                <code style={{ color: "#34d399" }}>ml-cart</code> decision tree
                classifier.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
