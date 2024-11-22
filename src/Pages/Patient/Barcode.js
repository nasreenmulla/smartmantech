import API from '../../Api';
import React, { useState, useEffect } from 'react';
import './Barcode.css'; // Import CSS for styling
import Barcode from 'react-barcode';


const BarcodeGeneratorPage = ({ custId,onClose }) => {
    const [showReport, setShowReport] = useState(false); // State to toggle modal display
    const [reportContent, setReportContent] = useState(''); // State to hold report content
    const [patientData, setPatientData] = useState(null); // State to hold patient data
    const [error, setError] = useState(null); // State to hold error message

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch patient data
                const patientResponse = await API.get(`/api/patient/${custId}`);
                const patientData = patientResponse.data;

                // Generate report content
                const generatedReport = generateReport(patientData, 21); // Repeat report 20 times

                // Set states
                setPatientData(patientData);
                setReportContent(generatedReport);
                setShowReport(true); // Show the report modal
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching patient data');
            }
        };

        if (custId) {
            fetchData();
        }
    }, [custId]);

    const generateReport = (patientData, repeatCount) => {
        const reportData = {
            creation: {
                CREATED_DAT: patientData.createdDate,
                USRINFO_USERNAME: patientData.createdBy,
                CUST_ID: patientData.custId,
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
        };

        let generatedReport = '';
        for (let i = 0; i < repeatCount; i++) {
            if (i % 3 === 0) {
                // Open a new row for every 3 reports
                generatedReport += `<div class="custom-row">`;
            }

            generatedReport += `
                <div class="custom-report">
                    <div class="custom-report-section">
<div class="custom-bbar">
                            <img src="https://barcode.tec-it.com/barcode.ashx?data=${reportData.creation.CUST_ID}&code=Code128&dpi=96" alt="Barcode"  />
                        </div>


                    </div>
                    <div class="custom-report-section">
                        <div class="custom-bfield">
                            ${reportData.patientProfile.NAME_E}
                        </div>
                        <div class="custom-bfield-row">
                            <div class="custom-bfield">
                                <span class="custom-blabel">D.O.B:</span> ${reportData.patientProfile.DOB}
                            </div>
                            <div class="custom-bfield">
                                <span class="custom-blabel">Gender:</span> ${reportData.patientProfile.GENDER}
                            </div>
                        </div>
                        <div class="custom-bfield-row">
                            <div class="custom-bfield">
                                <span class="custom-blabel">Q.ID:</span> ${reportData.patientProfile.CIT_ID}
                            </div>
                            <div class="custom-bfield">
                                <span class="custom-blabel">Blood Type:</span> ${reportData.patientProfile.BLOOD_TYPE}
                            </div>
                        </div>
                        <div class="custom-bfield">
                            <span class="custom-blabel">Nationality:</span> ${reportData.patientProfile.NATIONALITY}
                        </div>
                    </div>
                </div>
            `;

            if (i % 3 === 2 || i === repeatCount - 1) {
                // Close the row after every 3 reports or at the end
                generatedReport += `</div>`;
            }
        }

        return generatedReport;
    };

    // Function to close the report modal
    const handleCloseReport = () => {
        setShowReport(false);
        setReportContent('');
        setError(null);
        if (onClose) {
            onClose(); // Notify the parent component
        }// Reset error state
    };

    // Function to handle printing of the report
    const handlePrintReport = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Report</title>
                    <style>
 
.custom-report {
    max-width: calc(33.33% - 10px); /* Adjust width to fit 3 reports in a row */
    max-height: 160px; /* Set a fixed height for the report */
    border: 1px solid #ccc; /* Optional: Add border for visual clarity */
    margin: 5px; /* Adjust margin between reports */
    page-break-inside: avoid; /* Avoid splitting reports across pages */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box; /* Ensure padding and border are included in the width */
    font-family: Arial, sans-serif; /* Example: Change font family */
}

.custom-bfield {
    margin-right: 10px; /* Optional: Add margin between fields */
    font-size: 12px; /* Adjust font size */
    color:black; /* Adjust font color */
}

.custom-bfield-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px; /* Optional: Add margin between rows */
}

.custom-blabel {
    font-weight: bold;
    margin-right: 5px;
}

.custom-row {
    display: flex;
    flex-wrap: wrap; /* Allow reports to wrap to the next line */
    justify-content: flex-start;
    margin: -5px; /* Negative margin to counteract the margin added to .custom-report */
}

.custom-row .custom-report {
    margin: 5px; /* Adjust margin between reports */
}


.custom-bfield {
    margin-right: 10px; /* Optional: Add margin between fields */
}
.custom-bfield-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px; /* Optional: Add margin between rows */
}
.custom-blabel {
    /* font-weight: bold; */
    margin-right: 5px;
    
}
.custom-bbar img {
    width: 90px; /* Adjust barcode width */
    height: auto; /* Maintain aspect ratio */
}
                    </style>
                </head>
                <body>${reportContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

   

    return (
        <div className="report-generator-page">
            {/* Modal for displaying the report */}
            {showReport && (
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
            )}
            {/* Display error message if there is an error */}
            {error && <p>{error}</p>}
        </div>
    );
};

export default BarcodeGeneratorPage;
