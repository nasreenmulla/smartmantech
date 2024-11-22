// SimpleModal.js
import React from 'react';
import './SimpleModal.css'; // Create a CSS file for styling

const SimpleModal = ({ alMessage, alOnClose }) => {
  return (
    <div className="al-modal-overlay">
      <div className="al-modal-content">
        <p>{alMessage}</p>
        <button onClick={alOnClose}>OK</button>
      </div>
    </div>
  );
};

export default SimpleModal;


