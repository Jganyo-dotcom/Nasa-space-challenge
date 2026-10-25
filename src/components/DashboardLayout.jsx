import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/Sidebar.css";

export default function DashboardLayout({
  activePage,
  navigate,
  children,
  userEmail = "farmer@nasa-spaceapps.org",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar handles desktop view & mobile drawer */}
      <Sidebar
        activePage={activePage}
        setActivePage={(page) => navigate(page)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={() => navigate("landing")}
      />

      <div className="main-content-wrapper">
        <Header userEmail={userEmail} />

        <main className="dashboard-page-container">{children}</main>
      </div>
    </div>
  );
}
