// utils/aiUtils.js
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

// Helper function to chunk text
function chunkText(text, maxLength = 1000) {
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += ' ' + sentence;
        }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}

async function generateCardsFromText(text, numCards, focus) {
    try {
        // Chunk the text
        console.log("start;");
        const chunks = chunkText(text);
        console.log("passed chunkText;");
        const cardsPerChunk = Math.ceil(numCards / chunks.length);
        let allCards = [];

        // Process each chunk
        for (const chunk of chunks) {
            console.log("pre prompt 1, chunk: ",chunk);
            const prompt = `
                Generate ${cardsPerChunk} flashcards from this text. Focus on ${focus}.
                Keep questions clear and concise.
                Keep answers brief but informative.
                So to clarify produce question and answer pairs from the text.

                Text: ${chunk}

                Can You format with no number labelling as:
                (Q): ...
                (A): ...

                ---`;

            try {
                const response = await hf.textGeneration({
                    model: 'DeepSeek-R1-Distill-Qwen-32B', 
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 250,
                        temperature: 0.7,
                        return_full_text: false,
                        stop: ['---']
                    }
                });
                console.log("post prompt 1");
                // Parse cards from this chunk
                const chunkCards = parseCards(response.generated_text);
                console.log("reponse below:")
                console.log(response.generated_text);
                console.log("response End");
                allCards = [...allCards, ...chunkCards];

                // If we have enough cards, stop processing chunks
                if (allCards.length >= numCards) break;

            } catch (error) {
                console.error('Error processing chunk:', error);
                continue; // Skip failed chunks
            }
        }
        console.log("passed card generation");
        // If we got no cards, generate simple ones from the first chunk
        if (allCards.length === 0) {
            return generateSimpleCards(chunks[0], numCards);
        }
        // Return requested number of cards
        return allCards.slice(0, numCards);

    } catch (error) {
        console.error('Error generating flashcards:', error);
        return generateSimpleCards(text.slice(0, 1000), numCards);
    }
}

function parseCards(text) {
    const cards = [];
    
    // Clean up the text and remove the placeholder line
    const cleanText = text.replace(/^:.*$/m, '').trim();
    
    // Process each line that might contain a card
    const lines = cleanText.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
        // Look for lines that start with a number and contain (A):
        const cardMatch = line.match(/^\d+\.\s*(.*?)\s*$$A$$:\s*(.*)$/);
        if (cardMatch) {
            const [_, question, answer] = cardMatch;
            cards.push({
                question: question.trim(),
                answer: answer.trim()
            });
        }
    }
    
    return cards;
}

function generateSimpleCards(text, numCards) {
    // Generate simple cards when AI generation fails
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, numCards).map((sentence, index) => ({
        question: `What is explained in this passage: "${sentence.slice(0, 30)}..."?`,
        answer: sentence.trim()
    }));
}

module.exports = { generateCardsFromText };