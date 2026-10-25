import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { MapPin, Sliders } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "../styles/FarmMap.css";

export default function FarmMapPage({ navigate, showToast }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Define default values locally inside the component state now
  const [tempLat, setTempLat] = useState(5.6037);
  const [tempLng, setTempLng] = useState(-0.187);
  const [tempCrop, setTempCrop] = useState("Maize");
  const [tempSize, setTempSize] = useState("2.5");
  const [locationName, setLocationName] = useState("Accra Test Field");

  // Map Click Component Handler to capture exact coordinate picks
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setTempLat(e.latlng.lat.toFixed(4));
        setTempLng(e.latlng.lng.toFixed(4));
        showToast(
          `Pin dropped at Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`,
          "info",
        );
      },
    });
    return null;
  }

  const handlePreset = (name, lat, lng) => {
    setTempLat(lat);
    setTempLng(lng);
    setLocationName(name);
    showToast(`Selected location preset: ${name}`, "info");
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLocationName("Custom Pinned Field");
    showToast(
      "Farm configurations and profile details saved successfully!",
      "success",
    );
  };

  const handleLogout = () => {
    navigate("landing");
    showToast("Signed out successfully.", "info");
  };

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
        <Header userEmail="elikemejay@gmail.com" />

        <main className="dashboard-page-container">
          <div className="map-page-view">
            <div className="map-page-header">
              <h1>Farm Map & Coordinate Selector</h1>
              <p>
                Click directly on the interactive map surface or select a preset
                region to query NASA POWER agroclimate variables.
              </p>
            </div>

            <div className="map-grid-layout">
              <div className="map-canvas-card">
                <h3 className="map-canvas-title">
                  <MapPin size={18} color="#10b981" /> Interactive Leaflet
                  Canvas
                </h3>

                {/* Leaflet Map Integration */}
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
                    center={[parseFloat(tempLat), parseFloat(tempLng)]}
                    zoom={11}
                    style={{ height: "100%", width: "100%" }}
                    key={`${tempLat}-${tempLng}`} // Key guarantees map updates instantly on preset clicks
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler />
                    <Marker
                      position={[parseFloat(tempLat), parseFloat(tempLng)]}
                    >
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
                    onClick={() =>
                      handlePreset("Accra, Ghana", "5.6037", "-0.1870")
                    }
                  >
                    Accra, Ghana
                  </button>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() =>
                      handlePreset("Nairobi, Kenya", "-1.2921", "36.8219")
                    }
                  >
                    Nairobi, Kenya
                  </button>
                  <button
                    type="button"
                    className="btn-preset"
                    onClick={() =>
                      handlePreset("Kumasi, Ghana", "6.6885", "-1.6244")
                    }
                  >
                    Kumasi, Ghana
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
                    <label>Field Size (Hectares)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input-map"
                      value={tempSize}
                      onChange={(e) => setTempSize(e.target.value)}
                      required
                    />
                  </div>

                  <div className="coords-row">
                    <div>
                      <label>Latitude</label>
                      <input
                        type="text"
                        className="form-input-map"
                        value={tempLat}
                        readOnly
                        style={{ background: "#090d16", color: "#94a3b8" }}
                      />
                    </div>
                    <div>
                      <label>Longitude</label>
                      <input
                        type="text"
                        className="form-input-map"
                        value={tempLng}
                        readOnly
                        style={{ background: "#090d16", color: "#94a3b8" }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-save-farm">
                    Save Farm Configuration
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
