import React, { useState } from "react";
import "./Components.css";

export default function FileUploader({
  label,
  accept = ".pdf,image/*",
  onChange,
  required = false,
}) {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFileName(file.name);
      if (typeof onChange === "function") onChange(file);
    } else {
      setFileName("");
      if (typeof onChange === "function") onChange(null);
    }
  };

  return (
    <div className="input-field" style={{ marginBottom: 8 }}>
      {label && <label>{label}{required ? " *" : ""}</label>}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ marginTop: 6 }}
      />
      {fileName && (
        <div style={{ marginTop: 6, fontSize: 13, color: "#333" }}>
          Arquivo selecionado: <strong>{fileName}</strong>
        </div>
      )}
    </div>
  );
}
