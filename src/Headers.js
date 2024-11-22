
import React from 'react'
import { useEffect,useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'

const Header = ({OpenSidebar, onLogout}) => {
    const [showLogoutButton, setShowLogoutButton] = useState(false);
  const navigate = useNavigate();
    useEffect(() => {
        const loggedInUsername = localStorage.getItem('username');
        if (loggedInUsername) {
            setUsername(loggedInUsername);
        }
    }, []);
    
    const [username, setUsername] = useState('');
    
  const handleUserInitialClick = () => {
    setShowLogoutButton(!showLogoutButton);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('ac');
    navigate("/");
    onLogout();
    
  };
    return (
        <header className='header'>
            <div className='menu-icon'>
                <BsJustify className='icon' onClick={OpenSidebar}/>
            </div>
            <div className='header-left'>
                
            </div>
            <div className='header-right'>
               
              
              
                <div className="nav-item">
            <a className="nav-link" onClick={handleUserInitialClick}>
              <span className="fas fa-user-circle"></span>WelCome {username}
            </a>
          </div>
          {showLogoutButton &&
          <div className="navbar-nav">
            <div className="nav-item">
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Logout <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
         
          </div>
        }
            </div>
        </header>
      )
}

export default Header
