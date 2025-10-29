import React from "react";
import Button from "./Button.jsx";
import "./Components.css"; // Importar CSS

export default function SearchTable({
  headers = [],
  rows = [],
  onActionClick,
  actionLabel = "Ação",
}) {
  return (
    <div className="search-table-container">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.id}>
                <td>{row.nome}</td>
                <td>{row.cpf}</td>
                <td>{row.nascimento}</td>
                <td>{row.responsavel}</td>
                <td>
                  <Button onClick={() => onActionClick(row.id)}>
                    {actionLabel}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length}>
                Nenhum resultado encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}