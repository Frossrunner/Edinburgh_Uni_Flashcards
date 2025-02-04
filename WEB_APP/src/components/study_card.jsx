// components/study_card.jsx
import React, { useState } from 'react';
//styles
import '../styles/study.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faThumbsUp, faThumbsDown, faRedo, faStar } from '@fortawesome/free-solid-svg-icons';

const StudyCard = ({ card, onResponse }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleFlip = () => {
        if (!isAnswered) {
            setIsFlipped(!isFlipped);
        }
    };

    const handleDifficulty = (difficulty) => {
        setIsAnswered(true);
        onResponse(card, difficulty);
        // Reset for next card
        setTimeout(() => {
            setIsFlipped(false);
            setIsAnswered(false);
        }, 300);
    };

    return (
        <div className={`study-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="study-card-inner">
                <div className="study-card-question" onClick={handleFlip}>
                    <div className="study-card-content-question">
                        {card.question}
                    </div>
                    {!isFlipped && (
                        <div className="study-card-hint">
                            <FontAwesomeIcon icon={faRotate} /> Click to flip
                        </div>
                    )}
                </div>
                <div className="study-card-answer" onClick={handleFlip}>
                    <div className="study-card-content-answer">
                        {card.answer}
                    </div>
                    {!isAnswered && (
                        <div className="study-card-difficulty">
                            <button onClick={() => handleDifficulty(1)} className="difficulty-btn again">
                                <span><FontAwesomeIcon icon={faRedo} /></span>
                                <span>Again</span>
                            </button>
                            <button onClick={() => handleDifficulty(2)} className="difficulty-btn hard">
                                <span><FontAwesomeIcon icon={faThumbsDown} /></span>
                                <span>Hard</span>
                            </button>
                            <button onClick={() => handleDifficulty(3)} className="difficulty-btn good">
                                <span><FontAwesomeIcon icon={faThumbsUp} /></span>
                                <span>Good</span>
                            </button>
                            <button onClick={() => handleDifficulty(5)} className="difficulty-btn easy">
                                <span><FontAwesomeIcon icon={faStar} /></span>
                                <span>Easy</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyCard;