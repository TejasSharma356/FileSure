const express = require('express');
const router = express.Router();
const llmService = require('../services/llmService');
const { v4: uuidv4 } = require('uuid');

// In-Memory Storage (Replaces Database for Prototype)
// conversations: Map<string, { id, userId, messages: [] }>
const conversations = new Map();

// POST /chat/start - Start a new conversation
router.post('/start', async (req, res) => {
    try {
        const { userId } = req.body;
        const conversationId = uuidv4();

        // Store conversation in memory
        conversations.set(conversationId, {
            id: conversationId,
            userId: userId || 'anon',
            messages: []
        });

        console.log(`[InMemory] Started conversation: ${conversationId}`);
        res.json({ conversationId });
    } catch (error) {
        console.error('Error starting chat:', error);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
});

// POST /chat/message - Send message & get reply
router.post('/message', async (req, res) => {
    try {
        const { conversationId, message, currentScreen, currentStep, businessContext } = req.body;

        if (!conversationId || !message) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const conversation = conversations.get(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        // 1. Save User Message
        const userMsg = {
            id: uuidv4(),
            role: 'user',
            content: message,
            timestamp: new Date(),
            contextSnapshot: { currentScreen, currentStep, businessContext }
        };
        conversation.messages.push(userMsg);

        // 2. Fetch History (from memory)
        const history = conversation.messages.slice(-10); // Last 10

        // 3. Generate LLM Response
        const llmResponse = await llmService.generateResponse(
            history,
            message,
            { currentScreen, currentStep, businessContext }
        );

        // 4. Save Assistant Reply
        const assistantMsg = {
            id: uuidv4(),
            role: 'assistant',
            content: llmResponse.reply,
            timestamp: new Date()
        };
        conversation.messages.push(assistantMsg);

        res.json({
            reply: llmResponse.reply,
            nextSuggestedStep: llmResponse.nextSuggestedStep
        });

    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// GET /chat/history - Get conversation history
router.get('/history/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = conversations.get(conversationId);

        if (!conversation) {
            return res.json({ messages: [] });
        }

        res.json({ messages: conversation.messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;
