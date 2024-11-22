
import React from 'react';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../Api';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import './Schedule.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import Popup from '../Popup/Popup';
import STRCodePopup from '../Popup/STR';
import { useParams } from 'react-router-dom';
const AppointmentTable = () => {
  



  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [strCodes, setStrCodes] = useState([]);
  const [showSTRCodePopup, setShowSTRCodePopup] = useState(false); // State for showing STRCodePopup
  const [selectedSTRCode, setSelectedSTRCode] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  



  const handleSTRCodeSelect = (code) => {
    setSelectedSTRCode(code);
    setShowSTRCodePopup(false);
    setShowPopup(false);
    // Proceed with showing the bill or performing actions with the selected STR_CODE
    console.log('Selected STR_CODE:', code);
    localStorage.setItem('STR_CODE',code)
    // You can add logic here to fetch or show the bill with the selected STR_CODE
  };

 

  const handleBillClick = (fileNo) => {
    
    const appointment = rowsToRender.find(app => app.PAT_ID === fileNo);
    setSelectedAppointment(appointment);
    setShowSTRCodePopup(true);
  };

  const handleClosePopup = () => {
    setSelectedAppointment(null);
    setSelectedSTRCode(null);
    setShowPopup(false);
    
    

  };

  const navigate = useNavigate();
  // Dummy data for empty rows
  const emptyRows = Array.from({ length: 8 }, (_, index) => index + 1);
    const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle case where dateString is empty or undefined
  
    const dateObject = new Date(dateString);
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const year = dateObject.getFullYear();
  
    return `${month}/${day}/${year}`;
  };


  const [visitFromDate, setVisitFromDate] = useState(null);
const [visitToDate, setVisitToDate] = useState(null);
const [isCanceledChecked, setIsCanceledChecked] = useState(false);




    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('ALL');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
    const [appointments, setAppointments] = useState([]);
    //1
    useEffect(() => {
      handleFilter(visitFromDate, visitToDate);
  }, [selectedDoctor, visitFromDate, visitToDate]);
    useEffect(() => {
      const comNo = localStorage.getItem('COM_NO');
    const username = localStorage.getItem('username');
    
    if (comNo && username) {
      fetchStrCode(comNo, username);
    }
      const today = new Date();
      setVisitFromDate(today);
      setVisitToDate(today);
      fetchAllDoctors();
      fetchSpecialities();
      
      // Fetch appointments for the current day without doctor filter
      handleFilter(today, today);
    }, []);

  const statusOptions = ["Schedule", "Walk-in", "$PAYS", "Done"];
  const checkboxStyle1 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'grey',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle2 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'lightblue',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle3= {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: '#b46b9a',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle4 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'lightgreen',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle5 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'grey',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 


  
  const checkboxStyle6 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'red',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle7 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'yellow',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  };
  const fetchAllDoctors = async () => {
    try {
      const response = await API.get('/api/fetchAll');
      const doctorsData = response.data.map((doctorName, index) => ({
        id: index + 1,
        name: doctorName
      }));
      setDoctors(doctorsData);
      setSelectedDoctor('ALL')
      setFilteredDoctors(doctorsData); // Initialize filtered doctors
    } catch (error) {
      console.error('Error fetching all doctors:', error);
    }
  };

  const fetchSpecialities = async () => {
    try {
      const response = await API.get('/api/fetchSpeciality');
      
      setSpecialities(response.data);
      setSelectedSpecialty('ALL');//NEW
      fetchAllDoctors();//NEW
    } catch (error) {
      console.error('Error fetching specialities:', error);
    }
  };

  const fetchDoctors = async (specialty) => {
    try {
      const response = await API.get(`/api/fetchDoctors?specialty=${specialty}`);
      const doctorsData = response.data.map((doctorName, index) => ({
        id: index + 1,
        name: doctorName
      }));
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData); // Set filtered doctors to the new list
    } catch (error) {
      console.error(`Error fetching doctors for ${specialty}:`, error);
    }
  };
  const handleSpecialtyChange = (event) => {
    const selectedSpecialty = event.target.value;
    setSelectedSpecialty(selectedSpecialty);

    if (selectedSpecialty === 'ALL') {
      fetchAllDoctors();
    } else {
      fetchDoctors(selectedSpecialty);
    }
  };
  const handleDoctorChange = async (event) => {
    const selectedDoctor = event.target.value;
    setSelectedDoctor(selectedDoctor);
    console.log('Selected Doctor:', selectedDoctor); // Debugging line
  
    // Call handleFilter to fetch and sort appointments with the selected doctor and current date range
    handleFilter(visitFromDate, visitToDate);
  };
  
  
  //1
  const handleVisitFromDateChange = (event) => {
    const newDate = event.target.value;
    setVisitFromDate(newDate);
    handleFilter(newDate, visitToDate); // Filter with the new from date and existing to date
  };
  
  const handleVisitToDateChange = (event) => {
    const newDate = event.target.value;
    setVisitToDate(newDate);
    handleFilter(visitFromDate, newDate); // Filter with existing from date and new to date
  };
  const handleFilter = async (fromDate = visitFromDate, toDate = visitToDate) => {
    const formattedVisitFromDate = formatDate(fromDate);
    const formattedVisitToDate = formatDate(toDate);
  
    // Log the filtering parameters for debugging
    console.log('Filtering with:', {
      doctor: selectedDoctor === 'ALL' ? 'ALL' : selectedDoctor, // Use 'ALL' to indicate fetching for all doctors
      visitFromDate: formattedVisitFromDate,
      visitToDate: formattedVisitToDate
    });
  
    try {
      // Fetch filtered appointments from the API
      const response = await API.get('/api/filterAppointments', {
        params: {
          doctor: selectedDoctor === 'ALL' ? undefined : selectedDoctor, // Use 'undefined' to fetch for all doctors
          visitFromDate: formattedVisitFromDate,
          visitToDate: formattedVisitToDate
        }
      });
  
      // Sort appointments by date (descending) and time (ascending)
      const sortedAppointments = response.data.sort((a, b) => {
        const dateA = new Date(a.VISIT_DATE);
        const dateB = new Date(b.VISIT_DATE);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime(); // Descending order
        }
        const timeA = (a.VISIT_HOUR || 0) * 60 + (a.VISIT_MINUTES || 0);
        const timeB = (b.VISIT_HOUR || 0) * 60 + (b.VISIT_MINUTES || 0);
        return timeA - timeB; // Ascending order
      });
  
      // Update the state with the sorted appointments
      setAppointments(sortedAppointments);
      console.log('Filtered Appointments:', sortedAppointments); // Debugging line
    } catch (error) {
      console.error('Error fetching filtered appointments:', error);
    }
  };
  
  

  
  
  
  // const handleFilter = async (fromDate = visitFromDate, toDate = visitToDate) => {
  //   const formattedVisitFromDate = formatDate(fromDate);
  //   const formattedVisitToDate = formatDate(toDate);
  //   alert(formattedVisitFromDate)
  
  //   try {
  //     const response = await API.get('/api/filterAppointments', {
  //       params: {
  //         doctor: selectedDoctor  || '', // Use empty string if no doctor is selected
  //         visitFromDate: formattedVisitFromDate,
  //         visitToDate: formattedVisitToDate
  //       }
  //     });
  //     setAppointments(response.data);
  //     console.log('response for appointment schedule',response.data)
  //   } catch (error) {
  //     console.error('Error fetching filtered appointments:', error);
  //   }
  // };

  const rowsToRender = [...appointments];
  const additionalRows = Math.max(0, 8 - appointments.length);
  for (let i = 0; i < additionalRows; i++) {
    rowsToRender.push([]);
  }
  const formatTime = (hour, minutes) => {
    // Ensure hour and minutes are numbers and handle cases where hour or minutes might be undefined
    if (hour != null && minutes != null) {
      // Convert hours to 12-hour format and determine AM/PM
      const period = hour >= 12 ? 'PM' : 'AM';
      const adjustedHour = hour % 12 || 12; // Convert 0 hours to 12 for AM
      const formattedMinutes = String(minutes).padStart(2, '0'); // Ensure minutes are always two digits
  
      return `${adjustedHour}:${formattedMinutes} ${period}`;
    } else {
      return null; // Return null if hour or minutes are not provided
    }
  };
  
const handlePatientClick = (patId) => {
  // Redirect to patient profile page with PAT_ID as query parameter
  navigate(`/patientprofile?patId=${patId}`);
};
const handleCheckboxChange = async (patId,visitId) => {
  // Find the appointment by PAT_ID
  const updatedAppointments = appointments.map(appointment => 
    appointment.PAT_ID === patId  && appointment.VISIT_ID === visitId
      ? { ...appointment, CANCELED: appointment.CANCELED === 'Y' ? 'N' : 'Y' }
      : appointment
  );

  // Update the state with the new appointments
  setAppointments(updatedAppointments);

  try {
    await API.post('/api/updateAppointment', {
      PAT_ID: patId,
      VISIT_ID: visitId,
      CANCELED: updatedAppointments.find(app => app.PAT_ID === patId && app.VISIT_ID === visitId).CANCELED
    });
    // Show alert on successful update
    // alert(`Cancellation status for PAT_ID ${patId} updated successfully`);
  } catch (error) {
    // Show alert if there is an error
    console.error('Error updating appointment status:', error);
    // alert(`Failed to update cancellation status for PAT_ID ${patId}`);
  }
};

const handleCheckedboxChange = (event) => {
  setIsCanceledChecked(event.target.checked);
};
const fetchStrCode = async (comNo, username) => {
  try {
    const response = await API.get('/api/storeUsers', {
      params: { comNo, username }
    });
    const codes = response.data.STR_CODES; 
    setStrCodes(codes); 
    console.log(codes)
    if (codes.length === 1) {
      handleSTRCodeSelect(codes[0]);
    } else if (codes.length > 1) {
      setShowPopup(true);
    }
  
    
    console.log('codes     ',response.data.STR_CODES)// Assume the API returns an array of STR_CODE values
  } catch (error) {
    console.error('Error fetching STR_CODES:', error);
  }
};
const [sortConfig, setSortConfig] = useState({ key: 'VISIT_DATE', direction: 'ascending' });

const sortedAppointments = [...appointments].sort((a, b) => {
  const { key, direction } = sortConfig;

  if (a[key] < b[key]) {
    return direction === 'ascending' ? -1 : 1;
  }
  if (a[key] > b[key]) {
    return direction === 'ascending' ? 1 : -1;
  }
  return 0;
});

const requestSort = (key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });
};


  return (
    <main className='main-container'>
      <div className='main-cards'>
        <div className='card'>
          <div>
            <h2>Appointment Table</h2>
            <div style={{
    backgroundColor: '#d3d3d3' // Light yellow background color

 // Make it wrap around content only
  }} class="Sform-row">
  <div class="form-item">
  <label style={{ display: 'flex',marginRight:'5px',marginTop:'10px'}}>Clinic</label>
              <select style={{width:'200px'}} value={selectedSpecialty} onChange={handleSpecialtyChange}> 
                  <option value="ALL">ALL</option>
        {specialities.map((specialty, index) => (
          <option key={index} value={specialty}>{specialty}</option>
        ))}
              </select>
  </div>
  <div class="form-item">
  <label style={{ display: 'flex',marginRight:'5px',marginTop:'10px'}} >Doctor</label>
              <select value={selectedDoctor}  style={{marginRight:'10px'}}onChange={handleDoctorChange}>
              <option value="ALL">ALL</option>
          {doctors
            .filter((doc, index, self) =>
              index === self.findIndex((t) => (
                t.name === doc.name
              ))
            )
            .map((doctor, index) => (
              <option key={index} value={doctor.name}>{doctor.name}</option>
            ))}
              </select>
  </div>
  <div class="form-item">
    <label>Visit From Date</label>
    <DatePickerComponent 
      value={visitFromDate}
    onChange={handleVisitFromDateChange} 
    />
  </div>
  <div class="form-item">
    <label>Visit To Date</label>
    <DatePickerComponent 
    value={visitToDate}
  
    onChange={handleVisitToDateChange}/>
  </div>
  {/* <button  onClick={handleFilter}>Filter</button> */}
  <button  onClick={() => {
   setSelectedDoctor('ALL');
   const today = new Date();
   setVisitFromDate(today);
   setVisitToDate(today);
   
   // Reset appointments to show all appointments
   fetchAllDoctors(); // Reset to all doctors
   handleFilter(); // Reset to all doctors
  }}>Cancel</button>
 <input
    type='checkbox'
    checked={isCanceledChecked}
    onChange={handleCheckedboxChange}
  />
  <label>Canceled</label>
</div>


    
            <div style={{    borderRadius: '5px', // Adds border radius of 8px to round the corners
    // Optional: Adds padding inside the container
    backgroundColor: '#f0f0f0',}}>
               
             
               
               
               <input type="checkbox" style={checkboxStyle2} ></input> <label style={{marginRight:'35px'}}>Walk-in path.</label>
               
              
              <input type="checkbox" style={checkboxStyle3} ></input>  <label style={{marginRight:'35px'}}>Scheduled</label>
              
              
               <input type="checkbox" style={checkboxStyle4} ></input>   <label style={{marginRight:'35px'}}>$RequestToPay$</label>
               
              
              <input type="checkbox" style={checkboxStyle5} ></input> <label style={{marginRight:'35px'}}>Done</label>
              
              
              <input type="checkbox" style={checkboxStyle6} ></input> <label style={{marginRight:'35px'}}>Archive</label>
             
              
              <input type="checkbox" style={checkboxStyle7} ></input>  <label style={{marginRight:'35px'}}>Canceled</label>
              
              </div>
              <table style={{ width: 'auto', borderCollapse: 'collapse', border: '1px solid #ddd', fontSize: '12px' }}>
  <thead>
    <tr style={{ backgroundColor: '#f2f2f2' }}>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '60px' }}>Bill</th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '60px' }}>Prof</th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '80px' }}>
        <span>Status
          <button onClick={() => requestSort('STATUS')} style={{ border: 'none', background: 'transparent', padding: '0', marginLeft: '5px' }}>
            {sortConfig.key === 'STATUS' && sortConfig.direction === 'ascending' ? '🔽' : '🔼'}
          </button>
        </span>
      </th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '80px' }}>
        <span>Que#
          <button onClick={() => requestSort('QUEUE_NUMBER')} style={{ border: 'none', background: 'transparent', padding: '0', marginLeft: '5px' }}>
            {sortConfig.key === 'QUEUE_NUMBER' && sortConfig.direction === 'ascending' ? '🔽' : '🔼'}
          </button>
        </span>
      </th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '120px' }}>
        <span>Patient Name
          <button onClick={() => requestSort('PATIENT_FIRST_NAME')} style={{ border: 'none', background: 'transparent', padding: '0', marginLeft: '5px' }}>
            {sortConfig.key === 'PATIENT_FIRST_NAME' && sortConfig.direction === 'ascending' ? '🔽' : '🔼'}
          </button>
        </span>
      </th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '100px' }}>
        <span>Date
          <button onClick={() => requestSort('VISIT_DATE')} style={{ border: 'none', background: 'transparent', padding: '0', marginLeft: '5px' }}>
            {sortConfig.key === 'VISIT_DATE' && sortConfig.direction === 'ascending' ? '🔽' : '🔼'}
          </button>
        </span>
      </th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '100px' }}>
        <span>Time
          <button onClick={() => requestSort('VISIT_HOUR')} style={{ border: 'none', background: 'transparent', padding: '0', marginLeft: '5px' }}>
            {sortConfig.key === 'VISIT_HOUR' && sortConfig.direction === 'ascending' ? '🔽' : '🔼'}
          </button>
        </span>
      </th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '100px' }}>Expected Time</th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '60px' }}>Hours</th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '60px' }}>Minutes</th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '120px' }}>
        <span>Doctor Name
          <button onClick={() => requestSort('DOCTOR_ID')} style={{ border: 'none', background: 'transparent', padding: '0', marginLeft: '5px' }}>
            {sortConfig.key === 'DOCTOR_ID' && sortConfig.direction === 'ascending' ? '🔽' : '🔼'}
          </button>
        </span>
      </th>
      <th style={{ ...headerCellStyle, padding: '2px 4px', width: '60px' }}>Cancel</th>
    </tr>
  </thead>

  <tbody className="table-body">
    {sortedAppointments
      .filter(appointment => isCanceledChecked ? appointment.CANCELED === 'Y' : appointment.CANCELED === 'N')
      .map((appointment, index) => {
        // Determine row color based on the current status and canceled status
        const rowStyleToApply = appointment.CANCELED === 'Y'
          ? { ...rowStyle, backgroundColor: 'yellow' }
          : (appointment.STATUS === 'W' ? { ...rowStyle, backgroundColor: 'lightblue' }
          : (appointment.STATUS === 'P' ? { ...rowStyle, backgroundColor: 'lightgreen' }
          : (appointment.STATUS === 'D' ? { ...rowStyle, backgroundColor: 'lightgrey' }
          : (appointment.STATUS === 'R' ? { ...rowStyle, backgroundColor: '#b46b9a' }
          : rowStyle))));

        const handleStatusChange = (event, patId,visitId) => {
          const newStatus = event.target.value;
          
          // Create a copy of the appointments array and update the specific row
          const updatedAppointments = appointments.map(app => 
            app.PAT_ID === patId && app.VISIT_ID === visitId 
                ? { ...app, STATUS: newStatus } 
                : app
        );
          
          // Update the state with the new appointments
          setAppointments(updatedAppointments);
        
          // Send the update request to the backend
          API.post('/api/updateAppointmentStatus', {
              PAT_ID: patId,
              VISIT_ID:visitId,
              STATUS: newStatus
          })
          .then(() => {
              // Show alert on successful status update with PAT_ID
              // alert(`Status for PAT_ID ${patId} updated successfully`);
          })
          .catch(error => {
              // Show alert if there is an error, with PAT_ID
              console.error('Error updating status:', error);
              // alert(`Failed to update status for PAT_ID ${patId}`);
          });
        };
        
        const dropdownValue = appointment.STATUS === 'R' ? 'Scheduled' : appointment.STATUS || '';

        return (
          <tr key={index} style={rowStyleToApply}>
            <td style={{ ...cellStyle, padding: '2px 4px' }}>
              <button 
                onClick={() => handleBillClick(appointment.PAT_ID)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#007bff' }}
              >
                Bill
              </button>
            </td>
            <td style={{ ...cellStyle, padding: '2px 4px' }}>
              <button 
                onClick={() => handlePatientClick(appointment.PAT_ID)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#007bff' }}
              >
                <FontAwesomeIcon icon={faUser} style={{ fontSize: '16px' }} />
              </button>
            </td>
            <td style={{ ...cellStyle, padding: '2px 4px' }}>
              <select 
                value={dropdownValue} 
                onChange={(event) => handleStatusChange(event, appointment.PAT_ID,appointment.VISIT_ID)}  
                style={{ width: '100%', fontSize: '12px' }}
              >
                <option value="">Select Status</option>
                <option value="R">Scheduled</option>
                <option value="W">Walk-in</option>
                <option value="P">$PAY$</option>
                <option value="D">Done</option>
              </select>
            </td> {/* Status */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{appointment.QUEUE_NUMBER || ''}</td> {/* Queue# */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{appointment.PATIENT_FIRST_NAME || ''}</td> {/* Patient Name */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{formatDate(appointment.VISIT_DATE) || ''}</td> {/* Date */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{formatTime(appointment.VISIT_HOUR, appointment.VISIT_MINUTES)}</td> {/* Time */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{appointment.EXPECTED_TIME || ''}</td> {/* Expected Time */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{appointment.VISIT_HOUR || ''}</td> {/* Hours */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{appointment.VISIT_MINUTES || ''}</td> {/* Minutes */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>{appointment.DOCTOR_ID || ''}</td> {/* Doctor Name */}
            <td style={{ ...cellStyle, padding: '2px 4px' }}>
              <input
                type="checkbox"
                checked={appointment.CANCELED === 'Y'}
                onChange={() => handleCheckboxChange(appointment.PAT_ID,appointment.VISIT_ID)}
                style={{ margin: '0' }}
              />
            </td>
          </tr>
        );
      })}
  </tbody>
</table>

          
            {selectedAppointment && (
        <Popup appointment={selectedAppointment} onClose={handleClosePopup} />
      )}
      {showPopup && showSTRCodePopup && (
              <STRCodePopup 
                strCodes={strCodes} 
                onSelect={handleSTRCodeSelect} 
                onClose={() => setShowSTRCodePopup(false)} 
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const headerCellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  borderRight: '1px solid #ddd',
  fontWeight: 'bold',
};

const cellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  borderRight: '1px solid #ddd',
};

const rowStyle = {
  borderTop: '1px solid #ddd',
};

export default AppointmentTable;

