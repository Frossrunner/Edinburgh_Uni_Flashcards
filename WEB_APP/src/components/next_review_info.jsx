// components/NextReviewInfo.jsx (Updated)
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCheck, faBook } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const NextReviewInfo = ({ nextReview, totalCards, dueCards }) => {
    const navigate = useNavigate();

    const formatDateTime = (dateString) => {
        if (!dateString) return 'No upcoming reviews';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="study-next-review-container">
            <div className="study-next-review-card">
                <div className="study-next-review-icon">
                    {dueCards === 0 ? (
                        <FontAwesomeIcon icon={faCheck} className="study-icon-complete" />
                    ) : (
                        <FontAwesomeIcon icon={faClock} className="study-icon-pending" />
                    )}
                </div>
                <h2>{dueCards === 0 ? 'All Done!' : 'No Cards Due'}</h2>
                {dueCards === 0 ? (
                    <>
                        <p className="study-status-message">You're all caught up for now!</p>
                        <p className="study-next-review-time">
                            Next review: {formatDateTime(nextReview)}
                        </p>
                    </>
                ) : (
                    <>
                        <p className="study-status-message">No cards are due for review at this moment.</p>
                        <p className="study-next-review-time">
                            Next review: {formatDateTime(nextReview)}
                        </p>
                    </>
                )}
                <div className="study-card-stats">
                    <span>Total cards: {totalCards}</span>
                </div>
                <button
                    className="study-complete-btn"
                    onClick={() => navigate(`/class`)}
                >
                    <FontAwesomeIcon icon={faBook} /> Back to Decks
                </button>
            </div>
        </div>
    );
};

export default NextReviewInfo;