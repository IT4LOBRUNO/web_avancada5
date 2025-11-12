import React from "react";
import "./Components.css";

export default function Modal({ title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar" }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="modal-title">{title}</h3>}
        {message && <p className="modal-message" dangerouslySetInnerHTML={{ __html: message }} />}

        <div className="modal-buttons">
          <button className="cancelar" onClick={onCancel}>
            {cancelText}
          </button>

          <button className="remover" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
