import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useData } from '../../context/DataContext';
import { Ionicons } from '@expo/vector-icons';

export const ComplianceFormScreen = ({ navigation, route }) => {
    const { complianceId, title } = route.params || {};
    const { saveComplianceDraft } = useData();
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    // Form State
    const [bizName, setBizName] = useState('');
    const [bizType, setBizType] = useState('');
    const [turnover, setTurnover] = useState('');

    // Step 2
    const [fy, setFy] = useState('');
    const [period, setPeriod] = useState('');

    // Step 3
    const [sales, setSales] = useState('');
    const [otherIncome, setOtherIncome] = useState('');

    // Step 4
    const [expenses, setExpenses] = useState('');
    const [tds, setTds] = useState('');

    const isStepValid = () => {
        switch (step) {
            case 1: return !!bizName && !!bizType && !!turnover;
            case 2: return !!fy && !!period;
            case 3: return !!sales; // Other income optional
            case 4: return !!expenses; // TDS optional
            case 5: return true; // Review step always valid
            default: return false;
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else navigation.goBack();
    };

    const handleNext = () => {
        if (!isStepValid()) {
            Alert.alert("Missing Fields", "Please fill in all required fields to proceed.");
            return;
        }

        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Save Draft
            if (complianceId) {
                const draftData = {
                    bizName, bizType, turnover,
                    fy, period,
                    sales, otherIncome,
                    expenses, tds
                };
                saveComplianceDraft(complianceId, draftData);
            }
            Alert.alert("Success", "Compliance Form Saved Successfully!", [
                { text: "Go to Dashboard", onPress: () => navigation.goBack() }
            ]);
        }
    };

    const progress = (step / totalSteps) * 100;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || 'Compliance Filing'}</Text>
                <TouchableOpacity style={styles.saveExitBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="save-outline" size={18} color={colors.primary} />
                    <Text style={styles.saveExitText}>Save & Exit</Text>
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.excludeHeader}>
                <View style={styles.stepRow}>
                    <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
                    <Text style={styles.percentText}>{progress}% Complete</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View>
                        <Text style={styles.sectionTitle}>Business Information</Text>
                        <Text style={styles.sectionSubtitle}>Let's start with some basic details about your business</Text>

                        <Input
                            label="What is your business name?"
                            placeholder="Enter your registered business name"
                            value={bizName}
                            onChangeText={setBizName}
                            rightIcon="help-circle-outline"
                        />

                        <Input
                            label="What type of business do you run?"
                            placeholder="Select your business type"
                            value={bizType}
                            onChangeText={setBizType}
                            rightIcon="help-circle-outline"
                        />

                        <Input
                            label="What is your annual turnover?"
                            placeholder="Enter amount in rupees"
                            value={turnover}
                            onChangeText={setTurnover}
                            rightIcon="help-circle-outline"
                        />
                    </View>
                )}
                {step === 2 && (
                    <View>
                        <Text style={styles.sectionTitle}>Filing Period</Text>
                        <Text style={styles.sectionSubtitle}>Select the period you are filing for</Text>

                        {/* Placeholder for Date/Period Selection */}
                        <Input
                            label="Financial Year"
                            placeholder="e.g. 2024-2025"
                            value={fy}
                            onChangeText={setFy}
                        />
                        <Input
                            label="Month/Quarter"
                            placeholder="e.g. Q1 (April - June)"
                            value={period}
                            onChangeText={setPeriod}
                        />
                    </View>
                )}
                {step === 3 && (
                    <View>
                        <Text style={styles.sectionTitle}>Income Details</Text>
                        <Text style={styles.sectionSubtitle}>Enter your revenue details for this period</Text>

                        <Input
                            label="Total Sales (Revenue)"
                            placeholder="0.00"
                            value={sales}
                            onChangeText={setSales}
                            keyboardType="numeric"
                        />
                        <Input
                            label="Other Income"
                            placeholder="0.00"
                            value={otherIncome}
                            onChangeText={setOtherIncome}
                            keyboardType="numeric"
                        />
                    </View>
                )}
                {step === 4 && (
                    <View>
                        <Text style={styles.sectionTitle}>Deductions & Expenses</Text>
                        <Text style={styles.sectionSubtitle}>Claim your valid business expenses</Text>

                        <Input
                            label="Total Expenses"
                            placeholder="0.00"
                            value={expenses}
                            onChangeText={setExpenses}
                            keyboardType="numeric"
                        />
                        <Input
                            label="Tax Deducted at Source (TDS Credit)"
                            placeholder="0.00"
                            value={tds}
                            onChangeText={setTds}
                            keyboardType="numeric"
                        />
                    </View>
                )}
                {step === 5 && (
                    <View>
                        <Text style={styles.sectionTitle}>Review & Verify</Text>
                        <Text style={styles.sectionSubtitle}>Please review all details before generating the draft.</Text>

                        <View style={{ backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                            {/* Business Section */}
                            <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>Business Details</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ color: colors.textSecondary }}>Name:</Text>
                                    <Text style={{ fontWeight: '600' }}>{bizName || '-'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ color: colors.textSecondary }}>Type:</Text>
                                    <Text style={{ fontWeight: '600' }}>{bizType || '-'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: colors.textSecondary }}>Turnover:</Text>
                                    <Text style={{ fontWeight: '600' }}>₹{turnover || '0'}</Text>
                                </View>
                            </View>

                            {/* Filing Period */}
                            <View style={{ padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#F9FAFB' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>Filing Period</Text>
                                <Text style={{ fontWeight: '500' }}>{period} ({fy})</Text>
                            </View>

                            {/* Financial Summary */}
                            <View style={{ padding: spacing.md }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary, marginBottom: 8 }}>Financial Summary</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ color: colors.textSecondary }}>Total Sales:</Text>
                                    <Text style={{ fontWeight: '600' }}>₹{sales || '0'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ color: colors.textSecondary }}>Total Expenses:</Text>
                                    <Text style={{ fontWeight: '600' }}>₹{expenses || '0'}</Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>Net Taxable:</Text>
                                    <Text style={{ fontWeight: 'bold', color: colors.success }}>
                                        ₹{Math.max(0, (parseFloat(sales || 0) - parseFloat(expenses || 0))).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: colors.textSecondary }}>TDS Credit:</Text>
                                    <Text style={{ fontWeight: '600' }}>-₹{tds || '0'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Button
                    title={step === totalSteps ? "Confirm & Save" : "Continue"}
                    onPress={handleNext}
                    style={[styles.continueBtn, !isStepValid() && styles.disabledBtn]}
                />
                <Button title="Save Draft" variant="outline" onPress={() => {
                    Alert.alert("Draft Saved", "You can resume this later.");
                    navigation.goBack();
                }} style={styles.draftBtn} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white", // Image shows white background
    },
    disabledBtn: {
        backgroundColor: colors.primary,
        opacity: 0.5
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backBtn: {
        marginRight: spacing.md,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        color: colors.text,
    },
    saveExitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    saveExitText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 12,
        marginLeft: 4,
    },
    excludeHeader: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    stepRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    stepText: {
        color: colors.info,
        fontWeight: '600',
        fontSize: 14,
    },
    percentText: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary, // Blue
        borderRadius: 3,
    },
    content: {
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    footer: {
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    continueBtn: {
        backgroundColor: colors.primary,
        marginBottom: spacing.md,
    },
    draftBtn: {
        borderColor: colors.primary,
    },
    placeholderStep: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    }
});
