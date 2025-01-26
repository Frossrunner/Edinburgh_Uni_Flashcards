// Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import profilePic from '../assets/profile_pic.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faQuestionCircle, 
    faBell, 
    faUsers, 
    faChartLine, 
    faGraduationCap 
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const location = useLocation();
    const [notificationCount] = useState(3); // Example notification count

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="nav-left">
                    <Link to="/classes" className={`nav-item ${isActive('/classes') ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                        <span>Classes</span>
                    </Link>
                    <Link to="/stats" className={`nav-item ${isActive('/stats') ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Stats</span>
                    </Link>
                    <Link to="/community" className={`nav-item ${isActive('/community') ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faUsers} />
                        <span>Community</span>
                    </Link>
                </div>

                <div className="nav-right">
                    <Link to="/notifications" className={`nav-item notification-icon ${isActive('/notifications') ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faBell} />
                        {notificationCount > 0 && <span className="notification-badge">{notificationCount}</span>}
                    </Link>
                    <Link to="/help_faq" className={`nav-item ${isActive('/help_faq') ? 'active' : ''}`}>
                        <FontAwesomeIcon icon={faQuestionCircle} />
                    </Link>
                    <Link to="/profile" className="profile-link">
                        <div className="profile-image-container">
                            <img src={profilePic} alt="Profile" className="profile-image" />
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;