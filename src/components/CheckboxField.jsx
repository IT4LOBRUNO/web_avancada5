import "./Components.css";

export default function CheckboxField({ label, checked, onChange }) {
  return (
    <div className="input-field">
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    </div>
  );
}
