import API from '../../Api';
import logo from './salamlogo.jpg';
import './ReportPage.css'
import { toWords } from 'number-to-words';
import { useLocation } from 'react-router-dom';

import React, { useState, useEffect } from 'react';

import axios from 'axios'; // Import Axios for API calls

const ReportPage = ({  date,totalAmount, totalDiscountp, patientCashPay, patientCardPay, insuranceShareBalance,DOCTOR_ID,PAT_ID, reportData, onClose,newTH,maxTransactionHeaderSerial} ) => {
  useEffect(() => {
    if (reportData) {
      document.body.classList.add('modal-open'); 
    } 
    // Cleanup function to ensure overflow is reset if the component unmounts
    
  }, [reportData]);

  // alert(insuranceShareBalance)
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      throw new Error('Input must be a Date object');
    }

    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    return `${formattedMonth}/${formattedDay}/${year}`;
  };

  // Ensure `date` is a Date object; if not, handle accordingly
  
const balance=(totalAmount-(insuranceShareBalance+patientCashPay+patientCardPay))
  // alert(reportData)
  const totalPayInWords = toWords((patientCashPay || 0) + (insuranceShareBalance || 0));
  let paymentMode = 'None';
  const paymentMethods = [];
  if (patientCashPay > 0) paymentMethods.push('Cash');
  if (patientCardPay > 0) paymentMethods.push('Card');
  if (insuranceShareBalance > 0) paymentMethods.push('Insurance');

  if (paymentMethods.length === 3) {
    paymentMode = 'Multi-payment (Cash, Card, Insurance)';
  } else if (paymentMethods.length === 2) {
    paymentMode = `Multi-payment (${paymentMethods.join(', ')})`;
  } else if (paymentMethods.length === 1) {
    paymentMode = paymentMethods[0];
  }

  
  const username=localStorage.getItem('username');
    const [showReport, setShowReport] = useState(false); // State to toggle modal display
    const [reportContent, setReportContent] = useState(''); // State to hold report content
    const [patientData, setPatientData] = useState(null); // State to hold patient data
    const [companyData, setCompanyData] = useState(null); // State to hold company data
    const [soresData,setSoresData]=useState(null)
    useEffect(() => {
      const fetchData = async () => {
          try {
              // Fetch patient data
              const patientResponse = await API.get(`/api/patient/${PAT_ID}`);
              const patientData = patientResponse.data;
  
              // Retrieve COM_NO and STR_CODE from localStorage
              const comNo = localStorage.getItem('COM_NO');
              const strCode = localStorage.getItem('STR_CODE');
  
              if (!comNo || !strCode) {
                  throw new Error('COM_NO or STR_CODE not found in localStorage');
              }
  
              // Fetch company details using COM_NO
              const companyResponse = await API.get(`/api/comp/${comNo}`);
              const companyData = companyResponse.data;
  
              // Fetch NAME_E from SORES table using STR_CODE and COM_NO
              const soresResponse = await API.get(`/api/sores/${strCode}/${comNo}`);
              const soresData = soresResponse.data;
              console.log(soresData,'INVOICENAME')
  
              // Generate report content
              const generatedReport = generateReport(patientData, companyData, soresData);
  
              // Set states
              setPatientData(patientData);
              setCompanyData(companyData);
              setSoresData(soresData); // Assuming you have a state for soresData
              setReportContent(generatedReport);
              setShowReport(true); // Show the report modal
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
  
      if (PAT_ID) {
          fetchData();
      }
  }, [PAT_ID]);
  
  const generateReport = (patientData, companyData, soresData) => {
    const IreportData = {
        
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
            INSURANCE: patientData.insurance,
        },
        invoiceName: soresData?.NAME_E || '',
        imageUrl: logo, // Add the image URL here
    };

    // Generate report content using patient and company data
    const generatedReport = `
    <div class="report">
       <div style="display: flex; align-items: center; justify-content: space-between;">
        <!-- Company Details Section -->
        <div class="report-section" style="display: flex; flex: 2; justify-content: space-between;">
            <!-- English Details -->
            <div class="field left-column" style="flex: 1; direction: ltr; text-align: left;">
               ${IreportData.companyDetails.Name1E}
                    ${IreportData.companyDetails.Name2E}
                    ${IreportData.companyDetails.Name3E}
                    ${IreportData.companyDetails.Name4E}
                    ${IreportData.companyDetails.Name5E}

            </div>

            <!-- Logo Section -->
            <div class="logoname" style="text-align: center; flex: 1;">
                <div class="image-section" style="display: inline-block;">
                    <img src="${IreportData.imageUrl}" alt="Report Image" style="max-width: 40%; height: auto;"/>
                </div>
                <div class="field">
                    <span class="label"></span>${IreportData.invoiceName}
                </div>
            </div>

            <!-- Arabic Details -->
            <div class="field right-column" style="flex: 1; direction: rtl; text-align: right;">
               ${IreportData.companyDetails.Name1E}
                    ${IreportData.companyDetails.Name2E}
                    ${IreportData.companyDetails.Name3E}
                    ${IreportData.companyDetails.Name4E}
                    ${IreportData.companyDetails.Name5E}
            </div>
        </div>
    </div>
        
       <div class="inv">
  <div class="report-section" style="text-align: center;">
    <div class="field-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
       <span class="label">File Number:</span> 
    <div class="field" style="flex: 1; text-align: left;">
       
                           <img src="https://barcode.tec-it.com/barcode.ashx?data=${PAT_ID}&code=Code128&dpi=96" alt="Barcode" />
      </div>
    
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Bill No:</span> ${maxTransactionHeaderSerial}
      </div>
    </div>
  </div>

  <div class="report-section">
    <div class="field-row" style="display: flex; justify-content: space-between;">
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Name:</span> ${IreportData.patientProfile.NAME_E}
      </div>
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Date:</span> ${date }
      </div>
    </div>

    <div class="field-row" style="display: flex; justify-content: space-between;">
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Doctor:</span> ${DOCTOR_ID}
      </div>
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Insurance:</span> ${IreportData.patientProfile.INSURANCE}
      </div>
    </div>
  </div>
</div>

 
        <div class="service-table" style="margin-top: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            Service ID <br> <span style="font-size: 0.8em;">رقم الخدمة</span>
                        </th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            Service Type <br> <span style="font-size: 0.8em;">نوع الخدمة</span>
                        </th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            Quantity <br> <span style="font-size: 0.8em;">الكمية</span>
                        </th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            Price <br> <span style="font-size: 0.8em;">السعر</span>
                        </th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            Discount% <br> <span style="font-size: 0.8em;">الخصم</span>
                        </th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                            Total <br> <span style="font-size: 0.8em;">الإجمالي</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                        ${reportData.map(service => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.serviceCode}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.serviceName}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.price}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.discountPercentage}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${service.total}</td>
                            </tr>
                        `).join('')}
                    </tbody>
            </table>
  </div>
<div class="total-section" style="margin-top: 20px; border: 1px solid #ddd; padding: 10px;">
    <div class="field-row" style="display: flex; justify-content: space-between;">
        <div style="flex: 1; text-align: left;">
            <div><strong>Patient Cash Pay:</strong> ${patientCashPay}</div>
            <div><strong>Patient Card Pay:</strong> ${patientCardPay}</div>
            <div><strong>Insurance Share:</strong> ${insuranceShareBalance}</div>
        </div>
        <div style="flex: 1; text-align: left; padding-left: 160px; ">
            <div><strong>Total Amount:</strong> ${totalAmount}</div>
            <div><strong>Total Discount:</strong> ${totalDiscountp}</div>
            <div><strong>Balance:</strong> ${balance}</div>
        </div>
    </div>
    <div class="field-row" style="margin-top: 10px;">
        <div><strong>Amount in Words:</strong> ${totalPayInWords} Qatari Riyals</div>
    </div>
    <div class="field-row" style="margin-top: 5px;">
        <div><strong>Mode of Payment:</strong> ${paymentMode}</div>
    </div>
</div>
     
                   <div class="consent-section" style="margin-top: 20px; border: 2px solid darkgray; padding: 10px;">
    <p style="text-align: center; margin: 0;">
        <strong>Computer generated Invoice and requires no signature or stamp</strong><br>
        <span style="font-size: 0.9em;">فاتورة مولدة بواسطة الكمبيوتر ولا تحتاج إلى توقيع أو ختم</span>
    </p>

    <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1; text-align: center;">
            <div style="border: 1px solid black; padding: 10px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between;">
                    <strong>Doctor:</strong>
                    <span>${DOCTOR_ID}</span>
                </div>
                <hr style="border: 0; border-top: 1px solid gray; margin: 5px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <strong>Cashier Sign:</strong>
                    <span>${username}</span>
                </div>
            </div>
        </div>

        <div style="flex: 1; text-align: center;">
            <div style="margin-bottom: 10px;">
                
                ${new Date().toLocaleString()} <!-- Current date and time -->
            </div>
        </div>

        <div style="flex: 1; text-align: center;">
            <div style="border: 1px solid black; padding: 10px; display: inline-block;">
                <strong>Patient Sign:</strong><br>
                ${IreportData.patientProfile.NAME_E}
            </div>
        </div>
    </div>
</div>
    </div>
`;

//last 2 div
    return generatedReport;
};



    // Function to close the report modal
    const handleCloseReport = () => {
     
        setShowReport(false);
        setReportContent('');
        if(onClose){
          onClose();
        }
        // document.body.classList.remove('modal-open');
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
    padding: 20px; 
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
 .total-section {
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column; /* Stack rows vertically */
}

.field-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* Space between rows */
  flex-wrap: wrap; /* Allows items to wrap to the next line */
}

.field-row > div {
  flex: 1 1 calc(25% - 10px); /* Adjust width for up to 4 items per row */
  box-sizing: border-box; /* Includes padding and border in the element's total width */
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
              <div className="modal-overlay">
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

export default ReportPage;
