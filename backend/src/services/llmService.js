const axios = require('axios');

class LLMService {
    constructor() {
        this.apiKey = process.env.LLM_API_KEY; // User willprovide this
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'; // Example: Gemini
    }

    async generateResponse(history, currentMessage, context) {
        // 1. Construct System Prompt
        const systemPrompt = `
You are the AI Assistant for Vyapar Mitra, a tax compliance app for Indian MSMEs.
Your goal is to be helpful, knowledgeable, and reassuring.

Context Provided:
- User Business: ${context.businessContext?.businessName || 'Not specified'} (${context.businessContext?.type || 'General User'})
- Turnover: ${context.businessContext?.turnover || 'Not specified'}
- Current Screen: ${context.currentScreen}

Instructions:
1. **Be Helpful First**: If you don't have enough context, DO NOT just say "I don't know". Instead, give a general answer based on standard Indian tax rules (GST, Income Tax) and ask for clarifying details if needed.
2. **General Queries**: If the user asks a general question (e.g., "What is GST?"), answer it directly without needing specific business context.
3. **App Guidance**: Use the 'Current Screen' context to guide them. If they are on the "ComplianceForm", help them with filing fields.
4. **Tone**: Professional, encouraging, and simplified (exclude complex jargon).
5. **Safety**: Do not invent laws. If uncertain about a specific rate/section, advise checking the official portal or a CA.
`;

        // 2. Format History for API (Simplified for now)
        // In real impl, map 'history' array to provider's format (e.g. { role, parts })

        // 3. Call API (Mock for now until Key provided)
        if (!this.apiKey) {
            console.warn("LLM API Key missing, returning mock response.");
            return {
                reply: `[MOCK] Based on your turnover of ${context.businessContext?.turnover}, you likely need to file GSTR-1 quarterly. On this screen (${context.currentScreen}), please enter your total sales for the last quarter.`,
                nextSuggestedStep: "Fill Sales Field"
            };
        }

        try {
            const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
            const prompt = `${systemPrompt}\n\nChat History:\n${historyText}\n\nUser: ${currentMessage}\nAssistant:`;

            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: "llama-3.3-70b-versatile", // Reverting to supported model
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...history.map(h => ({ role: h.role, content: h.content })),
                        { role: "user", content: currentMessage }
                    ],
                    temperature: 0.7
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const replyText = response.data.choices[0].message.content;

            // Simple heuristic for next step suggestion based on reply content
            let nextStep = null;
            if (replyText.toLowerCase().includes("upload")) nextStep = "Upload Documents";
            else if (replyText.toLowerCase().includes("file")) nextStep = "Start Filing";

            return {
                reply: replyText,
                nextSuggestedStep: nextStep
            };

        } catch (error) {
            console.error("LLM Error:", error.response?.data || error.message);
            // Fallback mock if API fails
            return {
                reply: `[System Error] I'm having trouble connecting to my brain right now. Please try again.`,
                nextSuggestedStep: "Retry"
            };
        }
    }
}

module.exports = new LLMService();
