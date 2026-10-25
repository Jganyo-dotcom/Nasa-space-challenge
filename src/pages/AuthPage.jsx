import React, { useState } from "react";
import {
  Sprout,
  Mail,
  Lock,
  User,
  Globe,
  ArrowLeft,
  LogIn,
  UserPlus,
  MapPin,
  Wheat,
} from "lucide-react";
import "../styles/AuthPage.css";

export default function AuthPage({ navigate, showToast }) {
  const [isRegistering, setIsRegistering] = useState(false);

  // Form Field State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("Accra, Ghana");
  const [primaryCrop, setPrimaryCrop] = useState("Maize");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Please fill in all required credentials.", "error");
      return;
    }

    if (isRegistering) {
      showToast(
        `Welcome to Field Shift, ${fullName || "Farmer"}! Account created successfully.`,
        "success",
      );
    } else {
      showToast(
        "Successfully signed in to NASA Agroclimate Portal.",
        "success",
      );
    }

    // Direct user straight into the dashboard
    navigate("dashboard");
  };

  return (
    <div className="auth-root-container">
      <div className="auth-bg-glow" />

      <div className="auth-card">
        {/* Back to Landing Page Button */}
        <button className="btn-back-home" onClick={() => navigate("landing")}>
          <ArrowLeft size={16} /> Back to Field Shift Landing
        </button>

        {/* Brand Header */}
        <div className="auth-brand-badge">
          <div className="brand-icon-wrapper">
            <Sprout size={28} color="#10b981" />
          </div>
          <span className="nasa-pill-tag">NASA Space Apps 2026</span>
        </div>

        <h1 className="auth-title">
          {isRegistering ? "Create Farmer Account" : "Welcome Back"}
        </h1>
        <p className="auth-subtitle">
          {isRegistering
            ? "Set up your field telemetry profile to access NASA POWER AI insights."
            : "Access your saved farm coordinates and climate recommendations."}
        </p>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group-auth">
              <label>Full Name / Agricultural Org</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input-auth"
                  placeholder="Kofi Mensah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isRegistering}
                />
              </div>
            </div>
          )}

          <div className="form-group-auth">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input-auth"
                placeholder="elikemejay@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group-auth">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="form-input-auth"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Registration Extra Fields for Farm Setup */}
          {isRegistering && (
            <>
              <div className="form-group-auth">
                <label>Primary Agricultural Region</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input-auth"
                    placeholder="Accra, Ghana"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group-auth">
                <label>Primary Cultivated Crop</label>
                <div className="input-with-icon">
                  <Wheat size={18} className="input-icon" />
                  <select
                    className="form-input-auth"
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                    style={{ paddingLeft: "42px" }}
                  >
                    <option value="Maize">Maize</option>
                    <option value="Sorghum">Sorghum</option>
                    <option value="Millet">Millet</option>
                    <option value="Soybean">Soybean</option>
                    <option value="Cowpea">Cowpea</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-auth-submit">
            {isRegistering ? (
              <>
                <UserPlus size={18} /> Register & Launch Dashboard
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle Mode */}
        <div className="auth-toggle-footer">
          {isRegistering ? (
            <span>
              Already registered?
              <button
                className="auth-toggle-btn"
                onClick={() => setIsRegistering(false)}
              >
                Sign in here
              </button>
            </span>
          ) : (
            <span>
              New to Field Shift?
              <button
                className="auth-toggle-btn"
                onClick={() => setIsRegistering(true)}
              >
                Create an account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
