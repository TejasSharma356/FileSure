import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://172.20.10.5:5000'; // Updated to physical machine IP
const API_URL = `${BASE_URL}/api`;

const getHeaders = async () => {
    const token = await AsyncStorage.getItem('userToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'x-auth-token': token } : {})
    };
};

export const apiService = {
    // Auth
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("API Response Parse Error:", text);
            throw new Error(text || 'Network response was not valid JSON');
        }

        if (!response.ok) throw new Error(data.msg || 'Login failed');
        return data;
    },

    signup: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("API Response Parse Error:", text);
            throw new Error(text || 'Network response was not valid JSON');
        }

        if (!response.ok) throw new Error(data.msg || 'Signup failed');
        return data;
    },

    // Business
    getBusinessProfile: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/business`, { headers });
        const data = await response.json();
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(data.msg || 'Failed to fetch profile');
        return data;
    },

    updateBusinessProfile: async (profileData) => {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/business`, {
            method: 'POST',
            headers,
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Failed to update profile');
        return data;
    },

    // Filing
    getFilings: async () => {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/filing`, { headers });
        return response.json();
    },

    saveFiling: async (filingData) => {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/filing`, {
            method: 'POST',
            headers,
            body: JSON.stringify(filingData)
        });
        return response.json();
    },

    // --- Legacy / Adapter Methods (Prevent Crashes) ---
    getDeadlines: async () => {
        // TODO: Implement backend endpoint for deadlines
        return [];
    },

    saveRevenueData: async (data) => {
        // TODO: Implement backend endpoint for revenue
        console.log("Mock Revenue Saved:", data);
        return { success: true };
    },

    saveReturnDraft: async (draftData) => {
        // Adapt old frontend call to new backend structure
        return apiService.saveFiling({
            filingType: 'GSTR-3B', // Default for now
            period: 'October 2023',
            status: 'Draft',
            data: draftData
        });
    },

    getReturnForm: async (formType) => {
        // Keep mock form logic for Wizard
        return {
            formId: 'gst-3b',
            fields: []
        };
    }
};
