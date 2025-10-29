import React from "react";
import Button from "./Button.jsx";
import "./Components.css";

export default function SearchResultItem({ children, onClick }) {
  return (
    <div className="search-result-item">
      <div>{children}</div>
      <Button onClick={onClick}>Perfil</Button>
    </div>
  );
}