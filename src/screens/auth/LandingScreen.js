import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';

export const LandingScreen = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Navigate after delay
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.iconBox}>
                    <Ionicons name="shield-checkmark" size={64} color="white" />
                </View>
                <Text style={styles.title}>Vyapar Mitra</Text>
                <Text style={styles.subtitle}>Simplify Your Business Compliance</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary, // Brand color background
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconBox: {
        marginBottom: 24,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 40,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 1,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#E0E7FF',
        fontWeight: '500',
    },
});
