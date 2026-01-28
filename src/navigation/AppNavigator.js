import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { RevenueScreen } from '../screens/revenue/RevenueScreen';
import { ReturnFilingScreen } from '../screens/filing/ReturnFilingScreen';
import { DeadlinesScreen } from '../screens/deadlines/DeadlinesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ComplianceFormScreen } from '../screens/filing/ComplianceFormScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { colors } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Revenue') {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                    } else if (route.name === 'Filing') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'Deadlines') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                headerShown: true, // Show header for tab screens
                headerStyle: {
                    backgroundColor: colors.surface,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                },
                headerTitleStyle: {
                    color: colors.text,
                    fontWeight: '600',
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Revenue" component={RevenueScreen} />
            <Tab.Screen name="Filing" component={ReturnFilingScreen} options={{ title: 'Compliance List' }} />
            <Tab.Screen name="Deadlines" component={DeadlinesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="ComplianceForm" component={ComplianceFormScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    );
};
