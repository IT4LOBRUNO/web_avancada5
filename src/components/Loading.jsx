import React from "react";
import "../components/Components.css";

export default function Loading({ text = "Carregando..." }) {
  return (
    <div className="loading-container">
      <p className="loading-text">{text}</p>
    </div>
  );
}
