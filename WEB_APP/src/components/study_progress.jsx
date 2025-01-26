// components/study_progress.jsx
import React from 'react';
//styles
import '../styles/study.css';

const StudyProgress = ({ stats }) => {
    const totalCards = stats.correct + stats.incorrect + stats.remaining;
    const progress = ((stats.correct + stats.incorrect) / totalCards) * 100;

    return (
        <div className="study-progress">
            <div className="study-progress-bar">
                <div 
                    className="study-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="study-stats">
                <span className="correct">{stats.correct} correct</span>
                <span className="incorrect">{stats.incorrect} incorrect</span>
                <span className="remaining">{stats.remaining} remaining</span>
            </div>
        </div>
    );
};

export default StudyProgress;