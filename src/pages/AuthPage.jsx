import React, { useState } from "react";
import {
  Sprout,
  Mail,
  Lock,
  User,
  ArrowLeft,
  LogIn,
  UserPlus,
  MapPin,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import "../styles/AuthPage.css";

 const API_BASE_URL = "http://localhost:5000/api";
//const API_BASE_URL = "https://nasa-space-challenge-backend.onrender.com/api";

export default function AuthPage({ navigate, showToast, onAuthSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Field State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("Accra, Ghana");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Please fill in all required credentials.", "error");
      return;
    }

    setIsLoading(true);

    const endpoint = isRegistering ? "/auth/register" : "/auth/login";
    const payload = isRegistering
      ? { email, password, name: fullName, region }
      : { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Authentication failed. Please check your credentials.",
        );
      }

      // Store JWT token and user details in localStorage
      localStorage.setItem("field_shift_token", data.token);
      localStorage.setItem("field_shift_user", JSON.stringify(data.user));

      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token);
      }

      if (isRegistering) {
        showToast(
          `Welcome to Field Shift, ${data.user.name || "Farmer"}! Account created.`,
          "success",
        );
      } else {
        showToast(
          "Successfully signed in to NASA Agroclimate Portal.",
          "success",
        );
      }

      // Navigate to Dashboard upon successful authentication
      navigate("dashboard");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-root-container">
      <div className="auth-bg-glow" />

      <div className="auth-card">
        {/* Back Button */}
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
            <div className="input-with-icon" style={{ position: "relative" }}>
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="form-input-auth"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Registration Extra Field for Region Setup */}
          {isRegistering && (
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
          )}

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Authenticating...
              </>
            ) : isRegistering ? (
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
              Already registered?{" "}
              <button
                type="button"
                className="auth-toggle-btn"
                onClick={() => setIsRegistering(false)}
              >
                Sign in here
              </button>
            </span>
          ) : (
            <span>
              New to Field Shift?{" "}
              <button
                type="button"
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
