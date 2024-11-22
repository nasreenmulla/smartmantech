import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reads.css'
import API from '../../Api';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

const Reads = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasDetails, setHasDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (event) => {
    const newDate = event.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await API.get(`/api/patientsr`, {
              params: { date: formattedDate },
          });
  
          // Create a unique list of patients based on their IDs
          const uniquePatients = response.data.reduce((acc, patient) => {
              const existing = acc.find(p => p.id === patient.id);
              if (!existing) {
                  acc.push(patient);
              }
              return acc;
          }, []);
  
          setPatients(uniquePatients);
          console.log(uniquePatients, 'received in PATIENTVISIT');
          setLoading(false);
      } catch (error) {
          console.error('Error fetching patients:', error);
          setLoading(false);
      }
  };
  
  
    fetchPatients();
  }, [selectedDate]); 
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (selectedPatient) {
        try {
          const response = await API.get(`/api/patient-details/${selectedPatient.id}`);
          const data = response.data;
  
          if (data) {
            setHasDetails(true);
            setFormData({
              weight: data.weight || '',
              height: data.height || '',
              heartRate: data.heartRate || '',
              oxygenSaturation: data.oxygenSaturation || '',
              bloodSugar: data.bloodSugar || '',
              temperature: data.temperature || '',
              bpSystolic: data.bpSystolic || '',
              bpDiastolic: data.bpDiastolic || '',
              headCircumference: data.headCircumference || '',
              nurseNotes: data.nurseNotes || '',
              fileNo: data.fileNo || '',
              VISIT_ID: data.VISIT_ID || ''
            });
          } else {
            setHasDetails(false);
            setFormData({
              weight: '',
              height: '',
              heartRate: '',
              oxygenSaturation: '',
              bloodSugar: '',
              temperature: '',
              bpSystolic: '',
              bpDiastolic: '',
              headCircumference: '',
              nurseNotes: '',
              fileNo: '',
              VISIT_ID: ''
            });
          }
        } catch (error) {
          console.error('Error fetching patient details:', error);
        }
      }
    };
    fetchPatientDetails();
  }, [selectedPatient]);
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    
    // Clear form data and readings for the new patient
    setFormData({
      weight: '',
      height: '',
      heartRate: '',
      oxygenSaturation: '',
      bloodSugar: '',
      temperature: '',
      bpSystolic: '',
      bpDiastolic: '',
      headCircumference: '',
      nurseNotes: '',
      fileNo: '',
      VISIT_ID: ''
    });
    
    setHasDetails(false);
  };
  

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    heartRate: '',
    oxygenSaturation: '',
    bloodSugar: '',
    temperature: '',
    bpSystolic: '',
    bpDiastolic: '',
    headCircumference: '',
    nurseNotes: '',
    fileNo: '',
    VISIT_ID:'' // Add fileNo to the state if needed
});


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!selectedPatient) {
      alert('Please select a patient first.');
      return;
    }
  
    const username = localStorage.getItem('username'); // Fetch username for both createdBy and updatedBy
  
    const formDataWithPatientId = {
      ...formData,
      fileNo: selectedPatient.id,
      VISIT_ID: selectedPatient.visitId,
      updatedBy: hasDetails ? username : undefined, // Include updatedBy if updating
      createdBy: !hasDetails ? username : undefined // Include createdBy if submitting new
    };
  
    try {
      if (hasDetails) {
        // Update existing details
        await API.put(`/api/update-details/${selectedPatient.id}`, formDataWithPatientId);
        alert('Details updated successfully');
      } else {
        // Submit new details
        await API.post('/api/submit-details', formDataWithPatientId);
        alert('Details submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting details:', error);
      alert('Error submitting details');
    }
  };
  
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options).replace(/\//g, '-');
  };
  
  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const dob = selectedPatient ? selectedPatient.dob : '';
  const formattedDob = formatDate(dob);
  const age = selectedPatient ? calculateAge(dob) : 'N/A';
  function formatTime(hour, minute) {
    let period = 'AM';
    let formattedHour = hour;

    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            formattedHour = hour - 12;
        }
    } else if (hour === 0) {
        formattedHour = 12; // Midnight case
    }

    return `${formattedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}


  return (
    <main className='main-container'>
      <div className='main-content'>
      <div className='patient-list-container' style={{
  flex: '1',
  overflowY: 'auto',
  backgroundColor: '#fff9e6', /* Light yellow background */
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Subtle shadow for depth */
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
 
  boxSizing: 'border-box', /* Ensures padding and border are included in the total width and height */
}}>

  <div className='search-container' style={{
    marginBottom: '10px', /* Reduce space below the search bar */
  }}>
     <div className='date-picker-container'>
        <label htmlFor='date-picker'>Date</label>
        <DatePickerComponent
          id='date-picker'
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
    <input
      type='text'
      placeholder='Search patients...'
      value={searchTerm}
      onChange={handleSearchChange}
      style={{
        width: '90%',
        padding: '12px',
        border: '2px solid #f7c330', /* Soft yellow border */
        borderRadius: '8px',
        fontSize: '16px',
        outline: 'none',
        backgroundColor: '#fff8e1', /* Very light yellow background */
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', /* Subtle shadow */
        transition: 'border-color 0.3s, box-shadow 0.3s', /* Smooth transitions */
      }}
      onFocus={(e) => e.target.style.boxShadow = '0 0 8px rgba(247, 195, 48, 0.5)'} /* Yellow shadow on focus */
      onBlur={(e) => e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'} /* Default shadow on blur */
    />
  </div>

  {loading ? (
    <p>Loading patients...</p>
  ) : (
    <ul className='patient-list' style={{
      listStyleType: 'none',
      padding: '0',
      margin: '0',
    fontSize:'15px',
      
      backgroundColor: '#fffbe8', /* Light yellow for the list background */
      borderRadius: '8px',
      border: '1px solid #f0e4d7', /* Light border color */
    }}>
      {filteredPatients.length > 0 ? (
        filteredPatients.map(patient => (
          <li
            key={patient.id}
            className='patient-item'
            onClick={() => handlePatientSelect(patient)}
            style={{
              padding: '12px',
              cursor: 'pointer',
              borderBottom: '1px solid #f0e4d7',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff6e0'} /* Slightly darker yellow on hover */
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fffbe8'} /* Default background */
          >
            {patient.name}
          </li>
        ))
      ) : (
        <li>No patients found</li>
      )}
    </ul>
  )}
</div>

  
        <div className='details-container'>
          <div className='patient-details-container'>
            <h2  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}>Patient Details</h2>
            <div 
  className='details-grid' 
  style={{
    display: 'flex',
    flexWrap: 'wrap', /* Allow items to wrap onto multiple lines */
  
  }}
>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box' ,fontSize:'15px'}}>
    <strong>FileNo:</strong> {selectedPatient ? selectedPatient.id : 'N/A'}
  </p>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box' ,fontSize:'15px'}}>
    <strong>Name:</strong> {selectedPatient ? selectedPatient.name : 'N/A'}
  </p>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box',fontSize:'15px' }}>
    {/* <strong>Date of Birth:</strong> {selectedPatient ? selectedPatient.dob : 'N/A'} */}
    <strong>Date of Birth:</strong> {formattedDob} (Age: {age})
  </p>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box',fontSize:'15px' }}>
    <strong>Marital Status:</strong> {selectedPatient ? selectedPatient.maritalStatus : 'N/A'}
  </p>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box',fontSize:'15px' }}>
    <strong>Gender:</strong> {selectedPatient ? selectedPatient.gender : 'N/A'}
  </p>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box',fontSize:'15px' }}>
    <strong>Blood Type:</strong> {selectedPatient ? selectedPatient.bloodType : 'N/A'}
  </p>
  <p style={{ flexBasis: '45%', boxSizing: 'border-box',fontSize:'15px' }}>
    <strong>Smoker:</strong> {selectedPatient ? (selectedPatient.smoker ? 'Yes' : 'No') : 'N/A'}
  </p>
</div>

          </div>
  
          <div  className='observations-container'>
           <div className='Read'>
           <h2  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }} >Readings</h2>
           </div>
            <div 
  className='readings-grid' 
  style={{
    display: 'flex', 
    flexWrap: 'wrap', /* Allow items to wrap onto multiple lines */
    gap: '10px', 
    fontSize:'15px'/* Space between items */
  }}
>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>Height:</strong> {formData.height ? `${formData.height} cm` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>HR:</strong> {formData.heartRate ? `${formData.heartRate} bpm` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>SPO2:</strong> {formData.oxygenSaturation ? `${formData.oxygenSaturation} %` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>Sugar:</strong> {formData.bloodSugar ? `${formData.bloodSugar} mg/dL` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>Temp:</strong> {formData.temperature ? `${formData.temperature} °C` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>BP:</strong> {formData.bpSystolic && formData.bpDiastolic ? `${formData.bpSystolic}/${formData.bpDiastolic} mmHg` : 'N/A'}
</p>
<p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
  <strong>Head:</strong> {formData.headCircumference ? `${formData.headCircumference} cm` : 'N/A'}
</p>

</div>

          </div>
        </div>
      </div>
      <div style={{
 backgroundColor: '#d3d3d3',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}}>

  <div style={{
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div style={{ flex: '1', marginRight: '10px' }}>
      <p style={{ margin: 0 }}><strong>Time:</strong> {selectedPatient ? formatTime(selectedPatient.visitHour, selectedPatient.visitMinute) : 'N/A'}</p>
    </div>
    <div style={{ flex: '1', marginRight: '10px' }}>
      <p style={{ margin: 0 }}><strong>Date:</strong> {selectedPatient ? selectedPatient.visitDate : 'N/A'}</p>
    </div>
    <div style={{ flex: '1' }}>
      <p style={{ margin: 0 }}><strong>Doctor:</strong> {selectedPatient ? selectedPatient.doctorId : 'N/A'}</p>
    </div>
  </div>
</div>


      <div className='form-container'>
  <h2  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}>Patient Observations Form</h2>
  <form onSubmit={handleSubmit}>
  <div className='field-row'>
    <div className='form-group'>
      <label htmlFor='weight'>Weight (kg):</label>
      <input
        type='text'
        id='weight'
        name='weight'
        value={formData.weight}
        onChange={handleChange}
        placeholder='e.g., 70'
      />
    </div>
    <div className='form-group'>
      <label htmlFor='height'>Height (cm):</label>
      <input
        type='text'
        id='height'
        name='height'
        value={formData.height}
        onChange={handleChange}
        placeholder='e.g., 175'
      />
    </div>
    <div className='form-group'>
      <label htmlFor='heart-rate'>Heart Rate (bpm):</label>
      <input
        type='text'
        id='heart-rate'
        name='heartRate'
        value={formData.heartRate}
        onChange={handleChange}
        placeholder='e.g., 80'
      />
    </div>
    <div className='form-group'>
      <label htmlFor='oxygen-saturation'>Oxygen Saturation (%):</label>
      <input
        type='text'
        id='oxygen-saturation'
        name='oxygenSaturation'
        value={formData.oxygenSaturation}
        onChange={handleChange}
        placeholder='e.g., 98'
      />
    </div>
  </div>
  <div className='field-row'>
    <div className='form-group'>
      <label htmlFor='blood-sugar'>Blood Sugar (mg/dL):</label>
      <input
        type='text'
        id='blood-sugar'
        name='bloodSugar'
        value={formData.bloodSugar}
        onChange={handleChange}
        placeholder='e.g., 90'
      />
    </div>
    <div className='form-group'>
      <label htmlFor='temperature'>Temperature (°C):</label>
      <input
        type='text'
        id='temperature'
        name='temperature'
        value={formData.temperature}
        onChange={handleChange}
        placeholder='e.g., 36.6'
      />
    </div>
    <div className='form-group'>
      <label htmlFor='bp-systolic'>Systolic BP (mmHg):</label>
      <input
        type='text'
        id='bp-systolic'
        name='bpSystolic'
        value={formData.bpSystolic}
        onChange={handleChange}
        placeholder='e.g., 120'
      />
    </div>
    <div className='form-group'>
      <label htmlFor='bp-diastolic'>Diastolic BP (mmHg):</label>
      <input
        type='text'
        id='bp-diastolic'
        name='bpDiastolic'
        value={formData.bpDiastolic}
        onChange={handleChange}
        placeholder='e.g., 80'
      />
    </div>
  </div>
  <div className='head-notes-row'>
    <div className='head-circumference-container'>
      <div className='form-group'>
        <label htmlFor='head-circumference'>Head Circumference (cm):</label>
        <input
          type='text'
          id='head-circumference'
          name='headCircumference'
          value={formData.headCircumference}
          onChange={handleChange}
          placeholder='e.g., 45'
        />
      </div>
    </div>
    <div className='nurse-notes-container'>
      <div className='form-group'>
        <label htmlFor='nurse-notes'>Nurse Notes:</label>
        <textarea
          id='nurse-notes'
          name='nurseNotes'
          value={formData.nurseNotes}
          onChange={handleChange}
          placeholder='Add notes here...'
        ></textarea>
      </div>
    </div>
  </div>
  <button type='submit' className='submit-button'>
    {hasDetails ? 'Update' : 'Submit'}
  </button>
</form>


</div>

    </main>
  );
  
  
};

export default Reads;
