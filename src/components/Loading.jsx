import "./Components.css";

export default function Loading({ text = "Carregando..." }) {
  return <div className="loading">{text}</div>;
}
