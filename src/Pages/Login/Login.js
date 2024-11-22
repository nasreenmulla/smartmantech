import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faStar,faBuilding } from '@fortawesome/free-solid-svg-icons'; // Import faStar for the star icon
import './Login.css'; // CSS file for styling
import API from '../../Api/index.js';
import { Navigate, useNavigate } from 'react-router-dom';

// Import local images
import img1 from '../../images/image1.jpg';
import img2 from '../../images/image2.avif';
import img3 from '../../images/image3.jpg';
import img4 from '../../images/image4.jpg';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({ username: '', password: '', company: '' }); // Added 'company' state
    const [errorMessage, setErrorMessage] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [companies, setCompanies] = useState([]); // State to hold companies fetched from API
    const images = [img1, img2, img3, img4];
    const [sh,setSh]=useState('');
    const navigate = useNavigate();
   




    useEffect(() => {
       
      
        // Function to fetch companies from API
        const fetchCompanies = async () => {
            try {
                const response = await API.get('/api/company');
                console.log(response)
                setCompanies(response.data); // Assuming API returns an array of objects [{ COM_NO, NAME_E }]
            } catch (error) {
                console.error('Error fetching companies:', error);
                // Handle error if needed
            }
        };

        fetchCompanies(); // Call the fetch function
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Function to handle form submission
    const handleSubmit = async (event) => {
    
        event.preventDefault();
    
        try {
            // Attempt to log in
            const response = await API.post('/api/login', formData);
            console.log(response);
      




            if (response.status === 200) {
                console.log('Login successful!');
                onLogin();
                
                const { username, company } = formData;
               




                // Find the selected company object from state based on COM_NO
                const selectedCompany = companies.find(comp => comp.COM_NO === parseInt(company));
    
                if (selectedCompany) {
                    // Save username, selected company COM_NO and NAME_E to localStorage
                    localStorage.setItem('username', username);
                    localStorage.setItem('COM_NO', selectedCompany.COM_NO);
                    localStorage.setItem('companyNAME_E', selectedCompany.NAME_E);



    
                    // Save login date in desired format to localStorage
                    const currentDate = new Date();
                    const formattedDate = currentDate.toISOString().split('T')[0]; // Formats as "yyyy-MM-dd"
                    localStorage.setItem('loginDate', formattedDate);
    
                    // Set Active as 'Yes' by default
                    localStorage.setItem('Active', 'Yes');



// Store in localStorage
    
                    // Fetch and store user roles (if available)
                    try {
                        const userRoleResponse = await API.get(`/api/userRole/${username}`);
                        console.log('User Roles:', userRoleResponse.data.roles);
                        const roles = userRoleResponse.data.roles;
    
                        if (roles.length > 0) {
                            roles.forEach(role => {
                                const { ROLE_ID, ACTIVE } = role;
                                
                                // Store each role's details in localStorage
                                localStorage.setItem(`ROLE_ID_${ROLE_ID}`, ROLE_ID);
                                localStorage.setItem(`ACTIVE_${ROLE_ID}`, ACTIVE);
                            });
                        }
                    } catch (roleError) {
                        console.error('Error fetching user roles:', roleError);
                        // Continue even if fetching roles fails
                    }
                    try {
                        const userDetailsResponse = await API.get(`/api/userDetails/${username}`);
                        console.log('User Details:', userDetailsResponse.data);
    
                        const { priceAccess, active: userActive, discountPercentage } = userDetailsResponse.data;
                        const userlab = await API.get('/api/user/lab', {
                            params: { username } // Send username as a query parameter
                          });
                          const isAuthorized = userlab.data.isAuthorized; // Expecting 'Y' or 'N'
                          localStorage.setItem('ac', isAuthorized);
                        // Store additional user details in localStorage
                        localStorage.setItem('PRICE_ACCESS', priceAccess);
                        localStorage.setItem('USER_ACTIVE', userActive);
                        localStorage.setItem('DISCOUNT_PERCENTAGE', discountPercentage);
                        if (isAuthorized === 'Y') {
                            navigate('/LB');
                        } else {
                            navigate('/AS');
                        }
                    } catch (userDetailsError) {
                        console.error('Error fetching user details:', userDetailsError);
                        // Continue even if fetching user details fails
                    }
           
                    // Navigate to the desired route
                   
                } else {
                    throw new Error('Selected company not found');
                }
    
            } else {
                throw new Error('Login failed');
            }
    
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Login failed. Please check your credentials.');
        }
    };
    

    // UseEffect for changing background images
    useEffect(() => {
       
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change image every 5 seconds (5000 milliseconds)

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="login-container">
            <div
                className="background-image"
                style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            />
            <div className="background-overlay"></div>
            <div className="login-box">
                <h2 style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'bold', color: '#333333' }}>Welcome to SMART</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <span className="icon"><FontAwesomeIcon icon={faUser} /></span>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="mandatory-mark"><FontAwesomeIcon icon={faStar} className="star-icon" /></span>
                    </div>
                    <div className="input-group">
                        <span className="icon"><FontAwesomeIcon icon={faLock} /></span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        <span className="mandatory-mark"><FontAwesomeIcon icon={faStar} className="star-icon" /></span>
                    </div>
                    <div className="input-group">
                        <span className="icon"><FontAwesomeIcon icon={faBuilding} /></span>
                        <select
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Company</option>
                            {companies.map(company => (
                                <option key={company.COM_NO} value={company.COM_NO}>
                                    {company.NAME_E}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Login</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
               
            </div>
        </div>
    );
};

export default Login;


