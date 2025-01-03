import react, { useState, useEffect } from 'react';
import '../styles/popup.css';

const CreateClassPopup = ({ isVisible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description }); // Pass form data to the parent
        onClose(); // Close the popup after submission
    };

    if (!isVisible) return null; // Don't render anything if the popup is not visible

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Create New Class</h2>
                <form onSubmit={handleSubmit}>
                    <div className="popup-form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="popup-form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="popup-submit-button">
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateClassPopup;