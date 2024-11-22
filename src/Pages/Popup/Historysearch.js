import React, { useState } from 'react';
import './Historysearch.css'; // Ensure this includes styles for table, popup, etc.

const BillingPopup = ({ details, onClose, onSelect }) => {
  console.log(details,'INSEARCH')
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckboxChange = (detail) => {
    setSelectedDetails(prevSelected =>
      prevSelected.includes(detail)
        ? prevSelected.filter(d => d !== detail)
        : [...prevSelected, detail]
    );
  };

  const handleAdd = () => {
    onSelect(selectedDetails);
  };

  const handleCancelSearch = () => {
    setSearchTerm('');
  };

  const filteredDetails = searchTerm
    ? details.filter(detail =>
        detail.serviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : details;

  return (
    <div className="billing-popup-overlay">
      <div className="billing-popup-content">
        <div className="billing-popup-header">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="billing-popup-search"
          />
          {searchTerm && (
            <button
              className="billing-popup-cancel-button"
              onClick={handleCancelSearch}
              aria-label="Cancel Search"
            >
              Cancel
            </button>
          )}
          <button
            className="billing-popup-close-button"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <table className="billing-popup-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Service Code</th>
              <th>Service Name</th>
              <th>Price</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredDetails.length > 0 ? (
              filteredDetails.map(detail => (
                <tr key={detail.serviceCode}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedDetails.includes(detail)}
                      onChange={() => handleCheckboxChange(detail)}
                    />
                  </td>
                  <td>{detail.serviceCode}</td>
                  <td>{detail.serviceName}</td>
                  <td>{detail.servicePrice}</td> {/* Assuming detail has a price property */}
                  

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No matching results</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="billing-popup-footer">
          <button className="billing-popup-button" onClick={handleAdd}>Add Selected</button>
          <button className="billing-popup-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default BillingPopup;













