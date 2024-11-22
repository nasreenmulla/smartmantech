
import React, { useState, useEffect, useCallback } from 'react';
import API from '../../Api'; // Adjust the path as needed
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import './History.css'; 
import HistoryBill from './Historybill.js';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const Reads = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchName, setSearchName] = useState('');
  const [searchFileNo, setSearchFileNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate=useNavigate();

  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null); // State to hold selected fileNo and serial

  // Function to handle date change
  const handleDateChange = (event) => {
    const newDate = event.value;
    setSelectedDate(newDate);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Debounced function to fetch data from the API
  const fetchData = useCallback(debounce(async () => {
    try {
      const response = await API.get('/api/history', {
        params: {
          date: selectedDate.toISOString(),
          name: searchName,
          fileNo: searchFileNo
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, 300), [selectedDate, searchName, searchFileNo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle click on serial and fileNo
  const handleSerialClick = (serial, fileNo) => {
    const url = `/patientBILL?fileNo=${encodeURIComponent(fileNo)}&serial=${encodeURIComponent(serial)}`;

    navigate(url);
  };

  const handleClose = () => {
    setSelectedData(null); // This will hide the HistoryBill component
  };

  const filteredData = data.filter(item => item.fileNo.includes(searchQuery));

  return (
    <main className='main-container'>
      <div className='ddate-picker-container'>
        <label htmlFor='date-picker'>Date</label>
        <DatePickerComponent
          id='date-picker'
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
      <div className='search-container'>
        <label htmlFor='search-input'>Search by File No:</label>
        <input
          id='search-input'
          type='text'
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Enter file number'
        />
      </div>
      <div className='dmain-content'>
        {/* Display search results above the table */}
        <div className='dhcontainer'>
        {filteredData.length > 0 && (
    <div className='search-results'>
        <table className='htable'>
            <thead>
                <tr>
                    <th>Patient Name</th>
                    <th>File No</th>
                    <th>Bill Number</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item) => (
                    <tr key={item.fileNo}>
                        <td>{item.name}</td>
                        <td>{item.fileNo}</td>
                        <td>
                            {item.serial?.split(', ').map((serial, index) => (
                                <div key={index} style={{ marginBottom: '5px' }}>
                                    <button onClick={() => handleSerialClick(serial, item.fileNo)}>
                                        {serial}
                                    </button>
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}

          {filteredData.length === 0 && searchQuery && (
            <div className='no-results'>
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
      {/* Conditionally render HistoryBill component */}
      {selectedData && (
        <HistoryBill
          fileNo={selectedData.fileNo}
          serial={selectedData.serial}
          onClose={handleClose} 
        />
      )}
    </main>
  );
};

export default Reads;
