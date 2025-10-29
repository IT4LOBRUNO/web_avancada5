import React from "react";
import "./Components.css";

export default function Button({ children, onClick, style, type = "button", disabled = false }) {
  return (
    <button
      className="app-button"
      onClick={onClick}
      style={style}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
