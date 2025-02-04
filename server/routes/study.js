const express = require("express");
const authenticateToken = require("../middleware/authenticatetoken.js");
const db = require("../db.js");
const router = express.Router();

// Get cards due for review in a deck
router.get("/study/:deckId/flashcards", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;

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
            LIMIT 200
        `, [deckId]);

        res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching study cards:", error);
        res.status(500).json({ error: "An error occurred while fetching study cards" });
    }
});

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

router.post("/study/session/start", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { class_id, deck_id } = req.body;
        
        const [result] = await db.execute(`
            INSERT INTO study_sessions 
            (user_id, class_id, deck_id, start_time) 
            VALUES (?, ?, ?, NOW())
        `, [userId, class_id, deck_id]);

        res.status(200).json({ session_id: result.insertId });
    } catch (error) {
        console.error("Error starting study session:", error);
        res.status(500).json({ error: "Error starting study session" });
    }
});

// End a study session
router.post("/study/session/end", authenticateToken, async (req, res) => {
    try {
        const { 
            session_id, 
            duration_minutes, 
            cards_studied, 
            correct_cards,
            completed 
        } = req.body;
        
        await db.execute(`
            UPDATE study_sessions 
            SET 
                end_time = NOW(),
                duration_minutes = ?,
                cards_studied = ?,
                correct = ?,
                completed = ?
            WHERE id = ?
        `, [duration_minutes, cards_studied, correct_cards, completed, session_id]);

        res.status(200).json({ message: "Session ended successfully" });
    } catch (error) {
        console.error("Error ending study session:", error);
        res.status(500).json({ error: "Error ending study session" });
    }
});

module.exports = router;
