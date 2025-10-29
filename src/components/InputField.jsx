import "./Components.css";

export default function InputField({ label, type = "text", value, onChange, placeholder, required = false }) {
  return (
    <div className="input-field">
      {label && <label>{label}{required ? " *" : ""}</label>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
      />
    </div>
  );
}
