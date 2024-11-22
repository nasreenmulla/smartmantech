
import React, { useState, useEffect } from 'react';
import API from '../../Api';

const Reads = () => {
  const [lab, setLab] = useState([]);
  const [testDetails, setTestDetails] = useState([]);
  const [nextTestNo, setNextTestNo] = useState(null);
  const [username, setUsername] = useState(''); // State for username
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [hasDetails, setHasDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for selected item code

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchNextTestNo = async () => {
      try {
        const response = await API.get('/api/get-next-test-id');
        const data = response.data;
        setNextTestNo(data.nextTestId);
      } catch (error) {
        console.error('Error fetching next Test ID:', error);
      }
    };

    fetchNextTestNo();
  }, []);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const response = await API.get('/api/lab');
        setLab(response.data);
        console.log('lab resposne array',response.data)
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };

    fetchLab();
  }, []);

  const handleRowClick = async (itemCode) => {
    // alert(itemCode,'ROW CLICKED')
    try {
      setSelectedItemCode(itemCode); // Set the selected item code
      setTestDetails([]);
      setHasDetails(false);

      const response = await API.get(`/api/test-details/${itemCode}`);
      console.log('HANDLE ROW',response.data)
      const data=response.data;
      if (data && Object.keys(data).length > 0) {
                 
        setHasDetails(true);
    } else {
        setHasDetails(false);
    }
      if (response.data.length > 0) {
        
        setTestDetails(response.data);
      } else {
        setTestDetails([]);
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      alert('Error fetching test details.');
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...testDetails];
    updatedDetails[index][field] = value;
    setTestDetails(updatedDetails);
  };

  const handleAddRow = () => {
    setTestDetails([...testDetails, { testId: '', testName: '', referenceRange: '', comments: '', active: '', testHeader: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const submissionData = {
      username,
      selectedItemCode,
      nextTestNo,
      testDetails: testDetails.map(detail => ({
        testName: detail.testName,
        referenceRange: detail.referenceRange,
        comments: detail.comments,
        active: detail.active,
        testHeader: detail.testHeader
      }))
    };

    try {
      // Send the data to the backend API
      console.log('SUBMITTINGDATA',submissionData)
      const response = await API.post('/api/submit-test-details', submissionData);
      console.log('Submission successful:', response.data);
      // Optional: Handle success feedback to the user
      alert('Test details submitted successfully!');
    } catch (error) {
      console.error('Error submitting test details:', error);
      // Optional: Handle error feedback to the user
    }
  };
  const handleUpdate = async () => {
    // Prepare data to send for update
    const updateData = {
      username,
      testDetails: testDetails.map(detail => ({
        testId: detail.testId, // Ensure testId is included for the update
        testName: detail.testName,
        referenceRange: detail.referenceRange,
        comments: detail.comments,
        active: detail.active,
        testHeader: detail.testHeader,
      })),
    };

    try {
      console.log('Updating :', updateData);
      const response = await API.post('/api/updateMasterTestId', updateData);
      console.log('Update successful:', response.data);
      alert('Test details updated successfully!');
      // Optional: Handle success feedback to the user
    } catch (error) {
      console.error('Error updating test details:', error);
      // Optional: Handle error feedback to the user
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  const filteredLab = lab.filter(item =>
    item.referenceCode.toLowerCase().includes(searchTerm) ||
    (item.descriptionEnglish && item.descriptionEnglish.toLowerCase().includes(searchTerm)) ||
    (item.descriptionArabic && item.descriptionArabic.toLowerCase().includes(searchTerm))
  );
  return (
    <main className='main-container'>
      <div className='main-content'>
        <div className='details-container'>
          <div className='patient-details-container'>
            <h2 style={{ backgroundColor: '#d3d3d3', width: '100%', display: 'inline-block' }}>
              Lab Master Information
            </h2>
            <input
              type="text"
              placeholder="Search by code or name..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
            />
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Reference Code</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Name (English)</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Name (Arabic)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLab.length > 0 ? (
                    filteredLab.map(item => (
                      <tr 
                        key={item.referenceCode} 
                        onClick={() => handleRowClick(item.itemCode)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.referenceCode}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.descriptionEnglish || 'N/A'}</td>
                        <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.descriptionArabic || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '8px' }}>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
        <div className='form-container'>
          <h2 style={{ backgroundColor: '#d3d3d3', width: '100%', display: 'inline-block' }}>
            Test Name and Details
          </h2>
          <form onSubmit={handleSubmit}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Test Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Reference Range</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Active</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Comments</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px' }}>Test Header</th>
                </tr>
              </thead>
              <tbody>
                {testDetails.length > 0 ? (
                  testDetails.map((detail, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        <input
                          type="text"
                          value={detail.testName}
                          onChange={(e) => handleInputChange(index, 'testName', e.target.value)}
                        />
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        <input
                          type="text"
                          value={detail.referenceRange}
                          onChange={(e) => handleInputChange(index, 'referenceRange', e.target.value)}
                          style={{ width: '300px', height: '40px' }} 
                        />
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        <input
                          type="checkbox"
                          checked={detail.active === 'Y'}
                          onChange={(e) => handleInputChange(index, 'active', e.target.checked ? 'Y' : 'N')}
                        />
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        <input
                          type="checkbox"
                          checked={detail.comments === 'Y'}
                          onChange={(e) => handleInputChange(index, 'comments', e.target.checked ? 'Y' : 'N')}
                        />
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                        <input
                          type="text"
                          value={detail.testHeader}
                          onChange={(e) => handleInputChange(index, 'testHeader', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '8px' }}>No tests available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button type="button" onClick={handleAddRow}>New Row</button>
            { hasDetails ? (
    <button type='button' onClick={handleUpdate} >
        Update
    </button>
) : (
  <button type="submit">Save</button>
)}
            
          </form>
        </div>
      
    </main>
  );
};

export default Reads;
