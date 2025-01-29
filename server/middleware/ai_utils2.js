// utils/aiUtils.js
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();
const axios = require('axios');

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

async function checkOllamaStatus() {
    try {
      await axios.get('http://localhost:11434/api/version');
      console.log('Ollama is running');
      return true;
    } catch (error) {
      console.error('Error: Ollama is not running. Please check that:');
      console.error('1. Ollama is installed');
      console.error('2. Ollama icon is visible in the system tray');
      console.error('3. You can see Ollama running in Task Manager');
      return false;
    }
  }

// Helper function to chunk text
function chunkText(text, maxLength = 4000) {
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
        const chunks = chunkText(text);
        const cardsPerChunk = Math.ceil(numCards / chunks.length);
        let allCards = [];

        for (const chunk of chunks) {
            const prompt = `
                Generate ${cardsPerChunk} Question/Answer pairs from this text. Focus on ${focus}.
                Ensure the questions are clear and concise.
                Ensure answers are brief but informative.

                Text:
                ---
                ${chunk}
                ---

                Format all outputs exactly as shown below. 
                - Do NOT number the questions.
                - Follow the (Q): and (A): format exactly.
                - Do NOT include any introductory text or explanations.
                - Only output the question-answer pairs.

                Example output:
                (Q): What is the capital of France?
                (A): The capital of France is Paris.

                Now generate the question-response pairs in this format and ensure they ARE NOT numbered:`;

            try {
                // Make request to local Ollama instance
                const response = await axios.post('http://localhost:11434/api/generate', {
                    model: 'mistral', // or another model you've pulled in Ollama
                    prompt: prompt,
                    stream: false
                });

                // Parse cards from this chunk
                const generatedText = response.data.response;
                console.log(generatedText);
                const chunkCards = parseCards(generatedText);
                
                allCards = [...allCards, ...chunkCards];

                // If we have enough cards, stop processing chunks
                if (allCards.length >= numCards) break;

            } catch (error) {
                console.error('Error processing chunk:', error);
                continue; // Skip failed chunks
            }
        }

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

    // Trim the text to remove leading/trailing whitespace
    const cleanText = text.trim();

    // Split the text into lines
    const lines = cleanText.split('\n');

    let currentQuestion = '';
    let currentAnswer = '';
    let isAnswer = false;

    for (let line of lines) {
        line = line.trim();

        // Skip empty lines
        if (!line) continue;

        // Check for numbered questions or regular questions
        const isNumberedQuestion = /^\d+[\.)]\s*/.test(line);
        const isRegularQuestion = line.startsWith('(Q):');

        if (isNumberedQuestion || isRegularQuestion) {
            // Save the previous card if it exists
            if (currentQuestion && currentAnswer) {
                cards.push({
                    question: currentQuestion,
                    answer: currentAnswer
                });
            }

            // Extract question text
            if (isNumberedQuestion) {
                // Remove the number and any following punctuation/whitespace
                currentQuestion = line.replace(/^\d+[\.)]\s*/, '').trim();
            } else {
                currentQuestion = line.substring(4).trim();
            }
            currentAnswer = '';
            isAnswer = false;
        } else if (line.startsWith('(A):')) {
            currentAnswer = line.substring(4).trim();
            isAnswer = true;
        } else if (line) {
            // Append line to current answer or question
            if (isAnswer) {
                currentAnswer += ' ' + line;
            } else if (currentQuestion) {
                currentQuestion += ' ' + line;
            }
        }
    }

    // Add the last card if it exists
    if (currentQuestion && currentAnswer) {
        cards.push({
            question: currentQuestion,
            answer: currentAnswer
        });
    }

    // Clean up any double spaces
    return cards.map(card => ({
        question: card.question.replace(/\s+/g, ' ').trim(),
        answer: card.answer.replace(/\s+/g, ' ').trim()
    }));
}



function generateSimpleCards(text, numCards) {
    // Generate simple cards when AI generation fails
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, numCards).map((sentence, index) => ({
        question: `What is explained in this passage: "${sentence.slice(0, 30)}..."?`,
        answer: sentence.trim()
    }));
}

checkOllamaStatus();

// Test cases
const test1 = `
1. (Q): What is Ohm's Law?
(A): V = IR

2. (Q): What are the units?
(A): Volts, Amperes, Ohms
`;

const test2 = `
(Q): Simple question?
(A): Simple answer

(Q): Another question?
(A): Another answer
`;

//console.log(parseCards(test1));
//console.log(parseCards(test2));

module.exports = { generateCardsFromText };

//ok so ollama is taking ridiculously long to answer on my laptop >2mins. for an app this is obviously unfeasible so my question is then, if i were to eventually upload my service to AWS then would this process become a lot faster?