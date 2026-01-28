import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [businessProfile, setBusinessProfile] = useState(null);
    const [compliances, setCompliances] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [deadlines, setDeadlines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Only fetch deadlines/other data. Profile is local-first for now to force onboarding.
            // In a real app we'd check if profile exists on backend.
            const [deadlinesList] = await Promise.all([
                apiService.getDeadlines(),
            ]);
            // setBusinessProfile(profile); // DISABLE MOCK PROFILE FETCH
            // setCompliances(complianceList); // DISABLE MOCK FETCH
            setDeadlines(deadlinesList);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            // We do NOT fetch profile automatically to force "check"
            // But we might want to check if persisted. For this task, we assume fresh login = needs onboarding or we rely on state.
            // basic fetch
            fetchData();
        } else {
            setBusinessProfile(null);
            setCompliances([]);
            setDeadlines([]);
        }
    }, [user]);

    const completeOnboarding = (profile, complianceList) => {
        setBusinessProfile(profile);
        setCompliances(complianceList);
    };

    const saveRevenue = async (data) => {
        await apiService.saveRevenueData(data);
        console.log('Revenue saved locally in context');
    };

    const saveComplianceDraft = (id, draftData) => {
        setCompliances(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, status: 'Draft Saved', draftData };
            }
            return item;
        }));
        console.log('Compliance draft saved:', id);
    };

    return (
        <DataContext.Provider value={{
            businessProfile,
            compliances,
            revenue,
            deadlines,
            isLoading,
            refreshData: fetchData,
            completeOnboarding, // Exposed method
            saveRevenue,
            saveComplianceDraft,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
