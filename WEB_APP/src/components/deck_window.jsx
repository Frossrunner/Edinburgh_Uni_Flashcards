import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faTrash, faPencil, faPlay } from '@fortawesome/free-solid-svg-icons';
import '../styles/deck_overview.css';

const DeckWindow = ({deckData, deleteDeck, classData}) => {

    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);

    const handleEditDeck = () => {
        navigate(`/decks/${deckData.id}/edit`, { state: classData });
    };

    const handleStudyDeck = () => {
        // Add study functionality
        navigate(`/study/${deckData.id}`, { state: classData });
    };

    return(
        <div className='deck-window-card'>
            <div className='deck-window-card-header'>
                <h2 className='deck-window-card-title'>{deckData.name || 'Untitled Deck'}</h2>
                    <div 
                        className='deck-window-card-actions'
                        onMouseLeave={() => setShowOptions(false)} // Add this line
                    >
                        <button 
                            className='deck-window-action-btn'
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                        {showOptions && (
                            <div className='deck-window-dropdown'>
                                <button onClick={() => handleStudyDeck()}>
                                    <FontAwesomeIcon icon={faPlay} /> Study
                                </button>
                                <button onClick={() => handleEditDeck()}>
                                    <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                                <button onClick={() => deleteDeck()} className='deck-window-delete-btn'>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
            </div>
            <div className='deck-window-card-content'>
                <p className='deck-window-card-description'>
                    {deckData.description || 'No description provided'}
                </p>
                <div className='deck-window-card-stats'>
                    <span>0 cards</span>
                    <span>Last studied: Never</span>
                </div>
            </div>
        </div>
    );
};

export default DeckWindow;