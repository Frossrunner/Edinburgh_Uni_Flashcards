// components/AICardGenerator.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faFileUpload, 
  faSpinner,
  faCheck,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import '../styles/ai_generator.css';

const AICardGenerator = ({ isVisible, onClose, onCardsGenerated }) => {
  const [file, setFile] = useState(null);
  const [numCards, setNumCards] = useState(10);
  const [focus, setFocus] = useState('');
  const [generatedCards, setGeneratedCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState('upload'); // upload, review, complete

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // First upload the PDF
      const formData = new FormData();
      formData.append('pdf', file);
      
      // API call to upload PDF
      const uploadResponse = await fetch('/api/pdf/upload', {
        method: 'POST',
        body: formData
      });
      const { fileId } = await uploadResponse.json();

      // API call to generate cards
      const generateResponse = await fetch('/api/pdf/generate-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId,
          numCards,
          focus,
        })
      });
      
      const data = await generateResponse.json();
      console.log("Generated Cards:", data);
      setGeneratedCards(data.flashcards);
      setStep('review');
    } catch (error) {
      console.error('Error generating cards:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCardSelection = (index) => {
    setSelectedCards(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  };

  const handleAddSelected = () => {
    const selectedCardsData = selectedCards.map(index => generatedCards[index]);
    onCardsGenerated(selectedCardsData);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="ai-generator-overlay">
      <div className="ai-generator-modal">
        <div className="ai-generator-header">
          <h2>AI Card Generator</h2>
          <button className="ai-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {step === 'upload' && (
          <div className="ai-generator-content">
            <div className="ai-upload-section">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                id="pdf-upload"
                hidden
              />
              <label htmlFor="pdf-upload" className="ai-upload-label">
                <FontAwesomeIcon icon={faFileUpload} />
                <span>{file ? file.name : 'Choose PDF'}</span>
              </label>
            </div>

            <div className="ai-config-section">
              <div className="ai-input-group">
                <label>Number of Cards</label>
                <input
                  type="number"
                  value={numCards}
                  onChange={(e) => setNumCards(e.target.value)}
                  min="1"
                  max="50"
                />
              </div>

              <div className="ai-input-group">
                <label>Focus Area (optional)</label>
                <input
                  type="text"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  placeholder="e.g., 'key concepts' or 'definitions'"
                />
              </div>

              <button 
                className="ai-generate-btn"
                onClick={handleGenerate}
                disabled={!file || isGenerating}
              >
                {isGenerating ? (
                  <><FontAwesomeIcon icon={faSpinner} spin /> Generating</>
                ) : (
                  'Generate Cards'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="ai-review-content">
            <div className="ai-cards-grid">
              {generatedCards.map((card, index) => (
                <div 
                  key={index}
                  className={`ai-review-card ${selectedCards.includes(index) ? 'selected' : ''}`}
                  onClick={() => toggleCardSelection(index)}
                >
                  <div className="ai-review-card-header">
                    <span>Card #{index + 1}</span>
                    <FontAwesomeIcon 
                      icon={selectedCards.includes(index) ? faCheck : faPlus} 
                    />
                  </div>
                  <div className="ai-review-card-content">
                    <div className="ai-review-question">{card.question}</div>
                    <div className="ai-review-answer">{card.answer}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-review-actions">
              <button 
                className="ai-back-btn"
                onClick={() => setStep('upload')}
              >
                Generate More
              </button>
              <button 
                className="ai-add-btn"
                onClick={handleAddSelected}
                disabled={selectedCards.length === 0}
              >
                Add Selected Cards ({selectedCards.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICardGenerator;