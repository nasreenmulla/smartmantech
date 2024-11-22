import React, { useState } from 'react';
import './Add.css'; // Ensure this file includes the necessary CSS

const AddServiceModal = ({ onClose, onAddService }) => {
  const [service, setService] = useState({
    serviceCode: '',
    serviceName: '',
    uomDescription: '',
    servicePrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService(prevService => ({
      ...prevService,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(service).some(value => !value)) {
      alert('Please fill in all fields');
      return;
    }
    onAddService(service);
  };

  return (
    <div className="add-service-modal">
      <div className="add-service-modal-content">
        <button className="add-service-modal-close" onClick={onClose}>X</button>
        <h2>Add New Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="serviceCode">Service Code:</label>
            <input 
              id="serviceCode" 
              name="serviceCode"
              type="text" 
              value={service.serviceCode} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="serviceName">Service Name:</label>
            <input 
              id="serviceName" 
              name="serviceName"
              type="text" 
              value={service.serviceName} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="uomDescription">UOM Description:</label>
            <input 
              id="uomDescription" 
              name="uomDescription"
              type="text" 
              value={service.uomDescription} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="servicePrice">Service Price:</label>
            <input 
              id="servicePrice" 
              name="servicePrice"
              type="number" 
              value={service.servicePrice} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit">Add Service</button>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
