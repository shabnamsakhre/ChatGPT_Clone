const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function generateResponse(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    })

    return response.text;
}

async function generateVector(prompt) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: prompt,
        config: { outputDimensionality: 768 }
    })

    return response.embeddings[0].values;
}

module.exports = { generateResponse, generateVector };