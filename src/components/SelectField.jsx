import React from "react";
import "./Components.css";

export default function SelectField({ label, value, onChange, options }) {
  return (
    <div className="input-field">
      {label && <label>{label}</label>}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Selecione</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
