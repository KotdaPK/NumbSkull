import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";

// TODO(developer) Replace the following with your app's Firebase configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyD-nnM08OD5pTpwa5-H11HpMOmHbiU7g80",
  authDomain: "numbskull-kotda.firebaseapp.com",
  projectId: "numbskull-kotda",
  storageBucket: "numbskull-kotda.appspot.com",
  messagingSenderId: "752038215210",
  appId: "1:752038215210:web:19aef154a3c36712be0d53",
  measurementId: "G-JCWH4PWXGH"
};

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
    This is for a guessing game. So, the cards should be diverse and not too easy or too hard to guess.
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