import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import '../styles/popup.css';

const CreateClassPopup = ({ isVisible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description });
        setName('');
        setDescription('');
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="popup-header">
                    <div className="popup-title">
                        <FontAwesomeIcon icon={faGraduationCap} className="popup-icon" />
                        <h2>Create New Class</h2>
                    </div>
                    <button className="popup-close-button" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="popup-form-group">
                        <label htmlFor="name">Class Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter class name"
                            required
                        />
                    </div>
                    <div className="popup-form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter class description"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="popup-actions">
                        <button type="button" className="popup-cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="popup-submit-button">
                            Create Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClassPopup;