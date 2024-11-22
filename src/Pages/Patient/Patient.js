


import React, { useState, useEffect } from 'react';
import './Patient.css'; // External CSS file for styling
import API from '../../Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReportGeneratorPage from './Report';
import BarcodeGeneratorPage from './Barcode';
import { useLocation } from 'react-router-dom';


const PatientInfo = () => {
    const username = localStorage.getItem('username');
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const patId = query.get('patId'); // Retrieve patId from query parameters
    const [right,setRight]=useState(false)

    const initialform = {
   
        USRINFO_USERNAME: '',
        ACTIVE: 'N',
        ADDRESS: '',
        CIT_ID: '',
        MOBILE: '',
        CUST_ID: '',
        NAME_E: '',
        DOB: '',
        NATIONALITY: '',
        CITY_ID: '',//NOW
        INSURANCE: '',
        EMAIL: '',
        INSURANCE_EXPIRY: '',
        WORK_TYPE: '',
        PHONE: '',
        CUST_CODE: '',
        HASBAND_NAME: '',
        HASBAND_ID: '',
        HASBAND_PHONE: '',
        GENDER: '',
        SMOKER: '',
        BLOOD_TYPE: '',
        MARITAL_STATUS: '',
        VIP: 'N',
    };

    const [formData, setFormData] = useState(initialform);
    const [showr,setShowr]=useState(false)
    const [age, setAge] = useState('');
    //for search 
    const [searchInput, setSearchInput] = useState('');
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [custIdForReport, setCustIdForReport] = useState(null);
    const [custIdForSecondReport, setCustIdForSecondReport] = useState(null);
    const [showSecondReport, setShowSecondReport] = useState(false);
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };
    const handleSearch = async () => {
        try {
            const searchQuery = patId ? patId : searchInput;
            const response = await API.get(`/api/searchPatient?q=${searchQuery}`);
    
            // Check if there are results returned
            if (response.data.length > 0) {
                const firstResult = response.data[0];
                console.log(firstResult)
    
                // Update state with the first search result
                setSearchedPatient(firstResult); // Store searched patient details
                setFormData(firstResult); 
                // setCustIdForReport(firstResult.CUST_ID);
                localStorage.setItem('SCUST_ID', firstResult.CUST_ID);// Update form fields with searched patient details
            } else {
                // Handle case where no results are found
                console.log('No matching patient found.');
    
                // Clear searched patient details and reset form fields to initial state
                setSearchedPatient(null);
                setFormData(initialform);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            // Handle error if needed (e.g., show error message to user)
        }
        setRight(true)
    };
    if (patId) {
        handleSearch(patId);
    }







    const handleCancel = () => {
        setSearchInput('');
        setSearchedPatient(null);
        setFormData(prevFormData => ({
            ...prevFormData,
            ...initialform,
            USRINFO_USERNAME:username // retain previous value
        }));
        // setFormData(initialform);
        localStorage.removeItem('SCUST_ID');
    };
    // const [custIdForReport, setCustIdForReport] = useState(null);
    


  

   
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked ? 'Y' : 'N',
            }));
        } else if (name === 'DOB') {
            // Format DOB and calculate age
            const formattedDate = formatDateString(value);
            setFormData(prevState => ({
                ...prevState,
                DOB: formattedDate,
            }));
            calculateAge(formattedDate);
        } else if (name === 'INSURANCE_EXPIRY') {
            // Format INSURANCE_EXPIRY if necessary
            const formattedDate = formatDateString(value);
            setFormData(prevState => ({
                ...prevState,
                INSURANCE_EXPIRY: formattedDate,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    
        // Additional logic for specific fields
        if (name === 'CUST_ID') {
            const custIdWithoutLeadingZero = value.replace(/^0+/, ''); // Remove leading zeros
            setFormData(prevState => ({
                ...prevState,
                CUST_CODE: custIdWithoutLeadingZero,
            }));
        }
    };
    
    const formatDateString = (dateString) => {
        // Format date string to MM/DD/YYYY
        const cleaned = dateString.replace(/[^\d]/g, ''); // Remove non-numeric characters
        const match = cleaned.match(/^(\d{1,2})(\d{1,2})(\d{4})$/);
    
        if (match) {
            return `${match[1]}/${match[2]}/${match[3]}`;
        } else {
            return dateString; // Return as is if not fully matched
        }
    };
    
    const calculateAge = (dob) => {
        if (!dob) {
            setAge('');
            return;
        }
    
        const today = new Date();
        const birthDate = new Date(dob);
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
    
        setAge(calculatedAge);
    };
    

   
    const handleSubmit = async (e) => {
        setShowr(true)
        // alert('save called')
        e.preventDefault();
        const COM_NO = localStorage.getItem('COM_NO');
        
        // Add CUSTTYP_ID: 5 to formData
        const formDataWithCustTypeID = {
            ...formData,
            CUSTTYP_ID: 5,
            COMMISSION: 'Y',
            COM_NO: COM_NO
         
            // //OTHERFEILDS
            // NAME_A:'',
            // FAX:'',
            // DTYP_CODE:'',
            // COM_NO:'',
            // ACC_NO:'',
            // POBOX:'',
            // OLD_CUST_ID:'',
            // SPONSOR_ID:'',
            // LENGTH:'',
            // INSU_CODE:'',
            // CR_NUMBER:'',
            // BALADIYA_LICENSE:'',
            // LOCATION:''




        };
        console.log(formDataWithCustTypeID)
        const fieldCount = Object.keys(formDataWithCustTypeID).length;
        console.log('Number of fields in formDataWithCustTypeID:', fieldCount);
        try {
            // Code to send formData to backend API
            const response = await API.post('/api/savePatientInfo', formDataWithCustTypeID);
            console.log('Form Data sent:', formDataWithCustTypeID);
            console.log('Response:', response.data);
            // Reset form or showPrintPreview success message
        } catch (error) {
            console.error('Error sending form data:', error);
            // Handle error if needed
        }
    };

    // Fetch data functions
    const fetchBankNames = async () => {
        try {
            const response = await API.get('/api/bankcodes');
            // Filter banks where SHORT_NAME is 'INS'
            const filteredBanks = response.data.filter(bank => bank.SHORT_NAME === 'INS');
            setBankOptions(filteredBanks);
        } catch (error) {
            console.error('Error fetching bank names:', error);
            // Handle error if needed
        }
    };

    const fetchCities = async () => {
        try {
            const response = await API.get('/api/citycodes');
            console.log(response.data)
            setCityOptions(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
            // Handle error if needed
        }
    };

    const fetchNationalities = async () => {
        try {
            const response = await API.get('/api/nationalities');
            setNationalityOptions(response.data);
        } catch (error) {
            console.error('Error fetching nationalities:', error);
            // Handle error if needed
        }
    };
    const handleNewPatientClick = async () => {
        try {
            // Fetch max customer ID from API
            const response = await API.get('/api/maxCustomerId');
            const { maxCustId } = response.data;

            // Convert maxCustId to number and add 1
            const nextCustId = parseInt(maxCustId, 10) + 1;

            // Format nextCustId to have leading zeros if necessary
            const formattedId = ('000000' + nextCustId).slice(-6);

            // Update the formData with the formattedCustId
            setFormData({
                ...initialform,
                CUST_ID: formattedId,
                CUST_CODE: nextCustId.toString(),
                USRINFO_USERNAME:username
            });
            // setCustIdForReport(formattedId);
            localStorage.setItem('SCUST_ID', formattedId);
            localStorage.setItem('CUST_code', nextCustId.toString());
        } catch (error) {
            console.error('Error fetching maxCustId:', error);
            // Handle error fetching maxCustId
        }
    };




    const fetchUsername = () => {
        const username = localStorage.getItem('username');
        if (username) {
            setFormData(prevState => ({
                ...prevState,
                USRINFO_USERNAME: username
            }));
        }
    };

    useEffect(() => {
        // Retrieve login date from local storage
        const loginDate = localStorage.getItem('loginDate');
        if (loginDate) {
            setFormData(prevState => ({
                ...prevState,
                CREATED_DAT: loginDate
            }));
        }

        fetchUsername();
        fetchBankNames();
        fetchCities();
        fetchNationalities();
        // fetchMaxCustomerId();
    }, []);
    useEffect(() => {
        calculateAge(formData.DOB);
    }, [formData.DOB]);
    const [bankOptions, setBankOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [nationalityOptions, setNationalityOptions] = useState([]);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const handlePrint = () => {
        setShowPrintPreview(true);
        setCustIdForReport(formData.CUST_ID );

        setCustIdForSecondReport(formData.CUST_ID);
        setShowSecondReport(true);
      };

      const handleClosePrintPreview = () => {
        setShowPrintPreview(false);
    };
    const handleCloseSecondReport = () => {
        setShowSecondReport(false);
    };

    return (
       
         <div className='main-container'>
            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <div className='patient'>
                            <div className="patient-info-container">
                                <h2 className='section-header'  style={{
    backgroundColor: '#d3d3d3', // Light yellow background color
 // Optional: rounded corners
    width: '100%',
    display: 'inline-block', // Make it wrap around content only
  }}>Patient Information</h2>
                                <div style={{ display: 'flex' }}>
                                    <div>
                                        <label>Reg.Date:</label>
                                        <input type="text" value={formData.CREATED_DAT} readOnly />
                                    </div>
                                    <div>
                                        <label>Created By:</label>
                                        <input type="text" value={formData.USRINFO_USERNAME} readOnly />
                                    </div>
                                    <div>
                                    <label>Active:</label>
                                            <input
                                                type="checkbox"
                                                name="ACTIVE"
                                                checked={formData.ACTIVE === 'Y'}
                                                onChange={handleChange}
                                            />
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    {/* Search Input */}
                                    <div className="search-input" style={{ marginRight: '700px',display:'flex' }}>
                                     <div style={{ marginRight: '200px'}}>
          
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchInput}
                                            style={{width:'880%'}}
                                            onChange={handleSearchInputChange}
                                        />
                                                                   <FontAwesomeIcon icon={faSearch} className="search-icon"  style={{
                    position: 'absolute',
                    right: '-30px',
                    top: '30%',
                    transform: 'translateY(-50%)',
                    color: '#888',
                    pointerEvents: 'none' // Ensures the icon does not interfere with the input
                }}/>
                                     </div>
                                     <div>
                                     <button onClick={handleSearch}  style={{
                    padding: '10px 20px',        // Padding inside the button
                    border: '1px solid #ccc',    // Border around the button
                    borderRadius: '4px',         // Rounded corners
                    backgroundColor: '#007bff',  // Background color
                    color: 'white',              // Text color
                    cursor: 'pointer',           // Pointer cursor on hover
                    fontSize: '16px',            // Font size
                    fontWeight: 'bold',          // Font weight
                    outline: 'none',             // Remove default outline
                    whiteSpace: 'nowrap'         // Prevent text wrapping
                }}>Search</button>
                                     
                                     </div>
                                       <div>
                                       <button onClick={handleCancel}  style={{
                    padding: '10px 20px',        // Padding inside the button
                    border: '1px solid #ccc',    // Border around the button
                    borderRadius: '4px',         // Rounded corners
                    backgroundColor: '#6c757d',  // Background color
                    color: 'white',              // Text color
                    cursor: 'pointer',           // Pointer cursor on hover
                    fontSize: '16px',            // Font size
                    fontWeight: 'bold',          // Font weight
                    outline: 'none',             // Remove default outline
                    whiteSpace: 'nowrap'         // Prevent text wrapping
                }}>Cancel</button>
                                       </div>
                                        
                                    </div>
                                    
                                    <div className="new-patient-button">
                                        <button onClick={handleNewPatientClick}  style={{
                   
                
                    borderRadius: '2px',         // Rounded corners
                    backgroundColor: '#007bff',  // Background color
                          // Prevent text wrapping
                }}>Add</button>
                                    </div>
                                </div>
                                {/* Main Patient Information Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-section">
                                        <h3>Basic Information</h3>
                                        <div className="form-row">
                                            <label>QID/Passport:<span className="mandatory-star">*</span>:</label>
                                            <input type="text" name="CIT_ID" value={formData.CIT_ID} onChange={handleChange} placeholder="QID/Passport"  required/>
                                            <label>Mobile<span className="mandatory-star">*</span>:</label>
                                            <input type="tel" name="MOBILE" value={formData.MOBILE} onChange={handleChange} placeholder="Mobile" required />
                                        </div>
                                        <div className="form-row">
                                            <label>Nationality<span className="mandatory-star">*</span>:</label>
                                            <select
                                                id="NATIONALITY"
                                                name="NATIONALITY"
                                                value={formData.NATIONALITY}
                                                onChange={handleChange}
                                                
                                            >
                                                <option value="">Select Nationality</option>
                                                {nationalityOptions.map((nationality, index) => (
                                                    <option key={index} value={nationality}>{nationality}</option>
                                                ))}
                                            </select>

                                            <label>City <span className="mandatory-star">*</span>:</label>
                                            <select
                                                id="CITY_ID"
                                                name="CITY_ID"
                                                value={formData.CITY_ID}
                                                onChange={handleChange}
                                                
                                            >
                                                <option value="">Select City</option>
                                                {cityOptions.map((city, index) => (
                                                    <option key={index} value={city.CITY_ID}>{city.CITY_NAME}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-row">
                                            <label>FileNo.<span className="mandatory-star"></span></label>
                                            <input
                                                type="text"
                                                name="CUST_ID"
                                                value={formData.CUST_ID}
                                                onChange={handleChange}
                                                placeholder="File No"
                                              
                                            />
                                            <label>Name <span className="mandatory-star">*</span>:</label>
                                            <input type="text" name="NAME_E" value={formData.NAME_E} onChange={handleChange} placeholder="NAME" />
                                            <label>Date of birth<span className="mandatory-star">*</span>:</label>
                                            <input type="text" name="DOB" value={formData.DOB} onChange={handleChange} placeholder="DD/MM/YYYY" required />
                                            <span>Age: {age}</span>
                                        </div>

                                        {/* Add more fields as per your requirements */}
                                    </div>

                                    {/* Additional Information Section */}
                                    <div className="form-section">
                                        <h3>Additional Information</h3>
                                        <div className="form-row">
                                            <label>Insurance Co. </label>
                                            <select
                                                id="INSURANCE"
                                                name="INSURANCE"
                                                value={formData.INSURANCE}
                                                onChange={handleChange}
                                                
                                            >
                                                <option value="">Select Insurance Company</option>
                                                {bankOptions.map((bank, index) => (
                                                    <option key={index} value={bank.NAME_E}>{bank.NAME_E}</option>
                                                ))}
                                            </select>
                                            <label>Email:</label>
                                            <input type="text" name="EMAIL" value={formData.EMAIL} onChange={handleChange} placeholder="Email" />
                                            <label>Address:</label>
                                            <input type="text" name="ADDRESS" value={formData.ADDRESS} onChange={handleChange} placeholder="Address" />
                                        </div>

                                        <div className="form-row">
                                            <label>Ins. Card Expiry:</label>
                                            <input type="text" name="INSURANCE_EXPIRY" value={formData.INSURANCE_EXPIRY} onChange={handleChange} placeholder="Ins Card Expiry" />
                                            <label>work_type:</label>
                                            <input type="text" name="WORK_TYPE" value={formData.WORK_TYPE} onChange={handleChange} placeholder="Work Type" />
                                            <label>Home Phone</label>
                                            <input type="text" name="PHONE" value={formData.PHONE} onChange={handleChange} placeholder="home-phone" />
                                        </div>
                                        {/* Add more fields as per your requirements */}
                                    </div>

                                    {/* Female Information Section */}
                                    <div className="form-section">
                                        <h3>Female Information</h3>
                                        <div className="form-row">
                                            <label>HusbandName</label>
                                            <input type="text" name="HASBAND_NAME" value={formData.HASBAND_NAME} onChange={handleChange} placeholder="HusbandName" />
                                            <label>HusbandQid</label>
                                            <input type="text" name="HASBAND_ID" value={formData.HASBAND_ID} onChange={handleChange} placeholder="HusbandQid" />
                                            <label>HusbandPhone</label>
                                            <input type="text" name="HASBAND_PHONE" value={formData.HASBAND_PHONE} onChange={handleChange} placeholder="HusbandPhone" />
                                        </div>
                                        {/* Add more fields as per your requirements */}
                                    </div>

                                    {/* Dropdowns and Checkbox Section */}
                                    <div className="form-section">
                                        <div className="form-row">
                                            <label>Gender<span className="mandatory-star">*</span>:</label>
                                            <select name="GENDER" value={formData.GENDER} onChange={handleChange}>
                                                <option value="">Select Gender</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                            </select>
                                            <label>Smoker:</label>
                                            <select name="SMOKER" value={formData.SMOKER} onChange={handleChange}>
                                                <option value="">Smoker?</option>
                                                <option value="Y">Yes</option>
                                                <option value="N">No</option>
                                            </select>
                                            <label>Blood Type<span className="mandatory-star">*</span>:</label>
                                            <select name="BLOOD_TYPE" value={formData.BLOOD_TYPE} onChange={handleChange}>
                                                <option value="">Select Blood Type</option>
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="AB">AB</option>
                                                <option value="O">O</option>
                                            </select>
                                            <label>Marital Status:</label>
                                            <select name="MARITAL_STATUS" value={formData.MARITAL_STATUS} onChange={handleChange}>
                                                <option value="">Select Marital Status</option>
                                                <option value="single">Single</option>
                                                <option value="married">Married</option>
                                                <option value="divorced">Divorced</option>
                                                <option value="widowed">Widowed</option>
                                            </select>
                                        </div>
                                        <div>
                                        <label>VIP:</label>
                                            <input
                                                type="checkbox"
                                                name="VIP"
                                                checked={formData.VIP === 'Y'}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons Section */}
                                    <div className=" bb">
                                        <div className="button-row">
                 {(
                                            !right && (    <button type="submit"  style={{
                   
                
                                                borderRadius: '2px',         // Rounded corners
                                                backgroundColor: '#007bff',  // Background color
                                                      // Prevent text wrapping
                                            }} >Save</button>)
                 )}
           {(
           ( showr || right) &&  (
                <button type="button"  onClick={handlePrint}  style={{
                   
                
                    borderRadius: '2px',         // Rounded corners
                    backgroundColor: '#007bff',  // Background color
                          // Prevent text wrapping
                }} >Report</button>
            )
           )}
                                            {/* <button type="button"  style={{
                   
                
                   borderRadius: '2px',         // Rounded corners
                   backgroundColor: '#007bff',  // Background color
                         // Prevent text wrapping
               }}>Exit</button> */}
                                        </div>
                                    </div>
                                </form>

                                {/* New Patient Button */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showPrintPreview && <ReportGeneratorPage  custId={custIdForReport} onClose={handleClosePrintPreview}/>}
            {showSecondReport && <BarcodeGeneratorPage custId={custIdForSecondReport} onClose={handleCloseSecondReport} />}
        </div>
       
    );
};

export default PatientInfo;


