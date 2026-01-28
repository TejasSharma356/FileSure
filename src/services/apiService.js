import { MOCK_COMPLIANCES } from '../mockData/compliances';
import { MOCK_USER } from '../mockData/user';

const BASE_URL = 'http://10.3.50.245:3000'; // Detected LAN IP
// const BASE_URL = 'http://localhost:3000'; // For simulator

// Simulate network delay for non-chat mock calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
    // Authentication (Mock for now, can be real later)
    login: async (email, password) => {
        await delay(1000);
        if (email === 'demo@example.com' && password === 'password') {
            return { token: 'mock-jwt-token', user: { id: 'u1', email } };
        }
        throw new Error('Invalid credentials');
    },

    signup: async (userData) => {
        await delay(1000);
        return { token: 'mock-jwt-token', user: { id: 'u2', ...userData } };
    },

    // Business Profile
    getBusinessProfile: async () => {
        await delay(800);
        // TODO: Fetch from real backend
        return MOCK_USER;
    },

    updateBusinessProfile: async (data) => {
        await delay(1000);
        // TODO: Send to real backend
        console.log('Updated profile:', data);
        return { ...MOCK_USER, ...data };
    },

    // Compliances
    getComplianceChecklist: async (businessType) => {
        await delay(1000);
        // TODO: Fetch from backend based on businessType
        // Filter mocks for demo
        if (!businessType) return MOCK_COMPLIANCES;
        return MOCK_COMPLIANCES.filter(c => c.businessType.includes(businessType));
    },

    // Revenue
    saveRevenueData: async (revenueData) => {
        await delay(1200);
        // TODO: Send to backend
        console.log('Saved revenue data:', revenueData);
        return { success: true, id: 'rev-' + Date.now() };
    },

    // Return Filing
    getReturnForm: async (formType) => {
        await delay(800);
        // TODO: Fetch form schema/data
        return {
            formId: 'gst-3b',
            fields: [
                { id: 'sales', label: 'Total Sales', type: 'number', required: true },
                { id: 'tax', label: 'Tax Payable', type: 'number', required: true },
                { id: 'itc', label: 'Input Tax Credit', type: 'number', required: true },
            ]
        };
    },

    saveReturnDraft: async (draftData) => {
        await delay(800);
        console.log('Saved draft:', draftData);
        return { success: true, draftId: 'draft-' + Date.now() };
    },

    // Deadlines
    getDeadlines: async () => {
        await delay(600);
        return MOCK_COMPLIANCES.map(c => ({
            id: c.id,
            title: c.title,
            dueDate: c.dueDate,
            status: new Date(c.dueDate) < new Date() ? 'At Risk' : 'Safe'
        }));
    },

    // Chat / LLM
    startChat: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/chat/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error startChat:', error);
            throw error;
        }
    },

    sendMessage: async (conversationId, message, context) => {
        try {
            const response = await fetch(`${BASE_URL}/chat/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId,
                    message,
                    ...context
                })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error sendMessage:', error);
            throw error;
        }
    }
};
