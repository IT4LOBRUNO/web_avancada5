import "./Components.css";

export default function FormHeader({ title, subtitle }) {
  return (
    <div className="form-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
