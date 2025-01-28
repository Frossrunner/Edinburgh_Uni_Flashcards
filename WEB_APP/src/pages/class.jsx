import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DeckWindow from '../components/deck_window.jsx';
import CreateDeckPopup from '../components/create_deck_popup.jsx';
import { useUser } from '../components/user_context.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import '../styles/deck_overview.css';

const Class = () => {
    const [decks, setDecks] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const classData = location.state;
    const { user } = useUser();
    const handleOpenPopup = () => setIsPopupVisible(true);
    const handleClosePopup = () => setIsPopupVisible(false);
    useEffect(() => {
        collect_decks();
    }, []);

    const handleCreateDeck = async ({ name, description }) => {
        try{
            const class_id = classData.id;
            console.log(name);
            console.log(description);
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const response = await fetch('/api/createDeck', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                 },
                body: JSON.stringify({ class_id, name, description })
            });
            const createdDeck = await response.json();

            setDecks((prevDecks) => [...prevDecks, createdDeck]);
        }catch(error){
            console.log("error creating deck: ", error);
        }
    };

    const collect_decks = async () => {
        const class_id = classData.id;
        try {
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const response = await fetch('/api/decks', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({class_id})
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    alert('Unauthorized. Please log in.');
                } else {
                    alert('Problem collecting decks');
                }
                return null;
            }
    
            const data = await response.json();
            setDecks(data);
            
        } catch (error) {
            console.error('Error fetching decks:', error);
            alert('An error occurred while collecting decks');
            return null;
        }
    };

    const deleteDeck = async (deckData) => {
        try{
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const deck_id = deckData.id;
            console.log(deck_id);
            const response = await fetch('/Api/deck', {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                 },
                body: JSON.stringify({deck_id})
            });
            setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckData.id));
        }catch (error){
            console.log('error deleting deck: ', error);
        }
    };

    const filteredDecks = decks.filter(deck => 
        deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="deck-overview-container">
            <div className="deck-overview-sidebar">
                <div className="deck-overview-sidebar-section">
                    <h3 className="deck-overview-sidebar-title">Views</h3>
                    <div className="deck-overview-sidebar-item">All Decks</div>
                    <div className="deck-overview-sidebar-item">Recent</div>
                    <div className="deck-overview-sidebar-item">Favorites</div>
                </div>
                
                <div className="deck-overview-sidebar-section">
                    <h3 className="deck-overview-sidebar-title">Categories</h3>
                    <div className="deck-overview-sidebar-item">Uncategorized</div>
                    {/* Add more categories as needed */}
                </div>
            </div>

            <div className="deck-overview-main">
                <div className="deck-overview-header">
                    <h1>{classData.name || 'Class Decks'}</h1>
                    <div className="deck-overview-controls">
                        <div className="deck-overview-search">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Search decks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="deck-overview-filter-btn">
                            <FontAwesomeIcon icon={faFilter} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="deck-overview-content">
                    <div className="deck-overview-grid">
                        {filteredDecks.map((dck) => (
                            <DeckWindow key={dck.id} deckData={dck} deleteDeck={deleteDeck} classData={classData} />
                        ))}
                        <div className='deck-window-create-card' onClick={handleOpenPopup}>
                            <div className='deck-window-create-content'>
                                <div className='deck-window-create-icon'>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                                <span className='deck-window-create-text'>Create New Deck</span>
                                <span className='deck-window-create-subtext'>Click to add a new deck</span>
                            </div>
                        </div>
                    </div>
                </div>

                <CreateDeckPopup
                    isVisible={isPopupVisible}
                    onClose={() => setIsPopupVisible(false)}
                    onSubmit={handleCreateDeck}
                />
            </div>
        </div>
    );
};

export default Class;