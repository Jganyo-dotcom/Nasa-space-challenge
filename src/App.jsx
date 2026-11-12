import React, { useState, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import FarmMapPage from "./pages/FarmMapPage";
import ClimateDataPage from "./pages/ClimateDataPage";
import AiRecommendationsPage from "./pages/AiRecommendationsPage";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import "./App.css";

// 1. FIXED: ProtectedRoute defined OUTSIDE the App component
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [toast, setToast] = useState(null);

  // 2. Memoized showToast with useCallback (stabilizes map click event listeners)
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <div className="app-root">
      {/* Global Toast Notification Container */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === "success" && <CheckCircle2 size={18} />}
            {toast.type === "error" && <AlertCircle size={18} />}
            {toast.type === "info" && <Info size={18} />}
            <span>{toast.message}</span>
          </div>
          <button className="toast-close-btn" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Real Browser URL Route Switcher */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<LandingPage navigate={navigate} showToast={showToast} />}
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              navigate={navigate}
              showToast={showToast}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage navigate={navigate} showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FarmMapPage navigate={navigate} showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/climate"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ClimateDataPage navigate={navigate} showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AiRecommendationsPage
                navigate={navigate}
                showToast={showToast}
              />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
