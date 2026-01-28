import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/colors';

export const SignupScreen = ({ navigation }) => {
    const { signup, isLoading, error } = useAuth();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={{ width: '100%', marginBottom: spacing.lg }}>
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChangeText={setName}
                />
                <Input
                    label="Email"
                    placeholder="john@example.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <Input
                    label="Password"
                    placeholder="******"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                {error && <Text style={{ color: colors.error, marginTop: 8 }}>{error}</Text>}
            </View>

            <Button
                title={isLoading ? "Creating Account..." : "Signup"}
                onPress={() => signup({ name, email, password })}
                style={styles.btn}
                disabled={!name || !email || !password || isLoading}
            />
            <Button title="Back to Login" onPress={() => navigation.goBack()} variant="outline" style={styles.btn} />
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.xl,
        color: colors.text
    },
    btn: {
        width: '100%',
        marginBottom: spacing.md,
    }
});
