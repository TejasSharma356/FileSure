import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://172.20.10.5:5000'; // Updated to physical machine IP
const API_URL = `${BASE_URL}/api/chat`;

export const grokService = {
    sendMessage: async (messages) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('User not authenticated');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    messages: messages
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("Backend API Error:", data.error);
                throw new Error(data.error || 'Failed to fetch response');
            }

            if (!data.choices || !data.choices[0]) {
                console.warn("Unexpected Grok Response:", data);
                throw new Error("Invalid response from AI");
            }

            return data.choices[0].message;

        } catch (error) {
            console.error('Chat Service Error:', error);
            throw error;
        }
    }
};
