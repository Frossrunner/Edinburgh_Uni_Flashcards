const express = require("express");
const authenticateToken = require("../middleware/authenticatetoken.js"); // Authentication middleware
const db = require("../db.js"); // Adjust the path to your `db.js` file
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/decks", authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const user_id = user.id;
        const class_id = req.body.class_id;
        const [decks] = await db.execute("SELECT * FROM decks WHERE user_id = ? AND class_id = ?", [user_id, class_id]);
        res.json(decks); // Return the fetched decks directly
    } catch (error) {
        console.error("Error collecting decks:", error); // Log detailed error
        res.status(500).json({ error: "An error occurred during deck collection" });
    }
});

router.post("/createDeck", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the authenticated user
        const { class_id, name, description } = req.body;

        if (!class_id || !name || !description) {
            return res.status(400).json({ error: "Class ID, name, and description are required" });
        }

        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace('T', ' ');

        // Insert the new deck into the database
        const [result] = await db.execute(
            "INSERT INTO decks (user_id, class_id, name, description, created_at) VALUES (?, ?, ?, ?, ?)",
            [userId, class_id, name, description, timestamp]
        );

        // Fetch the newly inserted deck using the generated insertId
        const [newDeck] = await db.execute(
            "SELECT * FROM decks WHERE id = ?",
            [result.insertId]
        );

        // Respond with the newly created deck
        res.status(201).json(newDeck[0]); // Return the first (and only) row
    } catch (error) {
        console.error("Error creating deck:", error); // Log detailed error
        res.status(500).json({ error: "An error occurred during deck creation" });
    }
});

router.delete("/deck", authenticateToken, async (req, res) => {
    try {
        const deck_id = req.body.deck_id;

        // Use await to ensure the query resolves
        const [response] = await db.execute('DELETE FROM decks WHERE id = ?', [deck_id]);

        // Optionally check the response to confirm deletion
        if (response.affectedRows === 0) {
            return res.status(404).json({ error: "Deck not found" });
        }

        res.status(200).json({ message: "Deck deleted successfully" });
    } catch (error) {
        console.error("Error deleting deck:", error); // Log detailed error
        res.status(500).json({ error: "An error occurred during deck deletion" });
    }
});

// collect deck along with its flashcards
router.get("/decks/:deckId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;

        // Fetch the deck owned by the user
        const [deckRows] = await db.execute(
            "SELECT * FROM Decks WHERE id = ? AND user_id = ?",
            [deckId, userId]
        );

        if (deckRows.length === 0) {
            return res.status(404).json({ error: "Deck not found" });
        }

        const deck = deckRows[0];

        // Fetch the flashcards associated with the deck
        const [flashcardRows] = await db.execute(
            "SELECT * FROM Flashcards WHERE deck_id = ?",
            [deckId]
        );

        // Include the flashcards in the deck object
        deck.cards = flashcardRows;

        res.status(200).json(deck);
    } catch (error) {
        console.error("Error fetching deck:", error);
        res.status(500).json({ error: "An error occurred while fetching the deck" });
    }
});

// Update a deck
router.put("/decks/:deckId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const deckId = req.params.deckId;
        const { name, cards } = req.body;

        // Validate input data
        if (!name || !Array.isArray(cards)) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        // Update the deck name
        await db.execute(
            "UPDATE Decks SET name = ? WHERE id = ? AND user_id = ?",
            [name, deckId, userId]
        );

        // Delete existing flashcards for this deck
        await db.execute(
            "DELETE FROM Flashcards WHERE deck_id = ?",
            [deckId]
        );

        // Insert new flashcards
        const flashcardInsertPromises = cards.map(card => {
            return db.execute(
                "INSERT INTO Flashcards (deck_id, class_id, user_id, question, answer) VALUES (?, ?, ?, ?, ?)",
                [
                    deckId,
                    card.class_id || null,
                    userId,
                    card.question,
                    card.answer
                ]
            );
        });

        await Promise.all(flashcardInsertPromises);

        // Fetch the updated deck and its flashcards to return in the response
        const [updatedDeckRows] = await db.execute(
            "SELECT * FROM Decks WHERE id = ? AND user_id = ?",
            [deckId, userId]
        );

        if (updatedDeckRows.length === 0) {
            return res.status(404).json({ error: "Deck not found after update" });
        }

        const updatedDeck = updatedDeckRows[0];

        const [updatedFlashcardRows] = await db.execute(
            "SELECT * FROM Flashcards WHERE deck_id = ?",
            [deckId]
        );

        updatedDeck.cards = updatedFlashcardRows;

        res.status(200).json(updatedDeck);
    } catch (error) {
        console.error("Error updating deck:", error);
        res.status(500).json({ error: "An error occurred while updating the deck" });
    }
});

module.exports = router;