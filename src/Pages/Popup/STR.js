// src/components/Popup/STRCodePopup.js
import React from 'react';
import './Str.css'; // Add your popup styles here

const STRCodePopup = ({ strCodes, onSelect, onClose }) => {
  return (
    <div className='popup-overlay'>
      <div className='popup-content'>
       
        <table className='str-code-table'>
          <thead>
            <tr>
              <th>Select STR Code</th>
            </tr>
          </thead>
          <tbody>
            {strCodes.map((code, index) => (
              <tr key={index} onClick={() => onSelect(code)} className='str-code-row'>
                <td>{code}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default STRCodePopup;
