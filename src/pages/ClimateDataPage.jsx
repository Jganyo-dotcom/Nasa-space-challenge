import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  CloudSun,
  Thermometer,
  Droplets,
  Sun,
  Activity,
  Loader2,
  Wind,
} from "lucide-react";
import "../styles/ClimateData.css";

//const API_BASE_URL = "http://localhost:5000/api";
 const API_BASE_URL = "https://nasa-space-challenge-backend.onrender.com/api";

export default function ClimateDataPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("farmer@spaceapps.org");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    lat: "5.6037",
    lng: "-0.1870",
    locationName: "Loading...",
    dataSource: "",
    telemetry: { avgTemp: "--", totalRain: "--", avgSolar: "--" },
    liveWeather: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("field_shift_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.email) setUserEmail(parsed.email);
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchData() {
      try {
        const token = localStorage.getItem("field_shift_token");
        const res = await fetch(`${API_BASE_URL}/data`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setData(json);
        } else {
          throw new Error(json.error || "Failed to load telemetry.");
        }
      } catch (err) {
        if (showToast) showToast(err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("landing");
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage="climate"
        setActivePage={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />
      <div className="main-content-wrapper">
        <Header userEmail={userEmail} />
        <main className="dashboard-page-container">
          <div className="climate-view">
            <div className="climate-header">
              <h1>Environmental Telemetry & Weather</h1>
              <p>
                Active Farm: <strong>{data.locationName}</strong> [{data.lat},{" "}
                {data.lng}]
              </p>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "4px 10px",
                  background: "#065f46",
                  color: "#34d399",
                  borderRadius: "12px",
                  fontSize: "0.85rem",
                }}
              >
                📡 Source: {data.dataSource}
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Loader2 className="animate-spin" size={36} color="#10b981" />
                <p>Gathering sensor and satellite metrics...</p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    color: "black",
                    margin: "1.5rem 0 0.75rem",
                  }}
                >
                  📊 NASA POWER Climatology Baseline
                </h3>
                <div className="climate-metrics-grid">
                  <div className="climate-metric-card">
                    <div
                      className="climate-metric-top"
                      style={{ color: "#f59e0b" }}
                    >
                      <Thermometer size={18} /> Avg Temperature
                    </div>
                    <div className="climate-metric-val">
                      {data.telemetry.avgTemp} °C
                    </div>
                    <div className="climate-metric-sub">
                      Mean daily temp at 2 meters (T2M)
                    </div>
                  </div>
                  <div className="climate-metric-card">
                    <div
                      className="climate-metric-top"
                      style={{ color: "#3b82f6" }}
                    >
                      <Droplets size={18} /> Annual Precipitation
                    </div>
                    <div className="climate-metric-val">
                      {data.telemetry.totalRain} mm
                    </div>
                    <div className="climate-metric-sub">
                      Annualised corrected rainfall
                    </div>
                  </div>
                  <div className="climate-metric-card">
                    <div
                      className="climate-metric-top"
                      style={{ color: "#10b981" }}
                    >
                      <Sun size={18} /> Solar Radiation
                    </div>
                    <div className="climate-metric-val">
                      {data.telemetry.avgSolar} kWh/m²
                    </div>
                    <div className="climate-metric-sub">
                      Surface shortwave downward irradiance
                    </div>
                  </div>
                </div>

                {data.liveWeather && (
                  <>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        color: "black",
                        margin: "2rem 0 0.75rem",
                      }}
                    >
                      🌤️ Live Weather (
                      {data.liveWeather.stationName || "Local Station"})
                    </h3>
                    <div className="climate-metrics-grid">
                      <div className="climate-metric-card">
                        <div
                          className="climate-metric-top"
                          style={{ color: "#f59e0b" }}
                        >
                          <Thermometer size={18} /> Current Temp
                        </div>
                        <div className="climate-metric-val">
                          {data.liveWeather.temp} °C
                        </div>
                        <div className="climate-metric-sub">
                          Feels like {data.liveWeather.feelsLike}°C (
                          {data.liveWeather.weatherDescription})
                        </div>
                      </div>
                      <div className="climate-metric-card">
                        <div
                          className="climate-metric-top"
                          style={{ color: "#3b82f6" }}
                        >
                          <Droplets size={18} /> Humidity
                        </div>
                        <div className="climate-metric-val">
                          {data.liveWeather.humidity} %
                        </div>
                        <div className="climate-metric-sub">
                          Surface atmospheric moisture
                        </div>
                      </div>
                      <div className="climate-metric-card">
                        <div
                          className="climate-metric-top"
                          style={{ color: "#10b981" }}
                        >
                          <Wind size={18} /> Wind & Pressure
                        </div>
                        <div className="climate-metric-val">
                          {data.liveWeather.windSpeed} m/s
                        </div>
                        <div className="climate-metric-sub">
                          Pressure: {data.liveWeather.pressure} hPa | Clouds:{" "}
                          {data.liveWeather.clouds}%
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="sentinel-card" style={{ marginTop: "2rem" }}>
                  <h3 className="sentinel-title">
                    <Activity size={18} color="#10b981" /> Sentinel Cleaning
                  </h3>
                  <p className="sentinel-text">
                    Null records (-999 sentinels) automatically filtered from
                    NASA telemetry.
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
