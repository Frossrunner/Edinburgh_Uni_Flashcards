import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Navbar = () => {
    return (
        <nav style={styles.nav}>
            <div style={styles.navLeft}>
                <Link to="/help_FAQ" style={styles.link}>Help/FAQ</Link>
                <Link to="/notifications" style={styles.link}>Notifications</Link>
                <Link to="/community" style={styles.link}>Community</Link>
                <Link to="/stats" style={styles.link}>Stats</Link>
                <Link to="/classes" style={styles.link}>Classes</Link>
            </div>
            <div style={styles.navRight}>
                <Link to="/profile" className="logo" style={styles.link}>
                    <img src="assets/Screenshot empty.png" alt="Logo" style={styles.logo} />
                </Link>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#333',
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    navLeft: {
        display: 'flex',
        gap: '1rem',
    },
    navRight: {
        display: 'flex',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        transition: 'background-color 0.3s ease',
    },
    logo: {
        height: '40px',
        width: 'auto',
    },
};

export default Navbar;