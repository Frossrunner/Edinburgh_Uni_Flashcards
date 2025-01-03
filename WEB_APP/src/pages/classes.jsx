import React, { useState, useEffect } from 'react';
import '../styles/classes.css';
import ClassWindow from '../components/class_window.jsx';
import CreateClassPopup from '../components/create_class_popup.jsx';


const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleOpenPopup = () => setIsPopupVisible(true);
    const handleClosePopup = () => setIsPopupVisible(false);

    const handleCreateClass = (data) => {
        console.log('New Class Created:', data);
        // Handle the form data (e.g., save to a database)
    };

    const collect_classes = async () => {
        try {
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const response = await fetch('/api/classes', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include token for authentication
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Unauthorized. Please log in.');
                } else {
                    alert('Problem collecting classes');
                }
                return null;
            }
    
            const data = await response.json();
            setClasses(data);
            
        } catch (error) {
            console.error('Error fetching classes:', error);
            alert('An error occurred while collecting classes');
            return null;
        }
    };
    useEffect(() => {
        collect_classes();
    }, []);

    return (
        <div className="classes-container">
            {classes.map((cls) => (
                <ClassWindow key={cls.id} classData={cls} />
            ))}
            <div className='classes-window'>
                <div className='classes-edit-info'>
                    <button className='edit-button'>I</button>
                </div>
                <button onClick={handleOpenPopup} className='class-window-button'>
                    <h1> Create Class</h1>
                </button>
                <CreateClassPopup
                    isVisible={isPopupVisible}
                    onClose={handleClosePopup}
                    onSubmit={handleCreateClass}
                />
            </div>
        </div>
    );
};

export default Classes;