import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './Reads.css'
import API from '../../Api';
import './visit.css'
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

const Reads = () => {

 
  
  const[showchief,setShowchief]=useState(false);
  const[showpresent,setShowPresent]=useState(false);
  const[showallergies,setShowallergies]=useState(false);
  const[showfamily,setShowfamily]=useState(false);
  const[showdental,setShowdental]=useState(false);
  const[showprovisional,setShowprovisional]=useState(false);
  const[showmanagment,setShowmanagment]=useState(false);
  const[showprocedure,setShowprocedure]=useState(false);
  const[showfollow,setShowfollow]=useState(false);
  const[showfollowuphistory,setShowfollowuphistory]=useState(false);
  const[showprescriptionhistory,setShowprescriptionhistory]=useState(false);
  const[showpresentillness,setShowpresentillnes]=useState(false);
  const[showpresentmedication,setShowpresentmedication]=useState(false);
  const[showsurgery,setShowsurgery]=useState(false);
  const[showalergtomedi,setShowallergtomedi]=useState(false);
  const[showimmunization,setShowimmunization]=useState(false);
 const[showabout,setShowabout]=useState(false);
 const[showchild,setShowchild]=useState(false);
 const [search,setSearch]=useState('');
 const[show,setShow]=useState(false);
 const handleSearchChangep = (event) => {
  // alert(event.target.value)
  setSearch(event.target.value.toLowerCase()); // Store the search term in lowercase
  // setShow(true);
};


 const toggleallergtomedi = () => {
  setShowallergtomedi(!showalergtomedi);
};
const toggleimmunization = () => {
  setShowimmunization(!showimmunization);
};
const toggleabout = () => {
  setShowabout(!showabout);
};
const togglechild = () => {
  setShowchild(!showchild);
};
  const togglepresentillness = () => {
    setShowpresentillnes(!showpresentillness);
};
const togglemedication = () => {
  setShowpresentmedication(!showpresentmedication);
};
const togglesurgey = () => {
  setShowsurgery(!showsurgery);
};
  const toggleChief = () => {
    setShowchief(!showchief);
};
const togglePresent = () => {
  setShowPresent(!showpresent);
};
const toggleAllergies = () => {
  setShowallergies(!showallergies);
};
const toggleFamily = () => {
  setShowfamily(!showfamily);
};
const toggleDental = () => {
  setShowdental(!showdental);
};
const toggleProvisional = () => {
  setShowprovisional(!showprovisional);
};  const toggleManagment = () => {
  setShowmanagment(!showmanagment);
};
const toggleProcedure = () => {
  setShowprocedure(!showprocedure);
};
const togglefollow = () => {
  setShowfollow(!showfollow);
};
const togglefollowuphistory = () => {
  setShowfollowuphistory(!showfollowuphistory);
};
const togglePrescriptionhistory = () => {
  setShowprescriptionhistory(!showprescriptionhistory);
};
  const [procedureData, setProcedureData] = useState({
    selectedProcedures: [],
  });
  const [maxSerialQuote, setMaxSerialQuote] = useState(null);


  const [availableProcedures, setAvailableProcedures] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Unique name for dropdown visibility
  const [selectedForAdd, setSelectedForAdd] = useState([]); // Store selected procedures for adding

  const [proced,setProced]=useState('') ;
  const [details, setDetails] = useState([]); // State to hold details based on THSEQ

    const fetchDetailsByThseq = async (thseq) => {
        try {
            const response = await API.get(`/api/details`, { params: { thseq } });
            console.log('RESPOSNE FROM API by th seq',response)
            setDetails(response.data); // Assuming the response contains the details
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };// Search query state

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await API.get('/api/medip');
        // console.log('prescription from items category disrubution',response.data) // Adjust the API endpoint
        setAvailableProcedures(response.data);
        setFilteredProcedures(response.data); // Set all procedures initially
      } catch (error) {
        console.error('Error fetching procedures:', error);
      }
    };

    fetchProcedures();
  }, []);
  useEffect(() => {
    const fetchMaxSerialQuote = async () => {
      const comNo = localStorage.getItem('COM_NO');


        if (!comNo) {
            console.error('com_no not found in local storage');
            return;
        }

        try {
          // console.log('sending',comNo)
          const response = await API.get('/api/max-serial-quote', {
            params: { comNo } // Correctly send com_no as a query parameter
        });
            setMaxSerialQuote(response.data.MAXQ); // Store the max serial quote in state
            console.log('Max Serial Quote:', response.data.MAXQ);
        } catch (error) {
            console.error('Error fetching max serial quote:', error);
        }
    };

    fetchMaxSerialQuote();
}, []);


  const toggleProcedureSelection = (procedure) => {
    setSelectedForAdd((prevSelected) => {
      if (prevSelected.includes(procedure)) {
        return prevSelected.filter(item => item !== procedure);
      } else {
        return [...prevSelected, procedure];
      }
    });
  };

  const addSelectedProcedures = () => {
    setProcedureData((prev) => ({
      ...prev,
      selectedProcedures: [
        ...prev.selectedProcedures,
        ...selectedForAdd.map(proc => ({ ...proc, qty: 1, comments: '' }))
      ],
    }));
    setSelectedForAdd([]); // Clear selections after adding
    setIsDropdownOpen(false); // Hide dropdown after selection
  };


  
  
  
  

  const [appointmentDetails, setAppointmentDetails] = useState(null);
   const [icd10Descriptors, setICD10Descriptors] = useState([]);
    const [icd10Codes, setICD10Codes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(Array(5).fill(false));
    const [activeRow, setActiveRow] = useState(null);
    const [followupHistory, setFollowupHistory] = useState([]); 
    const [presh,setPresh]=useState([]);
    const [complaintH, setComplaintH] = useState('');
    const [investigationResultsH, setInvestigationResultsH] = useState('');
    const [diagnosisH, setDiagnosisH] = useState('');
    const [managementPlanH, setManagementPlanH] = useState('');
    const [followupPlanH, setFollowupPlanH] = useState('');
    const [mediP, setMediP] = useState('');
    const [doseP, setDoseP] = useState('');
    const [dayP, setDayP] = useState('');
    const [periodP, setPriodP] = useState('');
    const [notesP, setNotesP] = useState('');
    const [historyPrescriptions, setHistoryPrescriptions] = useState([]);
// State to track the active row
 
  const [specialty, setSpecialty] = useState(null);
  useEffect(() => {
    const fetchSpecialty = async () => {
      try {
        const username = localStorage.getItem('username');
        if (username) {
        
          const response = await API.get(`/api/getSpecialty?username=${username}`);
          // console.log(response.data.specialty,'SPECIALITY')
          const data = response.data;
          //for any
          if (data.specialty && data.specialty.toLowerCase().includes('dental')) {
            // alert('Dental specialty detected!');
            setSpecialty(data.specialty);
          }
        }
      } catch (error) {
        console.error('Error fetching specialty:', error);
        // Optional: Handle the error as needed
      }
    };

    fetchSpecialty();
  }, []);


    
  const [patients, setPatients] = useState([]);
  const [maxHstId, setMaxHstId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasDetails, setHasDetails] = useState(false);
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (selectedPatient) {
        try {
          const response = await API.get(`/api/patient-detailsv/${selectedPatient.id}?visitId=${selectedPatient.visitId}`);
          console.log(response,'CARRIES')
          const data = response.data;
        // console.log('disgnosis prescription FOLLOWUPfggggggggggggggggggggeee',data)
          if (data) {
            // Extract data from response
            const history1 = data.history[0] || {};
            const history2 = data.history[1] || {};
            const history3= data.history[2] || {};
            const history4 = data.history[3] || {};
            const history5 = data.history[4] || {};
            const history6 = data.history[5] || {};
            const history7 = data.history[6] || {};
            const history8 = data.history[7] || {};
            
            const dental = data.dental[0] || {};
            const dentalCries = data.dentalCries[0] || {};
            const followupd=data.followUp[0] || {};
            const diagno1=data.diagnosis[0] || {};
            const diagno2=data.diagnosis[1] || {};
            const diagno3=data.diagnosis[2] || {};
            const diagno4=data.diagnosis[3] || {};

            const thera1=data.therapeutic[0] || {};
            const thera2=data.therapeutic[1] || {};
            const thera3=data.therapeutic[2] || {};
            const thera4=data.therapeutic[3] || {};
            const managementPlan = data.managementPlan[0] || {};



            // const prescriptions = data.prescriptions || [];
            // const formattedPrescriptions = prescriptions.map(prescription => ({
            //     medicineBrand: prescription.ITEM_NAME || '',
            //     dose: prescription.DOSAGE_QUANTITY || '',
            //     repeat: prescription.REPEATED_IN_DAYS || '',
            //     noDays: prescription.DAYS_PERIOD || '',
            //     prescriptionNote: prescription.PRESCRIPTION_NOTES || ''
            // }));
  
            // Map data to form fields
            setFormData({
              icdName1: managementPlan.FINAL_DIAG1_NAME,
              code1: managementPlan.FINAL_DIAG1_CODE,
              note1: managementPlan.FINAL_DIAG1_COMMENTS,
              icdName2:  managementPlan.FINAL_DIAG2_NAME,
              code2:  managementPlan.FINAL_DIAG2_CODE,
              note2:  managementPlan.FINAL_DIAG2_COMMENTS,
              icdName3:  managementPlan.FINAL_DIAG3_NAME,
              code3:  managementPlan.FINAL_DIAG3_CODE,
              note3:  managementPlan.FINAL_DIAG3_COMMENTS,
              clinicData: managementPlan.
              CLINICAL_DATA
              ,
              actionPlan: managementPlan.
              MANAGEMENT_PLAN
              ,
              followUpPlan: managementPlan.
              FOLLOW_UP
              ,
              followupComplaint:followupd.COMPLAINT,
              followupInvestigationResults: followupd.INVESTIGATION_RESULTS,
              
              followupDiagnosis: followupd.DIAGNOSIS,
              
              followupManagement: followupd.MANAGEMENT_PLAN
              ,
              followfollowupPlan: followupd.FOLLOW_UP,
              diagnosticNotes1 :diagno1.DESCREPTION || '',
              diagnosticNotes2 :diagno2.DESCREPTION || '',
              diagnosticNotes3 :diagno3.DESCREPTION || '',
              diagnosticNotes4 :diagno4.DESCREPTION || '',
              diagnosisNoteCheckbox1: diagno1.STATUS === 'Y' ? 'Y' : 'N',
              diagnosisNoteCheckbox2: diagno2.STATUS === 'Y' ? 'Y' : 'N',
              diagnosisNoteCheckbox3: diagno3.STATUS === 'Y' ? 'Y' : 'N',
              diagnosisNoteCheckbox4: diagno4.STATUS === 'Y' ? 'Y' : 'N',
              therapeuticNotes1: thera1.DESCREPTION ||'',
              therapeuticNoteCheckbox1:  thera1.STATUS === 'Y' ? 'Y' : 'N',
              therapeuticNotes2: thera2.DESCREPTION ||'',
              therapeuticNoteCheckbox2: thera2.STATUS === 'Y' ? 'Y' : 'N',
              therapeuticNotes3:thera3.DESCREPTION ||'',
              therapeuticNoteCheckbox3:thera3.STATUS === 'Y' ? 'Y' : 'N',
              therapeuticNotes4:thera4.DESCREPTION ||'',
              therapeuticNoteCheckbox4: thera4.STATUS === 'Y' ? 'Y' : 'N',






              chiefComplaints: history1.DESCREPTION || '',
              historyPresentIllness:  history2.DESCREPTION || '',
              presentMedication: history3.DESCREPTION || '',
              pastSurgicalHistory:  history4.DESCREPTION || '' ,
              allergiesToMedicationsFoodLatexOther: history5.DESCREPTION || '',
              historyVaccinesImmunizations:  history6.DESCREPTION || '',
              healthInfoFamily:  history7.DESCREPTION || '',
              childhoodDiseases: history8.DESCREPTION || '' ,
  
              // Handling dental data
              pregnant: dental.PREGNANT || 'N',
              lactating: dental.LACTATING || 'N',
              previousSurgeries: dental.PREV_SURGERIES || 'N',
              bloodDisorders: dental.BLOOD_DISORDERS || 'N',
              cardiacProblem: dental.CARDIAC_PROBLEMS || 'N',
              respiratoryProblems: dental.RESPIRATORY || 'N',
              endocrineProblem: dental.ENDOCINE || 'N',
              pregnancyTrimester: dental.TRIMESTER || '2', // Default value if not present
  
              // Past Dental History
              prevExtraction: dental.PREV_EXTRACTION || 'N',
              prevRestoration: dental.PREV_RESTORATION || 'N',
              prevOrtho: dental.PREV_ORTHO || 'N',
  
              // Oral Prosthetic
              prostheticType: dental.ORAC_PROSTHETIC_TYPE || 'N',
              prostheticDuration: dental.ORAC_PROSTHETIC_DURATION || 'N',
              prostheticClinic: dental.ORAC_PROSTHETIC_NOTES || 'N',
              clinicExamination: dental.CLINIC_EXAMINATION || 'Examination1',
              oralHygiene: dental.ORAL_HYGINE || 'Good',
  
             // Additional Checkboxes
          ...Object.fromEntries(
            Array.from({ length: 36 }, (_, i) => [`checkbox${i + 1}`, dentalCries[`C${i + 1}`] || 'N'])
          ),
          ...Object.fromEntries(
            Array.from({ length: 11 }, (_, i) => [`checkbox${String.fromCharCode(65 + i)}`, dentalCries[`C${String.fromCharCode(65 + i)}`] || 'N'])
          ),
  
              // Hard Tissue Findings
              numberOfTeeth: dental.NUMBER_TEETH || '',
              missingTeeth: dental.MISSING_TEETH || '',
              fracturedTeeth: dental.FRACTURED_TEETH || '',
              filledTeeth: dental.FILLED_TEETH || '',
              discoloredTeeth: dental.DISCOLORED_TEETH || '',
              mobility: dental.MOBILITY || '',
              crowding: dental.CROW_SPACE || '',
  
              // Soft Tissue Findings
              sinusOpening: dental.SINUS_OPENING || '',
              swelling: dental.SWEELING || '',
              pulpVitality: dental.PULP_VITALITY || '',
              prognosis: dental.PROGNOSIS || '',
              treatmentPlan: dental.TREATMENT_PLAN || '',
              radiologicalExamination: dental.RADIO_EXAM || '',
              finalDiagnosis: dental.FINAL_DIAGNOSIS || '',
              instruction: dental.INSTRUCTIONS || '',
              followupPlan: dental.FOLLOW_UP || '',
              referral: dental.REFERAL || '',
              patientCooperative: dental.COOPERATIVE || 'N',
              prevExtractionClinic: dental.PREV_EXTRACTION_NOTES || '',
              prevRestorationClinic: dental.PREV_RESTORATION_NOTES || '',
              prevOrthoClinic: dental.PREV_ORTHO_NOTES || '',
              previousSurgeriesNote: dental.SURGERIES_NOTES || '',
              bloodDisordersNote: dental.BLOOD_DISORDERS_NOTES || '',
              cardiacProblemNote: dental.CARDIAC_PROBLEMS_NOTES || '',
              respiratoryProblemsNote: dental.RESPIRATORY_NOTES || '',
              endocrineProblemNote: dental.ENDOCINE_NOTE || '',
              // prescriptions: formattedPrescriptions
            });
            
            setHasDetails(true); // Set to true when data is successfully fetched and exists
          } else {
            setHasDetails(false);
          }
        } catch (error) {
          console.error('Error fetching patient details:', error);
          setHasDetails(false); // Set to false if there's an error fetching data
        }
      }
    };
    
    fetchPatientDetails();
  }, [selectedPatient]);
  

  const handlePayRequest = async () => {

    // Retrieve values from local storage
    const comNo = localStorage.getItem('COM_NO');
    const username = localStorage.getItem('username'); // Get the username from local storage
  
    // Assuming selectedPatient is an object with id and name properties
    const patientId = selectedPatient ? selectedPatient.id : null;
    const patientName = selectedPatient ? selectedPatient.name : null;
    const patientvisitId = selectedPatient ? selectedPatient.visitId : null;
  
    try {
      // console.log('proceduressending',procedureData.selectedProcedures)
      const response = await API.post('/api/pay-request', {
        selectedProcedures: procedureData.selectedProcedures,
        maxSerialQuote: maxSerialQuote,
        comNo: comNo,
        username: username, // Include created by (username) here
        patientId: patientId, // Include selected patient ID
        patientName: patientName,
        patientvisitId:patientvisitId // Include selected patient name
      });
   
      //new addition
      alert('Requested To Pay')
      setProcedureData(prev => ({
        ...prev,
        selectedProcedures: []
    }));
      // Handle successful response (e.g., show a success message)
      
    } catch (error) {
      console.error('Error sending pay request:', error);
      // Handle error (e.g., show an error message)
    }
  };
  

  useEffect(() => {
    const fetchMaxHstId = async () => {
        try {
            const response = await API.get('/api/max-hst-id');
            const data = response.data;
            // console.log(data.maxHstId,'maxhid')
            setMaxHstId(data.maxHstId);
        } catch (error) {
            console.error('Error fetching maximum HST_ID:', error);
            // Optional: You might want to handle the error here if needed
        }
    };

    fetchMaxHstId();
}, []); // Empty dependency array means this useEffect runs once on component mount

  // Function to handle date change
  const handleDateChange = (event) => {
    const newDate = event.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const fetchPatientsPres = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
            const username = localStorage.getItem('username'); // Get username from localStorage

            // Ensure username and selectedPatient are available
            if (!username) {
                console.error('Username not found in localStorage');
                setLoading(false);
                return;
            }

            if (!selectedPatient || !selectedPatient.id) {
                console.error('Selected patient ID is required');
                setLoading(false);
                return;
            }

            // Make API call with date, username, and selectedPatient.id as parameters
            const response = await API.get('/api/patientspres', {
                params: {
                    date: formattedDate,
                    username: username, // Add username as a parameter
                    patientId: selectedPatient.id // Add selectedPatient.id as a parameter
                }
            });

            // console.log(response.data, 'HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
            setPresh(response.data);
            // console.log(response.data, 'received in PATIENTVISIT');
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchPatientsPres();
}, [selectedDate, selectedPatient]); // Include selectedPatient in dependencies

  useEffect(() => {
    const fetchPatientsfollow = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        const username = localStorage.getItem('username'); // Get username from localStorage
  
        // Ensure username is available
        if (!username) {
          console.error('Username not found in localStorage');
          setLoading(false);
          return;
        }
  
        // Ensure selectedPatient is available
        if (!selectedPatient || !selectedPatient.id) {
          console.error('Selected patient ID is not available');
          setLoading(false);
          return;
        }
  
        // Make API call with date, username, and selectedPatient.id as parameters
        const response = await API.get('/api/patientsfollow', {
          params: {
            date: formattedDate,
            username: username,
            patientId: selectedPatient.id // Add patient ID here
          }
        });
  
        // console.log(response.data, 'followup');
        setFollowupHistory(response.data);
        // console.log(response.data, 'received in PATIENTVISIT');
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatientsfollow();
  }, [selectedDate, selectedPatient]);

   // Include selectedPatient in the dependency array
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        const username = localStorage.getItem('username'); // Get username from localStorage
  
        // Ensure username is available
        if (!username) {
          console.error('Username not found in localStorage');
          setLoading(false);
          return;
        }
  
        // Make API call with date and username as parameters
        const response = await API.get('/api/patients', {
          params: {
            date: formattedDate,
            username: username, // Add username as a parameter
          }
        });
  
        setPatients(response.data);
        // console.log(response.data, 'received in PATIENTVISIT');
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatients();
  }, [selectedDate]);
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        const username = localStorage.getItem('username'); // Get username from localStorage
  
        // Ensure username is available
        if (!username) {
          console.error('Username not found in localStorage');
          setLoading(false);
          return;
        }
  
        // Make API call with date and username as parameters
        const response = await API.get('/api/patients', {
          params: {
            date: formattedDate,
            username: username, // Add username as a parameter
          }
        });
  
        setPatients(response.data);
        // console.log(response.data, 'received in PATIENTVISIT');
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatients();
  }, [selectedDate]);
  // Add selectedDate to the dependency array
  

  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const fetchAppointmentDetails = async () => {
    if (selectedPatient && selectedPatient.visitId && selectedPatient.visitDate) {
      try {
        const response = await API.get(`/api/CLNC-pat-VISIT`, {
          params: {
            patId: selectedPatient.id,
            visitId: selectedPatient.visitId,
            visitDate: selectedPatient.visitDate
          }
        });
        setAppointmentDetails(response.data);
        // console.log(response.data,'by appointment of patientvusist')

      } catch (error) {
        console.error('Error fetching appointment details:', error);
      }
    }
  };
  useEffect(() => {
    fetchAppointmentDetails();
  }, [selectedPatient]);
  const handleVisitClick = async (visitId) => {
    // console.log('Visit ID clicked:', visitId);
    
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format selectedDate to YYYY-MM-DD

    try {
        const response = await API.get(`/api/visit/${visitId}`, {
            params: { selectedDate: formattedDate }
        });
        const visitDetails = response.data;
        // console.log('GOT FROM HISTORY FOLLOWUP',visitDetails)
        // Update the state with the values from the API response
        setComplaintH(visitDetails.complaint);
        setInvestigationResultsH(visitDetails.investigationResults);
        setDiagnosisH(visitDetails.diagnosis);
        setManagementPlanH(visitDetails.managementPlan);
        setFollowupPlanH(visitDetails.followupPlan);

        // Optionally, log the visit details
        // console.log('Visit Details:', visitDetails);
    } catch (error) {
        console.error('Error fetching visit details:', error);
        // Handle the error (e.g., show a notification)
    }
};


const fetchPatientProcedureHistory = async () => {
  // Ensure selectedPatient is available
  if (!selectedPatient || !selectedPatient.id || !selectedPatient.visitId) {
      console.error('Selected patient ID and visit ID are required');
      return;
  }

  try {
      const response = await API.get('/api/pro', {
        params: {
          patientId: selectedPatient.id
  
      }
      });

      console.log(response.data);
      // Handle the response data, e.g., set it to state
      setProced(response.data);
  } catch (error) {
      console.error('Error fetching procedure history:', error);
  }
};

// Call this function when you need to fetch the procedure history, e.g., after selecting a patient
useEffect(() => {
  if (selectedPatient) {
      fetchPatientProcedureHistory(); // Fetch history when component mounts or selectedPatient changes
  }
}, [selectedPatient]); // Dependency array includes selectedPatient

const handleVisitClickp = async (visitId) => {
  // console.log('Visit ID clicked:', visitId);

  const formattedDate = selectedDate.toISOString().split('T')[0]; // Format selectedDate to YYYY-MM-DD

  try {
      const response = await API.get(`/api/visitpres/${visitId}`, {
          params: { selectedDate: formattedDate }
      });
      
      const visitDetails = response.data;
      // console.log('GOT FROM HISTORY ', visitDetails);
      
      // Update state with all prescription details
      setHistoryPrescriptions(visitDetails); // Assuming visitDetails is an array

      // Optionally, log the visit details
      // console.log('Visit Details:', visitDetails);
  } catch (error) {
      console.error('Error fetching visit details:', error);
      // Handle the error (e.g., show a notification)
  }
};

// const handleVisitClickp = async (visitId) => {
//   console.log('Visit ID clicked:', visitId);

//   const formattedDate = selectedDate.toISOString().split('T')[0]; // Format selectedDate to YYYY-MM-DD

//   try {
//       const response = await API.get(`/api/visitpres/${visitId}`, {
//           params: { selectedDate: formattedDate }
//       });
      
//       const visitDetails = response.data;
//       console.log('GOT FROM HISTORY ', visitDetails);
      
//       // Assuming visitDetails is an array of objects as per the response structure
//       // Update state with the first item's details (or handle multiple items as needed)
//       if (visitDetails.length > 0) {
//           setMediP(visitDetails[0].itemName);
//           setDoseP(visitDetails[0].dosageQuantity);
//           setDayP(visitDetails[0].repeatedInDay);
//           setPriodP(visitDetails[0].daysPeriod);
//           setNotesP(visitDetails[0].notes);
//       }

//       // Optionally, log the visit details
//       console.log('Visit Details:', visitDetails);
//   } catch (error) {
//       console.error('Error fetching visit details:', error);
//       // Handle the error (e.g., show a notification)
//   }
// };

  
  const handlePatientSelect = (patient) => {
    // console.log(patient,'selecetd patinet')
    // alert(patient.id);
    // alert(patient.visitId)
    setSelectedPatient(patient);
    setDetails([]);
    setProced([]);
   
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
    chiefComplaints: '',
    historyPresentIllness: '',
    presentMedication: '',
    pastSurgicalHistory: '',
    allergiesToMedicationsFoodLatexOther: '',
    historyVaccinesImmunizations: '',
    healthInfoFamily: '',
    childhoodDiseases: '',
    pregnant: 'N',
  lactating: 'N',
  previousSurgeries: 'N',
  bloodDisorders: 'N',
  cardiacProblem: 'N',
  respiratoryProblems: 'N',
  endocrineProblem: 'N',
  pregnancyTrimester: '2', // This will be included only if 'pregnant' is true

  // Past Dental History
  prevExtraction: 'N',
  prevRestoration: 'N',
  prevOrtho: 'N',

  // Oral Prosthetic
  prostheticType: 'N',
  prostheticDuration: 'N',
  prostheticClinic: 'N',
  clinicExamination: 'Examination1',
  oralHygiene: 'Good',

  // Additional Checkboxes
  checkbox1: 'N',
  checkbox2: 'N',
  checkbox3: 'N',
  checkbox4: 'N',
  checkbox5: 'N',
  checkbox6: 'N',
  checkbox7: 'N',
  checkbox8: 'N',
  checkbox9: 'N',
  checkbox10: 'N',
  checkbox11: 'N',
  checkbox12: 'N',
  checkbox13: 'N',
  checkbox14: 'N',
  checkbox15:'N',
  checkbox16: 'N',
  checkbox17: 'N',
  checkbox18: 'N',
  checkbox19: 'N',
  checkbox20: 'N',
  checkbox21: 'N',
  checkbox22: 'N',
  checkbox23:'N',
  checkbox24: 'N',
  checkbox25: 'N',
  checkbox26: 'N',
  checkbox27: 'N',
  checkbox28: 'N',
  checkbox29: 'N',
  checkbox30: 'N',
  checkbox31: 'N',
  checkbox32: 'N',
  checkbox33: 'N',
  checkbox34: 'N',
  checkbox35: 'N',
  


  // ... up to checkbox36
  checkbox36: 'N',
  checkboxa: 'N',
  checkboxb: 'N',
  checkboxc: 'N',
  checkboxd:'N' ,
  checkboxe:'N' ,
  checkboxf:'N' ,
  checkboxg:'N' ,
  checkboxh: 'N',
  checkboxi: 'N',
  checkboxj: 'N',


  
  

  // ... up to checkboxk
  checkboxk: 'N',

  // Hard Tissue Findings
  numberOfTeeth: '',
  missingTeeth: '',
  fracturedTeeth: '',
  filledTeeth: '',
  discoloredTeeth: '',
  mobility: '',
  crowding: '',

  // Soft Tissue Findings
  sinusOpening: '',
  swelling: '',
  pulpVitality: '',
  prognosis: '',
  treatmentPlan: '',
  radiologicalExamination: '',
  finalDiagnosis: '',
  instruction: '',
  followupPlan: '',
  referral: '',
  patientCooperative: 'N',
  prevExtractionClinic: '',
  prevRestorationClinic: '',
  prevOrthoClinic: '',
  previousSurgeriesNote: '',
    bloodDisordersNote: '',
    cardiacProblemNote: '',
    respiratoryProblemsNote: '',
    endocrineProblemNote: '',
    
   
    medicineBrand: '',
    dose: '',
    repeat: '',
    noDays: '',
    prescriptionNote: '',
    prescriptions: [],
    clinicData: '',
    actionPlan: '',
    followUpPlan: '',
    newDiagnosis: '',
    finalDiagnoses: [],
    followupComplaint: '',
    followupInvestigationResults: '',
    followupDiagnosis: '',
    followupManagement: '',
    followfollowupPlan: '',
    diagnosticNotes1: '',
  diagnosticNotes2: '',
  diagnosticNotes3: '',
  diagnosticNotes4: '',
  
  diagnosisNoteCheckbox1: 'N',
  diagnosisNoteCheckbox2: 'N',
  diagnosisNoteCheckbox3: 'N',
  diagnosisNoteCheckbox4: 'N',
  therapeuticNotes1: '',
  therapeuticNoteCheckbox1: 'N',
  therapeuticNotes2: '',
  therapeuticNoteCheckbox2: 'N',
  therapeuticNotes3: '',
  therapeuticNoteCheckbox3: 'N',
  therapeuticNotes4: '',
  therapeuticNoteCheckbox4: 'N',
  icdName1: '',
  code1: '',
  note1: '',
  icdName2: '',
  code2: '',
  note2: '',
  icdName3: '',
  code3: '',
  note3: '',
  icdName4: '',
  code4: '',
  note4: '',
  icdName5: '',
  code5: '',
  note5: '',
  });

  const [diseases, setDiseases] = useState([]);
  const [medi,setMedi]=useState([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [selectedMedi, setSelectedMedi] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [codes, setCodes] = useState([]);
//D
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await API.get('/api/diseases'); // Use axios instance
        setDiseases(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error('Error fetching diseases:', error);
      }
    };

    fetchDiseases();
  }, []);

  useEffect(() => {
    const fetchMedi = async () => {
        try {
            const response = await API.get('/api/medi'); // Use axios instance
            // console.log(response.data, 'prescription');

            // Separate descriptions and codes
            const descriptions = response.data.map(item => item.description);
            const itemCodes = response.data.map(item => item.itemCode);

            setMedi(descriptions);
            setCodes(itemCodes);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        }
    };

    fetchMedi();
}, []);
useEffect(() => {
  const fetchicd = async () => {
      try {
          const response = await API.get('/api/icd10-codes'); 
          // Use axios instance
          const data = response.data;
          if (data) {
            // Assigning to separate variables
            const icd10Descriptors = [];
            const icd10Codes = [];

            data.forEach(item => {
                icd10Descriptors.push(item[0]); // Push descriptor
                icd10Codes.push(item[1]); // Push code
            });
            setICD10Descriptors(icd10Descriptors);
            setICD10Codes(icd10Codes)
            // console.log('ICD10 Descriptors:', icd10Descriptors);
            // console.log('ICD10 Codes:', icd10Codes);

            // Example: Assign to state or use as needed
            // setICD10Descriptors(icd10Descriptors); // Assuming you have a state variable for this
            // setICD10Codes(icd10Codes); // Assuming you have a state variable for this
        }

          // Separate descriptions and codes
          
      } catch (error) {
          console.error('Error fetching medicines:', error);
      }
  };

  fetchicd();
}, []);
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'F9' && activeRow !== null) {
      setShowDropdown((prev) =>
        prev.map((val, index) => (index === activeRow ? !val : false)) // Toggle only the active row
      );
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [activeRow]);


  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
  
    if (type === 'checkbox') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked ? 'Y' : 'N' 
      }));
    } else if (type === 'select-one') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  const handleAddPrescription = async () => {
    const { dose, repeat, noDays, prescriptionNote } = formData;

    if (selectedMedi && dose && repeat && noDays && selectedPatient) {
      const username = localStorage.getItem('username');
        const prescriptionData = {
            medicineBrand: selectedMedi,
            dose,
            repeat,
            noDays,
            prescriptionNote,
            patientId: selectedPatient.id,  // Include patientId
            visitId: selectedPatient.visitId,
            createdBy: username,
            code: selectedCode // Include visitId
        };

        try {
            // Send an array of prescriptions
            // console.log([prescriptionData])
            const response = await API.post('/api/add-prescription', [prescriptionData]);
            // console.log('Prescriptions added successfully:', response.data);

            // Update local state
            setFormData(prevFormData => ({
                ...prevFormData,
                prescriptions: [
                    ...(prevFormData.prescriptions || []),
                    prescriptionData
                ],
                dose: '',
                repeat: '',
                noDays: '',
                prescriptionNote: ''
            }));
            setSelectedMedi('');
            setSelectedCode(''); // Clear the selected medicine
        } catch (error) {
            console.error('Error adding prescription:', error);
        }
    }
};

  
  


  // const handleAddPrescription = () => {
  //   const { medicineBrand, dose, repeat, noDays, prescriptionNote } = formData;
  //   if (medicineBrand && dose && repeat && noDays) {
  //     setFormData({
  //       ...formData,
  //       prescriptions: [
  //         ...formData.prescriptions,
  //         {
  //           medicineBrand: selectedMedi,
  //           dose,
  //           repeat,
  //           noDays,
  //           prescriptionNote
  //         }
  //       ],
  //       medicineBrand: '',
  //       dose: '',
  //       repeat: '',
  //       noDays: '',
  //       prescriptionNote: ''
  //     });
  //     setSelectedMedi('');
  //   }
  // };

  const handleRemovePrescription = async (index) => {
    const prescriptionToRemove = formData.prescriptions[index];

    // Send request to delete the prescription from the backend
    try {
        await API.delete(`/api/delete-prescription`, {
            data: {
                medicineBrand: prescriptionToRemove.medicineBrand,
                dose: prescriptionToRemove.dose,
                repeat: prescriptionToRemove.repeat,
                noDays: prescriptionToRemove.noDays,
                prescriptionNote: prescriptionToRemove.prescriptionNote,
                patientId: selectedPatient.id,
                visitId: selectedPatient.visitId,
                createdBy: localStorage.getItem('username') // Assuming username is stored in localStorage
            }
        });

        // Update local state
        setFormData({
            ...formData,
            prescriptions: formData.prescriptions.filter((_, i) => i !== index)
        });

        // console.log('Prescription removed successfully');
    } catch (error) {
        console.error('Error removing prescription:', error);
        // Handle the error as needed
    }
};

  
  const handleDiseaseChange = (event) => {
    setSelectedDisease(event.target.value);
  };
  const handlemediChange = (event) => {
    const index = event.target.selectedIndex;
    setSelectedMedi(medi[index-1]); // Set selected medicine
    setSelectedCode(codes[index-1]);
  };
  

  const addDiseaseToHistory = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      historyPresentIllness: prevFormData.historyPresentIllness + (selectedDisease ? ` ${selectedDisease}` : '')
    }));
    setSelectedDisease('');
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Retrieve the username from local storage
    const username = localStorage.getItem('username');
  
    if (!username) {
      console.error('Username not found in localStorage');
      return;
    }
  
    // Generate next history ID
    const nextHstId = Number(maxHstId) !== null ? Number(maxHstId) + 1 : 1;
  
    // Prepare form data for submission
    const submissionData = {
      ...formData,
      patId: selectedPatient ? selectedPatient.id : '',
      visitId: selectedPatient ? selectedPatient.visitId: '',
      hstId: nextHstId,
      username: username
    };
    
    console.log('Prepared Submission Data:', submissionData);
  
    try {
      // Determine whether to update or create new
      if (hasDetails) {
        // Update existing patient details
        await API.put(`/api/update-observations/${selectedPatient.id}?visitId=${selectedPatient.visitId}`, submissionData);

        // console.log('Form Data Updated:', submissionData);
      } else {
        // console.log(submissionData,'DATA')
        // Save new patient details
        await API.post('/api/save-form-details', submissionData);
        // console.log('Form Data Saved:', submissionData);
      }
  
      // Show success alert
      window.alert('Form details saved successfully!');
    } catch (error) {
      console.error('Error submitting form data:', error);
  
      // Show error alert
      // window.alert('Error saving form details. Please try again.');
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


const handleAddDiagnosis = () => {
  if (formData.newDiagnosis.trim()) {
    setFormData(prevFormData => ({
      ...prevFormData,
      finalDiagnoses: [
        ...(Array.isArray(prevFormData.finalDiagnoses) ? prevFormData.finalDiagnoses : []), // Ensure it is an array
        formData.newDiagnosis
      ],
      newDiagnosis: '' // Clear the input after adding
    }));
  }
};


const handleRemoveDiagnosis = (index) => {
  setFormData({
    ...formData,
    finalDiagnoses: formData.finalDiagnoses.filter((_, i) => i !== index)
  });
};
const handleInputChange = (field, value) => {
  setFormData((prevData) => ({
    ...prevData,
    [field]: value,
  }));
};
const filteredList =filteredProcedures.filter(proc => 
        proc.description && 
        proc.description.toLowerCase().includes(search)
      )
   
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
<div className='patient-details-container'>
    <h2 style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}>App Dt & Time</h2>
    <div className='details-grid'>
        <p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
            <strong>Visit @:</strong> 
            {appointmentDetails ? 
                `${appointmentDetails.visitDate} ${formatTime(appointmentDetails.visitHour, appointmentDetails.visitMinute)}`
                : 'N/A'}
        </p>
        <p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
            <strong>Inspection Time:</strong> 
            {appointmentDetails ? 
                `${appointmentDetails.expected} minutes `  
                : 'N/A'}
        </p>
        <p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
            <strong>Queue #:</strong> 
            {appointmentDetails ? 
                `${appointmentDetails.queue} `  
                : 'N/A'}
        </p>
        <p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
            <strong>Waiting Patients:</strong> 
            <span>{filteredPatients.length}</span>
        </p>
        <p style={{ flexBasis: '45%', boxSizing: 'border-box' }}>
            <strong>For Doctor:</strong> 
            {appointmentDetails ? 
                `${appointmentDetails.doctorId} `  
                : 'N/A'}
        </p>
    </div>
</div>


        
  
        <div className='details-container'>
          <div className='patient-details-container'>
            <h2 style={{
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
          
           <h2 style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}>Readings </h2>
          
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


      <div className='form-container'>
      <h2 style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}>Patient Observations Form</h2>
      <form onSubmit={handleSubmit}>
        <div >
        
            <h3    style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }} onClick={toggleChief} >Chief Complaints:</h3>
            
            <div className='form-group'>
                <textarea
              id='chief-complaints'
              name='chiefComplaints'
              value={formData.chiefComplaints}
              onChange={handleChange}
              placeholder='Describe chief complaints...'
            ></textarea>
              
          
          </div>
        </div>

  <div>
  <h3  
   style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '5px', // Optional: rounded corners
    display: 'inline-block',
    width: '100%',
    marginBottom:'10px' // Make it wrap around content only
  }} onClick={togglePresent}>Present Illness</h3>

    
 
   {(
    showpresent && (
    <div>
           <div className='form-group' style={{ display: 'flex', gap: '20px' }}>
   
   {/* History of Present Illness Section */}
   <div style={{ flex: 1 }}>
     <label  >History of Present Illness:</label>
  

       <div>
           <textarea
       id='history-present-illness'
       name='historyPresentIllness'
       value={formData.historyPresentIllness}
       onChange={handleChange}
       placeholder='Describe history of present illness...'
       style={{ width: '100%', height: '100px' }} // Adjust height as needed
     ></textarea>
   
       
       <select
         id='disease-select'
         value={selectedDisease}
         onChange={handleDiseaseChange}
       >
         <option value=''>Select a disease</option>
         {diseases.map((disease, index) => (
           <option key={index} value={disease}>
             {disease}
           </option>
         ))}
       </select>
       <button type='button' onClick={addDiseaseToHistory}>
         Add
       </button>
     </div>
     
   
   </div>

   {/* Present Medication Section */}
   <div style={{ flex: 1 }}>
     <label htmlFor='present-medication'>Present Medication:</label>

     <textarea
     id='present-medication'
     name='presentMedication'
     value={formData.presentMedication}
     onChange={handleChange}
     placeholder='List current medications...'
     style={{ width: '100%', height: '100px' }} // Adjust height as needed
   ></textarea>
   
 
   </div>

   {/* Past Surgical History Section */}
   <div style={{ flex: 1 }}>
     <label  htmlFor='past-surgical-history'>Past Surgical History:</label>

     <textarea
     id='past-surgical-history'
     name='pastSurgicalHistory'
     value={formData.pastSurgicalHistory}
     onChange={handleChange}
     placeholder='Describe past surgical history...'
     style={{ width: '100%', height: '100px' }} // Adjust height as needed
   ></textarea>
   
  

   </div>

 </div>
    </div>
    )
   )}

  </div>


        <div >
          <h3     style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '5px', // Optional: rounded corners
    display: 'inline-block',
    width: '100%',
    marginBottom:'10px' // Make it wrap around content only
  }}  onClick={toggleAllergies}>Allergies and Vaccines</h3>
        {(
          showallergies && (
            <div   className='form-group'>
            <label   htmlFor='allergies-to-medications-food-latex-other'>Allergies to Medications/Food/Latex/Other:</label>
      
             <textarea
             id='allergies-to-medications-food-latex-other'
             name='allergiesToMedicationsFoodLatexOther'
             value={formData.allergiesToMedicationsFoodLatexOther}
             onChange={handleChange}
             placeholder='List allergies to medications, food, latex, or other substances...'
           ></textarea>
           

           
              <div>
            <label  htmlFor='history-vaccines-immunizations'>History of Vaccines and Immunizations:</label>
     
        <textarea
        id='history-vaccines-immunizations'
        name='historyVaccinesImmunizations'
        value={formData.historyVaccinesImmunizations}
        onChange={handleChange}
        placeholder='Describe history of vaccines and immunizations...'
      ></textarea>
       
      
          </div>
          </div>
          )
        )}
        
        </div>

        <div>
          <h3  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}    onClick={toggleFamily}>Family and Childhood Diseases</h3>
        {(
          showfamily && (
            <div>
                <div className='form-group'>
            <label   htmlFor='health-info-family'>Health Information about Patient's Family:</label>
       
          <textarea
          id='health-info-family'
          name='healthInfoFamily'
          value={formData.healthInfoFamily}
          onChange={handleChange}
          placeholder='Describe health information about the patient’s family...'
        ></textarea>
      
          </div>
          <div className='form-group'>
            <label  htmlFor='childhood-diseases'>Childhood Diseases:</label>
    
              <textarea
              id='childhood-diseases'
              name='childhoodDiseases'
              value={formData.childhoodDiseases}
              onChange={handleChange}
              placeholder='List childhood diseases...'
            ></textarea>
            
          
          </div>
            </div>
          )
        )}
        </div>
    

        {specialty && (
        <div><h3   style={{
          backgroundColor: '#d3d3d3', // Light yellow background color
          padding: '10px', // Some padding for better spacing
          cursor: 'pointer', // Change cursor to pointer on hover
          borderRadius: '1px', // Optional: rounded corners
          width: '100%',
          display: 'inline-block',
          marginTop:'10px' // Make it wrap around content only
        }} onClick={toggleDental} >Dental</h3>  
   {(
    showdental && (
      <div className='general-form'>
      <h3 onClick={toggleallergtomedi}>General Medication</h3>
{(
  showalergtomedi && (
    <div>
      <div className='field-row' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
 
 {/* Pregnant and Lactating Checkboxes */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 20%', minWidth: '200px' }}>
   <label style={{ margin: 0 }}>
     <input type='checkbox' name='pregnant' checked={formData.pregnant === 'Y'} onChange={handleChange} /> Pregnant
   </label>
   <label style={{ margin: 0 }}>
     <input type='checkbox' name='lactating' checked={formData.lactating === 'Y'} onChange={handleChange} /> Lactating
   </label>
 </div>

 {/* Trimester Select */}
 {formData.pregnant && (
   <div className='form-group' style={{ flex: '1 1 20%', minWidth: '200px' }}>
     <label htmlFor='pregnancy-trimester' style={{ margin: 0 }}>Trimester:</label>
     <select
       id='pregnancy-trimester'
       name='pregnancyTrimester'
       value={formData.pregnancyTrimester}
       onChange={handleChange}
       style={{ width: '100%', boxSizing: 'border-box' }}
     >
       <option value=''>Select Trimester</option>
       <option value='1'>First Trimester</option>
       <option value='2'>Second Trimester</option>
       <option value='3'>Third Trimester</option>
     </select>
   </div>
 )}

 {/* Previous Surgeries */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 20%', minWidth: '200px' }}>
   <input
     type='checkbox'
     name='previousSurgeries'
     checked={formData.previousSurgeries === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ margin: 0 }}>Prev Surgeries</label>
   <input
     type='text'
     name='previousSurgeriesNote'
     value={formData.previousSurgeriesNote}
     onChange={handleChange}
     placeholder='Notes for Previous Surgeries'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Blood Disorders */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 20%', minWidth: '200px' }}>
   <input
     type='checkbox'
     name='bloodDisorders'
     checked={formData.bloodDisorders === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ margin: 0 }}>Blood Disorders</label>
   <input
     type='text'
     name='bloodDisordersNote'
     value={formData.bloodDisordersNote}
     onChange={handleChange}
     placeholder='Notes for Blood Disorders'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Cardiac Problem */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 20%', minWidth: '200px' }}>
   <input
     type='checkbox'
     name='cardiacProblem'
     checked={formData.cardiacProblem === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ margin: 0 }}>Cardiac Problem</label>
   <input
     type='text'
     name='cardiacProblemNote'
     value={formData.cardiacProblemNote}
     onChange={handleChange}
     placeholder='Notes for Cardiac Problem'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Respiratory Problems */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 20%', minWidth: '200px' }}>
   <input
     type='checkbox'
     name='respiratoryProblems'
     checked={formData.respiratoryProblems === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ margin: 0 }}>Respiratory Problems</label>
   <input
     type='text'
     name='respiratoryProblemsNote'
     value={formData.respiratoryProblemsNote}
     onChange={handleChange}
     placeholder='Notes for Respiratory Problems'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Endocrine Problem */}
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 20%', minWidth: '200px' }}>
   <input
     type='checkbox'
     name='endocrineProblem'
     checked={formData.endocrineProblem === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ margin: 0 }}>Endocrine Problem</label>
   <input
     type='text'
     name='endocrineProblemNote'
     value={formData.endocrineProblemNote}
     onChange={handleChange}
     placeholder='Notes for Endocrine Problem'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>
 
</div>


   {/* New Past Dental History section */}
 
   <h3>Past Dental History</h3>
<div className='form-group' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
 {/* Previous Extraction */}
 <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 30%', minWidth: '250px' }}>
   <input
     type='checkbox'
     name='prevExtraction'
     checked={formData.prevExtraction === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ marginRight: '10px' }}>Previous Extraction</label>
   <input
     type='text'
     name='prevExtractionClinic'
     value={formData.prevExtractionClinic}
     onChange={handleChange}
     placeholder='Clinic for Previous Extraction'
     style={{ width: '200px', boxSizing: 'border-box' }}
   />
 </div>

 {/* Previous Restoration */}
 <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 30%', minWidth: '250px' }}>
   <input
     type='checkbox'
     name='prevRestoration'
     checked={formData.prevRestoration === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ marginRight: '10px' }}>Previous Restoration</label>
   <input
     type='text'
     name='prevRestorationClinic'
     value={formData.prevRestorationClinic}
     onChange={handleChange}
     placeholder='Clinic for Previous Restoration'
     style={{ width: '200px', boxSizing: 'border-box' }}
   />
 </div>

 {/* Previous Orthodontics */}
 <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 30%', minWidth: '250px' }}>
   <input
     type='checkbox'
     name='prevOrtho'
     checked={formData.prevOrtho === 'Y'}
     onChange={handleChange}
     style={{ marginRight: '5px' }}
   />
   <label style={{ marginRight: '10px' }}>Previous Orthodontics</label>
   <input
     type='text'
     name='prevOrthoClinic'
     value={formData.prevOrthoClinic}
     onChange={handleChange}
     placeholder='Clinic for Previous Orthodontics'
     style={{ width: '200px', boxSizing: 'border-box' }}
   />
 </div>
</div>
    </div>
  )
)}

   

   {/* New Oral Prosthetic section */}
 
   <h3 onClick={toggleimmunization}>Oral Prosthetic</h3>
{(
  showimmunization && (
    <div>
      <div className='form-group' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
 
 {/* Checkboxes */}
 <div style={{ display: 'flex', flex: '1 1 30%', minWidth: '250px', gap: '10px' }}>
   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
     <input
       type='checkbox'
       name='prostheticType'
       checked={formData.prostheticType === 'Y'}
       onChange={handleChange}
       style={{ marginRight: '5px' }}
     />
     <label>Type</label>
   </div>
   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
     <input
       type='checkbox'
       name='prostheticDuration'
       checked={formData.prostheticDuration === 'Y'}
       onChange={handleChange}
       style={{ marginRight: '5px' }}
     />
     <label>Duration</label>
   </div>
   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
     <input
       type='checkbox'
       name='prostheticClinic'
       checked={formData.prostheticClinic === 'Y'}
       onChange={handleChange}
       style={{ marginRight: '5px' }}
     />
     <label>Clinic</label>
   </div>
 </div>

 {/* Dropdowns */}
 <div className='form-group' style={{ flex: '1 1 30%', minWidth: '250px' }}>
   <label htmlFor='clinic-examination'>Clinic Examination:</label>
   <select
     id='clinic-examination'
     name='clinicExamination'
     value={formData.clinicExamination}
     onChange={handleChange}
     style={{ width: '100%' }}
   >
     <option value=''>Select Examination</option>
     <option value='Examination1'>Examination 1</option>
     <option value='Examination2'>Examination 2</option>
     {/* Add more options as needed */}
   </select>
 </div>

 <div className='form-group' style={{ flex: '1 1 30%', minWidth: '250px' }}>
   <label htmlFor='oral-hygiene'>Oral Hygiene:</label>
   <select
     id='oral-hygiene'
     name='oralHygiene'
     value={formData.oralHygiene}
     onChange={handleChange}
     style={{ width: '100%' }}
   >
     <option value=''>Select Hygiene Level</option>
     <option value='good'>Good</option>
     <option value='moderate'>Moderate</option>
     <option value='poor'>Poor</option>
   </select>
 </div>

</div>

  

<div className='form-group' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', overflowX: 'auto' }}>

 {Array.from({ length: 36 }, (_, index) => (
   <label key={index} style={{ display: 'flex', alignItems: 'center' }}>
     <input
       type='checkbox'
       name={`checkbox${index + 1}`}
       checked={formData[`checkbox${index + 1}`] === 'Y'}
       onChange={handleChange}
       style={{ marginRight: '5px' }}
     />
     {index + 1}
   </label>
 ))}


 {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map(letter => (
   <label key={letter} style={{ display: 'flex', alignItems: 'center' }}>
     <input
       type='checkbox'
       name={`checkbox${letter}`}
       checked={formData[`checkbox${letter}`] === 'Y'}
       onChange={handleChange}
       style={{ marginRight: '5px' }}
     />
     {letter}
   </label>
 ))}
</div>
    </div>
  )
)}


  

   {/* New Hard Tissue Findings section */}
 
   <h3 onClick={toggleabout}>Hard Tissue Findings</h3>
{(
  showabout && (
    <div className='form-group' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
 {/* Number of Teeth */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='numberOfTeeth'>Number of Teeth:</label>
   <input
     type='text'
     id='numberOfTeeth'
     name='numberOfTeeth'
     value={formData.numberOfTeeth}
     onChange={handleChange}
     placeholder='Number of teeth...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Missing Teeth */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='missingTeeth'>Missing Teeth:</label>
   <input
     type='text'
     id='missingTeeth'
     name='missingTeeth'
     value={formData.missingTeeth}
     onChange={handleChange}
     placeholder='Missing teeth...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Fractured Teeth */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='fracturedTeeth'>Fractured Teeth:</label>
   <input
     type='text'
     id='fracturedTeeth'
     name='fracturedTeeth'
     value={formData.fracturedTeeth}
     onChange={handleChange}
     placeholder='Fractured teeth...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Filled Teeth */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='filledTeeth'>Filled Teeth:</label>
   <input
     type='text'
     id='filledTeeth'
     name='filledTeeth'
     value={formData.filledTeeth}
     onChange={handleChange}
     placeholder='Filled teeth...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Discolored Teeth */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='discoloredTeeth'>Discolored Teeth:</label>
   <input
     type='text'
     id='discoloredTeeth'
     name='discoloredTeeth'
     value={formData.discoloredTeeth}
     onChange={handleChange}
     placeholder='Discolored teeth...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Mobility */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='mobility'>Mobility:</label>
   <input
     type='text'
     id='mobility'
     name='mobility'
     value={formData.mobility}
     onChange={handleChange}
     placeholder='Mobility...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Crowding */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='crowding'>Crowding:</label>
   <input
     type='text'
     id='crowding'
     name='crowding'
     value={formData.crowding}
     onChange={handleChange}
     placeholder='Crowding...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>
</div>
  )
)}


   {/* New Soft Tissue Findings section */}
   
   <h3 onClick={togglechild}>Soft Tissue Findings</h3>
{(
  showchild && (
    <div className='form-group' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
 {/* Sinus Opening */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='sinusOpening'>Sinus Opening:</label>
   <input
     type='text'
     id='sinusOpening'
     name='sinusOpening'
     value={formData.sinusOpening}
     onChange={handleChange}
     placeholder='Sinus opening...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Swelling */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='swelling'>Swelling:</label>
   <input
     type='text'
     id='swelling'
     name='swelling'
     value={formData.swelling}
     onChange={handleChange}
     placeholder='Swelling...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Pulp Vitality */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='pulpVitality'>Pulp Vitality:</label>
   <input
     type='text'
     id='pulpVitality'
     name='pulpVitality'
     value={formData.pulpVitality}
     onChange={handleChange}
     placeholder='Pulp vitality...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Prognosis */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='prognosis'>Prognosis:</label>
   <input
     type='text'
     id='prognosis'
     name='prognosis'
     value={formData.prognosis}
     onChange={handleChange}
     placeholder='Prognosis...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Treatment Plan */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='treatmentPlan'>Treatment Plan:</label>
   <input
     type='text'
     id='treatmentPlan'
     name='treatmentPlan'
     value={formData.treatmentPlan}
     onChange={handleChange}
     placeholder='Treatment plan...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Radiological Examination */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='radiologicalExamination'>Radiological Examination:</label>
   <input
     type='text'
     id='radiologicalExamination'
     name='radiologicalExamination'
     value={formData.radiologicalExamination}
     onChange={handleChange}
     placeholder='Radiological examination...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Final Diagnosis */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='finalDiagnosis'>Final Diagnosis:</label>
   <input
     type='text'
     id='finalDiagnosis'
     name='finalDiagnosis'
     value={formData.finalDiagnosis}
     onChange={handleChange}
     placeholder='Final diagnosis...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Instruction */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='instruction'>Instruction:</label>
   <input
     type='text'
     id='instruction'
     name='instruction'
     value={formData.instruction}
     onChange={handleChange}
     placeholder='Instruction...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Follow-up Plan */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='followupPlan'>Follow-up Plan:</label>
   <input
     type='text'
     id='followupPlan'
     name='followupPlan'
     value={formData.followupPlan}
     onChange={handleChange}
     placeholder='Follow-up plan...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Referral to Other Consultant */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label htmlFor='referral'>Referral to Other Consultant:</label>
   <input
     type='text'
     id='referral'
     name='referral'
     value={formData.referral}
     onChange={handleChange}
     placeholder='Referral to other consultant...'
     style={{ width: '100%', boxSizing: 'border-box' }}
   />
 </div>

 {/* Patient Cooperative Checkbox */}
 <div style={{ flex: '1 1 22%', minWidth: '200px' }}>
   <label>
     <input
       type='checkbox'
       name='patientCooperative'
       checked={formData.patientCooperative === 'Y'}
       onChange={handleChange}
       style={{ marginRight: '5px' }}
     />
     Patient Cooperative
   </label>
 </div>
</div>
  )
)}

   
   </div>
    )
   )} 
    </div> 
       )}
        <div >
        <h3 style={{

  backgroundColor: '#d3d3d3', // Light yellow background color
  padding: '10px', // Some padding for better spacing
  cursor: 'pointer', // Change cursor to pointer on hover
  borderRadius: '1px', // Optional: rounded corners
  width: '100%',
  display: 'inline-block', // Make it wrap around content only

    marginTop:'10px'// Make it wrap around content only
  }}  onClick={toggleProvisional}>Provisional notes</h3>
         {(
          showprovisional && (
            <div>
               <div>
     
     <div >
   <div>
     
     

   <div style={{ display: 'flex', gap: '20px' }}>
{/* Diagnostic Notes Section */}
<div style={{ flex: 1 }}>
   <label   htmlFor='diagnostic-notes'>Diagnostic Notes:</label>
   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='diagnostic-notes-1'
               name='diagnosticNotes1'
               value={formData.diagnosticNotes1}
               onChange={handleChange}
               placeholder='Enter diagnostic notes 1...'
               style={{ width: '200%' }} // Full width of the parent
           />
           <input
               type='checkbox'
               name='diagnosisNoteCheckbox1'
               checked={formData.diagnosisNoteCheckbox1 === 'Y'}
               onChange={handleChange}
           />
       </div>

       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='diagnostic-notes-2'
               name='diagnosticNotes2'
               value={formData.diagnosticNotes2}
               onChange={handleChange}
               placeholder='Enter diagnostic notes 2...'
               style={{ width: '200%' }}
           />
           <input
               type='checkbox'
               name='diagnosisNoteCheckbox2'
               checked={formData.diagnosisNoteCheckbox2 === 'Y'}
               onChange={handleChange}
           />
       </div>

       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='diagnostic-notes-3'
               name='diagnosticNotes3'
               value={formData.diagnosticNotes3}
               onChange={handleChange}
               placeholder='Enter diagnostic notes 3...'
               style={{ width: '200%' }}
           />
           <input
               type='checkbox'
               name='diagnosisNoteCheckbox3'
               checked={formData.diagnosisNoteCheckbox3 === 'Y'}
               onChange={handleChange}
           />
       </div>

       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='diagnostic-notes-4'
               name='diagnosticNotes4'
               value={formData.diagnosticNotes4}
               onChange={handleChange}
               placeholder='Enter diagnostic notes 4...'
               style={{ width: '200%' }}
           />
           <input
               type='checkbox'
               name='diagnosisNoteCheckbox4'
               checked={formData.diagnosisNoteCheckbox4 === 'Y'}
               onChange={handleChange}
           />
       </div>
   </div>
</div>

{/* Therapeutic Notes Section */}
<div style={{ flex: 1 }}>
   <label  htmlFor='therapeutic-notes'>Therapeutic Notes:</label>
   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='therapeutic-notes-1'
               name='therapeuticNotes1'
               value={formData.therapeuticNotes1}
               onChange={handleChange}
               placeholder='Enter therapeutic notes 1...'
               style={{ width: '200%' }} // Full width of the parent
           />
           <input
               type='checkbox'
               name='therapeuticNoteCheckbox1'
               checked={formData.therapeuticNoteCheckbox1 === 'Y'}
               onChange={handleChange}
           />
       </div>

       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='therapeutic-notes-2'
               name='therapeuticNotes2'
               value={formData.therapeuticNotes2}
               onChange={handleChange}
               placeholder='Enter therapeutic notes 2...'
               style={{ width: '200%' }}
           />
           <input
               type='checkbox'
               name='therapeuticNoteCheckbox2'
               checked={formData.therapeuticNoteCheckbox2 === 'Y'}
               onChange={handleChange}
           />
       </div>

       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='therapeutic-notes-3'
               name='therapeuticNotes3'
               value={formData.therapeuticNotes3}
               onChange={handleChange}
               placeholder='Enter therapeutic notes 3...'
               style={{ width: '200%' }}
           />
           <input
               type='checkbox'
               name='therapeuticNoteCheckbox3'
               checked={formData.therapeuticNoteCheckbox3 === 'Y'}
               onChange={handleChange}
           />
       </div>

       <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
           <input
               id='therapeutic-notes-4'
               name='therapeuticNotes4'
               value={formData.therapeuticNotes4}
               onChange={handleChange}
               placeholder='Enter therapeutic notes 4...'
               style={{ width: '200%' }}
           />
           <input
               type='checkbox'
               name='therapeuticNoteCheckbox4'
               checked={formData.therapeuticNoteCheckbox4 === 'Y'}
               onChange={handleChange}
           />
       </div>
   </div>
</div>
</div>




   </div>
 </div>
 
 <div>

 <div style={{display:'flex'}} className='prescription-section'>
  
  <div  style={{marginTop:'20px'}}className='form-group prescription-form-group'>
  
    <select
id='medicine-brand'
name='medicineBrand'
value={selectedMedi} // Should match state variable
onChange={handlemediChange} // Should update state
className='form-select'
>
<option value=''>Select a medicine</option>
{medi.map((description, index) => (
  <option key={index} value={codes[index]}>
      {description}
  </option>
))}
{/* Option for manual entry */}
</select>
<input
type='text'
placeholder='Or add manually'
value={selectedMedi} // Display manual input only if selected
onChange={(e) => {
  setSelectedMedi(e.target.value); // Update selected medicine
  setSelectedCode(null); // Set code to null for manual entry
}}
className='form-input'
/>

    {/* <select
id='medicine-brand'
name='medicineBrand'
value={selectedMedi} // Should match state variable
onChange={handlemediChange} // Should update state
className='form-select'
>
<option value=''>Select a medicine</option>
{medi.map((description, index) => (
              <option key={index} value={codes[index]}>
                  {description}
              </option>
          ))}
</select> */}

<input
type='text'
id='dose'
name='dose'
value={formData.dose} // Should match state variable
onChange={handleChange} // Should update state
placeholder='Dose'
className='form-input'
/>

<input
type='text'
id='repeat'
name='repeat'
value={formData.repeat} // Should match state variable
onChange={handleChange} // Should update state
placeholder='Repeat'
className='form-input'
/>

<input
type='number'
id='no-days'
name='noDays'
value={formData.noDays} // Should match state variable
onChange={handleChange} // Should update state
placeholder='No. of Days'
className='form-input'
/>

<input
type='text'
id='prescription-note'
name='prescriptionNote'
value={formData.prescriptionNote} // Should match state variable
onChange={handleChange} // Should update state
placeholder='Additional notes...'
className='form-input'
/>

<button type='button' onClick={handleAddPrescription} className='add-prescription-button'>
Add Prescription
</button>

  </div>

  <table className='prescription-table'>
<thead>
<tr>
<th>Medicine Brand</th>
<th>Dose</th>
<th>Repeat</th>
<th>No. of Days</th>
<th>Prescription Note</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{formData.prescriptions && formData.prescriptions.length > 0 ? (
formData.prescriptions.map((prescription, index) => (
<tr key={index}>
  <td>{prescription.medicineBrand}</td>
  <td>{prescription.dose}</td>
  <td>{prescription.repeat}</td>
  <td>{prescription.noDays}</td>
  <td>{prescription.prescriptionNote}</td>
  <td>
    <button type='button' onClick={() => handleRemovePrescription(index)} className='remove-prescription-button'>
      Remove
    </button>
  </td>
</tr>
))
) : (
<tr>
<td colSpan={6}>No prescriptions available</td>
</tr>
)}
</tbody>

</table>

</div>
 </div>
      
  
     </div>
            </div>
          )
         )}
        </div>
  
        <h3   style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block',
    marginTop:'10px' // Make it wrap around content only
  }}  onClick={toggleManagment}>Management Plan:</h3>
      {(
        showmanagment && (
          <div style={{display:'flex'}}className='form-group management-plan-group'>
       <div>
       <label htmlFor='clinic-data'>Clinic Data:</label>
          <textarea 
            type='text'
            id='clinic-data'
            name='clinicData'
            value={formData.clinicData}
            onChange={handleChange}
            placeholder='Enter clinic data...'
            className='form-input'
          />
       </div>

       <div>
       <label htmlFor='action-plan'>Action Plan:</label>
          <textarea
            type='text'
            id='action-plan'
            name='actionPlan'
            value={formData.actionPlan}
            onChange={handleChange}
            placeholder='Enter action plan...'
            className='form-input'
          />
       </div>

        <div>
        <label htmlFor='follow-up-plan'>Follow-Up Plan:</label>
          <textarea
            type='text'
            id='follow-up-plan'
            name='followUpPlan'
            value={formData.followUpPlan}
            onChange={handleChange}
            placeholder='Enter follow-up plan...'
            className='form-input'
          />
        </div>

        
   <div>
   <table>
      <thead>
        <tr>
          <th>ICD Name</th>
          <th>Code</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
  <tr onClick={() => setActiveRow(0)}>
    <td>
      {showDropdown[0] ? (
        <select
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedCode = icd10Codes[selectedIndex];
            handleInputChange('icdName1', e.target.value);
            handleInputChange('code1', selectedCode);
          }}
        >
          <option value="">Select ICD</option>
          {icd10Descriptors.map((descriptor, i) => (
            <option key={i} value={descriptor}>
              {descriptor}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="ICD Name 1"
          value={formData.icdName1}
          onChange={(e) => handleInputChange('icdName1', e.target.value)}
        />
      )}
    </td>
    <td>
      <input
        type="text"
        placeholder="Code 1"
        value={formData.code1}
        onChange={(e) => handleInputChange('code1', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Note 1"
        value={formData.note1}
        onChange={(e) => handleInputChange('note1', e.target.value)}
      />
    </td>
  </tr>
  <tr onClick={() => setActiveRow(1)}>
    <td>
      {showDropdown[1] ? (
        <select
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedCode = icd10Codes[selectedIndex];
            handleInputChange('icdName2', e.target.value);
            handleInputChange('code2', selectedCode);
          }}
        >
          <option value="">Select ICD</option>
          {icd10Descriptors.map((descriptor, i) => (
            <option key={i} value={descriptor}>
              {descriptor}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="ICD Name 2"
          value={formData.icdName2}
          onChange={(e) => handleInputChange('icdName2', e.target.value)}
        />
      )}
    </td>
    <td>
      <input
        type="text"
        placeholder="Code 2"
        value={formData.code2}
        onChange={(e) => handleInputChange('code2', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Note 2"
        value={formData.note2}
        onChange={(e) => handleInputChange('note2', e.target.value)}
      />
    </td>
  </tr>
  <tr onClick={() => setActiveRow(2)}>
    <td>
      {showDropdown[2] ? (
        <select
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedCode = icd10Codes[selectedIndex];
            handleInputChange('icdName3', e.target.value);
            handleInputChange('code3', selectedCode);
          }}
        >
          <option value="">Select ICD</option>
          {icd10Descriptors.map((descriptor, i) => (
            <option key={i} value={descriptor}>
              {descriptor}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="ICD Name 3"
          value={formData.icdName3}
          onChange={(e) => handleInputChange('icdName3', e.target.value)}
        />
      )}
    </td>
    <td>
      <input
        type="text"
        placeholder="Code 3"
        value={formData.code3}
        onChange={(e) => handleInputChange('code3', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Note 3"
        value={formData.note3}
        onChange={(e) => handleInputChange('note3', e.target.value)}
      />
    </td>
  </tr>
  <tr onClick={() => setActiveRow(3)}>
    <td>
      {showDropdown[3] ? (
        <select
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedCode = icd10Codes[selectedIndex];
            handleInputChange('icdName4', e.target.value);
            handleInputChange('code4', selectedCode);
          }}
        >
          <option value="">Select ICD</option>
          {icd10Descriptors.map((descriptor, i) => (
            <option key={i} value={descriptor}>
              {descriptor}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="ICD Name 4"
          value={formData.icdName4}
          onChange={(e) => handleInputChange('icdName4', e.target.value)}
        />
      )}
    </td>
    <td>
      <input
        type="text"
        placeholder="Code 4"
        value={formData.code4}
        onChange={(e) => handleInputChange('code4', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Note 4"
        value={formData.note4}
        onChange={(e) => handleInputChange('note4', e.target.value)}
      />
    </td>
  </tr>
  <tr onClick={() => setActiveRow(4)}>
    <td>
      {showDropdown[4] ? (
        <select
          onChange={(e) => {
            const selectedIndex = e.target.selectedIndex;
            const selectedCode = icd10Codes[selectedIndex];
            handleInputChange('icdName5', e.target.value);
            handleInputChange('code5', selectedCode);
          }}
        >
          <option value="">Select ICD</option>
          {icd10Descriptors.map((descriptor, i) => (
            <option key={i} value={descriptor}>
              {descriptor}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder="ICD Name 5"
          value={formData.icdName5}
          onChange={(e) => handleInputChange('icdName5', e.target.value)}
        />
      )}
    </td>
    <td>
      <input
        type="text"
        placeholder="Code 5"
        value={formData.code5}
        onChange={(e) => handleInputChange('code5', e.target.value)}
      />
    </td>
    <td>
      <input
        type="text"
        placeholder="Note 5"
        value={formData.note5}
        onChange={(e) => handleInputChange('note5', e.target.value)}
      />
    </td>
  </tr>
</tbody>


    </table>
   </div>




        </div>
        )
      )}
      
        <div>
        <label  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block',
    marginTop:'10px' // Make it wrap around content only
  }}   onClick={toggleProcedure}>Procedures</label>
  {(
    showprocedure && (
      <div>
              <div className='procedure-form-group'>
        <button
  type="button"
  style={{
    backgroundColor: 'grey',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px'
 
  }}
  onClick={() => setIsDropdownOpen(true)}
>
  Procedures
</button>


      {isDropdownOpen && (
  <div id='procedure-dropdown' className='procedure-modal-dropdown'>
    <div className='procedure-modal-content'>
      <button type="button" className='close-button' onClick={() => {
        setIsDropdownOpen(false)
      
      // Clear the search query when closing
    }}>Close</button>
      <button type="button" onClick={addSelectedProcedures}>Add</button>
      <input
        type='text'
        placeholder='Search procedures...'
        value={search}
        onChange={handleSearchChangep}
        className='search-input'
      />
      <table className='procedure-modal-table'>
        <thead>
          <tr>
            <th>Select</th>
            <th>Name</th>
         
            <th>Price</th>
            <th>Category</th>
            <th>RefCode</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map(proc => (
            <tr key={proc.itemCode} onClick={() => toggleProcedureSelection(proc)}>
              <td>
                <input
                  type='checkbox'
                  checked={selectedForAdd.includes(proc)}
                  readOnly
                />
              </td>
              <td>{proc.description}</td>
              <td>{proc.price}</td>
              <td>{proc.catDesc}</td>
              <td>{proc.refCode}</td>
            </tr>
          ))}
        </tbody>

      </table>
      <button type="button" onClick={addSelectedProcedures}>Add</button>
      <button type="button" className='close-button' onClick={() => setIsDropdownOpen(false)}>Close</button>
    </div>
  </div>
)}


      <table className='procedure-selected-table'>
        <thead>
          <tr>
            <th>Procedure Name</th>
            <th>Code</th>
            <th>Comments</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { 
          procedureData.selectedProcedures.length > 0 ?
          (procedureData.selectedProcedures.map((proc, index) => (
            <tr key={index}>
              <td>{proc.description}</td>
              <td>{proc.itemCode}</td>
              <td>
                <input
                  type='text'
                  value={proc.comments}
                  onChange={(e) => {
                    const updatedProcedures = [...procedureData.selectedProcedures];
                    updatedProcedures[index].comments = e.target.value;
                    setProcedureData((prev) => ({
                      ...prev,
                      selectedProcedures: updatedProcedures,
                    }));
                  }}
                />
              </td>
              <td>
                <input
                  type='number'
                  value={proc.qty}
                  min="1"
                  onChange={(e) => {
                    const updatedProcedures = [...procedureData.selectedProcedures];
                    updatedProcedures[index].qty = parseInt(e.target.value, 10);
                    setProcedureData((prev) => ({
                      ...prev,
                      selectedProcedures: updatedProcedures,
                    }));
                  }}
                />
              </td>
              <td>{proc.pr}</td>
             <td><button
              onClick={() => {
                const updatedProcedures = procedureData.selectedProcedures.filter((_, i) => i !== index);
                setProcedureData((prev) => ({
                  ...prev,
                  selectedProcedures: updatedProcedures,
                }));
              }}
            >
              Remove
            </button></td> 
            </tr>
          )))
          :(
            <tr>
              <td>Default Procedure</td>
              <td>12345</td>
              <td>
                <input type='text' placeholder='Add comments' />
              </td>
              <td>
                <input type='number' defaultValue={1} min="1" />
              </td>
              <td>0.00</td>
              <td>
              <button type='button'>Remove</button>
              </td>
            
            </tr>
          )}
        </tbody>
      </table>
 {/* <table className='procedure-selected-table'>
  <thead>
    <tr>
      <th>Procedure Name</th>
      <th>Code</th>
      <th>Comments</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {procedureData.selectedProcedures.length > 0 ? (
      procedureData.selectedProcedures.map((proc, index) => (
        <tr key={index}>
          <td>{proc.description}</td>
          <td>{proc.itemCode}</td>
          <td>
            <input
              type='text'
              value={proc.comments}
              onChange={(e) => {
                const updatedProcedures = [...procedureData.selectedProcedures];
                updatedProcedures[index].comments = e.target.value;
                setProcedureData((prev) => ({
                  ...prev,
                  selectedProcedures: updatedProcedures,
                }));
              }}
            />
          </td>
          <td>
            <input
              type='number'
              value={proc.qty}
              min="1"
              onChange={(e) => {
                const updatedProcedures = [...procedureData.selectedProcedures];
                updatedProcedures[index].qty = parseInt(e.target.value, 10);
                setProcedureData((prev) => ({
                  ...prev,
                  selectedProcedures: updatedProcedures,
                }));
              }}
            />
          </td>
          <td>{proc.pr}</td>
          <td>
            <button
              onClick={() => {
                const updatedProcedures = procedureData.selectedProcedures.filter((_, i) => i !== index);
                setProcedureData((prev) => ({
                  ...prev,
                  selectedProcedures: updatedProcedures,
                }));
              }}
            >
              Remove
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td>Default Procedure</td>
        <td>12345</td>
        <td>
          <input type='text' placeholder='Add comments' />
        </td>
        <td>
          <input type='number' defaultValue={1} min="1" />
        </td>
        <td>0.00</td>
        <td>
          <button
            onClick={() => {
              const newProcedure = {
                description: "Default Procedure",
                itemCode: "12345",
                comments: "",
                qty: 1,
                pr: 0.00,
              };
              setProcedureData((prev) => ({
                ...prev,
                selectedProcedures: [...prev.selectedProcedures, newProcedure],
              }));
            }}
          >
            Add
          </button>
        </td>
      </tr>
    )}
  </tbody>
</table> */}



      <button
  type="button"
  onClick={handlePayRequest}
  style={{
    backgroundColor: '#D3D3D3', // Light grey color
    color: 'black',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
  }}
>
  <i className="fa fa-credit-card" style={{ marginRight: '8px' }}></i> {/* Replace with your icon */}
  Request to Pay
</button>

    </div>
    <div className="proced-container">
  
    {proced.length > 0 ? (
        <table className="proced-table">
            <thead>
                <tr>
                    <th className="proced-th" >Date</th>
                    
                    <th className="proced-th">Amount</th>
                    <th className="proced-th">Return</th>
                    <th className="proced-th">Paid</th>
                    <th className="proced-th">Balance</th>
                    {/* Add other relevant headers if needed */}
                </tr>
            </thead>
            <tbody className="proced-tbody">
    {proced.map((proc, index) => (
        <tr key={index} className="proced-tr"> {/* Use index or a unique identifier */}
            <td className="proced-td" onClick={() => fetchDetailsByThseq(proc.TH_SEQ)}>{new Date(proc.CREATED_DAT).toLocaleDateString()} {/* Format the date */}</td> {/* Date */}
            
            <td className="proced-td">{proc.TOTAL_AMOUNT}</td> {/* Total Amount */}
           {/* Total Paid */}
            <td className="proced-td">{proc.TOTAL_RETURN}</td>
            <td className="proced-td">{proc.TOTAL_PAID}</td>
            <td className="proced-td">{proc.CREDIT_AMT}</td> {/* Credit Amount */} {/* Total Return */}
            {/* Add other relevant data cells if needed */}
        </tr>
    ))}
</tbody>

        </table>
    ) : (
        <p className="proced-no-data">No procedures found for this patient.</p>
    )}
    {details.length > 0 && (
                <div>
               
                    <table className="details-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th className="details-th" style={{ border: '1px solid black', padding: '8px' }}>Procedure Name</th>
                                <th className="details-th" style={{ border: '1px solid black', padding: '8px' }}>Price</th>
                                <th className="details-th" style={{ border: '1px solid black', padding: '8px' }}>QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((detail, index) => (
                                <tr key={index} className="details-tr">
                                    <td className="details-td" style={{ border: '1px solid black', padding: '8px' }}>{detail.ITM_FOREIGN_DESC}</td>
                                    <td className="details-td" style={{ border: '1px solid black', padding: '8px' }}>{detail.PRICE}</td>
                                    <td className="details-td" style={{ border: '1px solid black', padding: '8px' }}>{detail.QTY}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
</div>
      </div>
    )
  )}

        </div>
       
          <h3  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block',
    marginTop:'10px' // Make it wrap around content only
  }}  onClick={togglefollow}>followup:</h3>
        {(
          showfollow && (
            <div className='followup-group'>
            <label htmlFor='followup-complaint-input'>ChiefComplaint:</label>
            <input
              type='text'
              id='followup-complaint-input'
              name='followupComplaint'
              value={formData.followupComplaint}
              onChange={handleChange}
              placeholder='Enter complaint...'
              className='followup-input-field'
            />
  
            <label htmlFor='followup-investigation-results-input'>Post Operative Evaluation:</label>
            <input
              type='text'
              id='followup-investigation-results-input'
              name='followupInvestigationResults'
              value={formData.followupInvestigationResults}
              onChange={handleChange}
              placeholder='Enter investigation results...'
              className='followup-input-field'
            />
  
            <label htmlFor='followup-diagnosis-input'>Diagnosis:</label>
            <input
              type='text'
              id='followup-diagnosis-input'
              name='followupDiagnosis'
              value={formData.followupDiagnosis}
              onChange={handleChange}
              placeholder='Enter diagnosis...'
              className='followup-input-field'
            />
  
            <label htmlFor='followup-management-input'>Treatment Given:</label>
            <input
              type='text'
              id='followup-management-input'
              name='followupManagement'
              value={formData.followupManagement}
              onChange={handleChange}
              placeholder='Enter management...'
              className='followup-input-field'
            />
  
            <label htmlFor='followfollowup-plan-input'>Follow-Up Plan:</label> {/* Updated ID */}
            <input
              type='text'
              id='followfollowup-plan-input'  
              name='followfollowupPlan'  
              value={formData.followfollowupPlan}  
              onChange={handleChange}
              placeholder='Enter follow-up plan...'
              className='followup-input-field'
            />
          </div>
          )
        )}
        
        
        <div className='field-row'>
        <div >
  <h3 style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block',
    marginTop:'10px' // Make it wrap around content only
  }}   onClick={togglefollowuphistory} >Follow-up History:</h3>
  
  {/* Common div for table and visit details */}
{(
  showfollowuphistory && (
    <div className='history-container'>
    <table className="history-table">
      <thead>
        <tr>
          <th>Visit ID</th>
          <th>Created By</th>
          <th>Creation Date</th>
        </tr>
      </thead>
      <tbody>
  {followupHistory.map((item) => (
    <tr key={item[0]}> {/* Combine indices to create a unique key */}
      <td>
        <span onClick={() => handleVisitClick(item[1])}>
          {item[1]} {/* Visit ID at index 1 */}
        </span>
      </td>
      <td>{item[6]}</td> {/* Created By at index 6 */}
      <td>{new Date(item[7]).toLocaleDateString()}</td> {/* Creation Date at index 7 */}
    </tr>
  ))}
</tbody>


    </table>

    {/* Section for displaying additional information */}
    <div className='additional-info'>
      
      <div className='info-labels'>
        <label>Complaint: <span>{complaintH}</span></label>
        <label>Investigation Results: <span>{investigationResultsH}</span></label>
        <label>Diagnosis: <span>{diagnosisH}</span></label>
        <label>Management Plan: <span>{managementPlanH}</span></label>
        <label>Follow-up Plan: <span>{followupPlanH}</span></label>
      </div>
    </div>
  </div>
  )
)}
</div>


        </div>
        <div className='field-row'>
        <div >
  <h3  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
    padding: '10px', // Some padding for better spacing
    cursor: 'pointer', // Change cursor to pointer on hover
    borderRadius: '1px', // Optional: rounded corners
    width: '100%',
    display: 'inline-block',
    marginTop:'10px' // Make it wrap around content only
  }}    onClick={togglePrescriptionhistory}>presecription History:</h3>
  
  {/* Common div for table and visit details */}
{(
  showprescriptionhistory && (
    <div className='history-container'>
    <table className="history-table">
      <thead>
        <tr>
          <th>Visit ID</th>
          <th>Created By</th>
          <th>Creation Date</th>
        </tr>
      </thead>
      <tbody>
        {presh.map((item) => (
          <tr key={item[0]}>
            <td>
              <span onClick={() => handleVisitClickp(item[1])}>
                {item[1]} {/* Visit ID at index 1 */}
              </span>
            </td>
            <td>{item[3]}</td> {/* Created By at index 6 */}
            <td>{new Date(item[4]).toLocaleDateString()}</td> {/* Creation Date at index 7 */}
          </tr>
        ))}
      </tbody>
    </table>

    {/* Section for displaying additional information */}
    <div>
    {historyPrescriptions.length > 0 ? (
        <table className="prescription-table">
            <thead>
                <tr>
                    <th>Medicine</th>
                    <th>Dosage Quantity</th>
                    <th>Repeated In Day</th>
                    <th>Days Period</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                {historyPrescriptions.map((prescription, index) => (
                    <tr key={index}>
                        <td>{prescription.itemName || 'N/A'}</td>
                        <td>{prescription.dosageQuantity || 'N/A'}</td>
                        <td>{prescription.repeatedInDay || 'N/A'}</td>
                        <td>{prescription.daysPeriod || 'N/A'}</td>
                        <td>{prescription.notes || 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>No prescriptions found.</p>
    )}
</div>


  </div>
  )
)}
</div>
        </div>
    <button type='submit' className='submit-button'>
      {hasDetails ? 'Update' : 'Save'}
    </button>

        
      </form>
    </div>


    </main>
  );
  
  
};

export default Reads;
