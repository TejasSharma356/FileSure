import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { apiService } from '../../services/apiService';
import { Ionicons } from '@expo/vector-icons';

export const ReturnFilingScreen = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Mock Form Data
    const [sales, setSales] = useState('500000');
    const [tax, setTax] = useState('90000'); // ~18%
    const [itc, setItc] = useState('45000'); // Input tax credit
    const [challanId, setChallanId] = useState('');

    const TOTAL_STEPS = 6;

    const handleNext = () => setStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await apiService.saveReturnDraft({ sales, tax, itc, challanId });
            Alert.alert('Success', 'Return Filed Successfully! (Mock)');
            setStep(1); // Reset
            setChallanId('');
        } catch (err) {
            Alert.alert('Error', 'Failed to file return');
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 1: Period ---
    const renderStep1 = () => (
        <View>
            <Text style={styles.stepTitle}>Step 1: Confirm Period</Text>
            <Text style={styles.label}>Filing for Month:</Text>
            <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText}>October 2023</Text>
            </View>
            <Text style={styles.helper}>Based on your recent revenue uploads.</Text>
            <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Due Date: 20th Nov 2023</Text>
            </View>
        </View>
    );

    // --- STEP 2: Upload Documents (New) ---
    const renderStep2 = () => (
        <View>
            <Text style={styles.stepTitle}>Step 2: Upload Documents</Text>
            <Text style={styles.subtitle}>Upload your sales invoices and purchase bills for verification.</Text>

            <View style={styles.uploadBox}>
                <Ionicons name="cloud-upload-outline" size={40} color={colors.textSecondary} />
                <Text style={styles.uploadText}>Upload Sales Register (CSV/Excel)</Text>
                <Button title="Select File" onPress={() => Alert.alert('Upload', 'Mock File Picker')} variant="outline" style={{ marginTop: spacing.sm }} />
            </View>

            <View style={styles.uploadBox}>
                <Ionicons name="cloud-upload-outline" size={40} color={colors.textSecondary} />
                <Text style={styles.uploadText}>Upload Purchase Register (CSV/Excel)</Text>
                <Button title="Select File" onPress={() => Alert.alert('Upload', 'Mock File Picker')} variant="outline" style={{ marginTop: spacing.sm }} />
            </View>
        </View>
    );

    // --- STEP 3: Sales & Tax ---
    const renderStep3 = () => (
        <View>
            <Text style={styles.stepTitle}>Step 3: Total Sales & Tax</Text>
            <Input
                label="Total Taxable Value"
                value={sales}
                onChangeText={setSales}
                keyboardType="numeric"
                placeholder="0"
            />
            <Input
                label="Total Tax Payable (IGST/CGST/SGST)"
                value={tax}
                onChangeText={setTax}
                keyboardType="numeric"
                placeholder="0"
            />
            <Text style={styles.helper}>Pre-filled from your uploaded sales ledger.</Text>
        </View>
    );

    // --- STEP 4: ITC ---
    const renderStep4 = () => (
        <View>
            <Text style={styles.stepTitle}>Step 4: Input Tax Credit (ITC)</Text>
            <Input
                label="Eligible ITC"
                value={itc}
                onChangeText={setItc}
                keyboardType="numeric"
                placeholder="0"
            />
            <Text style={styles.helper}>Credit available from GSTR-2B (Mock).</Text>
            <View style={styles.calcBox}>
                <Text style={styles.calcLabel}>Net Tax Payable:</Text>
                <Text style={styles.calcValue}>₹{Math.max(0, parseInt(tax || 0) - parseInt(itc || 0))}</Text>
            </View>
        </View>
    );

    // --- STEP 5: Payment (New) ---
    const renderStep5 = () => (
        <View>
            <Text style={styles.stepTitle}>Step 5: Tax Payment</Text>
            <Text style={styles.subtitle}>Pay the net liability through Challan.</Text>

            <View style={styles.paymentCard}>
                <Text style={styles.paymentLabel}>Liablity</Text>
                <Text style={styles.paymentValue}>₹{Math.max(0, parseInt(tax || 0) - parseInt(itc || 0))}</Text>
            </View>

            <Input
                label="Challan Identification Number (CIN) / Ref ID"
                value={challanId}
                onChangeText={setChallanId}
                placeholder="Enter Challan Ref from Bank"
            />

            <Button
                title="Create Mock Challan"
                onPress={() => { setChallanId('CIN' + Math.floor(Math.random() * 100000)); Alert.alert('Payment', 'Mock Payment Successful'); }}
                variant="secondary"
                style={{ marginBottom: spacing.md }}
            />
        </View>
    );

    // --- STEP 6: Review & Submit ---
    const renderStep6 = () => (
        <View>
            <Text style={styles.stepTitle}>Step 6: Review & Submit</Text>
            <View style={styles.reviewCard}>
                <ReviewRow label="Filing Period" value="Oct 2023" />
                <ReviewRow label="Total Sales" value={`₹${sales}`} />
                <ReviewRow label="Total Tax" value={`₹${tax}`} />
                <ReviewRow label="Eligible ITC" value={`₹${itc}`} />
                <View style={styles.divider} />
                <ReviewRow label="Net Payable" value={`₹${Math.max(0, parseInt(tax || 0) - parseInt(itc || 0))}`} highlight />
                <ReviewRow label="Payment Ref" value={challanId || 'Pending'} />
            </View>

            <View style={styles.warningBox}>
                <Ionicons name="warning-outline" size={16} color={colors.warning} />
                <Text style={styles.warningText}>
                    I hereby declare that the information given above is true and correct to the best of my knowledge.
                </Text>
            </View>
        </View>
    );

    const ReviewRow = ({ label, value, highlight }) => (
        <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>{label}:</Text>
            <Text style={[styles.reviewValue, highlight && { color: colors.primary, fontWeight: 'bold' }]}>{value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Progress Header */}
            <View style={styles.progressContainer}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <View key={i} style={[styles.bar, step >= i + 1 && styles.activeBar]} />
                ))}
            </View>
            <Text style={styles.stepIndicator}>Step {step} of {TOTAL_STEPS}</Text>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
                {step === 6 && renderStep6()}
            </ScrollView>

            <View style={styles.footer}>
                {step > 1 && (
                    <Button title="Back" onPress={handleBack} variant="outline" style={{ flex: 1, marginRight: spacing.sm }} />
                )}
                {step < TOTAL_STEPS ? (
                    <Button title="Next" onPress={handleNext} style={{ flex: 1 }} />
                ) : (
                    <Button title="File Return" onPress={handleSubmit} loading={loading} style={{ flex: 1 }} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    progressContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.xs,
        paddingBottom: spacing.xs,
    },
    bar: {
        flex: 1,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
    },
    activeBar: {
        backgroundColor: colors.primary,
    },
    stepIndicator: {
        ...typography.caption,
        textAlign: 'center',
        paddingBottom: spacing.sm,
        color: colors.textSecondary,
    },
    content: {
        padding: spacing.md,
    },
    stepTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
        color: colors.text,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.label,
        marginBottom: spacing.xs,
    },
    readOnlyBox: {
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    readOnlyText: {
        ...typography.body,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
        padding: spacing.md,
        borderRadius: 8,
        marginTop: spacing.sm,
    },
    infoText: {
        marginLeft: spacing.sm,
        color: '#0369A1',
        ...typography.caption,
        fontWeight: '600'
    },
    helper: {
        ...typography.caption,
        marginBottom: spacing.lg,
        color: colors.textSecondary,
    },
    footer: {
        padding: spacing.md,
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    uploadBox: {
        borderWidth: 1,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: spacing.lg,
        alignItems: 'center',
        marginBottom: spacing.lg,
        backgroundColor: '#F0F9FF',
    },
    uploadText: {
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        color: colors.text,
        fontWeight: '500',
        textAlign: 'center',
    },
    calcBox: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    calcLabel: {
        ...typography.body,
    },
    calcValue: {
        ...typography.h3,
        color: colors.error,
    },
    paymentCard: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    paymentLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    paymentValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
    },
    reviewCard: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    reviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
    },
    reviewLabel: {
        ...typography.body,
        color: colors.textSecondary,
        flex: 1,
    },
    reviewValue: {
        ...typography.body,
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.sm,
    },
    warningBox: {
        flexDirection: 'row',
        padding: spacing.sm,
        backgroundColor: '#FFFBEB',
        borderRadius: 4,
        marginTop: spacing.sm,
    },
    warningText: {
        fontSize: 12,
        color: '#B45309',
        marginLeft: spacing.xs,
        flex: 1,
    }
});
