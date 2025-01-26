import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//styles
import '../styles/classes_overview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrash, faPencil, faBook } from '@fortawesome/free-solid-svg-icons';

const ClassWindow = ({classData}) => {
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);

    const toClass = (classData) => {
        navigate('/class', { state: classData });
    };

    return (
        <div className='class-window-card'>
            <div className='class-window-card-header'>
                <h2 className='class-window-card-title'>
                    {classData.name || 'Untitled Class'}
                </h2>
                <div 
                        className='class-window-card-actions'
                        onMouseLeave={() => setShowOptions(false)} // Add this line
                    >
                        <button 
                            className='class-window-action-btn'
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {showOptions && (
                            <div className='class-window-dropdown'>
                                <button onClick={() => toClass(classData)}>
                                    <FontAwesomeIcon icon={faBook} /> View Class
                                </button>
                                <button>
                                    <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                                <button className='class-window-delete-btn'>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            <div className='class-window-card-content'>
                <p className='class-window-card-description'>
                    {classData.description || 'No description provided'}
                </p>
                <div className='class-window-card-stats'>
                    <span>0 decks</span>
                    <span>Created: Recently</span>
                </div>
            </div>
        </div>
    );
};

export default ClassWindow;