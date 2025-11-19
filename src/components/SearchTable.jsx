import React from "react";
import Button from "./Button.jsx";
import "./Components.css";

//Renderiza as tabelas de busca

export default function SearchTable({
  headers = [],
  rows = [],
  onActionClick,
  actionLabel = "Ação",
}) {
  //Se não houver dados, retorna a tabela vazia
  if (rows.length === 0) {
    return (
      <div className="search-table-container">
        <table>
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={headers.length}>
                Nenhum resultado encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const dataKeys = Object.keys(rows[0]).filter(key => key !== 'id' && key !== 'actionPlaceholder');

  return (
    <div className="search-table-container">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {dataKeys.map(key => (
                <td key={key} style={{ verticalAlign: 'middle' }}>{row[key]}</td>
              ))}
              {onActionClick && (
                <td style={{ verticalAlign: 'middle' }}>
                  <Button onClick={() => onActionClick(row.id)}>
                    {actionLabel}
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
