import React, { useEffect, useState } from 'react';
import './Popup.css'; // Ensure this file includes the necessary CSS
import logo from './salamlogo.jpg';
import API from '../../Api'; 
import ReportPage from './ReportPage.js'
import { useLocation } from 'react-router-dom';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { faL } from '@fortawesome/free-solid-svg-icons';
import BillingPopup from './Historysearch.js'
{/* <button type="button" onClick={handleAddRow}>AddServices</button> */}
const Popup = ({ appointment, onClose }) => {

  const [isEditable, setIsEditable] = useState(true);
  const [quotationData, setQuotationData] = useState(null); 
  useEffect(() => {
    if (appointment) {
      document.body.classList.add('modal-open'); 
    } 
    // Cleanup function to ensure overflow is reset if the component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [appointment]);
  const [showr,setShowr]=useState(false)

  const today = new Date();
  
// Format date as YYYY-MM-DD for the input
const formattedDate = today.toISOString().split('T')[0];

// Function to convert YYYY-MM-DD to M/D/YYYY for display
const formatToDisplay = (date) => {
  const [year, month, day] = date.split('-').map(Number);
  return `${month}/${day}/${year}`;
};

// Format the default value for display
const displayDate = formatToDisplay(formattedDate);

// State to manage the date input


// Handle date change
const handleDateChange = (e) => {
  setDate(e.target.value);
};

  // console.log('apointment',appointment)
  const [companyInfo, setCompanyInfo] = useState({
    companyNo: '',
    companyName: '',
  });
  const [sr,setSr]=useState(false);
  const [date, setDate] = useState(formattedDate);
  const [newTH, setNewTH] = useState(null);
  const [newTrans, setNewTrans] = useState(null);
  //newstate for historypopup
  const [popupData, setPopupData] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const [maxDiscountPercentage, setMaxDiscountPercentage] = useState(0);
  const [showInsurance, setShowInsurance] = useState('');
  const [codeins, setCodeins] = useState(null);
  const[acc,setAcc]=useState(null);
  const [reportData, setReportData] = useState([] );
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscountp, setTotalDiscountp] = useState(0);
  const [patientCashPay, setPatientCashPay] = useState(0);
  const [patientCardPay, setPatientCardPay] = useState(0);
  const [insuranceShareBalance, setInsuranceShareBalance] = useState(0);
  
 
  const [searchCode, setSearchCode] = useState('');
  const [maxSessionNo, setMaxSessionNo] = useState(null);
  const [billingDetails, setBillingDetails] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [prices, setPrices] = useState({});
  const [dropdownValues, setDropdownValues] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [rowDiscounts, setRowDiscounts] = useState({});
  const [paymentAmounts, setPaymentAmounts] = useState({
    cash: 0,
    creditCard: 0,
    insurance: 0,
  });
  const [totalBill, setTotalBill] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [netBill, setNetBill] = useState(0);
  const [validationMessage, setValidationMessage] = useState('');
  useEffect(() => {
    const fetchCustomerInsurance = async () => {
      try {
        // Assuming the patient ID is available in the appointment object
        const patientId = appointment?.PAT_ID;
        if (patientId) {
          const response = await API.get(`/api/customers/${patientId}`);
          const customerData = response.data;
          setCodeins(customerData.bankCode);
          setShowInsurance(customerData.insuranceName)
          setAcc(customerData.accno)
         (codeins,'code')
        }
      } catch (error) {
        console.error('Error fetching customer insurance:', error);
      }
    };
  
    fetchCustomerInsurance();
  }, [appointment]);



  useEffect(() => {
    const fetchQ = async () => {
      try {
        // Extract patient ID and visit ID from appointment object
        const patientId = appointment?.PAT_ID;
        const visitId = appointment?.VISIT_ID;

        // Ensure both IDs are available
        if (patientId && visitId) {
          const response = await API.get(`/api/Q/${patientId}?visitId=${visitId}`); // Pass visitId as query parameter
          const data = response.data;
          setQuotationData(data);
         
          console.log(data, 'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQuotation Data'); // Debugging output
        }
      } catch (error) {
        console.error('Error fetching quotation data:', error);
      }
    };

    fetchQ();
  }, [appointment]); 
  
  //now
  
  //1
  useEffect(() => {
    const storedCompanyNo = localStorage.getItem('COM_NO') || '';
    const storedCompanyName = localStorage.getItem('companyNAME_E') || '';
    setCompanyInfo({
      companyNo: storedCompanyNo,
      companyName: storedCompanyName,
    });
  
    const priceAccess = localStorage.getItem('PRICE_ACCESS');
    const discountPercentage = parseFloat(localStorage.getItem('DISCOUNT_PERCENTAGE') || '0');
    setMaxDiscountPercentage(discountPercentage);
  
    const options = ['1'];
    if (priceAccess) {
      options.push(priceAccess);
    }
    setDropdownOptions(options);
  
    const initialDiscounts = {};
    billingDetails.forEach((_, index) => {
      const role = dropdownValues[index] || '1';
      initialDiscounts[index] = role === '1' ? '0' : discountPercentage;
    });
    setRowDiscounts(initialDiscounts);
  }, [billingDetails, dropdownValues]);
  

  
  useEffect(() => {
    const initialQuantities = {};
    const initialPrices = {};

    billingDetails.forEach((detail, index) => {
      initialQuantities[index] = 1; // Default quantity
      initialPrices[index] = detail.servicePrice || 0; // Default price
    });

    setQuantities(initialQuantities);
    setPrices(initialPrices);
  }, [billingDetails]);

  useEffect(() => {
    let totalBillAmount = 0;
    let totalDiscountAmount = 0;

    billingDetails.forEach((detail, index) => {
      const quantity = quantities[index] || 1;
      const price = prices[index] || 0;
      const discountPercentage = rowDiscounts[index] || '0';
      const total = quantity * price;
      const discountAmount = (total * (parseFloat(discountPercentage) || 0)) / 100;

      totalBillAmount += total;
      totalDiscountAmount += discountAmount;
    });

    setTotalBill(totalBillAmount.toFixed(2));
    setTotalDiscount(totalDiscountAmount.toFixed(2));
    setNetBill((totalBillAmount - totalDiscountAmount).toFixed(2));
  }, [billingDetails, quantities, prices, rowDiscounts]);

  

  const handleSearch = () => {
    if (searchCode) {
      fetchBillingDetails(searchCode);
    }
  };

  const handleQuantityChange = (index, value) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [index]: value
    }));
  };

  const handleDropdownChange = (index, value) => {
    setDropdownValues(prevValues => ({
      ...prevValues,
      [index]: value
    }));
  };

  const handlePriceChange = (index, value) => {
    setPrices(prevPrices => ({
      ...prevPrices,
      [index]: value
    }));
  };
  const handleDiscountChange = (index, value) => {
    setRowDiscounts(prevDiscounts => {
      const role = dropdownValues[index] || '1';
      const maxDiscount = role === '1' ? maxDiscountPercentage : Number.MAX_VALUE; // No limit for other roles
      return {
        ...prevDiscounts,
        [index]: Math.min(value, maxDiscount) // Ensure the discount does not exceed the maximum allowed
      };
    });
  };
  


  const handleCancel = () => {
    setBillingDetails([]);
    setQuantities({});
    setDropdownValues({});
    setPrices({});
    setRowDiscounts({});
  };

  const handlePaymentChange = (type, value) => {
    setPaymentAmounts(prev => ({
      ...prev,
      [type]: parseFloat(value) || 0
    }));
  };
  const [selectedPaymentType, setSelectedPaymentType] = useState({
    cash: 'CA',
    creditCard: 'CC',
    insurance: 'CC'
  });
  
  const handlePaymentTypeChange = (type, value) => {
    setSelectedPaymentType(prev => ({
      ...prev,
      [type]: value
    }));
  };
  

  const validatePayments = () => {
    const totalEntered = Object.values(paymentAmounts).reduce((sum, amount) => sum + amount, 0);

    if (totalEntered === parseFloat(netBill)) {
      setValidationMessage('');
    } else {
      setValidationMessage('Entered amounts do not match the Net Bill amount.');
    }
  };

  useEffect(() => {
    validatePayments();
  }, [paymentAmounts, netBill]);

  useEffect(() => {
    if (quotationData && quotationData.lines && quotationData.lines.length > 0) {
        const newBillingDetails = quotationData.lines.map(line => ({
          serviceCode: String(line.REF_CODE),
            serviceName: line.ITM_FOREIGN_DESC,
            uomDescription: line.UOM_CODE,
servicePrice:line.PRICE
            // Additional fields can be added as needed
        }));
        setBillingDetails(newBillingDetails);
    } else {
        // If no lines from quotationData, keep existing billingDetails
        // setBillingDetails(existingBillingDetails); // Adjust as necessary to reference your existing data
    }
}, [quotationData]); // Add any dependencies as necessary



  const [maxTHSEQ, setMaxTHSEQ] = useState(null);
  const [maxTLSEQ, setMaxTLSEQ] = useState(null);
  const [maxTRANSPAY, setMaxTRANSPAY] = useState(null);
  const [maxINFPAY, setMaxINFPAY] = useState(null);
  const[maxINFO,setMaxINFO]=useState(null)
  const [maxTransactionHeaderSerial, setMaxTransactionHeaderSerial] = useState(null);
  const [ccode,setCcode]=useState(null);

  useEffect(() => {
      const fetchMaxSessionNo = async () => {
          try {
              const response = await API.get('/api/getMaxSessionNo');
              setMaxSessionNo(response.data.maxSessionNo);
              // console.log('Maximum Session No:', response.data.maxSessionNo);
          } catch (error) {
              console.error('Error fetching maximum session number:', error);
          }
      };
      const fetchMaxINFINFO = async () => {
        try {
            const response = await API.get('/api/getMaxPAYINFINFO');
            setMaxINFO(response.data.PAYINF);
            // console.log('Maximum TH_SEQ:', response.data.PAYINF);
        } catch (error) {
            console.error('Error fetching maximum TH_SEQ:', error);
        }
    };

      const fetchMaxTHSEQ = async () => {
          try {
              const response = await API.get('/api/getMaxTHSEQ');
              setMaxTHSEQ(response.data.maxTHSEQ);
              // console.log('Maximum TH_SEQ:', response.data.maxTHSEQ);
          } catch (error) {
              console.error('Error fetching maximum TH_SEQ:', error);
          }
      };
      const fetchMaxTLSEQ = async () => {
        try {
            const response = await API.get('/api/getMaxTLSEQ');
            setMaxTLSEQ(response.data.maxTLSEQ);
            // console.log('Maximum TL_SEQ:', response.data.maxTLSEQ);
        } catch (error) {
            console.error('Error fetching maximum TL_SEQ:', error);
        }
    };
    const fetchMaxTRANSPAY = async () => {
      try {
          const response = await API.get('/api/getMaxTRANSPAY');
          setMaxTRANSPAY(response.data.maxTPAY);
          // console.log('Maximum TL_SEQ:', response.data.maxTPAY);
      } catch (error) {
          console.error('Error fetching maximum TL_SEQ:', error);
      }
  };

const fetchMaxTransactionHeaderSerial = async () => {
  try {
      // Retrieve STR_CODE and COM_NO from localStorage
      const strCode = localStorage.getItem('STR_CODE');
      const comNo = localStorage.getItem('COM_NO');

      if (!strCode || !comNo) {
          throw new Error('STR_CODE or COM_NO is not found in localStorage');
      }

      // Make the request with STR_CODE and COM_NO as query parameters
      const response = await API.get('/api/getMaxTransactionHeaderSerial', {
          params: {
              strCode: strCode,
              comNo: comNo
          }
      });

      // Set the response data
      const { maxTransactionHeaderSerial, bankCode, bankDetails } = response.data;
      
      // Handle the bankCode as a single number
      // console.log('Bank Code:', bankCode); 
      setCcode(bankCode)// Single bank code
      setMaxTransactionHeaderSerial(maxTransactionHeaderSerial);
      // console.log('Maximum Transaction Header Serial:', maxTransactionHeaderSerial);
      // console.log('Bank Details:', bankDetails);

  } catch (error) {
      console.error('Error fetching maximum Transaction Header Serial:', error);
  }
};


      const fetchAllData = async () => {
          try {
              await Promise.all([
                  fetchMaxSessionNo(),
                  fetchMaxTHSEQ(),
                  fetchMaxTransactionHeaderSerial(),
                  fetchMaxTLSEQ(),
                  fetchMaxTRANSPAY(),
                  // fetchMaxPAYINF()
                  fetchMaxINFINFO()
              ]);
          } catch (error) {
              console.error('Error fetching data from multiple endpoints:', error);
          }
      };

      fetchAllData();
  }, []);

  const handleAddRow = () => {
    setBillingDetails(prevDetails => [
      ...prevDetails,
      {
        serviceCode: '',
        serviceName: '',
        uomDescription: '',
        servicePrice: 0
      }
    ]);
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [billingDetails.length]: 1
    }));
    setPrices(prevPrices => ({
      ...prevPrices,
      [billingDetails.length]: 0
    }));
    setRowDiscounts(prevDiscounts => ({
      ...prevDiscounts,
      [billingDetails.length]: '0'
    }));
  };

  if (!appointment) return null;
  
  const handleSave = async () => {
    setIsEditable(false);
    // alert(maxTHSEQ)
    setShowr(true)
    const username = localStorage.getItem('username') || ''; // Adjust the key as needed
  const strcode = localStorage.getItem('STR_CODE') || ''; // Adjust the key as needed
  const com_no = localStorage.getItem('COM_NO') || ''; // Adjust the key as needed
  const newSessionNo = maxSessionNo !== null ? maxSessionNo + 1 : 1;
   const newthnew=maxTHSEQ !== null ? maxTHSEQ + 1 : 1;

   const newtransnew=maxTransactionHeaderSerial !== null ? maxTransactionHeaderSerial + 1 : 1;
  const newTL = maxTLSEQ !== null ? maxTLSEQ + 1 : 1;
  setNewTH(newthnew);
  setNewTrans(newtransnew);
  const newTPAY = maxTRANSPAY !== null ? maxTRANSPAY + 1 : 1;
  const newINF = maxINFO !== null ? maxINFO +1 :1;
 
    // Prepare billing data
    const billingData = billingDetails.map((detail, index) => {
      const quantity = quantities[index] || 1;
      const price = prices[index] || 0;
      const discountPercentage = rowDiscounts[index] || '0';
      const total = quantity * price;
      const discountAmount =Math.floor((total * (parseFloat(discountPercentage) || 0)) / 100); // Calculate discountAmount
    
      return {
        serviceCode: detail.serviceCode,
        serviceName: detail.serviceName,
        uomDescription: detail.uomDescription,
        quantity: quantity,
        price: price,
        discountPercentage: discountPercentage,
        discountAmount: discountAmount // Include discountAmount here
      };
    });
    
    // const billingData = billingDetails.map((detail, index) => ({
    //   serviceCode: detail.serviceCode,
    //   serviceName: detail.serviceName,
    //   uomDescription: detail.uomDescription,
    //   quantity: quantities[index] || 1,
    //   price: prices[index] || 0,
    //   discountPercentage: rowDiscounts[index] || '0',
      
    // }));
    // Calculate the total discount percentage
    const totalDiscountPercentage = billingData.reduce((total, detail) => {
      const discount = parseFloat(detail.discountPercentage) || 0;
      return total + discount;
  }, 0);
  
  const paymentData = {
    cash: {
      type: selectedPaymentType.cash,
      amount: paymentAmounts.cash || 0
    },
    creditCard: {
      type: selectedPaymentType.creditCard,
      amount: paymentAmounts.creditCard || 0
    },
    insurance: {
      type: selectedPaymentType.insurance,
      amount: paymentAmounts.insurance || 0
    }
  };

  const totalPayment = Object.values(paymentData).reduce((sum, payment) => sum + payment.amount, 0);
  // Log paymentData and totalPayment to debug
  // console.log('Payment Data:', paymentData);
  // console.log('Total Payment:', totalPayment);
    // Compile form data
    const formData = {
      CUST_ID:appointment.CUST_ID,
      visitid:appointment.VISIT_ID,
      patientName: appointment.PATIENT_FIRST_NAME || '',
      fileNo: appointment.PAT_ID || '',
      doctor: appointment.DOCTOR_ID || '',
      billingData,
      paymentData,
      totalBill,
      totalDiscount,
      netBill, username,     // Add username here
      com_no,       // Add com_no here
      strcode  ,
       newSessionNo,
      maxTHSEQ,
      maxTransactionHeaderSerial,
    newTL,
    newTPAY,
    newINF,
    totalPayment,
    totalDiscountPercentage,
  codeins,
showInsurance,
acc ,
ccode ,
date,
...(quotationData ? {
  QS: quotationData.header.QUOTHEAD_SERIAL,
  QY: quotationData.header.QUOTHEAD_YEAR,
  QC: quotationData.header.TRANSTYP_CODE
} : {}),};
  // alert(newTH)
    // Log the form data to the console
    console.log('Form Data to be sent:', formData);
  
    try {
      // Optionally log the response if needed
      const response = await API.post('/api/BillingData', formData);
      // console.log('Response from API:', response);
      alert('Data saved successfully!');
    } catch (error) {
      console.log('Failed to save data:', error);
      alert('Failed to save data. Please try again.');
    }
  };
 

  const handlePrint = () => {
    // Prepare report data based on billing details and associated data
    const reportData = billingDetails.map((detail, index) => {
        // Calculate quantity, price, discount amount, total, and discount percentage for each item
        const quantity = quantities[index] || 1;
        const price = prices[index] || 0;
        const discountPercentage = parseFloat(rowDiscounts[index] || '0');
        const total = quantity * price;
        const discountAmount = total * (discountPercentage / 100);

        return {
            serviceCode: detail.serviceCode,
            serviceName: detail.serviceName,
            quantity: quantity,
            price: price,
            discountPercentage: discountPercentage, // Include discount percentage
            discountAmount: discountAmount,
            total: total
        };
    });

    // Update state to trigger rendering of the report
    setSr(true); // Example state update (for showing/hiding print component)
    setReportData(reportData); 
    const totalAmount = reportData.reduce((sum, item) => sum + item.total, 0);
    const totalDiscountp = reportData.reduce((sum, item) => sum + item.discountAmount, 0);
    const patientCashPay = paymentAmounts.cash || 0;
    const patientCardPay = paymentAmounts.creditCard || 0;
    const insuranceShareBalance = paymentAmounts.insurance || 0;
    setTotalAmount(totalAmount);
    setTotalDiscountp(totalDiscountp);
    setPatientCashPay(patientCashPay);
    setPatientCardPay(patientCardPay);
    setInsuranceShareBalance(insuranceShareBalance);// Set the data to state
};

  
  const handleC = () => {
    setSr(false);
};
const fetchBillingDetails = async (code) => {
  try {
    const response = await API.get(`/api/billingDetails/${code}`);
    // console.log(response,'fetchbillingdatafrom distrubution table')
    const newDetails = response.data.billingDetails;

    // Open the popup with the fetched details
    setPopupData(newDetails);
    setIsPopupVisible(true);

  } catch (err) {
    console.error('Failed to fetch billing details.', err);
  }
};

const closePopup = () => {
  setIsPopupVisible(false);
};

const addSelectedDetails = (selectedDetails) => {
  setBillingDetails(prevDetails => {
    const existingCodes = new Set(prevDetails.map(detail => detail.serviceCode));
    const uniqueNewDetails = selectedDetails.filter(detail => !existingCodes.has(detail.serviceCode));
    return [...prevDetails, ...uniqueNewDetails];
  });

  setRowDiscounts(prevDiscounts => {
    const updatedDiscounts = { ...prevDiscounts };
    selectedDetails.forEach(detail => {
      if (!(detail.serviceCode in updatedDiscounts)) {
        updatedDiscounts[detail.serviceCode] = localStorage.getItem('DISCOUNT_PERCENTAGE') || '0';
      }
    });
    return updatedDiscounts;
  });

  setIsPopupVisible(false);
};
const handleRemoveRow = (index) => {
  
  const updatedDetails = billingDetails.filter((_, idx) => idx !== index);
  setBillingDetails(updatedDetails);



  

 
}; 





  return (
    <div className="Ppopup-overlay">
      <div className="Ppopup-content">
        <img src={logo} alt="Clinic Logo" className="Ppopup-logo" />
        <button className="Ppopup-close" onClick={onClose}>X</button>
        <form className="Ppopup-form">
          <div>
            <h2 className="Ppopup-heading">Bill Information</h2>
            <div className="Ppopup-company-info">
              <div className="Ppopup-company-item">{companyInfo.companyNo}</div>
              <div className="Ppopup-company-item">{companyInfo.companyName}</div>
            </div>
          </div>
          <div className="Pform-row full-width">
            <div className="Pform-group">
              <label htmlFor="patientName">Patient Name:</label>
              <input id="patientName" type="text"  defaultValue={appointment.PATIENT_FIRST_NAME || ''}  readOnly />
            </div>
            <div className="Pform-group">
              <label htmlFor="fileNo">File No:</label>
              <input id="fileNo" type="text" defaultValue={appointment.PAT_ID || ''} readOnly />
            </div>
            <div className="Pform-group">
              <label htmlFor="doctor">Doctor:</label>
              <input id="doctor" type="text" defaultValue={appointment.DOCTOR_ID || ''} readOnly />
            </div>
          <div className='Pform-group'>
          <label htmlFor="da">Date</label>
      <input 
      readOnly
        // type="date"
        id="date"
        value={date}
        onChange={handleDateChange}
        // Note: The input value must be in YYYY-MM-DD format
      />
          </div>
          </div>
          <div className="Ppopup-table-container">
            <h2 className="Ppopup-heading">Billing Details</h2>
            <div className="Ppopup-search">
              <input 
              
                type="text"
                placeholder="Search by Name or Code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <button type="button" onClick={handleSearch}>Search</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
              
            </div>
            <table className="Ppopup-table">
              <thead>
                <tr>
                  <th>Service Code</th>
                  <th>Service Name</th>
                  <th>Batch</th>
                  <th>UOM</th>
                  <th>QTY</th>
                  <th></th>
                  <th>Service Price</th>
                  <th>Total</th>
                  <th>Disc (%)</th>
                  <th>Disc Amt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {billingDetails.length > 0 ? (
                  billingDetails.map((detail, index) => {
                    const quantity = quantities[index] || 1;
                    const price = prices[index] || 0;
                    const dropdownValue = dropdownValues[index] || '1';
                    const discountPercentage = rowDiscounts[index] || '0';
                    const total = (quantity * price).toFixed(2);
                    const discountAmount = (((quantity * price) * (parseFloat(discountPercentage) || 0)) / 100).toFixed(2);

                    return (
                      <tr key={index}>
                        <td>
                          <input 
                          readOnly={!isEditable}
                            type="text"
                            value={detail.serviceCode}
                            onChange={(e) => {
                              const updatedDetails = [...billingDetails];
                              updatedDetails[index].serviceCode = e.target.value;
                              setBillingDetails(updatedDetails);
                            }}
                          />
                        </td>
                        <td>
                          <input 
                          readOnly={!isEditable}
                            type="text"
                            value={detail.serviceName}
                            onChange={(e) => {
                              const updatedDetails = [...billingDetails];
                              updatedDetails[index].serviceName = e.target.value;
                              setBillingDetails(updatedDetails);
                            }}
                          />
                        </td>
                        <td>1</td>
                        <td>
                          <input 
                          readOnly={!isEditable}
                            type="text"
                            value={detail.uomDescription}
                            onChange={(e) => {
                              const updatedDetails = [...billingDetails];
                              updatedDetails[index].uomDescription = e.target.value;
                              setBillingDetails(updatedDetails);
                            }}
                          />
                        </td>
                        <td>
                          <div className="qty-dropdown-container">
                            <input 
                            readOnly={!isEditable}
                              type="number"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(index, e.target.value)}
                              min="0"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="qty-dropdown-container">
                            <select 
                            readOnly={!isEditable}
                              value={dropdownValue}
                              onChange={(e) => handleDropdownChange(index, e.target.value)}
                            >
                              {dropdownOptions.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td>
                          <input
                          readOnly={!isEditable}
                            type="number"
                            value={price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            disabled={dropdownValue !== '6'}
                          />
                        </td>
                        <td>{total}</td>
                        <td>
  <input 
  readOnly={!isEditable}
    type="number"
    value={rowDiscounts[index] || 0}
    onChange={(e) => handleDiscountChange(index, parseFloat(e.target.value) || 0)}
    max={dropdownValues[index] === '1' ? maxDiscountPercentage : undefined} // Limit only for role 1
  />
</td>

                        <td>{discountAmount}</td>
                        <td>
                        {isEditable ? (
    <button 
        type="button"
        onClick={() => handleRemoveRow(index)}
    >
        Remove
    </button>
) : (
    <span style={{ color: 'gray', cursor: 'not-allowed' }}>Remove</span>
)}
                </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10">No billing details available</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="Ppopup-payment-container">
              <h2 className="Ppopup-heading">Bill Payment</h2>
              <div className="Ppopup-payment-form">
              <div className="payment-row">
              {['cash', 'creditCard', 'insurance'].map((type, index) => (
  <div className="payment-group" key={index}>
    <div className="payment-item">
      <label htmlFor={`paymentType${index}`}>Type</label>
      <select
        id={`paymentType${index}`}
        value={selectedPaymentType[type] || ''}
        onChange={(e) => handlePaymentTypeChange(type, e.target.value)}
      >
        {/* Show "Cash" for cash payments */}
        {type === 'cash' && (
          <option value="CA">Cash</option>
        )}
        {/* Show "Visa Card" for credit card payments */}
        {type === 'creditCard' &&  (
  <option value="CC">Visa Card</option>
)}

        {/* Show "Insurance" for insurance payments */}
        {type === 'insurance' && codeins !== null && (
          <option value="INS">Insurance</option>
        )}
      </select>
    </div>
    <div className="payment-item">
      <label htmlFor={`amount${index}`}>Amount:</label>
      <input 
      readOnly={!isEditable}
        id={`amount${index}`}
        type="number"
        value={paymentAmounts[type] || ''}
        onChange={(e) => handlePaymentChange(type, e.target.value)}
      />
    </div>
  </div>
))}

</div>



                <div className="Pform-row">
                  <div className="Pform-group third-width">
                    <label htmlFor="totalBill">Total Bill:</label>
                    <input id="totalBill" type="text" value={totalBill} readOnly />
                  </div>
                  <div className="Pform-group third-width">
                    <label htmlFor="totalDiscount">Total Discount:</label>
                    <input id="totalDiscount" type="text" value={totalDiscount} readOnly />
                  </div>
                  <div className="Pform-group third-width">
                    <label htmlFor="netBill">Net Bill:</label>
                    <input id="netBill" type="text" value={netBill} readOnly />
                  </div>
                </div>
                {validationMessage && <div className="validation-message">{validationMessage}</div>}
              </div>
            </div>
          </div>
        </form>
        <button type="button" onClick={handleSave}>Save</button>
        {(
          showr && (<button type="button"  onClick={handlePrint}   >Report</button>)
        )}

      </div>
      { sr  && <ReportPage newTH={newTH} maxTransactionHeaderSerial={maxTransactionHeaderSerial}
      totalAmount={totalAmount}
      totalDiscountp={totalDiscountp}
      patientCashPay={patientCashPay}
      patientCardPay={patientCardPay}
      insuranceShareBalance={insuranceShareBalance}
       PAT_ID={appointment.PAT_ID} DOCTOR_ID={appointment.DOCTOR_ID} reportData={reportData} date={date}
      onClose={handleC} />}
      {isPopupVisible && (
        <BillingPopup
          details={popupData}
          onClose={closePopup}
          onSelect={addSelectedDetails}
        />
      )}

    </div>
  );
};

export default Popup;

