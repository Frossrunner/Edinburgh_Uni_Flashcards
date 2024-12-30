import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css'; // Import the CSS file
import profilePic from '../assets/profile_pic.png';

const Navbar = () => {
    return (
        <nav>
            <div className="nav-left">
                <Link to="/help_faq">Help/FAQ</Link>
                <Link to="/notifications">Notifications</Link>
                <Link to="/community">Community</Link>
                <Link to="/stats">Stats</Link>
                <Link to="/classes">Classes</Link>
            </div>
            <div className="nav-right">
                <Link to="/profile" className="logo">
                    <img src={profilePic} alt="Logo" className="nav-logo" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;