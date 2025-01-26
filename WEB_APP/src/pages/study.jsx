// pages/StudyDeck.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import StudyCard from '../components/study_card.jsx';
import StudyProgress from '../components/study_progress.jsx';
import StudyComplete from '../components/study_complete.jsx';
import NextReviewInfo from '../components/next_review_info.jsx';
// styles
import '../styles/study.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPause } from '@fortawesome/free-solid-svg-icons';

const StudyDeck = () => {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [studyStats, setStudyStats] = useState({
        correct: 0,
        incorrect: 0,
        remaining: 0,
    });
    const [nextReviewInfo, setNextReviewInfo] = useState(null);
    const [sessionComplete, setSessionComplete] = useState(false);
    const location = useLocation();
    const classData = location.state;

    useEffect(() => {
        const initializeStudy = async () => {
            await fetchCards();
            await fetchNextReview();
        };

        initializeStudy();
    }, [deckId]);

    const fetchCards = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/study/${deckId}/flashcards`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setCards(data);
            setStudyStats((prev) => ({ ...prev, remaining: data.length }));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const handleResponse = async (cardId, difficulty) => {
        try {
            const token = localStorage.getItem('authToken');
            await fetch(`/api/study/${cardId}/response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ difficulty }),
            });

            // Update stats
            setStudyStats((prev) => ({
                correct: difficulty >= 4 ? prev.correct + 1 : prev.correct,
                incorrect: difficulty < 4 ? prev.incorrect + 1 : prev.incorrect,
                remaining: prev.remaining - 1,
            }));

            // Move to next card or end session
            if (currentCardIndex + 1 < cards.length) {
                setCurrentCardIndex((prev) => prev + 1);
            } else {
                setSessionComplete(true);
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const fetchNextReview = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/study/${deckId}/next-review`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setNextReviewInfo(data);
        } catch (error) {
            console.error('Error fetching next review:', error);
        }
    };

    if (isLoading) {
        return <div className="study-loading">Loading...</div>;
    }

    if (sessionComplete) {
        return <StudyComplete stats={studyStats} deckId={deckId} classData={classData} />;
    }

    if (cards.length === 0) {
        return (
            <NextReviewInfo
                nextReview={nextReviewInfo?.next_review}
                totalCards={nextReviewInfo?.total_cards || 0}
                dueCards={nextReviewInfo?.due_cards || 0}
            />
        );
    }

    return (
        <div className="study-container">
            <div className="study-header">
                <button
                    className="study-back-button"
                    onClick={() => navigate(`/class`, { state: classData })}
                >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Deck
                </button>
                <StudyProgress stats={studyStats} totalCards={cards.length} />
                <button className="study-pause-button">
                    <FontAwesomeIcon icon={faPause} /> Pause
                </button>
            </div>

            <StudyCard card={cards[currentCardIndex]} onResponse={handleResponse} />

            {nextReviewInfo && (
                <div className="study-floating-next-review">
                    <span>
                        Next Review:{' '}
                        {new Date(nextReviewInfo.next_review).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StudyDeck;