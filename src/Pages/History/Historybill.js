
import API from '../../Api';
import logo from '../Popup/salamlogo.jpg';
import './Historybill.css'

import { toWords } from 'number-to-words';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API calls
import { useNavigate } from 'react-router-dom';

const Historybill = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [shoapi, setShoapi] = useState({});
  const [dateapi, setDateapi] = useState(null);
  const [thapi, setThapi] = useState(null);
  const [transapi, setTransapi] = useState(null);
  const [reportapi, setReportapi] = useState([]);
  const [companyapi, setCompanyapi] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fileNo = query.get('fileNo');
  const serial = query.get('serial');

  useEffect(() => {
    if (fileNo && serial) {
      fetchReportData();
    }
  }, [fileNo, serial]);

  const fetchReportData = async () => {
    try {
      const response = await API.get('/api/transaction-headers', {
        params: {
          fileNo: encodeURIComponent(fileNo.trim()),
          serial: encodeURIComponent(serial.trim()),
        },
      });
      
      // Extract data
      const data = response.data;
      console.log(response.data)
      setShoapi(data);
      setDateapi(data.date);
      setThapi(data.newTH[0]);
      setTransapi(data.newTrans[0]);
      setReportapi(data.reportData);
      setCompanyapi(data.companyDetails[0]);
      
      // Generate report content
      const generatedReport = generateReport(data, data.companyDetails[0], data.reportData);
      setReportContent(generatedReport);
      setShowReport(true);
      document.body.classList.add('modal-open'); 
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const totalPayInWords = toWords(
    (shoapi.cashAmount || 0) + (shoapi.visaAmount || 0) + (shoapi.insuranceAmount || 0)
  );


  
  const generateReport = (data) => {
    // alert(data.newTrans[0])
    const {
      companyDetails,
      totalAmount,
      totalDiscountp,
      DOCTOR_ID,
      username,
      date,
      cashAmount,
      visaAmount,
      insuranceAmount,
      reportData,
      balance,
      transactionLines,
    } = data;
  
    // Convert total amount to words
    const totalPayInWords = toWords(totalAmount);
    const paymentMethods = [];
    if (cashAmount > 0) paymentMethods.push('Cash');
    if (visaAmount > 0) paymentMethods.push('Card');
    if (insuranceAmount > 0) paymentMethods.push('Insurance');
  
    let paymentMode = 'None';
    if (paymentMethods.length === 3) {
      paymentMode = 'Multi-payment (Cash, Card, Insurance)';
    } else if (paymentMethods.length === 2) {
      paymentMode = `Multi-payment (${paymentMethods.join(', ')})`;
    } else if (paymentMethods.length === 1) {
      paymentMode = paymentMethods[0];
    }
  
  
    // Format company details
    const companyDetailsHtml = companyDetails.map(detail => `
      <div class="report-section">
      <div class="company-details" style="display: flex; justify-content: space-between;">
      <div class="field" class="left-column" style="flex: 1; direction: ltr; text-align: left;">
        ${detail.Name1E || ''}<br>
        ${detail.Name2E || ''}<br>
        ${detail.Name3E || ''}<br>
        ${detail.Name4E || ''}<br>
        ${detail.Name5E || ''}
      </div>
        <div class="field" class="right-column" style="flex: 1; direction: rtl; text-align: right;">
        ${detail.Name1A || ''}<br>
        ${detail.Name2A || ''}<br>
        ${detail.Name3A || ''}<br>
        ${detail.Name4A || ''}<br>
        ${detail.Name5A || ''}
      </div>
      </div>
       </div>

    `).join('<br>');
  
    // Format transaction lines
    const transactionLinesHtml = transactionLines.map(line => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${line.REF_CODE}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${line.ITM_FOREIGN_DESC}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${line.UOM_QTY}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${line.PRICE}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${line.DISCOUNT_PERCENT}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${line.UOM_QTY * line.PRICE - line.DISCOUNT_PERCENT}</td>
      </tr>
    `).join('');
  
    // Generate report content
    return `
      <div class="report">
      <div style="display: flex; align-items: center; justify-content: space-between;">
  <!-- Logo Section -->
  

  <!-- Company Details Section -->
  <div class="report-section" style="display: flex; flex: 2; justify-content: space-between;">
    <!-- English Details -->
    <div class="field left-column" style="flex: 1; direction: ltr; text-align: left;">
      ${companyDetails.map(detail => `
        ${detail.Name1E || ''}<br>
        ${detail.Name2E || ''}<br>
        ${detail.Name3E || ''}<br>
        ${detail.Name4E || ''}<br>
        ${detail.Name5E || ''}
      `).join('')}
    </div>
<div class="logoname" style="text-align: center; flex: 1;">
    <div class="image-section" style="display: inline-block;">
      <img src="${logo}" alt="Report Image" style="max-width: 40%; height: auto;"/>
    </div>
    <div class="field">
      <span class="label"></span>${companyDetails.map(detail => detail.Name2E).join('<br>')}
    </div>
  </div>
    <!-- Arabic Details -->
    <div class="field right-column" style="flex: 1; direction: rtl; text-align: right;">
      ${companyDetails.map(detail => `
        ${detail.Name1A || ''}<br>
        ${detail.Name2A || ''}<br>
        ${detail.Name3A || ''}<br>
        ${detail.Name4A || ''}<br>
        ${detail.Name5A || ''}
      `).join('')}
    </div>
  </div>
</div>
<div class="inv">
  <div class="report-section" style="text-align: center;">
    <div class="field-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
       <span class="label">File Number:</span> 
    <div class="field" style="flex: 1; text-align: left;">
       
        <img src="https://barcode.tec-it.com/barcode.ashx?data=${reportData[0].CUST_ID}&code=Code128&dpi=96" alt="Barcode" />
      </div>
    
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Bill No:</span> ${data.newTrans[0]}
      </div>
    </div>
  </div>

  <div class="report-section">
    <div class="field-row" style="display: flex; justify-content: space-between;">
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Name:</span> ${data.insuranceDetails.NAME_E}
      </div>
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Date:</span> ${new Date(date).toLocaleDateString()}
      </div>
    </div>

    <div class="field-row" style="display: flex; justify-content: space-between;">
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Doctor:</span> ${DOCTOR_ID}
      </div>
      <div class="field" style="flex: 1; text-align: left;">
        <span class="label">Insurance:</span> ${data.insuranceDetails.INSURANCE || 'NULL'}
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
              ${transactionLinesHtml}
            </tbody>
          </table>
        </div>
        <div class="summary">
          <div class="field-row">
          
          
        
       
          </div>
          
        </div>
  <div class="total-section" style="margin-top: 20px; border: 1px solid #ddd; padding: 10px;">
    <div class="field-row" style="display: flex; justify-content: space-between;">
        <div style="flex: 1; text-align: left;">
            <div><strong>Patient Cash Pay:</strong> ${cashAmount}</div>
            <div><strong>Patient Card Pay:</strong> ${visaAmount}</div>
            <div><strong>Insurance Share:</strong> ${insuranceAmount}</div>
        </div>
        <div style="flex: 1; text-align: left; padding-left: 120px;"> <!-- Added padding-left here -->
            <div><strong>Total Amount:</strong> ${totalAmount}</div>
            <div><strong>Total Discount:</strong> ${totalDiscountp}</div>
            <div><strong>Balance:</strong> ${balance}</div>
        </div>
    </div>
    <div class="field-row" style="margin-top: 10px; display: flex; flex-direction: column;">
        <div><strong>Amount in Words:</strong> ${totalPayInWords} Qatari Riyals</div>
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
                ${reportData[0].CUST_ID}
            </div>
        </div>
    </div>
</div>

      </div>
    `;
  };
  ;
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
     printWindow.document.write(`
         <html>
             <head>
                <title>Print Report</title>
                <link rel="stylesheet" type="text/css" href="./Report.css">
                <style>
                .bar {
    display: flex;
    justify-content: center; /* Center the barcode horizontally */
}
                /* Styles for Report Generator Page */
.report-generator-page {
font-family: Arial, sans-serif;

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


  const navigate = useNavigate();

  const handleCloseReport = () => {
    setShowReport(false);
    document.body.classList.remove('modal-open');
    navigate('/PH');
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
                            <button onClick={handlePrint}>Print</button>
                        
                        </div> 

                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default Historybill;
