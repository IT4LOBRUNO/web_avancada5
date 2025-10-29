import React from "react";
import "./Components.css";

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      className="search-bar"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Buscar..."}
    />
  );
}
