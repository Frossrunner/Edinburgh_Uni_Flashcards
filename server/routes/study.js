const express = require("express");
const authenticateToken = require("../middleware/authenticatetoken.js");
const db = require("../db.js");
const router = express.Router();

// Get cards due for review in a deck
router.get("/study/:deckId/flashcards", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;
        const now = new Date().toISOString();

        // First verify deck ownership
        const [deckRows] = await db.execute(
            "SELECT * FROM decks WHERE id = ? AND user_id = ?",
            [deckId, userId]
        );

        if (deckRows.length === 0) {
            return res.status(404).json({ error: "Deck not found or unauthorized" });
        }
        // Fetch cards that are due for review (next_review <= now) or haven't been reviewed yet (next_review IS NULL)
        const [cards] = await db.execute(`
            SELECT id, question, answer, next_review, difficulty_factor, interval_, review_count
            FROM flashcards
            WHERE deck_id = ? 
            AND (next_review <= ? OR next_review IS NULL)
            ORDER BY COALESCE(next_review, '1970-01-01'), review_count
            LIMIT 20
        `, [deckId, now]);

        res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching study cards:", error);
        res.status(500).json({ error: "An error occurred while fetching study cards" });
    }
});

// Get next review time for a deck
router.get("/study/:deckId/next-review", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;

        const [nextReview] = await db.execute(`
            SELECT 
                MIN(next_review) as next_review,
                COUNT(*) as total_cards,
                SUM(CASE WHEN next_review <= NOW() THEN 1 ELSE 0 END) as due_cards
            FROM flashcards
            WHERE deck_id = ? AND next_review > NOW()
        `, [deckId]);

        res.status(200).json(nextReview[0]);
    } catch (error) {
        console.error("Error fetching next review time:", error);
        res.status(500).json({ error: "An error occurred while fetching next review time" });
    }
});

// Update card after review (implementing SuperMemo 2 algorithm)
router.post("/study/:cardId/response", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cardId = req.params.cardId;
        const { difficulty } = req.body;

        // Validate difficulty input
        if (!difficulty || difficulty < 1 || difficulty > 5) {
            return res.status(400).json({ error: "Invalid difficulty value. Must be between 1 and 5" });
        }

        // Verify card ownership
        const [cardRows] = await db.execute(`
            SELECT 
                f.id,
                f.interval_,
                f.difficulty_factor,
                f.review_count,
                d.user_id 
            FROM flashcards f
            JOIN decks d ON f.deck_id = d.id
            WHERE f.id = ? AND d.user_id = ?
        `, [cardId, userId]);

        if (cardRows.length === 0) {
            return res.status(404).json({ error: "Card not found or unauthorized" });
        }

        const card = cardRows[0];
        
        // Ensure default values if null
        const currentInterval = card.interval_ !== null ? card.interval_ : 0;
        const currentDifficultyFactor = card.difficulty_factor !== null ? card.difficulty_factor : 2.5;
        const currentReviewCount = card.review_count !== null ? card.review_count : 0;

        // Calculate new values using SuperMemo 2 algorithm
        const newValues = calculateNextReview(
            difficulty,
            currentInterval,
            currentDifficultyFactor,
            currentReviewCount
        );

        // Log values for debugging
        console.log('Current Values:', {
            interval: currentInterval,
            difficultyFactor: currentDifficultyFactor,
            reviewCount: currentReviewCount
        });
        
        console.log('New Values:', newValues);

        // Update card with new spacing values
        await db.execute(`
            UPDATE flashcards
            SET 
                next_review = ?,
                interval_ = ?,
                difficulty_factor = ?,
                review_count = COALESCE(review_count, 0) + 1
            WHERE id = ?
        `, [
            newValues.nextReview,
            newValues.interval,  // Note: removed underscore
            newValues.difficultyFactor,
            cardId
        ]);

        res.status(200).json({ 
            message: "Card updated successfully",
            nextReview: newValues.nextReview,
            newInterval: newValues.interval,
            newDifficultyFactor: newValues.difficultyFactor
        });
    } catch (error) {
        console.error("Error updating card:", error);
        res.status(500).json({ error: "An error occurred while updating the card" });
    }
});

// helper function
function formatDateForMySQL(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Helper function to calculate next review using SuperMemo 2 algorithm
function calculateNextReview(difficulty, oldInterval, oldEFactor, reviewCount) {
    // Ensure default values if null
    let interval = oldInterval || 0;
    let efactor = oldEFactor || 2.5;

    // Difficulty should be mapped to quality (q) in SM-2, where 5 is perfect response
    const q = difficulty; // Assuming difficulty is between 1 (hard) and 5 (easy)

    // Adjust EFactor
    efactor = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    efactor = Math.max(1.3, efactor);

    // Calculate new interval
    let newInterval;
    if (q < 3) {
        // Repeat the item immediately
        newInterval = 1; // Review again in 1 day
    } else {
        if (reviewCount <= 1) {
            newInterval = 0.04;
        } else if (reviewCount === 2) {
            newInterval = 1;
        } else {
            newInterval = Math.round(interval * efactor);
        }
    }

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    return {
        interval: newInterval,
        difficultyFactor: efactor,
        nextReview: formatDateForMySQL(nextReviewDate),
    };
}

// Get study statistics for a deck
router.get("/study/:deckId/stats", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;

        // Verify deck ownership
        const [deckRows] = await db.execute(
            "SELECT * FROM decks WHERE id = ? AND user_id = ?",
            [deckId, userId]
        );

        if (deckRows.length === 0) {
            return res.status(404).json({ error: "Deck not found or unauthorized" });
        }

        // Get various statistics
        const [stats] = await db.execute(`
            SELECT 
                COUNT(*) as total_cards,
                SUM(CASE WHEN next_review < NOW() THEN 1 ELSE 0 END) as due_cards,
                SUM(CASE WHEN review_count > 0 THEN 1 ELSE 0 END) as studied_cards,
                AVG(difficulty_factor) as average_difficulty
            FROM flashcards
            WHERE deck_id = ?
        `, [deckId]);

        res.status(200).json(stats[0]);
    } catch (error) {
        console.error("Error fetching deck statistics:", error);
        res.status(500).json({ error: "An error occurred while fetching deck statistics" });
    }
});

module.exports = router;
