import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for persisted token
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('userData');
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        };
        checkLogin();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiService.login(email, password);
            await AsyncStorage.setItem('userToken', response.token);
            await AsyncStorage.setItem('userData', JSON.stringify(response.user));
            setUser(response.user);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiService.signup(userData);
            await AsyncStorage.setItem('userToken', response.token);
            await AsyncStorage.setItem('userData', JSON.stringify(response.user));
            setUser(response.user);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
