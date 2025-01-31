import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faComments, 
    faShare, 
    faStar,
    faChalkboardTeacher,
    faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import '../styles/community.css';

const Community = () => {
    const features = [
        {
            icon: faComments,
            title: "Study Groups",
            description: "Join or create study groups with fellow students"
        },
        {
            icon: faShare,
            title: "Deck Sharing",
            description: "Share and discover flashcard decks from the community"
        },
        {
            icon: faChalkboardTeacher,
            title: "Mentorship",
            description: "Connect with experienced students in your field"
        },
        {
            icon: faLightbulb,
            title: "Study Tips",
            description: "Share and discover effective study techniques"
        }
    ];

    return (
        <div className="community-container">
            <div className="community-coming-soon">
                <div className="community-header">
                    <div className="community-icon-wrapper">
                        <FontAwesomeIcon icon={faUsers} className="community-icon" />
                    </div>
                    <h1>Community Hub Coming Soon</h1>
                    <p>Connect, share, and learn together</p>
                </div>

                <div className="community-features">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">
                                <FontAwesomeIcon icon={feature.icon} />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className="launch-indicator">
                    <div className="launch-progress">
                        <div className="progress-line">
                            <div className="progress-fill"></div>
                        </div>
                        <div className="progress-steps">
                            <div className="step completed">
                                <FontAwesomeIcon icon={faStar} />
                                <span>Planning</span>
                            </div>
                            <div className="step completed">
                                <FontAwesomeIcon icon={faStar} />
                                <span>Development</span>
                            </div>
                            <div className="step active">
                                <FontAwesomeIcon icon={faStar} />
                                <span>Testing</span>
                            </div>
                            <div className="step">
                                <FontAwesomeIcon icon={faStar} />
                                <span>Launch</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;