import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/colors';

export const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    // We can add local state for email/pass if we want, but for mock login we hardcode

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vyapar Mitra</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            <View style={{ width: '100%', marginBottom: spacing.lg }}>
                <Input label="Email" placeholder="demo@example.com" />
                <Input label="Password" placeholder="password" secureTextEntry={true} />
            </View>

            <Button title="Login (Mock)" onPress={() => login('demo@example.com', 'password')} style={styles.btn} />
            <Button title="Create Account" onPress={() => navigation.navigate('Signup')} variant="outline" style={styles.btn} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.surface
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
        color: colors.primary
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    btn: {
        width: '100%',
        marginBottom: spacing.md,
    }
});
