// components/study_complete.jsx
import React from 'react';
import { useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrophy, 
    faRedo, 
    faHome,
    faChartLine 
} from '@fortawesome/free-solid-svg-icons';

const StudyComplete = ({ stats, deckId, classData }) => {
    const navigate = useNavigate();
    const totalCards = stats.correct + stats.incorrect;
    const accuracy = ((stats.correct / totalCards) * 100).toFixed(1);

    return (
        <div className="study-complete-container">
            <div className="study-complete-card">
                <div className="study-complete-header">
                    <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
                    <h2>Session Complete!</h2>
                </div>

                <div className="study-complete-stats">
                    <div className="stat-item">
                        <span className="stat-label">Cards Studied</span>
                        <span className="stat-value">{totalCards}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Correct</span>
                        <span className="stat-value correct">{stats.correct}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Incorrect</span>
                        <span className="stat-value incorrect">{stats.incorrect}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Accuracy</span>
                        <span className="stat-value">{accuracy}%</span>
                    </div>
                </div>

                <div className="study-complete-actions">
                    <button 
                        className="study-complete-btn primary"
                        onClick={() => navigate(`/study/${deckId}`)}
                    >
                        <FontAwesomeIcon icon={faRedo} /> Study Again
                    </button>
                    <button 
                        className="study-complete-btn"
                        onClick={() => navigate(`/study/${deckId}/stats`)}
                    >
                        <FontAwesomeIcon icon={faChartLine} /> View Statistics
                    </button>
                    <button 
                        className="study-complete-btn"
                        onClick={() => navigate(`/class`, {state: classData })}
                    >
                        <FontAwesomeIcon icon={faHome} /> Back to Deck
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyComplete;