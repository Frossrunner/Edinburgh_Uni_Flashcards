import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/user_context.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faEnvelope, 
    faSignOutAlt, 
    faCog, 
    faChartLine,
    faBook,
    faBell,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import '../styles/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [stats, setStats] = useState({
        totalDecks: 0,
        totalCards: 0,
        cardsStudied: 0,
        accuracy: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'User',
        email: user?.email || '',
        bio: 'No bio added yet',
        notifications: true
    });

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("authToken");
        navigate('/');
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
        // Add API call to save profile data
    };

    return (
        <div className='profile-container'>
            <div className='profile-grid'>
                {/* Profile Overview */}
                <div className='profile-card profile-main'>
                    <div className='profile-header'>
                        <div className='profile-avatar'>
                            {profileData.name.charAt(0)}
                        </div>
                        <div className='profile-info'>
                            <h1>{profileData.name}</h1>
                            <p className='profile-email'>
                                <FontAwesomeIcon icon={faEnvelope} />
                                {profileData.email}
                            </p>
                        </div>
                        <button 
                            className='profile-edit-btn'
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                            Edit Profile
                        </button>
                    </div>

                    {isEditing ? (
                        <div className='profile-edit-form'>
                            <div className='profile-field'>
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                />
                            </div>
                            <div className='profile-field'>
                                <label>Bio</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                />
                            </div>
                            <button 
                                className='profile-save-btn'
                                onClick={handleSaveProfile}
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <p className='profile-bio'>{profileData.bio}</p>
                    )}
                </div>

                {/* Stats Card */}
                <div className='profile-card profile-stats'>
                    <h2>
                        <FontAwesomeIcon icon={faChartLine} />
                        Study Statistics
                    </h2>
                    <div className='stats-grid'>
                        <div className='stat-item'>
                            <span className='stat-value'>{stats.totalDecks}</span>
                            <span className='stat-label'>Total Decks</span>
                        </div>
                        <div className='stat-item'>
                            <span className='stat-value'>{stats.totalCards}</span>
                            <span className='stat-label'>Total Cards</span>
                        </div>
                        <div className='stat-item'>
                            <span className='stat-value'>{stats.cardsStudied}</span>
                            <span className='stat-label'>Cards Studied</span>
                        </div>
                        <div className='stat-item'>
                            <span className='stat-value'>{stats.accuracy}%</span>
                            <span className='stat-label'>Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className='profile-card profile-actions'>
                    <h2>Quick Actions</h2>
                    <div className='action-buttons'>
                        <button onClick={() => navigate('/classes')}>
                            <FontAwesomeIcon icon={faBook} />
                            My Classes
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faBell} />
                            Notifications
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faCog} />
                            Settings
                        </button>
                        <button onClick={handleLogout} className='logout-btn'>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;