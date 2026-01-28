import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useData } from '../../context/DataContext';

const COMPLIANCE_OPTIONS = [
    { id: 'GST', label: 'GST (Goods & Services Tax)' },
    { id: 'TDS', label: 'TDS (Tax Deducted at Source)' },
    { id: 'IT', label: 'Income Tax' },
    { id: 'PF', label: 'Provident Fund (PF)' },
    { id: 'ESI', label: 'Employee State Insurance (ESI)' },
    { id: 'ROC', label: 'ROC / Company Compliances' },
];

export const OnboardingScreen = () => {
    const { completeOnboarding } = useData();
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [category, setCategory] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [selectedCompliances, setSelectedCompliances] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleCompliance = (id) => {
        if (selectedCompliances.includes(id)) {
            setSelectedCompliances(prev => prev.filter(item => item !== id));
        } else {
            setSelectedCompliances(prev => [...prev, id]);
        }
    };

    const handleSave = async () => {
        if (!businessName || !category) {
            Alert.alert('Error', 'Please fill in Business Name and Category');
            return;
        }

        setLoading(true);
        try {
            // Create profile object
            const profile = {
                name: 'User', // Could fetch from Auth user name
                businessName,
                businessType,
                category,
                gstNumber,
                complianceHealth: 85, // Default score for new users? Or calculate based on inputs
            };

            // Generate compliance objects based on selection
            const generatedCompliances = selectedCompliances.map(compType => {
                const baseInfo = COMPLIANCE_OPTIONS.find(c => c.id === compType);
                return {
                    id: String(Date.now() + Math.random()),
                    title: baseInfo.label,
                    description: `${baseInfo.id} filing for current period`,
                    status: 'Pending',
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Due in 7 days
                    type: compType
                };
            });

            // Simulate API delay
            await new Promise(r => setTimeout(r, 800));

            completeOnboarding(profile, generatedCompliances);

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome to Vyapar Mitra</Text>
                <Text style={styles.subtitle}>Let's set up your business profile to get started.</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Business Details</Text>
                <Input
                    label="Business Name"
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="e.g. Sharma Enterprises"
                />
                <Input
                    label="Business Category"
                    value={category}
                    onChangeText={setCategory}
                    placeholder="e.g. Retail, Manufacturing"
                />
                <Input
                    label="Business Type"
                    value={businessType}
                    onChangeText={setBusinessType}
                    placeholder="e.g. Proprietorship, Pvt Ltd"
                />
                <Input
                    label="GST Number (Optional)"
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    placeholder="e.g. 29AAAAA0000A1Z5"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Applicable Compliances</Text>
                <Text style={styles.helperText}>Select the regulations that apply to your business:</Text>
                <View style={styles.checkboxContainer}>
                    {COMPLIANCE_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.checkboxItem,
                                selectedCompliances.includes(option.id) && styles.checkboxItemActive
                            ]}
                            onPress={() => toggleCompliance(option.id)}
                        >
                            <Text style={[
                                styles.checkboxLabel,
                                selectedCompliances.includes(option.id) && styles.checkboxLabelActive
                            ]}>
                                {option.label}
                            </Text>
                            {selectedCompliances.includes(option.id) && (
                                <Text style={styles.checkIcon}>✓</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Button
                title="Create Dashboard"
                onPress={handleSave}
                loading={loading}
                style={styles.button}
            />
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: spacing.lg,
        backgroundColor: colors.background,
        paddingTop: 60, // status bar space
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
        color: colors.text,
    },
    helperText: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    checkboxContainer: {
        gap: spacing.sm,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        justifyContent: 'space-between',
    },
    checkboxItemActive: {
        borderColor: colors.primary,
        backgroundColor: '#EFF6FF', // Light blue
    },
    checkboxLabel: {
        ...typography.body,
        color: colors.text,
    },
    checkboxLabelActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    checkIcon: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    button: {
        marginTop: spacing.md,
    },
});
