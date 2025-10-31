import React from "react";
import Button from "./Button.jsx";
import "./Components.css"; // Importar CSS

export default function SearchTable({
  headers = [],
  rows = [],
  onActionClick,
  actionLabel = "Ação",
}) {
  // Se não houver dados, retorna a tabela vazia ou uma mensagem.
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

  // Obtém as chaves de dados do primeiro objeto (ignorando 'id' e 'actionPlaceholder')
  const dataKeys = Object.keys(rows[0]).filter(key => key !== 'id' && key !== 'actionPlaceholder');

  return (
    <div className="search-table-container">
      <table>
        <thead>
          <tr>
            {/* Renderiza os cabeçalhos dinamicamente */}
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {/* Itera sobre as chaves de dados e renderiza as TDs */}
              {dataKeys.map(key => (
                <td key={key} style={{ verticalAlign: 'middle' }}>{row[key]}</td>
              ))}

              {/* Coluna de Ações: Renderizada apenas se onActionClick for fornecido */}
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
