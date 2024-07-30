import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";
import firebaseConfig from "./firebaseConfig";

// Initialize FirebaseApp
const firebaseApp = initializeApp(firebaseConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebaseApp);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

// Wrap in an async function so you can use await
async function generateDeck() {
  console.log("Generating deck...");
  console.trace(); // Log the stack trace
  const prompt = `Create a diverse deck of 100 cards in JSON format.  Each card should be an object with two properties:
    - "s": A single word (string).
    - "l": A phrase or compound word (string) containing the word in "s".
    Ensure that each word in "l" is directly related to the word in "s."
    Example Card: {"s": "Sun", "l": "Sunglasses"}
    Each Card should be separated by a comma.
    Surround the cards with square brackets.
    This is for a guessing game. So, the cards should be diverse and not too easy/simple or too hard/complicated to guess.
    Examples of cards that are too easy or simple: 
    {"s": "Cold", "l": "Coldness"}
    {"s": "Good", "l": "Goodness"}
    {"s": "Technology", "l": "Technological"}
    {"s": "Ocean", "l": "Oceanic"}
    {"s": "Europe", "l": "European"}
    {"s": "Planet", "l": "Planetary"}

    Examples of cards that are too hard or complicated:
    {"s": "Failure", "l": "Failure is not an option"} 

    Examples of good cards:
    {"s": "Stone", "l": "Stonehenge"} 


  `;
  const result = await model.generateContent(prompt);
  const responseText = await result.response.text(); // Await the response text

  // Extract JSON content
  const jsonStartIndex = responseText.indexOf('[');
  const jsonEndIndex = responseText.lastIndexOf(']') + 1;
  const jsonString = responseText.slice(jsonStartIndex, jsonEndIndex);

  // console.log(jsonString); // Log the JSON string

  return JSON.parse(jsonString); // Parse and return JSON
}

// run();

export default generateDeck;