// utils/aiUtils.js
const axios = require('axios');
require('dotenv').config();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Replace with the actual DeepSeek API endpoint
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // Ensure you have this in your .env file

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

// async function generateCardsFromText(text, numCards, focus) {
//     try {
//         // Chunk the text
//         console.log("start;");
//         const chunks = chunkText(text);
//         console.log("passed chunkText;");
//         const cardsPerChunk = Math.ceil(numCards / chunks.length);
//         let allCards = [];

//         // Process each chunk
//         for (const chunk of chunks) {
//             console.log("pre prompt 1, chunk: ", chunk);
//             const prompt = `
//                 Generate ${cardsPerChunk} flashcards from this text. Focus on ${focus}.
//                 Keep questions clear and concise.
//                 Keep answers brief but informative.
//                 So to clarify produce question and answer pairs from the text.

//                 Text: ${chunk}

//                 Can You format with no number labelling as:
//                 (Q): ...
//                 (A): ...
//                 blankline
//                 ---`;

//             try {
//                 const response = await axios.post(
//                     DEEPSEEK_API_URL,
//                     {
//                         model: 'deepseek-model-name', // Replace with the actual DeepSeek model name
//                         messages: [
//                             { role: 'user', content: prompt }
//                         ],
//                         max_tokens: 250,
//                         temperature: 0.7,
//                         stop: ['---']
//                     },
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 );

//                 console.log("post prompt 1");
//                 // Parse cards from this chunk
//                 const generatedText = response.data.choices[0].message.content;
//                 const chunkCards = parseCards(generatedText);
//                 console.log("response below:");
//                 console.log(generatedText);
//                 console.log("response End");
//                 allCards = [...allCards, ...chunkCards];

//                 // If we have enough cards, stop processing chunks
//                 if (allCards.length >= numCards) break;

//             } catch (error) {
//                 console.error('Error processing chunk:', error);
//                 continue; // Skip failed chunks
//             }
//         }
//         console.log("passed card generation");
//         // If we got no cards, generate simple ones from the first chunk
//         if (allCards.length === 0) {
//             return generateSimpleCards(chunks[0], numCards);
//         }
//         // Return requested number of cards
//         return allCards.slice(0, numCards);

//     } catch (error) {
//         console.error('Error generating flashcards:', error);
//         return generateSimpleCards(text.slice(0, 1000), numCards);
//     }
// }

async function generateCardsFromText(text, numCards, focus) {
    return [
        {
          question: "Describe Newton's First Law.",
          answer: "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."
        },
        {
          question: "Explain the theory of relativity.",
          answer: "The theory of relativity encompasses two interrelated theories by Albert Einstein: special relativity and general relativity."
        },
        {
          question: "What is quantum mechanics?",
          answer: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles."
        }
      ];
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