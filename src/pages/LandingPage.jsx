import React from "react";
import {
  Sprout,
  Globe,
  BrainCircuit,
  CloudSun,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import "../styles/LandingPage.css";

export default function LandingPage({ navigate, showToast }) {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-logo-badge">
            <Sprout size={24} color="#10b981" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">Field Shift</span>
            <span className="brand-sub">NASA Space Apps 2026</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className="btn-secondary"
            onClick={() => {
              navigate("auth");
              showToast("Signed in as Farmer successfully.", "success");
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-bg" />

        <div className="badge-nasa-tag">
          <Globe size={16} color="#93c5fd" />
          <span>Challenge: Field Shift — Adapting Farms with NASA Data</span>
        </div>

        <h1 className="hero-heading">
          Empowering Farmers with{" "}
          <span className="gradient-text">NASA Agroclimate Data</span> &
          In-Memory AI
        </h1>

        <p className="hero-description">
          Field Shift bridges satellite earth observations with machine learning
          predictions. Drop a pin on any field to process daily NASA POWER
          temperature, rainfall, and solar metrics to recommend high-yield,
          resilient crop rotations.
        </p>

        <div className="hero-cta-group">
          <button
            className="btn-hero-main"
            onClick={() => {
              navigate("dashboard");
              showToast("Welcome to your Field Shift dashboard!", "success");
            }}
          >
            Explore Dashboard <ArrowRight size={18} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              navigate("dashboard");
              showToast("Accessing Farmer Portal...", "info");
            }}
          >
            Farmer Portal Log In
          </button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="stats-strip">
        <div className="stat-card">
          <div className="stat-number">NASA POWER</div>
          <div className="stat-label">Gridded Meteorological Data Source</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">+22%</div>
          <div className="stat-label">
            Projected Yield Boost via Crop Rotation
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">ml-cart</div>
          <div className="stat-label">
            In-Memory Node.js ML Classifier Engine
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">35%</div>
          <div className="stat-label">Water Efficiency Improvement</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">
            End-to-End Decision Support Pipeline
          </h2>
          <p className="section-subtitle">
            Replacing rigid manual rules with localized satellite observations
            and machine learning logic.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <MapPin size={24} color="#10b981" />
            </div>
            <h3 className="feature-title">1. Precision Map Pinning</h3>
            <p className="feature-body">
              Farmers select their exact coordinates globally or search preset
              agricultural regions to benchmark local soil conditions and field
              sizes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <CloudSun size={24} color="#3b82f6" />
            </div>
            <h3 className="feature-title">2. NASA POWER Ingestion</h3>
            <p className="feature-body">
              Fetches daily T2M, PRECTOTCORR, RH2M, and solar radiation from
              NASA's Agroclimatology API, auto-filtering out -999 null
              sentinels.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <BrainCircuit size={24} color="#f59e0b" />
            </div>
            <h3 className="feature-title">3. ml-cart ML Inference</h3>
            <p className="feature-body">
              The cleaned climate metrics flow directly into an in-memory
              Decision Tree Classifier in Node.js to evaluate soil recovery
              strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>
          © 2026 <strong>Field Shift Team</strong> — NASA Space Apps Challenge
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>NASA POWER Agroclimatology (community=AG)</span>
        </div>
      </footer>
    </div>
  );
}
