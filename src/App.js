
import React, { useState, useRef } from 'react';
import { NavigateOptions,ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject,ViewsDirective,ViewDirective,TimelineViews,TimelineMonth, DragAndDrop,Resize, DragEventArgs, ResizeEventArgs,ScrollOptions } from '@syncfusion/ej2-react-schedule';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './Headers';
import Sidebar from './Sidebar';
import Login from './Pages/Login/Login';
import Patient from './Pages/Patient/Patient';
import Reads from './Pages/Reads/Reads';
import Schedule from './Pages/Schedule/Schedule';
import Visit from './Pages/Visit/Visit';
import Appointment from './Pages/Appointment/Appointment'
import History from './Pages/History/History'
import Historybill from './Pages/History/Historybill';
import Lab from './Pages/Lab/Lab'
import Res from './Pages/Lab/Res';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// import  './Sync'

import './App.css'
import downloadImage from './download.jpg'; // Adjust the path as necessary
import ReportPage from './Pages/Popup/ReportPage';
import Popup from './Pages/Popup/Popup';


function App() {
  return (
    <div>
      <Router>
        <Appc />
      </Router>
    </div>
  );
}

function Appc() {
  const location = useLocation();

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };


 

  console.log('Current path:', location.pathname);

 
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    return storedAuthStatus === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Persist authentication
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Clear authentication
  };

  // Check local storage on load
  useEffect(() => {
    const storedAuthStatus = localStorage.getItem('isAuthenticated');
    if (storedAuthStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);


  
  return (
    <div>
      <div className='scheduler-component' >
        <Routes>
          <Route exact path='/' element={<Login onLogin={handleLogin}  />} />
        </Routes>
      {isAuthenticated ? (  <> {location.pathname !== '/' && (
          <div className='grid-container'> 
            <Header OpenSidebar={OpenSidebar} onLogout={handleLogout} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
  
          <Routes>
              <Route exact path='/PP' element={<Patient />} />
              <Route exact path='/patientprofile' element={<Patient />} />
              <Route exact path='/SV' element={<Schedule />} />
              <Route path="/patientBILL" element={<Historybill />} />
              <Route exact path='/PR' element={<Reads />} />
              <Route exact path='/VD' element={<Visit />} />
              <Route exact path='/AS' element={<Appointment />} />
              <Route exact path='/PH' element={<History />} />
              <Route exact path='/LB' element={<Lab/>} />
              <Route exact path='/LR' element={<Res/>} />
            </Routes> 
          </div>
        )}</>):(
        <Navigate to="/" />
        )}
       
      </div>
    </div>
  );
  
  
}

export default App;
