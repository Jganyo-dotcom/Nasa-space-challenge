import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { MapPin, Sliders, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "../styles/FarmMap.css";

const API_BASE_URL = "https://nasa-space-challenge-backend.onrender.com/api";

// 1. Helper component to smoothly center/fly the map when coordinates change
function MapFlyTo({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    const pLat = parseFloat(lat);
    const pLng = parseFloat(lng);
    if (!isNaN(pLat) && !isNaN(pLng)) {
      map.flyTo([pLat, pLng], map.getZoom(), { duration: 0.8 });
    }
  }, [lat, lng, map]);
  return null;
}

// 2. Extracted outside the main component to prevent stale closures
function MapClickHandler({
  setTempLat,
  setTempLng,
  setLocationName,
  showToast,
}) {
  useMapEvents({
    click(e) {
      const clickedLat = e.latlng.lat.toFixed(6);
      const clickedLng = e.latlng.lng.toFixed(6);

      setTempLat(clickedLat);
      setTempLng(clickedLng);
      setLocationName(`Pinned Location [${clickedLat}, ${clickedLng}]`);

      if (showToast) {
        showToast(
          `Pinned! Lat: ${clickedLat}, Lng: ${clickedLng} filled into form.`,
          "info",
        );
      }
    },
  });
  return null;
}

export default function FarmMapPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("farmer@spaceapps.org");

  // Form states as strings to prevent input desync
  const [tempLat, setTempLat] = useState("5.6037");
  const [tempLng, setTempLng] = useState("-0.1870");
  const [tempCrop, setTempCrop] = useState("Maize");
  const [tempSize, setTempSize] = useState("2.5");
  const [locationName, setLocationName] = useState("Accra Test Field");

  const hasFetchedRef = useRef(false);

  // Fetch user's existing farm telemetry on mount
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("field_shift_token");
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/farm`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.success && data.farmDetails) {
        const { coordinates, locationName, currentCrop, fieldSize } =
          data.farmDetails;
        if (coordinates) {
          setTempLat(coordinates.lat.toString());
          setTempLng(coordinates.lng.toString());
        }
        if (locationName) setLocationName(locationName);
        if (currentCrop) setTempCrop(currentCrop);
        if (fieldSize)
          setTempSize(fieldSize.toString().replace(" Hectares", ""));
      }
    } catch (err) {
      console.error("Failed to load existing farm telemetry:", err);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

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

    fetchDashboardData();
  }, []);

  const handlePreset = (name, lat, lng) => {
    setTempLat(lat.toString());
    setTempLng(lng.toString());
    setLocationName(name);

    if (showToast) {
      showToast(`Selected location preset: ${name}`, "info");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const parsedLat = parseFloat(tempLat);
    const parsedLng = parseFloat(tempLng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      if (showToast) {
        showToast(
          "Please enter valid numeric latitude and longitude coordinates.",
          "error",
        );
      }
      setIsSaving(false);
      return;
    }

    const token = localStorage.getItem("field_shift_token");

    try {
      sessionStorage.removeItem("field_shift_ai_cache");

      const response = await fetch(`${API_BASE_URL}/farm`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          locationName,
          lat: parsedLat,
          lng: parsedLng,
          currentCrop: tempCrop,
          fieldSize: parseFloat(tempSize) || 2.5,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update farm telemetry.");
      }

      if (showToast) {
        showToast(
          "Farm coordinates saved! Running NASA satellite analysis & AI prediction...",
          "success",
        );
      }

      navigate("recommendations");
    } catch (err) {
      if (showToast) showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem("field_shift_token");
    localStorage.removeItem("field_shift_user");
    navigate("landing");
    if (showToast) showToast("Signed out successfully.", "info");
  };

  const numericLat = parseFloat(tempLat) || 5.6037;
  const numericLng = parseFloat(tempLng) || -0.187;

  return (
    <div className="app-layout">
      <Sidebar
        activePage="map"
        setActivePage={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      <div className="main-content-wrapper">
        <Header userEmail={userEmail} />

        <main className="dashboard-page-container">
          <div className="map-page-view">
            <div className="map-page-header">
              <h1>Farm Map & Coordinate Selector</h1>
              <p>
                Click anywhere on the interactive map to automatically populate
                your latitude and longitude form fields.
              </p>
            </div>

            <div className="map-grid-layout">
              <div className="map-canvas-card">
                <h3 className="map-canvas-title">
                  <MapPin size={18} color="#10b981" /> Interactive Leaflet
                  Canvas
                </h3>

                <div
                  style={{
                    height: "380px",
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    marginBottom: "1rem",
                  }}
                >
                  <MapContainer
                    center={[numericLat, numericLng]}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapFlyTo lat={numericLat} lng={numericLng} />

                    <MapClickHandler
                      setTempLat={setTempLat}
                      setTempLng={setTempLng}
                      setLocationName={setLocationName}
                      showToast={showToast}
                    />

                    <Marker position={[numericLat, numericLng]}>
                      <Popup>
                        <strong>{tempCrop} Field</strong>
                        <br />
                        {locationName}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>

                <div className="map-preset-row">
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() => handlePreset("Accra, Ghana", 5.6037, -0.187)}
                  >
                    Accra, Ghana
                  </button>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() =>
                      handlePreset("Kumasi, Ghana", 6.6885, -1.6244)
                    }
                  >
                    Kumasi, Ghana
                  </button>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() =>
                      handlePreset("Tamale, Ghana", 9.4072, -0.8532)
                    }
                  >
                    Tamale, Ghana
                  </button>
                </div>
              </div>

              <div className="farm-form-card">
                <h3 className="map-canvas-title">
                  <Sliders size={18} color="#3b82f6" /> Farm Profile Details
                </h3>

                <form onSubmit={handleSave}>
                  <div className="form-group-map">
                    <label>Current Cultivated Crop</label>
                    <select
                      className="form-select-map"
                      value={tempCrop}
                      onChange={(e) => setTempCrop(e.target.value)}
                    >
                      <option value="Maize">Maize</option>
                      <option value="Sorghum">Sorghum</option>
                      <option value="Millet">Millet</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Cowpea">Cowpea</option>
                    </select>
                  </div>

                  <div className="form-group-map">
                    <label>Location Name</label>
                    <input
                      type="text"
                      className="form-input-map"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                    />
                  </div>

                  <div className="form-group-map">
                    <label>Latitude</label>
                    <input
                      type="text"
                      className="form-input-map"
                      value={tempLat}
                      onChange={(e) => setTempLat(e.target.value)}
                    />
                  </div>

                  <div className="form-group-map">
                    <label>Longitude</label>
                    <input
                      type="text"
                      className="form-input-map"
                      value={tempLng}
                      onChange={(e) => setTempLng(e.target.value)}
                    />
                  </div>

                  <div className="form-group-map">
                    <label>Field Size (Hectares)</label>
                    <input
                      type="text"
                      className="form-input-map"
                      value={tempSize}
                      onChange={(e) => setTempSize(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-save-farm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Saving
                        Farm Telemetry...
                      </>
                    ) : (
                      "Save Farm Telemetry"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
