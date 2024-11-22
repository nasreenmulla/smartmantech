import API from '../../Api';
import logo from '../Popup/salamlogo.jpg';
import '../History/Historybill.css';
import React, { useState, useEffect } from 'react';

const Pres = () => {
    const [showReport, setShowReport] = useState(false);
    const [reportContent, setReportContent] = useState('');

    // Fetch report data when the component mounts
    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        try {
            // Fetch com_no from local storage
            const comNo = localStorage.getItem('COM_NO');
            
            // Ensure com_no is available before making the request
            if (!comNo) {
                console.error('com_no not found in local storage.');
                return; // Exit if com_no is not present
            }

            const response = await API.get('/api/presreport', {
                params: { com_no: comNo } // Send com_no as a query parameter
            });

            const data = response.data;
            console.log(data);
            
            const generatedReport = generateReport(data); // Pass data directly
            setReportContent(generatedReport);
            setShowReport(true);
            document.body.classList.add('modal-open'); 
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    const generateReport = (data) => {
        const { companyDetails } = data;

        // Ensure companyDetails is an array
        const detailsArray = Array.isArray(companyDetails) ? companyDetails : [companyDetails];

        return `
            <div class="report">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div class="report-section" style="display: flex; flex: 2; justify-content: space-between;">
                        <div class="field left-column" style="flex: 1; direction: ltr; text-align: left;">
                            ${detailsArray.map(detail => `
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
                                <span class="label"></span>${detailsArray.map(detail => detail.Name2E).join('<br>')}
                            </div>
                        </div>
                        <div class="field right-column" style="flex: 1; direction: rtl; text-align: right;">
                            ${detailsArray.map(detail => `
                                ${detail.Name1A || ''}<br>
                                ${detail.Name2A || ''}<br>
                                ${detail.Name3A || ''}<br>
                                ${detail.Name4A || ''}<br>
                                ${detail.Name5A || ''}
                            `).join('')}
                        </div>
                    </div>
                </div>
          
                <div class="consent-section" style="margin-top: 20px; border: 2px solid darkgray; padding: 10px;">
                    <p style="text-align: center; margin: 0;">
                        <strong>Computer generated Invoice and requires no signature or stamp</strong><br>
                        <span style="font-size: 0.9em;">فاتورة مولدة بواسطة الكمبيوتر ولا تحتاج إلى توقيع أو ختم</span>
                    </p>
                </div>
            </div>
        `;
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Report</title>
                    <style>
                        /* Add any additional styles needed for printing */
                    </style>
                </head>
                <body>${reportContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleCloseReport = () => {
        setShowReport(false);
        document.body.classList.remove('modal-open');
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

export default Pres;