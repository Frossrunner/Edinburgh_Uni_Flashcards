// routes/pdfRoutes.js
const express = require('express');
const router = express.Router();
const { upload, extractTextFromPDF } = require('../middleware/file_utils');
const { generateCardsFromText, fallbackGeneration } = require('../middleware/ai_utils');
const fs = require('fs').promises;
const path = require('path');

// Store uploaded files information (in production, use a proper database)
const uploadedFiles = new Map();

// PDF Upload endpoint
router.post('/pdf/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileId = path.basename(req.file.filename, '.pdf');
        const filePath = req.file.path;

        // Store file information
        uploadedFiles.set(fileId, {
            path: filePath,
            timestamp: Date.now()
        });

        // Clean up old files (files older than 1 hour)
        cleanupOldFiles();

        res.json({ fileId });
    } catch (error) {
        console.error('Error in file upload:', error);
        res.status(500).json({ error: 'Error processing file upload' });
    }
});

// Generate Cards endpoint
router.post('/pdf/generate-cards', async (req, res) => {
    try {
        const { fileId, numCards, focus } = req.body;

        if (!fileId || !numCards) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const fileInfo = uploadedFiles.get(fileId);
        if (!fileInfo) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Extract text from PDF
        const text = await extractTextFromPDF(fileInfo.path);

        let flashcards;
        try {
            flashcards = await generateCardsFromText(text, numCards, focus);
            console.log("good");
        } catch (error) {
            console.error('Primary model failed, trying fallback...');
            flashcards = await fallbackGeneration(text, numCards, focus);
            console.log("bad");
        }

        return res.status(200).json({ flashcards });
    } catch (error) {
        console.error('Error generating cards:', error);
        res.status(500).json({ error: 'Error generating flashcards' });
    }
});

// Cleanup function for old files
async function cleanupOldFiles() {
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    const now = Date.now();

    for (const [fileId, fileInfo] of uploadedFiles.entries()) {
        if (now - fileInfo.timestamp > oneHour) {
            try {
                await fs.unlink(fileInfo.path);
                uploadedFiles.delete(fileId);
            } catch (error) {
                console.error('Error cleaning up file:', error);
            }
        }
    }
}

module.exports = router;