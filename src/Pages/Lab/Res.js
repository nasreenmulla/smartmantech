import React, { useState, useEffect } from 'react';
import axios from 'axios';

import API from '../../Api';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import Reportlab from './Reportlab';

const Reads = () => {
  const [patients, setPatients] = useState([]);
 
  const [searchTerm, setSearchTerm] = useState('');
  const [sr,setSr]=useState(false);
  const [exam,setExam]=useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasDetails, setHasDetails] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [testDetails, setTestDetails] = useState(null);
  const [firstDetails,setFirstDetails]=useState(null);
  const [it,setIt]=useState('');
  const [lab,setLab]=useState('');
  const [dis,setDis]=useState('');
  const [testResults, setTestResults] = useState([]);
  const [nextLabNo, setNextLabNo] = useState(null);
  function formatTime(hour, minute) {
    console.log('hour:', hour, 'minute:', minute); // Log the values

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

    useEffect(() => {
        const fetchNextLabNo = async () => {
            try {
                const response = await API.get('/api/get-next-lab-no');
                const data = response.data;
                setNextLabNo(data.nextLabNo);
            } catch (error) {
                console.error('Error fetching next LAB_NO:', error);
                // Optional: Handle the error if needed
            }
        };

        fetchNextLabNo();
    }, []);
    useEffect(() => {
      const fetchPatient = async () => {
          if (selectedPatient) {
            // alert(selectedPatient.visitId)
              try {
                  const response = await API.get(`/api/patient-DT/${selectedPatient.id}`, {
                      params: { visitId: selectedPatient.visitId }
                  });
                  const data = response.data;
  
                  // Check if data has meaningful details
                  if (data && Object.keys(data).length > 0) {
                 
                      setHasDetails(true);
                  } else {
                      setHasDetails(false);
                  }
              } catch (error) {
                  console.error('Error fetching patient details:', error);
                  setHasDetails(false); // Optionally set to false on error as well
              }
          }
      };
  
      fetchPatient();
  }, [selectedPatient]);
 
  const handleReport = () => {
    // Example logic for generating a report
    // You might fetch data, format it, or trigger a download

   

    setSr(true);
};
const handleC = () => {
 
  setSr(false);
};
  const handleUpdate = async (e) => {
    const username = localStorage.getItem('username'); 
    e.preventDefault(); // Prevent default form submission

    const updatedTestDetails = firstDetails.map((detail, index) => ({
        testId: detail.testId, // Use testId to identify the test
        testName: testNamesf[index],
        referenceRange: referenceRangesf[index],
        result: resultsf[index],
        comments: commentsf[index],
        labno:detail.labno
    }));

    try {
        console.log('Submitting update', updatedTestDetails,selectedPatient.id,selectedPatient.visitId);
        const response = await API.put('/api/update-test-details', {
            testDetails: updatedTestDetails,
            patientId: selectedPatient.id, // Use patientId from selectedPatient
            visitId: selectedPatient.visitId, // Include visitId from selectedPatient
            itemCode: it, 
            username// Assuming 'it' is defined elsewhere in your code
        });
        // Handle the response as needed
        alert('Test details updated successfully!');
    } catch (error) {
        console.error('Error updating test details:', error);
        alert('Error updating test details.');
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get necessary information
    const username = localStorage.getItem('username'); // Get username from local storage
    const patientId = selectedPatient.id; // Selected patient ID
    const visitId = selectedPatient.visitId; // Visit ID

    // Prepare data to send
    const dataToSend = {
        patientId,
        visitId,
        username,
        labNo: nextLabNo, // Include the fetched next LAB_NO
        testResults,
        itemCode:it,
        itemDescription:dis // Include test results collected
    };

    try {
        // Send data to the backend API
        console.log(dataToSend, 'submitting data');
        const response = await API.post('/api/submit-test-results', dataToSend);
        console.log('Response from server:', response.data);
        alert('Test results submitted successfully.');
    } catch (error) {
        console.error('Error submitting test results:', error);
        alert('Error submitting test results.');
    }
};

  
  const handleItemDescriptionClick = async (itemCode,itemDescription) => {
    alert(itemCode)
   
    setDis(itemDescription);
    setIt(itemCode);
    setTestResults([]);
    setTestDetails([]);
    const visitId = selectedPatient.visitId;
    const patientId = selectedPatient.id;
    let responsefinal;
    let responsefinal2;
    try {
      // First API call
      responsefinal = await API.get(`/api/test-detailsexam/${itemCode}`, { params: { visitId, patientId } });
      console.log('Response from first API:', responsefinal.data);
  } catch (error) {
      console.error('Error fetching first API:', error);
      responsefinal = null; // Set to null if the request fails
  }

  try {
      // Second API call
      responsefinal2 = await API.get(`/api/test-details/${itemCode}`);
      console.log('Response from second API:', responsefinal2.data);
  } catch (error) {
      console.error('Error fetching second API:', error);
      responsefinal2 = null; // Set to null if the request fails
  }

  // Assign testDetails based on the responses
  if (responsefinal && responsefinal.data && Object.keys(responsefinal.data).length > 0) {
      setFirstDetails(responsefinal.data);
      setHasDetails(true);
      console.log('Using first response:', responsefinal.data);
  } else if (responsefinal2 && responsefinal2.data && responsefinal2.data.length > 0) {
      setTestDetails(responsefinal2.data);
      setHasDetails(false);
      console.log('Using second response:', responsefinal2.data);
  } else {
      setTestDetails([]); // If neither response is valid
      console.log('No valid responses found, setting testDetails to empty.');
  }


    // try {
 
    //   const secondResponse = await API.get(`/api/test-details/${itemCode}`); // Adjust the endpoint as necessary
    //   console.log('Response from second API:', secondResponse.data);
     
    
    //   setTestDetails(secondResponse.data)
     
      
     
    //   if(secondResponse.data.result && Object.keys(secondResponse.data.result).length > 0){
    //     setHasDetails(true)
    //   } // Update the test details state
    // } catch (error) {
    //   console.error('Error fetching test details:', error);
    //   setTestDetails(null);
    //   // Reset the test details state in case of error
    // }
  };
  const [testNames, setTestNames] = useState([]);
  const [referenceRanges, setReferenceRanges] = useState([]);
  const [results, setResults] = useState([]);
  const [comments, setComments] = useState([]);
  const [testNamesf, setTestNamesf] = useState([]);
  const [referenceRangesf, setReferenceRangesf] = useState([]);
  const [resultsf, setResultsf] = useState([]);
  const [commentsf, setCommentsf] = useState([]);
  
  useEffect(() => {
      if (testDetails) {
          setTestNames(testDetails.map(detail => detail.testName || ''));
          setReferenceRanges(testDetails.map(detail => detail.referenceRange || ''));
          setResults(testDetails.map(detail => detail.result || ''));
          setComments(testDetails.map(detail => detail.comments || ''));
      }
  }, [testDetails]);
  useEffect(() => {
    if (firstDetails) {
        console.log('Updating derived states from firstDetails:', firstDetails);
        setTestNamesf(firstDetails.map(detail => detail.testName || ''));
        setReferenceRangesf(firstDetails.map(detail => detail.referenceRange || ''));
        setResultsf(firstDetails.map(detail => detail.result || ''));
        setCommentsf(firstDetails.map(detail => detail.comments || ''));
    }
}, [firstDetails]);
  const handleTestNameChangef = (index, value) => {
    setFirstDetails(prevDetails => {
        const newDetails = [...prevDetails];

        if (!newDetails[index]) {
            newDetails[index] = {
              
                testHeader: firstDetails[index][0], // You may want to define a default value
                testId: firstDetails[index][1],
                testName: value,
                referenceRange:  referenceRangesf[index],
                result: resultsf[index],
                comments: commentsf[index] || '',
            };
        } else {
            newDetails[index].testName = value;
        }

        return newDetails;
    });
};

const handleReferenceRangeChangef = (index, value) => {
    setFirstDetails(prevDetails => {
        const newDetails = [...prevDetails];

        if (!newDetails[index]) {
            newDetails[index] = {
                testHeader:  firstDetails[index][0],
                testId: firstDetails[index][1],
                testName: testNamesf[index],
                referenceRange: value,
                result: resultsf[index],
                comments: commentsf[index] || '',
            };
        } else {
            newDetails[index].referenceRange = value;
        }

        return newDetails;
    });
};

const handleResultChangef = (index, value) => {
    setFirstDetails(prevDetails => {
        const newDetails = [...prevDetails];

        if (!newDetails[index]) {
            newDetails[index] = {
                testHeader: firstDetails[index][0],
                testId: firstDetails[index][1],
                testName:  testNamesf[index],
                referenceRange: referenceRangesf[index],
                result: value,
                comments: commentsf[index] || '',
            };
        } else {
            newDetails[index].result = value;
        }

        return newDetails;
    });
};

const handleCommentChangef = (index, value) => {
    setFirstDetails(prevDetails => {
        const newDetails = [...prevDetails];

        if (!newDetails[index]) {
            newDetails[index] = {
                testHeader: firstDetails[index][0],
                testId: firstDetails[index][1],
                testName: testNamesf[index],
                referenceRange: referenceRangesf[index],
                result: resultsf[index],
                comments: value,
            };
        } else {
            newDetails[index].comments = value;
        }

        return newDetails;
    });
};

  const handleTestNameChange = (index, value) => {
    
    setTestResults(prevTestResults => {
        const newTestResults = [...prevTestResults];

        // Initialize if it doesn't exist
        if (!newTestResults[index]) {
            newTestResults[index] = {
              testHeader: testDetails[index]?.testHeader || '',
                testId: testDetails[index]?.testId || '',
                testName: value, // Set new test name directly
                referenceRange: referenceRanges[index],
                resultValue: results[index],
                comment: comments[index] || '',
            };
        } else {
            // Update the testName
            newTestResults[index].testName = value;
        }

        return newTestResults;
    });

    // Update testNames state
    const newTestNames = [...testNames];
    newTestNames[index] = value;
    setTestNames(newTestNames);
};

const handleReferenceRangeChange = (index, value) => {
    setTestResults(prevTestResults => {
        const newTestResults = [...prevTestResults];

        if (!newTestResults[index]) {
            newTestResults[index] = {
              testHeader: testDetails[index]?.testHeader || '',
                testId: testDetails[index]?.testId|| '',
                testName: testNames[index],
                referenceRange: value, // Set new reference range
                resultValue: results[index],
                comment: comments[index] || '',
            };
        } else {
            newTestResults[index].referenceRange = value;
        }

        return newTestResults;
    });

    const newReferenceRanges = [...referenceRanges];
    newReferenceRanges[index] = value;
    setReferenceRanges(newReferenceRanges);
};
const handleResultChange = (index, value) => {
  setTestResults(prevTestResults => {
      const newTestResults = [...prevTestResults];

      // If no entry exists for the index, create one
      if (!newTestResults[index]) {
          newTestResults[index] = {
            testHeader: testDetails[index]?.testHeader || '',
              testId: testDetails[index]?.testId|| '',
              testName: testNames[index],
              referenceRange: referenceRanges[index],
              resultValue: value, // Set the initial result value
              comment: comments[index] || '',
          };
      } else {
          // Update the existing result value
          newTestResults[index].resultValue = value;
      }

      return newTestResults;
  });

  // Update results state
  setResults(prevResults => {
      const newResults = [...prevResults];
      newResults[index] = value; // Update the result value
      return newResults;
  });
};





const handleCommentChange = (index, value) => {
    setTestResults(prevTestResults => {
        const newTestResults = [...prevTestResults];

        if (!newTestResults[index]) {
            newTestResults[index] = {
              testHeader: testDetails[index]?.testHeader || '',
                testId: testDetails[index]?.testId || '',
                testName: testNames[index],
                referenceRange: referenceRanges[index],
                resultValue: results[index],
                comment: value, // Set new comment
            };
        } else {
            newTestResults[index].comment = value;
        }

        return newTestResults;
    });

    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
};


  // const handleTestNameChange = (index, value) => {
  //     const newTestNames = [...testNames];
  //     newTestNames[index] = value;
  //     setTestNames(newTestNames);
  //     setTestResults(index, { testName: value });
  // };

  // const handleReferenceRangeChange = (index, value) => {
  //     const newReferenceRanges = [...referenceRanges];
  //     newReferenceRanges[index] = value;
  //     setReferenceRanges(newReferenceRanges);
      
  // };

  // const handleResultChange = (index, value) => {
  //     const newResults = [...results];
  //     newResults[index] = value;
  //     setResults(newResults);
  // };

  // const handleCommentChange = (index, value) => {
  //     const newComments = [...comments];
  //     newComments[index] = value;
  //     setComments(newComments);
  // };
  const handleDateChange = (event) => {
    const newDate = event.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchPatients = async () => {
        setLoading(true); // Set loading state before fetching data
        try {
            // Format the selected date to YYYY-MM-DD
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await API.get(`/api/patientslab`, {
                params: { date: formattedDate },
            });

            // Create a unique list of patients based on their IDs
            const uniquePatients = response.data.reduce((acc, patient) => {
                const trimmedId = patient.id.trim(); // Trim the ID
                const existing = acc.find(p => p.id.trim() === trimmedId); // Compare trimmed IDs
                if (!existing) {
                    acc.push({ ...patient, id: trimmedId }); // Push with trimmed ID
                }
                return acc;
            }, []);

            // Update the patients state with unique patients
            setPatients(uniquePatients); // Ensure you set unique patients
            console.log(uniquePatients, 'received in PATIENTVISITlabw'); // Properly log the response
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false); // Set loading state to false after fetching data
        }
    };

    if (selectedDate) { // Check if selectedDate is valid
        fetchPatients();
    }
}, [selectedDate]);


useEffect(() => {
  const fetchPatientLab = async () => {
    if (selectedPatient) {
      const patientId = selectedPatient.id.trim(); // Trim any extra spaces
     // URL-encode the patient ID

      try {
        //from lab request selected patinet discription and sample 
        const response = await API.get(`/api/patient-lab/${selectedPatient.id}?date=${selectedDate}`);
        
        // Assuming your API response returns an object directly
        const data = response.data;
        setExam(data);

        // Log the fetched patient lab details
        console.log('Details from lab requestrequest tableexannnnnnnnnnnnnnnnnnnnnnm :', data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    }
  };

  fetchPatientLab();
}, [selectedPatient,selectedDate]);


const [checkboxStates, setCheckboxStates] = useState({});

    useEffect(() => {
        // Initialize checkbox states from the database response
        const initialStates = exam.reduce((acc, request) => {
            acc[request.itemCode] = request.sample === 'Y'; // 'Y' means checked
            return acc;
        }, {});
        setCheckboxStates(initialStates);
    }, [exam]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (selectedPatient) {
        try {
          const response = await API.get(`/api/patient-details/${selectedPatient.id}`);
          const data = response.data;
  console.log(data)
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
    console.log(patient,'patinet details in master table of laboratory')
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
    patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleCheckboxChange = async (itemCode) => {
    const currentSampleStatus = checkboxStates[itemCode]; // Get current state
    const newSampleStatus = !currentSampleStatus; // Toggle the current state

    // Update local state immediately for UI feedback
    setCheckboxStates((prev) => ({
        ...prev,
        [itemCode]: newSampleStatus,
    }));

    try {
        // Update the API with the new sample status
        await API.put('/api/update-collected', {
            itemCode,
            patientId: selectedPatient.id,
            date: selectedDate,
            sample: newSampleStatus ? 'Y' : 'N',
        });
        alert('Status updated successfully.');
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status. Please try again.');

        // Revert the checkbox state if the API call fails
        setCheckboxStates((prev) => ({
            ...prev,
            [itemCode]: currentSampleStatus, // Restore previous state
        }));
    }
};


//   const handleCheckboxChange = async (itemCode, newSampleStatus) => {
//     alert(newSampleStatus)
//     try {
//         await API.put('/api/update-collected', {
//             itemCode: itemCode,
//             patientId: selectedPatient.id, // Ensure this is the correct patient ID
//             date: selectedDate, // Make sure this is the selected date
//             sample: newSampleStatus // Send the updated status ('Y' or 'N')
//         });
//         alert('Collected status updated successfully.');
//     } catch (error) {
//         console.error('Error updating collected status:', error);
//         alert('Error updating collected status.');
//     }
// };


  

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
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#d0d0d0',
  padding: '10px', // Light grey color
 // Optional: add some padding for better spacing
  borderRadius: '5px'
  }}>
  <div style={{ flex: '1', marginRight: '10px' }}>
    <p style={{ margin: 0 }}>
        <strong>Time:</strong> 
        {selectedPatient 
            ? formatTime(selectedPatient.visitHour || 0, selectedPatient.visitMinute || 0) // Default to 0 if undefined
            : 'N/A'}
    </p>
</div>

    <div style={{ flex: '1', marginRight: '10px' }}>
      <p style={{ margin: 0 }}><strong>Date:</strong> {selectedPatient ? selectedPatient.visitDate : 'N/A'}</p>
    </div>
    <div style={{ flex: '1' }}>
      <p style={{ margin: 0 }}><strong>Doctor:</strong> {selectedPatient ? selectedPatient.doctorId : 'N/A'}</p>
    </div>
  </div>
      <div className='form-container'>
      <h2 style={{
        backgroundColor: '#d3d3d3',
        width: '100%',
        display: 'inline-block',
      }}>
        Laboratory Test
      </h2>
      <form onSubmit={handleSubmit}>
        <h3 style={{
    backgroundColor: '#d3d3d3', // Grey background
    border: '1px solid #ccc', // Light border
    textAlign: 'center', // Centered text
    padding: '5px', // Padding for some space
    borderRadius: '2px', // Rounded corners (optional)
    margin: '10px 0', // Margin above and below the heading
  }}>Required Lab Examination</h3>
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
    <thead>
      <tr>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Collected</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Requested By</th>
        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created By</th>
      </tr>
    </thead>

    <tbody>
        {exam.length > 0 ? (
            exam.map((request) => {
                const isChecked = checkboxStates[request.itemCode]; // Use checkbox state

                return (
                    <tr key={request.itemCode}>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                            <input
                                type="checkbox"
                                checked={isChecked} // Reflects current state
                                onChange={() => handleCheckboxChange(request.itemCode)} // Toggle state on change
                            />
                        </td>
                        <td
                            style={{ border: '1px solid #ddd', padding: '8px', cursor: 'pointer', color: 'blue' }}
                            onClick={() => handleItemDescriptionClick(request.itemCode, request.itemDescription)}
                        >
                            {request.itemDescription}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.requestedBy}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{request.createdBy}</td>
                    </tr>
                );
            })
        ) : (
            <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '8px' }}>No exams available</td>
            </tr>
        )}
    </tbody>


  </table>
<h3 style={{
    backgroundColor: '#d3d3d3',
    border: '1px solid #ccc',
    textAlign: 'center',
    padding: '5px',
    borderRadius: '5px',
    margin: '10px 0',
  }}>Result</h3>
        {firstDetails && Object.keys(firstDetails).length > 0 ? (
            <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Response Test Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Response Reference Range</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Response Result</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Response Comments</th>
                    </tr>
                </thead>
                <tbody>
    {firstDetails.map((detail, index) => (
        <tr key={index}>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                    type="text"
                    value={testNamesf[index] || ''}
                    onChange={(e) => handleTestNameChangef(index, e.target.value)}
                    placeholder="Enter Test Name"
                    style={{ width: '100%' }}
                />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                    type="text"
                    value={referenceRangesf[index] || ''}
                    onChange={(e) => handleReferenceRangeChangef(index, e.target.value)}
                    placeholder="Enter Reference Range"
                    style={{ width: '100%' }}
                />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                    type="text"
                    value={resultsf[index] || ''}
                    onChange={(e) => handleResultChangef(index, e.target.value)}
                    placeholder="Enter Result"
                    style={{ width: '100%' }}
                />
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <input
                    type="text"
                    value={commentsf[index] || ''}
                    onChange={(e) => handleCommentChangef(index, e.target.value)}
                    placeholder="Enter Comments"
                    style={{ width: '100%' }}
                />
            </td>
        </tr>
    ))}
</tbody>

            </table>
        ) : null}

        {testDetails && testDetails.length > 0 ? (
            <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Test Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reference Range</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Result</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {testDetails.map((detail, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={testNames[index] || ''}
                                    onChange={(e) => handleTestNameChange(index, e.target.value)}
                                    placeholder="Enter Test Name"
                                    style={{ width: '100%' }}
                                />
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={referenceRanges[index] || ''}
                                    onChange={(e) => handleReferenceRangeChange(index, e.target.value)}
                                    placeholder="Enter Reference Range"
                                    style={{ width: '100%' }}
                                />
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={results[index] || ''}
                                    onChange={(e) => handleResultChange(index, e.target.value)}
                                    placeholder="Enter Result"
                                    style={{ width: '100%' }}
                                />
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <input
                                    type="text"
                                    value={comments[index] || ''}
                                    onChange={(e) => handleCommentChange(index, e.target.value)}
                                    placeholder="Enter Comments"
                                    style={{ width: '100%' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : null
         
        }
{ hasDetails ? (
    <>
        <button type='button' style={{ marginTop: '20px', padding: '10px 20px' }} onClick={handleUpdate}>
            Update
        </button>
        <button type='button' style={{ marginTop: '20px', padding: '10px 20px' }}  onClick={handleReport} >
            Report
        </button>
    </>
) : (
    <button type='submit' style={{ marginTop: '20px', padding: '10px 20px' }} onClick={handleSubmit}>
        Save
    </button>
)}


  


</form>
{ sr  && <Reportlab  id={selectedPatient.id} visitId={selectedPatient.visitId} doctor={selectedPatient.doctorId}
      onClose={handleC} />}

    </div>

    </main>
  );
  
  
};

export default Reads;