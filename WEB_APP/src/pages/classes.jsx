import React, { useState, useEffect } from 'react';
import ClassWindow from '../components/class_window.jsx';
import CreateClassPopup from '../components/create_class_popup.jsx';
import { useUser } from '../components/user_context.jsx';
// styles
import '../styles/classes_overview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';


const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const handleOpenPopup = () => setIsPopupVisible(true);
    const handleClosePopup = () => setIsPopupVisible(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();


    const handleCreateClass = async ({ name, description }) => {
        try{
            console.log(name);
            console.log(description);
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const response = await fetch('/Api/createClass', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                 },
                body: JSON.stringify({ name, description })
            });
            const createdClass = await response.json();

            setClasses((prevClasses) => [...prevClasses, createdClass]);
        }catch(error){
            console.log("error creating class: ", error);
        }
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
        <div className="class-overview-container">
            <div className="class-overview-sidebar">
                <div className="class-overview-sidebar-section">
                    <h3 className="class-overview-sidebar-title">Views</h3>
                    <div className="class-overview-sidebar-item">All Classes</div>
                    <div className="class-overview-sidebar-item">Recent</div>
                    <div className="class-overview-sidebar-item">Favorites</div>
                </div>
            </div>

            <div className="class-overview-main">
                <div className="class-overview-header">
                    <h1>My Classes</h1>
                    <div className="class-overview-controls">
                        <div className="class-overview-search">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Search classes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="class-overview-filter-btn">
                            <FontAwesomeIcon icon={faFilter} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="class-overview-content">
                    <div className="class-overview-grid">
                        {classes.map((cls) => (
                            <ClassWindow key={cls.id} classData={cls} />
                        ))}
                        <div className='class-window-create-card' onClick={handleOpenPopup}>
                            <div className='class-window-create-content'>
                                <div className='class-window-create-icon'>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <span className='class-window-create-text'>Create New Class</span>
                                <span className='class-window-create-subtext'>Click to add a new class</span>
                            </div>
                        </div>
                    </div>
                </div>

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