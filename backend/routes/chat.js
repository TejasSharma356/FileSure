const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatHistory = require('../models/ChatHistory');

const API_KEY = process.env.GROK_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', auth, async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages) {
            return res.status(400).json({ error: 'Messages are required' });
        }

        // 1. Save User Message to History
        // Find or create chat session for simple single-thread model
        let chatHistory = await ChatHistory.findOne({ userId: req.user.id });
        if (!chatHistory) {
            chatHistory = new ChatHistory({ userId: req.user.id, messages: [] });
        }

        // Add user messages (assuming they come in batch or just the last one is new)
        // For simplicity, we just look at the last user message in the payload
        const lastUserMsg = messages[messages.length - 1];
        if (lastUserMsg.role === 'user') {
            chatHistory.messages.push({ role: 'user', content: lastUserMsg.content });
        }

        // 2. Call Grok API
        console.log("Sending request to Grok API..."); // Debug
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: "You are an expert Indian Business Compliance Assistant for 'Surefile'. \
                        Your goal is to help small business owners understand GST, TDS, Income Tax, and filing procedures. \
                        Be concise, professional, and helpful. Guide them on how to use the Surefile app features (Dashboard, Return Filing, Profile). \
                        If asked about filing, guide them to use the 'Return Filing' wizard in the app."
                    },
                    ...messages
                ],
                model: "openai/gpt-oss-120b",
                stream: false,
                temperature: 0.7
            })
        });

        const data = await response.json();
        console.log("Grok API Status:", response.status); // Debug
        console.log("Grok API Response:", JSON.stringify(data, null, 2)); // Debug

        if (data.error) {
            console.error("Grok API Error Details:", data.error);
            return res.status(500).json({ error: data.error.message || 'External API Error', details: data.error });
        }

        const botReply = data.choices[0].message;

        // 3. Save Bot Response to History
        chatHistory.messages.push({ role: 'assistant', content: botReply.content });
        await chatHistory.save();

        res.json(data);

    } catch (error) {
        console.error('Server Chat Error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
