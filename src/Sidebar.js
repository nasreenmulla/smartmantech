

import React, { useEffect, useState } from 'react';
import { GiTestTubes } from 'react-icons/gi';
import { BsFileText, BsInfoCircle, BsPeopleFill, BsClipboardData, BsCardText } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import API from './Api';

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const [roles, setRoles] = useState([]);

  const [usernameType, setUsernameType] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchLab = async () => {
      try {
        const username = localStorage.getItem('username');
        // alert(username)// Get username from localStorage
        if (username) {
          const response = await API.get('/api/user/lab', {
            params: { username } // Send username as a query parameter
          });
          console.log(response.data.isAuthorized, 'LABsidebar');
          localStorage.setItem('ac',response.data.isAuthorized)
          // Assuming isAuthorized returns 'Y' or 'N'
         
      
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLab();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
     
      try {
        const username = localStorage.getItem('username'); // Get username from localStorage
        if (username) {
          const response = await API.get('/api/user/details', {
            params: { username } // Send username as a query parameter
          });
          console.log(response.data, 'PAAMSTYPE');
          setUsernameType(response.data.userType);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();

    // Retrieve roles and their active status from localStorage
    const retrievedRoles = [];
    for (let key in localStorage) {
      if (key.startsWith('ROLE_ID_')) {
        const roleId = localStorage.getItem(key);
        const activeStatus = localStorage.getItem(`ACTIVE_${roleId}`);
        if (roleId && activeStatus) {
          retrievedRoles.push({ ROLE_ID: roleId, ACTIVE: activeStatus });
        }
      }
    }
    setRoles(retrievedRoles);
  }, []);

  const hasRole = (roleId, activeStatus) => {
    return roles.some(role => role.ROLE_ID === roleId && role.ACTIVE === activeStatus);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user details
  }
  const Show = localStorage.getItem('ac');
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>
        {Show ? (
          <li className='sidebar-list-item'>
            <Link>
              <GiTestTubes className='icon' /> Lab Management
            </Link>
            <ul className="sub-menu">
              <li className='sidebar-list-item'>
                <Link to='/LB'>
                  <BsClipboardData className='icon' /> Lab Master Information
                </Link>
              </li>
              <li className='sidebar-list-item'>
                <Link to='/LR'>
                  <BsCardText className='icon' /> Lab Result Details
                </Link>
              </li>
            </ul>
          </li>
        ) : (
          <li className='sidebar-list-item'>
            <a href="">
              <BsPeopleFill className='icon' /> Clinics Management
            </a>
            <ul className="sub-menu">
              {hasRole('550', 'Y') && (
                <>
                  <li className='sidebar-list-item'>
                    <Link to="/PP" className="sidebar-link">
                      <BsFileText className='icon' /> Patient Profile
                    </Link>
                  </li>
                  <li className='sidebar-list-item'>
                    <Link to='/AS'>
                      <BsFileText className='icon' /> Appointment Scheduler
                    </Link>
                  </li>
                  <li className='sidebar-list-item'>
                    <Link to='/SV'>
                      <BsFileText className='icon' /> Schedule Visit
                    </Link>
                  </li>
                  <li className='sidebar-list-item'>
                    <Link to='/PR'>
                      <BsFileText className='icon' /> Patient Reads
                    </Link>
                  </li>
                  {usernameType === 'D' && hasRole('550', 'Y') && (
                    <li className='sidebar-list-item'>
                      <Link to='/VD'>
                        <BsInfoCircle className='icon' /> Visit Details
                      </Link>
                    </li>
                  )}
                  <li className='sidebar-list-item'>
                    <Link to='/PH'>
                      <BsFileText className='icon' /> Patient History
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;

