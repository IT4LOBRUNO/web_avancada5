import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import './Components.css';

export default function ValidationMessage({ message }) {
    if (!message) return null;

    return (
        <div className="validation-message">
            <FiAlertCircle size={14} style={{ marginRight: '5px' }} />
            {message}
        </div>
    );
}