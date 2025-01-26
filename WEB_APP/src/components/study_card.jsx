// components/study_card.jsx
import React, { useState } from 'react';
//styles
import '../styles/study.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
        onResponse(card.id, difficulty);
        // Reset for next card
        setTimeout(() => {
            setIsFlipped(false);
            setIsAnswered(false);
        }, 300);
    };

    return (
        <div className={`study-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="study-card-inner">
                <div className="study-card-front" onClick={handleFlip}>
                    <div className="study-card-content">
                        {card.question}
                    </div>
                    {!isFlipped && (
                        <div className="study-card-hint">
                            <FontAwesomeIcon icon={faRotate} /> Click to flip
                        </div>
                    )}
                </div>
                <div className="study-card-back" onClick={handleFlip}>
                    <div className="study-card-content">
                        {card.answer}
                    </div>
                    {!isAnswered && (
                        <div className="study-card-difficulty">
                            <button 
                                onClick={() => handleDifficulty(1)}
                                className="difficulty-btn hard"
                            >
                                <FontAwesomeIcon icon={faThumbsDown} /> Hard
                            </button>
                            <button 
                                onClick={() => handleDifficulty(3)}
                                className="difficulty-btn medium"
                            >
                                Again Soon
                            </button>
                            <button 
                                onClick={() => handleDifficulty(5)}
                                className="difficulty-btn easy"
                            >
                                <FontAwesomeIcon icon={faThumbsUp} /> Easy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyCard;