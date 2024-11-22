import React, { useRef, useState, useEffect } from 'react';
import API from '../../Api';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Inject, ResourceDirective, ResourcesDirective } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent, TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import './Editor.css'
import { L10n } from '@syncfusion/ej2-base'; 
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import SimpleModal from './Simple';

L10n.load ({
  'en-US':{
    'schedule':{
      'saveButton':'',
      'cancelButton':'',
      'deleteButton':'',
      'newEvent':'EVENT'
    }
  }
})

const VisitReservationPage = () => {
  const[rr,setRr]=useState(false);
 

 
  const [save,setSave]=useState(true)
  

  const [eV,setEV]=useState([]);
 
 
  const handleEventUpdate = (newEventData) => {
  
  
    // Check for duplicates before updating state
    setEV((prevEvents) => {
      // Check if the event already exists
      const isDuplicate = prevEvents.some(event => event.Id === newEventData.Id);
      if (isDuplicate) {
        // Optionally handle duplicates (e.g., update existing event instead of adding a new one)
        return prevEvents;
      } else {
        // Add new event
      
        return [...prevEvents, newEventData];
      }
    });
  };

  const [editStatus, setEditStatus] = useState('');
 
  
  const scheduleRef = useRef(null);
  const [visitFromDate, setVisitFromDate] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]); // New state for filtered doctors
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  
 
  const [editFileNo, setEditFileNo] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editPatientName, setEditPatientName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editDate, setEditDate] = useState('');
 
  const[createby,setCreateby]=useState('');
  const [creatadda,setCreatadda]=useState('');
  const[editD,setEditD]=useState('');
  const [visitId, setVisitId] = useState(0);
  const [appointments, setAppointments] = useState([]);
  //1

 

   const [newd,setNewd]=useState(new Date())
  


    useEffect(() => {
     
        scheduleRef.current?.refresh();
     
     
}, [start, end]);

useEffect(() => {
 
  if (scheduleRef.current) {
    
  }
}, [eV]);
const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle case where dateString is empty or undefined

  const dateObject = new Date(dateString);
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');
  const year = dateObject.getFullYear();

  return `${month}/${day}/${year}`;
};
const formatDateM = (dateString) => {
  if (!dateString) return ''; // Handle case where dateString is empty or undefined

  const dateObject = new Date(dateString);
  const day = dateObject.getDate().toString().padStart(2, '0');
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = dateObject.getFullYear();

  return `${day}-${month}-${year}`;
};
//UC
  useEffect(() => {
     

    fetchAllDoctors();
    fetchSpecialities();
    fetchMaxVisitId();
   
    // fetchExpectedTime();
    
  }, []);

 
  //UC
  useEffect(()=>{
    handleEventFetch(newd)
  },[newd])
  const scheduledIdsRef = useRef(new Set());

const handleEventFetch = async (fromDate = visitFromDate) => {
 
  const formattedVisitFromDate = formatDateM(fromDate);

  try {
   
    const response = await API.get('/api/EventAppointments', {
     
      params: {
        visitFromDate: formattedVisitFromDate
      }
    });
   

   
    const appointments = response.data;
    setAppointments(appointments);
    console.log('event recived',appointments)
   
    if (Array.isArray(appointments) && appointments.length > 0) {
      appointments.forEach((appointment) => {
        const { Id, Subject, StartTime, EndTime, DoctorName,STATUSC } = appointment;
      //  alert(STATUSC)
        if (scheduledIdsRef.current.has(Id)) {
          setRr(true);
         
         
          return; 
        }

       
        scheduledIdsRef.current.add(Id);
        
        console.log('fetchedstarttimestarting from here ',StartTime)

        const startTimeParts = StartTime.split(':');
        const endTimeParts = EndTime.split(':');
        console.log('fetchedstarttimeparts',startTimeParts)
        const startHour = parseInt(startTimeParts[0], 10);
        console.log('fetchedstarthour',startHour)
        const startMinute = parseInt(startTimeParts[1], 10);
        console.log('fetchedstartmint',startMinute)
        const endHour = parseInt(endTimeParts[0], 10);
        const endMinute = parseInt(endTimeParts[1], 10);
       console.log(fromDate)
      //  alert(newd)
        const startDateF = new Date(fromDate);
        startDateF.setHours(startHour, startMinute, 0, 0);
        console.log(startDateF)

        const endDateF = new Date(fromDate);
        endDateF.setHours(endHour, endMinute, 0, 0);
        
        
        const eventData = {
          Id,
          Subject,
          StartTime: startDateF,
          EndTime: endDateF,
          IsAllDay: false,
          STATUSC,
          DoctorName,
         
        

        
        };
      

       
        if (scheduleRef.current) {
          scheduleRef.current.addEvent(eventData);
          // console.log('fetcheddata',eventData)
        }

        // Optionally handle event update logic
  
        handleEventUpdate(eventData);
        // handleUpdate(eventData);
       
      });
    } else {
      // console.log('No appointments found.');
    }

  } catch (error) {
    // console.log('Error fetching filtered appointments:', error);
  }
};

  
const handleDateSChange = (args) => {
  // console.log(new Date(args.value));
   // Check if date is correctly updating
 
  setNewd(new Date(args.value)); // Update selectedDate state when user selects a date
}; 
                                   

const fetchMaxVisitId = async () => {
  try {
    // Fetch the maximum visit ID from the API
    const response = await API.get('/api/visitId');
    const maxVisitId = response.data; // Assuming response.data directly gives you the max visit ID as a number

    // Increment the max visit ID by 1 to get the next visit ID
    const nextVisitId = maxVisitId + 1;

    // Optionally, you can convert nextVisitId to string if required by your application
    const nextVisitIdString = nextVisitId.toString();

    // Use nextVisitIdString wherever you need the incremented visit ID

    setVisitId(nextVisitIdString);
  } catch (error) {
    console.error('Error fetching max visit id:', error);
  }
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

  const fetchExpectedTime = async () => {
    try {
     
      const storedDoctorName = localStorage.getItem('DoctorName');
  
      if (!storedDoctorName) {
        console.error('DoctorName is not found in localStorage.');
        return;
      }
  

      const response = await API.get('/api/fetchExpectedTime', { params: { doctorName: storedDoctorName } });
      const { startTime, endTime } = response.data;
      // console.log('time fetched',response.data)
 
      if (typeof startTime === 'number' && typeof endTime === 'number') {
   
        const startHour = Math.floor(startTime); // Get the whole hour
        const startMinute = Math.round((startTime % 1) * 60); // Convert decimal part to minutes
        const endHour = Math.floor(endTime); // Get the whole hour
        const endMinute = Math.round((endTime % 1) * 60); // Convert decimal part to minutes
  
     
        setStart(new Date().setHours(startHour, startMinute, 0, 0));
        setEnd(new Date().setHours(endHour, endMinute, 0, 0));
        localStorage.setItem('START',new Date().setHours(startHour, startMinute, 0, 0))
        localStorage.setItem('END',new Date().setHours(endHour, endMinute, 0, 0))

      } else {
        console.error('Expected startTime and endTime to be numbers, but got:', { startTime, endTime });
      }
    } catch (error) {
      console.error('Error fetching expected time:', error);
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
 
  const handleDoctorSChange = async (event) => {
    const selectedDoctor = event.target.value;
    setSelectedDoctor(selectedDoctor);

    if (selectedDoctor === 'ALL') {
      // Show all doctors for the currently selected specialty
      setFilteredDoctors(doctors);
    } else {
      // Filter doctors based on selected doctor
      const filtered = doctors.filter(doc => doc.name === selectedDoctor);
      setFilteredDoctors(filtered);
    }

    // Optionally fetch expected time or other details for the selected doctor
    if (selectedDoctor !== 'ALL') {
      await fetchExpectedTime(selectedDoctor);
    }
  };

  
  const fetchEventDetails = async (eventId) => {
    console.log(eventId,'forom namesave')
    setSave(false)
    //from here getting result when cickeedit
    // alert('event')
    localStorage.setItem('eventId', eventId);
    // alert('called event details')
    // alert(eventId)
    
      const response = await API.get(`/api/getEventEdit/${eventId}`);
      // console.log('response from eventid ',response)
      return response.data;
   
  };
  const handleEditEvent = async (args) => {
    

    if (args && args.event && args.event.Id) {
      

      const eventId = args.event.Id;
        //  alert(eventId)

      try {

        const eventDetails = await fetchEventDetails(eventId);
        console.log(" events in handleedievents",eventDetails)
   console.log((eventDetails[1]),
   (eventDetails[2]),
   (eventDetails[3]),
   (eventDetails[4]),//visitdate
   (eventDetails[7]),
   (eventDetails[8]),
   (eventDetails[9]),
   (eventDetails[10]))
        if (eventDetails) {
          if(eventDetails[0])
          {setEditFileNo(eventDetails[0]);}
          if(eventDetails[1])
         {setEditPatientName(eventDetails[1])}
          if(eventDetails[2]){setEditPhoneNumber(eventDetails[2])}
          if(eventDetails[3]){setEditNotes(eventDetails[3])}
          setEditDate(eventDetails[4])//visitdate
          setEditD(eventDetails[7])
          setEditStatus(eventDetails[8])
          setCreateby(eventDetails[9])
          setCreatadda(eventDetails[10])
          

        } else {
          console.error(`Event details not found for eventId: ${eventId}`);
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    } else {
      console.error('Invalid event data:', args);
    }
  };
  const handleEditorClose = () => {
  
    scheduleRef.current.closeEditor();

   
  };
  
  const formatDateC = (dateString) => {
    // alert('date recived',dateString)
    if (!dateString) return ''; // Handle case where dateString is empty or undefined
  
    // Split the input date string into day, month, and year
    const [day, month, year] = dateString.split('-').map(Number);
  
    // Create a Date object using the parsed values
    const dateObject = new Date(year, month - 1, day); // Months are 0-indexed in JavaScript Date
  
    // Format the date into MM/DD/YYYY
    const formattedMonth = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const formattedDay = dateObject.getDate().toString().padStart(2, '0');
    const formattedYear = dateObject.getFullYear();
  
    return `${formattedMonth}/${formattedDay}/${formattedYear}`;
  };
  const EditorTemplate = ({ onClose, ...props }) => {
    //  useEffect(()=>{
    //    setEditFileNo('')
    //   setEditPatientName('')
    //   setEditPhoneNumber('')
    //    setEditNotes('')
    // setSave(true)
     
      
    // },[props])
  const[pp,setPp]=useState(true);
    const[us,setUs]=useState(false)
    const[ds,setDs]=useState(false)
    const [wd,setwd]=useState(formatDateC(editDate) || new Date())
    const handleDateChange = (args) => {
    
      // console.log(new Date(args.value));
       // Check if date is correctly updating
      setwd(new Date(args.value));
      setUs(true);
     
     
    }; 
    const [tedDoctor, setTedDoctor] = useState(props.DoctorName); 
    const handleDoctorChange = async (event) => {
      setTedDoctor(event.target.value)
   setDs(true)
       // Optionally fetch expected time or other details for the selected doctor
       if (tedDoctor !== 'ALL') {
         await fetchExpectedTime(tedDoctor);
       }
     };
    //WITHOUTFILE NO WE CANNOT UPDATE BECAUSE THE TABLE NEED COMLESURY FILENUMBER
    const [alShowModal, setAlShowModal] = useState(false);
    const [alModalMessage, setAlModalMessage] = useState('');
  
    localStorage.setItem('DoctorName', props.DoctorName);
    fetchExpectedTime(props.DoctorName)//24/09/2024

  const { StartTime, EndTime, IsAllDay, } = props;

    const [notes, setNotes] = useState(editNotes || ""); 
   
    const [startTime, setStartTime] = useState(props.StartTime );//neq
  
   
    const [endTime, setEndTime] = useState(props.EndTime );
    const [fileNumber, setFileNumber] = useState(editFileNo || ""); 
    const [qid,setQid]=useState("");
   
    const [name, setName] = useState(editPatientName || ""); 
    // alert(name)
    const [phone, setPhone] = useState(editPhoneNumber || ""); 
    const [createdDate, setCreatedDate] = useState('');
    const [status, setStatus] = useState(editStatus); 
   
    const [isManualEdit, setIsManualEdit] = useState(false);
   
   
  
  
    const diffMilliseconds = endTime - startTime;
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60)); 
  //UC
  useEffect(() => {
    const fetchDetailsByFileNumber = async () => {
      if (fileNumber && !isManualEdit) {
        try {
          // Fetching patient details by file number
          const response = await API.get(`/api/searchPatientDetails?searchTerm=${fileNumber}`);

          if (response.data) {
            setFileNumber(response.data.FILE_NO || '');
            setQid(response.data.CIT_ID || '');
            setName(response.data.NAME_E || '');
            setPhone(response.data.MOBILE || '');
          }

          // Check if the file number is already scheduled with the doctor
          const scheduleResponse = await API.get(`/api/checkScheduled?fileNumber=${fileNumber}&doctorName=${props.DoctorName}&newd=${newd}`);
          console.log(scheduleResponse,'response from api')
          if (scheduleResponse.data.isScheduled ) {
            setAlModalMessage(`You Can't Schedule it again.`);
            setAlShowModal(true); // Show the modal
          }
          
        } catch (error) {
          console.error('Error fetching user details or schedule:', error);
        }
      }
    };

    fetchDetailsByFileNumber();
  }, [fileNumber, isManualEdit, props.DoctorName, newd]);
  
    useEffect(() => {
      if (qid && !isManualEdit) {
        const fetchDetailsByi = async () => {
          try {
            const response = await API.get(`/api/searchPatientDetailsi?searchTerm=${qid}`);
            // console.log(response,'from api of serach')
            if (response.data) {
              setFileNumber(response.data.FILE_NO || '');
              setQid(response.data.CIT_ID || '');
              setName(response.data.NAME_E || ''); // Update name
              setPhone(response.data.MOBILE || ''); // Update phone
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        };
        fetchDetailsByi();
      } else if (!qid) {
        // Clear name and phone if no file number is provided
        // setQid('');
        // setName('');
        // setPhone('');
        // setFileNumber('');
      }
    }, [qid, isManualEdit]);

  
    
   
    const handleFileNumberChange = (e) => {
      setFileNumber(e.target.value);
      setIsManualEdit(false); // Reset manual edit flag
    };
    const handleQIDChange=(e)=>{
      setQid(e.target.value);
      setIsManualEdit(false)
    }
  
    const handleNameChange = (e) => {
      setName(e.target.value);
      setIsManualEdit(false); // Set flag to true when manually editing
    };
  
    const handlePhoneChange = (e) => {
      setPhone(e.target.value);
      setIsManualEdit(false); // Set flag to true when manually editing
    };
   
    
   
   
    const handleSave = async () => {

  
      
      const formattedDate = formatDateM(newd); 
   
      
      const locationName = localStorage.getItem('companyNAME_E') || 'Default Location';
  const createdBy = localStorage.getItem('username') || 'Default User';
  
  
 
      const maxapp = await API.get('/api/app');
      const maxId = maxapp.data.maxAPP;
   
      const eventData = {
        APPOINTMENT_NO:maxId+1,
        LOCATION_NAME_E: locationName,
        CREATED_BY:createdBy,
        CREATED_DATE:createdDate,
        NOTES: notes,
        STATUS: status,
        TIME_FROM: startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        
        TIME_TO: endTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        FILE_NO: fileNumber,
        PATIENT_FIRST_NAME: name,
        PHONE: phone,
        SCHEDULE_DATE: formattedDate,
        DOCTOR_NAME: tedDoctor, 
      
      };
  
      try {
   
        const response = await API.post('/api/saveEvent', eventData); // Adjust API endpoint
       
        

        const responseE = await API.get(`/api/getEvent/${eventData.APPOINTMENT_NO}`); // Adjust API endpoint

const startTimeParts = eventData.TIME_FROM.split(':');//cr//cr

        const endTimeParts = eventData.TIME_TO.split(':');
        const startHour = parseInt(startTimeParts[0], 10);//cr
        
     
        const startMinute = parseInt(startTimeParts[1], 10);//cr
        
       
        const endHour = parseInt(endTimeParts[0], 10);
        const endMinute = parseInt(endTimeParts[1], 10);
      
        const [day, month, year] = eventData.SCHEDULE_DATE.split('-').map(num => parseInt(num, 10));
        const startDateF = new Date(year, month - 1, day);//CR
       
        startDateF.setHours(startHour, startMinute, 0, 0);
        console.log('savefrom',startDateF,'fromsave')
        
        const endDateF = new Date(year, month - 1, day);
        endDateF.setHours(endHour, endMinute, 0, 0);

        
        const eventDataToAdd = {
          Id: eventData.APPOINTMENT_NO,
          Subject: eventData.PATIENT_FIRST_NAME,
          StartTime: startDateF,
              EndTime: endDateF,
              STATUSC:eventData.STATUS,
         
          IsAllDay: false,
          DoctorName: eventData.DOCTOR_NAME,
      
          
         

        
        };
      
    
        
        if (scheduleRef.current) {
      
          scheduleRef.current.addEvent(eventDataToAdd);

        } else {
        //  alert('Schedule reference is null.');
        }
   
        setFileNumber('');
        setName('');
        setPhone('');
        setNotes('');
     
      
        onClose();
        setSave(false);
        
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };
  
  
  const fetchMaxQueueNumber = async (visitDate, doctorId) => {
      try {

        // alert(`Fetching max queue number with: VISIT_DATE=${formatDate(visitDate)}, DOCTOR_ID=${doctorId}`);
          const response = await API.get('/api/getMaxQueueNumber', {
              params: {
                  VISIT_DATE: formatDateC(visitDate),
                  DOCTOR_ID: doctorId
              }
          });
          return response.data.maxQueueNumber || null;
      } catch (error) {
          console.error('Error fetching max queue number:', error);
          throw error;
      }
  };
const getNextQueueNumber = (currentQueueNumber, startingLetter) => {
    const match = currentQueueNumber.match(/^([A-Z]+)(\d+)$/);
    if (!match) {
        throw new Error('Invalid queue number format');
    }

    const [_, letterPart, numberPart] = match;
    let newNumber = parseInt(numberPart, 10) + 1;
    let newLetterPart = letterPart;

    if (newNumber > 99) {
        newNumber = 1;
        newLetterPart = incrementLetterPart(letterPart);
    }

    return `${newLetterPart}${newNumber.toString().padStart(2, '0')}`;
};

const incrementLetterPart = (letters) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let newLetters = '';
    let carry = true;

    for (let i = letters.length - 1; i >= 0; i--) {
        if (carry) {
            const index = alphabet.indexOf(letters[i]);
            if (index === alphabet.length - 1) {
                newLetters = 'A' + newLetters;
            } else {
                newLetters = alphabet[index + 1] + newLetters;
                carry = false;
            }
        } else {
            newLetters = letters[i] + newLetters;
        }
    }

    if (carry) {
        newLetters = 'A' + newLetters;
    }

    return newLetters;
};

const determineStartingLetter = (doctorId) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // Create a hash-like index for the doctorId
  let hash = 0;
  for (let i = 0; i < doctorId.length; i++) {
      hash = (hash << 5) - hash + doctorId.charCodeAt(i);
  }
  // Use modulus to ensure the index is within the alphabet range
  const index = Math.abs(hash) % alphabet.length;
  return alphabet[index];
};

const handleUpdate = async () => {
  
  // alert(props.Id)
  // alert('only for confirmed')
// alert(editDate)
  // alert(visitId)
  // alert(wd)

  setPp(true)
 
  // alert(props.STATUSC)
  // console.log(props)
  
  
  // Extract hours and minutes from startTime
  const visitHour = startTime.getHours();
  const visitMinutes = startTime.getMinutes();

  const formatDateToDDMMYYYY = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return ''; // Handle invalid date
    
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based)
    const year = date.getFullYear(); // Get full year
  
    return `${day}-${month}-${year}`; // Return in DD-MM-YYYY format
  };
  
  // Usage example in your handleUpdate function
  const visitD = us ? formatDateToDDMMYYYY(wd) : editDate;
  const formattedD = formatDateC(visitD);


  // Retrieve values from localStorage
  const locationName = localStorage.getItem('companyNAME_E') || 'Default Location';
  const createdBy = localStorage.getItem('username') || 'Default User';
  const cm_no = localStorage.getItem('COM_NO');

  try {
    // Fetch the maximum queue number for the given date and doctor
    const maxQueueNumber = await fetchMaxQueueNumber(visitD, ds ? tedDoctor : editD);

    // Determine the starting letter for this doctor
    const startingLetter = determineStartingLetter(editD);

    // Determine the next queue number
    const queueNumber = maxQueueNumber 
        ? getNextQueueNumber(maxQueueNumber, startingLetter) 
        : `${startingLetter}01`;

    // Prepare the event data with the new queue number
    const eventData = {
        PAT_ID: editFileNo,
        VISIT_DATE: formattedD,
        COM_NO: cm_no,
        CREATED_BY: createby,
        UPDATED_BY: createdBy,
        CREATIOIN_DATE: formatDate(creatadda),
        STATUS: status,
        QUEUE_NUMBER: queueNumber,
        VISIT_HOUR: visitHour,
        VISIT_MINUTES: visitMinutes,
        EXPECTED_TIME: diffMinutes,
        VISIT_ID: visitId,
        DOCTOR_ID: ds ? tedDoctor : editD,
        CANCELED: 'N',
        Aid:props.Id,
        S:startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        E:endTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

    };
    // alert(eventData.VISIT_DATE)
    // Send the updated event data
    const response = await API.post(`/api/updateEvent`, eventData);
    console.log('for doctor for gggggggggggggggggggggjdgukhydkjhsalkjhi',eventData.DOCTOR_ID)
    //updateiisue
    const startDate = new Date(startTime); // Assuming props.StartTime is a valid Date string
    const endDate = new Date(endTime); // Assuming props.EndTime is a valid Date string

    // Format times
    const startTimeFormatted = formatTime(startDate);//cr
    const endTimeFormatted = formatTime(endDate);

    
    const startTimeParts = startTimeFormatted.split(':');//cr
    
        const endTimeParts = endTimeFormatted.split(':');
        const startHour = parseInt(startTimeParts[0], 10);//cr
      
        
        const startMinute = parseInt(startTimeParts[1], 10);//cr
        
        const endHour = parseInt(endTimeParts[0], 10);
        const endMinute = parseInt(endTimeParts[1], 10);
       
        const startDateF = 
        new Date(wd);//CR
        startDateF.setHours(startHour, startMinute, 0, 0);//CR
      //  alert(startDateF)
        const endDateF = 
        new Date(wd);
        endDateF.setHours(endHour, endMinute, 0, 0);
        // console.log('starttimeupdate',endDateF)
       //update issue
        

    // Create event data to add to the scheduler
    const eventDataToAdd = {
      Id: props.Id,
      Subject: props.Subject,
      StartTime: startDateF, // Use Date objects for scheduler
      EndTime: endDateF,
      STATUSC:eventData.STATUS,
      IsAllDay: props.IsAllDay,
      DoctorName:eventData.DOCTOR_ID,
    };

    // console.log('Event updateData to Add:', eventDataToAdd);

    // Update the scheduler
    if (scheduleRef.current) {
     
      scheduleRef.current.deleteEvent(props.Id); 
      // Remove old event
      scheduleRef.current.addEvent(eventDataToAdd); 
      
      // Add updated event
    } else {
      alert('Schedule reference is null.');
    }
    
    onClose();
    
    // Clear input fields
    
    // alert('Event updated successfully in scheduler.');

  } catch (error) {
    console.error('Error updating event:', error);
  }
};

// Function to format Date objects to HH:mm
function formatTime(date) {
  if (!(date instanceof Date)) {
    throw new Error('Input must be a Date object.');
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

 

    
    const handleDeleteEvent = async () => {
      
      // Retrieve the event ID from localStorage
      const storedEventId = localStorage.getItem('eventId');
  
      if (!storedEventId) {
        console.error('No event ID found in localStorage.');
        return;
      }
  
      try {
        // Perform API call to delete the event from the backend
        await API.delete(`/api/deleteEvent/${props.Id}`);
        setFileNumber('');
        setName('');
        setPhone('');
        setNotes('');
        // console.log('Event deleted successfully from backend');
  
        // Delete the event from the Scheduler
        if (scheduleRef.current) {
          scheduleRef.current.deleteEvent(props.Id);
          setFileNumber('');
        setName('');
        setPhone('');
        setNotes('');
        
          // console.log('Event deleted successfully from Scheduler');
        } else {
          console.error('Scheduler reference is null.');
        }
        localStorage.removeItem('eventId');
         // Assuming setNotes is a state setter for the notes

    // Close the editor - replace `closeEditor` with your actual function or state setter
    onClose();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };

    
    const editorStyle = {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: 'auto',
    };
  
    const labelStyle = {
      fontWeight: 'bold',
      marginTop: '10px',
      display: 'block',
    };
  
    const textareaStyle = {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      resize: 'none',
      marginTop: '5px',
    };
  
    const inputStyle = {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginTop: '5px',
    };
  
    const buttonStyle = {
      marginTop: '15px',
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
    };
        
    const isDisabled = (status === 'R' && rr && pp);
    const alHandleCloseModal = () => {
      setAlShowModal(false);
    };
    return ( 
      <div style={editorStyle} >
        <label style={labelStyle}>File Number:</label>
        <input 
        disabled={isDisabled}
          type="text"
          value={fileNumber}
          onChange={handleFileNumberChange}
          style={inputStyle}
          placeholder="Enter File Number "
        />
        <label style={labelStyle}>QID:</label>
        <input 
        disabled={isDisabled}
          type="text"
          value={qid}
          onChange={handleQIDChange}
          style={inputStyle}
          placeholder="OPTIONAL "
        />
  
        <label style={labelStyle}>Name:</label>
        <input 
        disabled={isDisabled}
          type="text"
          value={name}
          onChange={handleNameChange}
          style={inputStyle}
          
        />
  
        <label style={labelStyle}>Phone:</label>
        <input 
        disabled={isDisabled}
          type="number"
          value={phone}
          onChange={handlePhoneChange}
          style={inputStyle}
        
        />

        
  
        <label style={labelStyle}>Notes:</label>
        <textarea 
        disabled={isDisabled}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={textareaStyle}
          rows="4"
          placeholder="Add your notes here..."
        />
<div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
<label style={labelStyle}>Date</label>
<DatePickerComponent 

  format="MM-dd-yyyy"
  value={wd}
  onChange={handleDateChange}
  placeholder="Select a date"
  style={inputStyle}
  disabled={isDisabled}
/>
        <label style={labelStyle}>Start Time:</label>
        <TimePickerComponent 
        disabled={isDisabled}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          
          className='e-field'
          data-name='StartTime'
          style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          
        />
  
        <label style={labelStyle}>End Time:</label>
        <TimePickerComponent 
         disabled={isDisabled}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='e-field'
          data-name='EndTime'
          style={{ width: '100%', padding: '10px', marginTop: '5px' }}
         
        />
</div>
   

<div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
<label style={labelStyle}>Doctor</label>
              <select style={inputStyle}  value={tedDoctor} onChange={handleDoctorChange} disabled={isDisabled}>
                { filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
        <label style={labelStyle}>Status:</label>
        <select
          value={status} 
        
          onChange={(e) => {
            setPp(false); // Set pp to false
            setStatus(e.target.value); // Update status with the selected value
          }}
          style={inputStyle}
          className='e-field'
          data-name='Status'
        
          disabled={isDisabled}
        >
          
          <option>Select Below</option>
          <option value="N">New</option>
          <option value="B">Booked</option>
          <option value="R">Confirmed</option>
          <option value="E">Revisit</option>
          <option value="W">Waiting</option>
          <option value="O">NoShow</option>
          <option value="C">VisitClosed</option>
        </select>
</div>
{!isDisabled && save && (
                  <button onClick={handleSave}  disabled={isDisabled} style={buttonStyle}>Save</button>
)}

        {!isDisabled && (
          <button onClick={handleUpdate}  disabled={isDisabled} style={buttonStyle}>Update</button>
)}

        {!isDisabled && (
  <ButtonComponent 
    id='delete'
    title='Delete'
    onClick={handleDeleteEvent}
  >
    Delete Event
  </ButtonComponent>
)}
        {/* <button onClick={handleDelete} style={buttonStyle}> Delete</button> */}
        
        {alShowModal && <SimpleModal alMessage={alModalMessage} alOnClose={alHandleCloseModal} />}
      </div>
    );
  };

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
    backgroundColor: 'purple',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle4 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'darkblue',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle5 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'yellow',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle6 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'green',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  
  const checkboxStyle7 = {
    appearance: 'none', 
    // Ensure browser default styles are overridden
    width: '20px',
    height: '20px',
    backgroundColor: 'orange',
    
    cursor: 'pointer', // Ensure cursor changes to pointer on hover
  }; 
  //1
  const handleActionBegin =async (args) => {
    // alert('calledactionbegin')
    const startStr = localStorage.getItem('START');
    const endStr = localStorage.getItem('END');
  
    if (!startStr || !endStr) {
      console.error('START and END times are not found in localStorage.');
      return;
    }
    
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange') {
      const eventStartTime = new Date(args.data.StartTime).getTime();
      const eventEndTime = new Date(args.data.EndTime).getTime();
         
      if (eventStartTime < startStr|| eventEndTime > endStr) {

        args.cancel = true;
        // alert('The event is outside the allowed time range.');
      }
    }
    if (args.requestType === 'eventDelete') {
      // alert('deletecalled')
      const eventId = args.data[0].Id; // Assuming the ID of the event is stored in `Id`
      
      try {
        // Make an API call to delete the event from the backend
        await API.delete(`/api/deleteEvent/${eventId}`);
        // console.log('Event deleted successfully from backend');
      } catch (error) {
        console.error('Error deleting event from backend:', error);
        // Revert the deletion in the scheduler if the API call fails
        args.cancel = true;
      }
    }
  };
 //1
 const handleCellClick = (args) => {
  
  const startStr = localStorage.getItem('START');
  const endStr = localStorage.getItem('END');

  if (!startStr || !endStr) {
    console.error('START and END times are not found in localStorage.');
    return;
  }
 
  const cellStartTime = new Date(args.startTime).getTime();
  const cellEndTime = new Date(args.endTime).getTime();

  // Get the element that was clicked
  const cellElement = args.element;

  // Check if the cell is within the allowed time range
  if (cellStartTime < startStr || cellEndTime > endStr) {
    // Change cursor to indicate the time slot is not allowed
    cellElement.style.cursor = 'not-allowed';
    // Optionally, you can add a class for additional styling
    cellElement.classList.add('disabled-time-slot');
    // Cancel the click action
    args.cancel = true;
  } else {
    // Reset cursor and remove the disabled class if within the range
    cellElement.style.cursor = 'pointer';
    cellElement.classList.remove('disabled-time-slot');
  }
};



 const eventTemplate = (props) => {

  const getCssClassBasedOnStatus = (status) => {
    switch (status) {
      case 'N': return 'new-status';
      case 'E': return 'revisit-status';
      case 'B': return 'booked-status';
      case 'R': return 'confirmed-status';
      case 'W': return 'waiting-status';
      case 'C': return 'visit-closed-status';
      case 'O': return 'no-show-status';
      default: return '';
    }
  };

  const eventClass = getCssClassBasedOnStatus(props.STATUSC);

  const startTime = props.StartTime.getHours() * 60 + props.StartTime.getMinutes();
  const endTime = props.EndTime.getHours() * 60 + props.EndTime.getMinutes();
  const duration = endTime - startTime;
  const eventHeight = `${duration * 4}px`; 

  return (
    <div className={eventClass} style={{ height: eventHeight }}>
      <div><strong>Subject:</strong> {props.Subject}</div>
      <div><strong>Doctor:</strong> {props.DoctorName}</div>
      <div><strong>Start Time:</strong> {props.StartTime.toLocaleTimeString()}</div>
      <div><strong>End Time:</strong> {props.EndTime.toLocaleTimeString()}</div>
    </div>
  );
};

  return (
    <main className='main-container'>
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <div className='visit-reservation'>
                
              <h1>Book Appointment</h1>
              <div style={{    borderRadius: '5px', 
   
    backgroundColor: '#f0f0f0',display:'flex'}}>
               
               <div style={{display:'flex'}}>
               <input type="checkbox" style={checkboxStyle1} ></input> <label style={{marginRight:'35px',marginTop:'5px'}}>NEW</label>
               </div>
               
               
               <input type="checkbox" style={checkboxStyle2} ></input> <label style={{marginRight:'35px',marginTop:'5px'}}>REVISIT</label>
               
              
              <input type="checkbox" style={checkboxStyle3} ></input>  <label style={{marginRight:'35px',marginTop:'5px'}}>BOOKED</label>
              
              
               <input type="checkbox" style={checkboxStyle4} ></input>   <label style={{marginRight:'35px',marginTop:'5px'}}>CONFIRMED</label>
               
              
              <input type="checkbox" style={checkboxStyle5} ></input> <label style={{marginRight:'35px',marginTop:'5px'}}>WAITING</label>
              
              
              <input type="checkbox" style={checkboxStyle6} ></input> <label style={{marginRight:'35px',marginTop:'5px'}}>VISITCLOSED</label>
             
              
              <input type="checkbox" style={checkboxStyle7} ></input>  <label style={{marginRight:'35px',marginTop:'5px'}}>NO SHOW</label>
              
              </div>
              <div  style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex',marginRight:'10px'}} >
              <label style={{ display: 'flex',marginRight:'5px',marginTop:'10px'}}>Clinic</label>
              <select style={{width:'200px'}} value={selectedSpecialty} onChange={handleSpecialtyChange}> 
                  <option value="ALL">ALL</option>
        {specialities.map((specialty, index) => (
          <option key={index} value={specialty}>{specialty}</option>
        ))}
              </select>
              </div>
              <label style={{ display: 'flex',marginRight:'5px',marginTop:'10px'}} >Doctor</label>
              <select value={selectedDoctor}  style={{marginRight:'10px'}}onChange={handleDoctorSChange}>
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

<div style={{ display: 'flex'}} >
<label style={{ display: 'flex',marginRight:'5px',marginTop:'10px'}} >ShowON</label>
<DatePickerComponent
  format="MM-dd-yyyy"
  value={newd}
  onChange={handleDateSChange}
  placeholder="Select a date"
  style={{width:'200px'}}
/>
</div>
</div>

              <div className='scheduler-modal' style={{ width: '980px',maxHeight: '500px' }}>
    
              <ScheduleComponent 
                   key={filteredDoctors}
                  ref={scheduleRef}  selectedDate={newd}  
                   group={{
                     resources: ['DoctorName'],
                     allowGroupEdit: true,
                     
                   }} 
                   eventSettings={{ dataSource: eV,template: eventTemplate   }}
                   eventClick={(args) => handleEditEvent(args)}
                   editorTemplate={(props) => <EditorTemplate   {...props}   onClose={handleEditorClose}/>}
                
                   //1
                   actionBegin={handleActionBegin}
                   //1
           cellClick={handleCellClick}
                  
                   >
                  <Inject services={[Day]} />
                   <ViewsDirective>
                     <ViewDirective option='Day' startHour='07:00'
                      endHour='23:00'
                       timeScale={{ interval: 15, slotCount: 1 }} />
                   </ViewsDirective>
 
                   <ResourcesDirective>
                   <ResourceDirective
           field='DoctorName' // Field name in your appointment data structure
           title='Doctor Name' // Display name for the resource
           name='DoctorName' // Internal name for the resource
           dataSource={filteredDoctors.map(doctor => ({
             text: doctor.name,
             id: doctor.name, // Use the doctor's name as the unique ID
           }))}
           textField='text' // Field in dataSource representing the doctor's name
           idField='id' // Field in dataSource representing the doctor's ID (which is also 'name')
         />
  
                   </ResourcesDirective>
 
                   <Inject services={[Day]} />
                 </ScheduleComponent>
 
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VisitReservationPage;








