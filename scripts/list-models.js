const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const apiKey = envConfig.GEMINI_API_KEY;

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not found in .env.local");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Fetching available models...");
        // Note: listModels is not directly exposed on the client instance in some versions,
        // but let's try the standard way or fallback to a raw request if needed.
        // Actually, looking at the docs/types, it might be on the class or a utility.
        // Let's try to get a model and see if we can list.
        // Wait, the error message says "Call ListModels".
        // In the Node SDK, it's usually a separate method or on a manager.
        // Let's try accessing the model manager if it exists, or just use a raw fetch if the SDK doesn't make it obvious.
        // Actually, the SDK has a `getGenerativeModel` but listing might be different.
        // Let's try a direct REST call if the SDK method isn't obvious, but wait, I should try the SDK first.
        // The error message said "Call ListModels".

        // Let's try to use the SDK's model listing capability if available.
        // If not, I'll use a simple fetch to the API endpoint.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
            });
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
