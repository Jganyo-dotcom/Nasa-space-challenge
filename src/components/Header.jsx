import React from "react";
import { ShieldCheck, User } from "lucide-react";
import "../styles/Header.css";

export default function Header({ userEmail }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <span className="header-badge">
          <ShieldCheck size={13} /> NASA POWER API Connected
        </span>
      </div>

      <div className="header-right">
        <User size={16} />
        <span className="header-user-email">{userEmail || "farmer@spaceapps.org"}</span>
      </div>
    </header>
  );
}