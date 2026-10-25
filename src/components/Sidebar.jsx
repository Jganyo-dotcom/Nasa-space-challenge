import React from "react";
import {
  LayoutDashboard,
  MapPin,
  CloudSun,
  BrainCircuit,
  Sprout,
  LogOut,
  Menu,
  X,
  Satellite,
} from "lucide-react";
import "../styles/Sidebar.css";

export default function Sidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
  onLogout,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard Overview",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "map", label: "Farm Map & Pinner", icon: <MapPin size={20} /> },
    { id: "climate", label: "NASA POWER Data", icon: <CloudSun size={20} /> },
    {
      id: "recommendations",
      label: "AI Crop Rotation",
      icon: <BrainCircuit size={20} />,
    },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileOpen(false); // Close drawer on mobile selection
  };

  return (
    <>
      {/* Mobile Top Header (Visible on screens <= 1024px) */}
      <div className="mobile-header">
        <div className="mobile-brand">
          <Sprout size={24} color="#10b981" />
          <span className="mobile-brand-title">Field Shift</span>
        </div>
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Background Overlay for Mobile Drawer */}
      <div
        className={`mobile-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Main Responsive Sidebar */}
      <aside className={`sidebar-container ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Brand Section */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sprout size={26} color="#10b981" />
          </div>
          <div>
            <div className="brand-title">Field Shift</div>
            <div className="brand-tag">NASA Space Apps 2026</div>
          </div>
        </div>

        {/* Eye-Catching NASA Satellite Visual Card */}
        <div className="nasa-hero-card">
          <div className="nasa-hero-content">
            <div className="nasa-badge-row">
              <span className="nasa-pill">NASA POWER</span>
              <div className="pulse-dot" title="Live Stream Active" />
            </div>
            <div className="nasa-card-title">Agroclimate Data</div>
            <div className="nasa-card-sub">
              Fetching daily T2M, PRECTOTCORR & solar radiation metrics.
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activePage === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer / Sign Out */}
        <div className="sidebar-footer">
          <button className="nav-button logout-button" onClick={onLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
