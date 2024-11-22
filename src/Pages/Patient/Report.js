

import API from '../../Api';


import React, { useState, useEffect } from 'react';
import './Report.css'; // Import external CSS file
import axios from 'axios'; // Import Axios for API calls

const ReportGeneratorPage = ({ custId,onClose }) => {
  useEffect(() => {
    if (custId) {
      document.body.classList.add('modal-open'); 
    } 
    // Cleanup function to ensure overflow is reset if the component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [custId]);

    const [showReport, setShowReport] = useState(false); // State to toggle modal display
    const [reportContent, setReportContent] = useState(''); // State to hold report content
    const [patientData, setPatientData] = useState(null); // State to hold patient data
    const [companyData, setCompanyData] = useState(null); // State to hold company data

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch patient data
                const patientResponse = await API.get(`/api/patient/${custId}`);
                const patientData = patientResponse.data;

                // Fetch company details
                const companyResponse = await API.get(`/api/company/${custId}`);
                const companyData = companyResponse.data;

                // Generate report content
                const generatedReport = generateReport(patientData, companyData);

                // Set states
                setPatientData(patientData);
                setCompanyData(companyData);
                setReportContent(generatedReport);
                setShowReport(true); // Show the report modal
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (custId) {
            fetchData();
        }
    }, [custId]);
    
    const generateReport = (patientData, companyData) => {
        const reportData = {
            creation: {
                CREATED_DAT: patientData.createdDate,
                USRINFO_USERNAME: patientData.createdBy,
                CUST_ID: patientData.custId,
            },
            companyDetails: {
                Name1E: companyData?.Name1E || '',
                Name1A: companyData?.Name1A || '',
                Name2E: companyData?.Name2E || '',
                Name2A: companyData?.Name2A || '',
                Name3E: companyData?.Name3E || '',
                Name3A: companyData?.Name3A || '',
                Name4E: companyData?.Name4E || '',
                Name4A: companyData?.Name4A || '',
                Name5E: companyData?.Name5E || '',
                Name5A: companyData?.Name5A || '',
            },
            patientProfile: {
                NAME_E: patientData.name,
                CIT_ID: patientData.qid,
                NATIONALITY: patientData.nationality,
                INSURANCE: patientData.insurance,
                GENDER: patientData.gender,
                DOB: patientData.dateOfBirth,
                SMOKER: patientData.smoker,
                BLOOD_TYPE: patientData.bloodType,
                MARITAL_STATUS: patientData.maritalStatus,
            },
            patientContacts: {
                ADDRESS: patientData.address,
                MOBILE: patientData.mobile,
                EMAIL: patientData.email,
                PHONE: patientData.phone,
            },
            patientConsent: `
                <div class="consent-arabic">
                    يتلا ةفلتخملا ةيبطلا تامدخلل راعسﻻا ةمئاق ىلع تعلطا دق يننا امك ةثيدحلا ةينقتلا قرطلاب جﻼعلاو صيخشتلا لحارم يف هعبتيس امو زكرملاب لمعلا ماظنب تملع دق ينناب رق
                    كرملاب نيلماعلا نييراشتسﻻا نم لماكتملا يبطلا قيرفلا لﻼخ نم سسﻻا هذه ءوض يلع قفاوا ينناو اذه زكرملا اهمدقي 
                    لذب ينم رارقا اذهو
                </div>
                <div class="consent-english">
                    I acknowledge that I have learned the workplace and the system that will follow the stages of diagnosis and treatment using modern technical means, as I have seen a price list for various medical services provided by this center and I agree that in light of these bases through an integrated medical team of consultants at the workplace.
                </div>
            `,
        };
        const encodedCustId = `*${reportData.creation.CUST_ID}*`;

        // Generate report content using patient and company data
        const generatedReport = `
            <div class="report">
                <div class="report-section">
                    <h1 class='phh'>Patient Report</h1>
                   <div class="company-details">
    <div class="left-column">
        <div class="field">${reportData.companyDetails.Name1E}</div>
        <div class="field">${reportData.companyDetails.Name2E}</div>
        <div class="field">${reportData.companyDetails.Name3E}</div>
        <div class="field">${reportData.companyDetails.Name4E}</div>
        <div class="field">${reportData.companyDetails.Name5E}</div>
    </div>
    <div class="right-column">
        <div class="field">${reportData.companyDetails.Name1A}</div>
        <div class="field">${reportData.companyDetails.Name2A}</div>
        <div class="field">${reportData.companyDetails.Name3A}</div>
        <div class="field">${reportData.companyDetails.Name4A}</div>
        <div class="field">${reportData.companyDetails.Name5A}</div>
    </div>
</div>

                </div>
                           <div class="report-section">
                    
<div class="bar">
    <div class="creation-details">
        <div class="field">
            <span class="label">File Date:</span> ${reportData.creation.CREATED_DAT}
        </div>
        <div class="field">
            <span class="label">Created By:</span> ${reportData.creation.USRINFO_USERNAME}
        </div>
    </div>
    <div class="barcode">
              <span style="font-family: 'BarcodeFont'; font-size: 24px;">
                            ${encodedCustId}
                        </span>
    </div>
</div>

                </div>
                <div class="report-section">
                  <div class="patient-profile">
    <div class="field-row">
        <div class="field">
            <span class="label">Name:</span> ${reportData.patientProfile.NAME_E}
        </div>
        <div class="field">
            <span class="label">Q.ID:</span> ${reportData.patientProfile.CIT_ID}
        </div>
    </div>
    <div class="field-row">
        <div class="field">
            <span class="label">Nationality:</span> ${reportData.patientProfile.NATIONALITY}
        </div>
        <div class="field">
            <span class="label">Insurance:</span> ${reportData.patientProfile.INSURANCE}
        </div>
    </div>
    <div class="field-row">
        <div class="field">
            <span class="label">Gender:</span> ${reportData.patientProfile.GENDER}
        </div>
        <div class="field">
            <span class="label">Date of Birth:</span> ${reportData.patientProfile.DOB}
        </div>
    </div>
    <div class="field-row">
        <div class="field">
            <span class="label">Smoker:</span> ${reportData.patientProfile.SMOKER}
        </div>
        <div class="field">
            <span class="label">Blood Type:</span> ${reportData.patientProfile.BLOOD_TYPE}
       
    </div>
     </div>
       <div class="field-row">
        <div class="field">
            <span class="label">Marital status:</span> ${reportData.patientProfile.MARITAL_STATUS}
        </div>
       <div class="field">
        <span class="label">Age:</span> ${calculateAge(reportData.patientProfile.DOB)}
    </div>
    </div>
</div>

                </div>

                <div class="report-section">
                    
                    <div class="patient-contacts">
    <div class="field-row">
        <div class="field">
            <span class="label">Address:</span> ${reportData.patientContacts.ADDRESS}
        </div>
        <div class="field">
            <span class="label">Mobile:</span> ${reportData.patientContacts.MOBILE}
        </div>
    </div>
    <div class="field-row">
        <div class="field">
            <span class="label">Email:</span> ${reportData.patientContacts.EMAIL}
        </div>
        <div class="field">
            <span class="label">Phone:</span> ${reportData.patientContacts.PHONE}
        </div>
    </div>
</div>

                </div>

                <div class="report-section">
                     <h5 class='ph'>Patient Consent</h5>
                    <div class="patient-consent">${reportData.patientConsent}</div>
                </div>
  


     
            </div>
        `;

        return generatedReport;
    };

    // Function to close the report modal
    const handleCloseReport = () => {
      document.body.classList.remove('modal-open');
        setShowReport(false);
        setReportContent('');
        if (onClose) {
          onClose(); // Notify the parent component
      }
    };

     const handlePrintReport = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
         printWindow.document.write(`
             <html>
                 <head>
                    <title>Print Report</title>
                    <link rel="stylesheet" type="text/css" href="./Report.css">
                    <style>
                    @font-face {
                        font-family: 'BarcodeFont';
                        src: url('../../fonts/30f9.ttf') format('truetype');
                    }
                    /* Styles for Report Generator Page */
 .report-generator-page {
    font-family: Arial, sans-serif;
    /* padding: 20px; */
  }
  
  /* .report-generator-page h1 {
    margin-bottom: 20px;
  } */
  
  .report-generator-page button {
    /* padding: 10px 20px; */
    font-size: 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  .report-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* background-color: #fff; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    /* padding: 20px; */
    z-index: 1000;
  }
  
  .report-modal-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .report-modal .close {
    position: absolute;
    /* top: 10px;
    right: 10px; */
    cursor: pointer;
    font-size: 20px;
    color: #000;
  }
  
  .report-content {
    max-height: 400px; /* Set a maximum height */
    overflow-y: auto; /* Enable vertical scrollbar when content exceeds max height */
    /* margin-bottom: 20px; */
  }
  
  .report-options button {
    /* padding: 10px 20px; */
    font-size: 16px;
    background-color: #28a745;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  .report {
    /* background-color: #ffffff; */
    /* padding: 20px; */
    /* margin: 20px auto; */
    border: 1px solid #ccc;
    max-width: 800px; /* Adjust max-width as per your layout */
    overflow: hidden; /* Hide overflow to prevent double scrollbar */
  }
  
  .report-section {
    /* margin-bottom: 20px; */
  }
  
  .header {
    font-weight: bold;
    /* margin-bottom: 10px; */
    color: #000;
  }
  
  .creation-details
  .patient-profile,
  .patient-contacts,
  .patient-consent {
    /* margin-top: 15px; */
  }
  
  .label {
    font-weight: bold;
    /* margin-right: 5px; */
    color: #000;
  }
   .creation-details,
  .patient-profile,
  .patient-contacts,
  .patient-consent {
    /* padding: 10px; */
    border: 1px solid #000;
    background-color: #fff;
  }
  .creation-details h1
  .patient-profile h1,
  .patient-contacts h1,
  .patient-consent h1 {
    font-size: 18px;
    margin-bottom: 10px;
    border-bottom: 1px solid #000;
    /* padding-bottom: 5px; */
    color: #000;
  }
  
  .field {
    /* margin-bottom: 8px; */
  }
  
  .patient-consent {
   /* Preserve formatting of consent text */
   
    color: #000;
  }
  .consent-arabic {
    font-family: 'Arial', sans-serif; /* Use appropriate font-family for Arabic */
    text-align: right; /* Right-align Arabic text */
    direction: rtl; /* Set direction to right-to-left for Arabic */
     /* Adjust spacing */
}

.consent-english {
    font-family: 'Arial', sans-serif; /* Use appropriate font-family for English */
    text-align: left; /* Left-align English text */
    direction: ltr; /* Set direction to left-to-right for English */
    /* margin-top: 3px; Adjust spacing */
}
.bar{
  display: flex;
}
.bar {
  display: flex;
  align-items: flex-start; /* Align items at the start of the flex container */
  gap: 20px; /* Gap between fields and barcode */
}

.creation-details {
  flex: 1; /* Take up remaining space */
}

.field {
  /* margin-bottom: 10px; Space between fields */
}

.barcode img {
  max-width: 100%; /* Ensure barcode image doesn't exceed its container */
}
.patient-profile {
  width: 100%;
}

.field-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* Adjust as needed */
}

.field {
  flex: 1; /* Each field takes equal width */
  /* margin-right: 20px;  */
}

.label {
  font-weight: bold;
  /* margin-right: 5px; */
}
.patient-contacts {
  width: 100%;
}

.field-row {
  display: flex;
  justify-content: space-between;
  /* margin-bottom: 10px; */
}

.field {
  flex: 1; /* Each field takes equal width */
  /* margin-right: 20px;  */
}

.label {
  font-weight: bold;
  /* margin-right: 5px; */
}

.company-details {
  width: 100%;
}

.field-row {
  display: flex;
  justify-content: space-between;
  /* margin-bottom: 10px;  */
}

.field {
  flex: 1; /* Each field takes equal width */
  /* margin-right: 20px;  */
}

.label {
  font-weight: bold;
  /* margin-right: 5px; */
}
.ph{
  text-align: center;
}
.phh{
  background-color: #f0f0f0; /* Light gray background */
  border: 1px solid #ccc; /* Light gray border */
  padding: 10px; /* Padding around the text */
  text-align: center; /* Center align text */
}
.company-details {
  display: flex;
  justify-content: space-between; /* Adjust the space between the two columns */
  /* margin-top: 20px;  */
}

.left-column,
.right-column {
  flex: 1; /* Each column takes equal width */
}

.left-column {
  /* padding-right: 20px; */
}

.right-column {
  direction: rtl; /* Set direction to right-to-left for Arabic text */
  text-align: right; /* Align text to right for Arabic text */
  padding-left: 20px; 
}

.field {
  margin-bottom: 10px; /* Space between each field */
  /* Additional styling for each field */
}

.field.arabic {
  /* Additional styles specific to Arabic text */
}

                    </style>
                 </head>
                 <body>${reportContent}</body>
             </html>
         `);
         printWindow.document.close();
         printWindow.print();
     };

     const calculateAge = (dob) => {
        if (!dob) return '';
    
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
    
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    };
    
    return (
        <div className="report-generator-page">
            {/* Modal for displaying the report */}
            {showReport && (
              <div className='modal-overlay'>
                <div className="report-modal">
                    <div className="report-modal-content">
                        <span className="close" onClick={handleCloseReport}>&times;</span>
                        <div className="report-content">
                            <div dangerouslySetInnerHTML={{ __html: reportContent }} />
                        </div>
                        <div className="report-options">
                            <button onClick={handlePrintReport}>Print</button>
                        
                        </div> 

                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default ReportGeneratorPage;
