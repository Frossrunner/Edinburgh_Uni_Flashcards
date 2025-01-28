// DeckEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // Import useParams
// Import API functions
import { getDeck, updateDeck } from '../api/deckApi.js';
import AICardGenerator from '../components/ai_generator.jsx';
// import styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileImport, 
  faFileExport, 
  faSort, 
  faArrowUp, 
  faArrowDown,
  faArrowLeft, 
  faTrash, 
  faPlus, 
  faSave,
  faMagicWandSparkles
} from '@fortawesome/free-solid-svg-icons';
import '../styles/deck_display.css';

const DeckEditPage = () => {
  const { deckId } = useParams(); // Use useParams to get deckId
  const [deckName, setDeckName] = useState('');
  const [cards, setCards] = useState([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const location = useLocation();
  const classData = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the deck data on component mount
    const fetchDeck = async () => {
      try {
        const deckData = await getDeck(deckId);
        setDeckName(deckData.name);
        setCards(deckData.cards);
      } catch (error) {
        console.error('Error fetching deck:', error);
      }
    };

    fetchDeck();
  }, [deckId]);

  const handleAddCard = () => {
    const newCard = {
      id: Date.now(),
      question: '',
      answer: '',
    };
    setCards([...cards, newCard]);
  };

  const handleCardsGenerated = (newCards) => {
    const formattedCards = newCards.map(card => ({
      id: Date.now() + Math.random(), // Generate unique ID
      question: card.question,
      answer: card.answer
    }));

    setCards([...cards, ...formattedCards]);
  };

  const handleDeleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleCardChange = (id, field, value) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleSaveDeck = async () => {
    const updatedDeck = {
      name: deckName,
      cards: cards,
    };

    try {
      await updateDeck(deckId, updatedDeck);
      alert('Deck saved successfully!');
      // Redirect or update the UI as needed
    } catch (error) {
      console.error('Error saving deck:', error);
    }
  };

  return (
    <div className="deck-edit-container">
      <div className="deck-edit-inner">
        <div className="deck-edit-static-content">
          <div className="deck-edit-header">
            <div className='deck-edit-title'>
              <h2>Edit Deck</h2>
              <button onClick={() => navigate('/class', {state: classData})}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Deck
              </button>
            </div>
            <div className="deck-edit-deck-info">
              <div className="deck-edit-deck-name">
                <input
                  type="text"
                  id="deckName"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="Enter Deck Name"
                  className="deck-edit-deck-name-input"
                />
              </div>
              <div className="deck-edit-deck-stats">
                <span>{cards.length} cards</span>
              </div>
            </div>
          </div>

          <div className="deck-edit-toolbar">
            <button className="deck-edit-tool-btn">
              <FontAwesomeIcon icon={faFileImport} /> Import
            </button>
            <button className="deck-edit-tool-btn">
              <FontAwesomeIcon icon={faFileExport} /> Export
            </button>
            <button className="deck-edit-tool-btn">
              <FontAwesomeIcon icon={faSort} /> Sort
            </button>
            <button className="deck-edit-tool-btn" onClick={() => setShowAIGenerator(true)}>
              <FontAwesomeIcon icon={faMagicWandSparkles} /> AI Generate
            </button>
          </div>
        </div>

        <div className="deck-edit-scrollable-content">
          <div className="deck-edit-cards">
            {cards.map((card, index) => (
              <div key={card.id} className="deck-edit-card">
                <div className="deck-edit-card-header">
                  <div className="deck-edit-card-number">#{index + 1}</div>
                  <div className="deck-edit-card-actions">
                    <button className="deck-edit-card-btn" title="Move Up">
                      <FontAwesomeIcon icon={faArrowUp} />
                    </button>
                    <button className="deck-edit-card-btn" title="Move Down">
                      <FontAwesomeIcon icon={faArrowDown} />
                    </button>
                    <button 
                      className="deck-edit-card-btn deck-edit-delete-btn"
                      onClick={() => handleDeleteCard(card.id)}
                      title="Delete Card"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                
                <div className="deck-edit-card-content">
                  <div className="deck-edit-card-field">
                    <textarea
                      className="deck-edit-card-input"
                      value={card.question}
                      onChange={(e) => handleCardChange(card.id, 'question', e.target.value)}
                      placeholder="Enter question here..."
                    />
                  </div>
                  <div className="deck-edit-card-divider">
                    <span>Answer</span>
                  </div>
                  <div className="deck-edit-card-field">
                    <textarea
                      className="deck-edit-card-input"
                      value={card.answer}
                      onChange={(e) => handleCardChange(card.id, 'answer', e.target.value)}
                      placeholder="Enter answer here..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="deck-edit-footer">
          <div className="deck-edit-actions">
            <button className="deck-edit-add-btn" onClick={handleAddCard}>
              <FontAwesomeIcon icon={faPlus} /> Add New Card
            </button>
            <button className="deck-edit-save-btn" onClick={handleSaveDeck}>
              <FontAwesomeIcon icon={faSave} /> Save Deck
            </button>
          </div>
        </div>
      </div>

      <AICardGenerator
        isVisible={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onCardsGenerated={handleCardsGenerated}
      />
      
    </div>
  );
};

export default DeckEditPage;