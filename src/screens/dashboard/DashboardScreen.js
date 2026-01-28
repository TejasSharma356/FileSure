import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Image } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { useData } from '../../context/DataContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const DashboardScreen = ({ navigation }) => {
    const { businessProfile, compliances, isLoading, refreshData } = useData();

    // Compute stats dynamically
    const stats = useMemo(() => {
        const upcoming = compliances.filter(c => {
            const days = (new Date(c.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
            return days > 0 && days <= 7;
        }).length;
        const pending = compliances.filter(c => c.status === 'Pending').length;
        // Mock doc needs for now as we don't track docs yet
        const docNeeds = 2;

        return { upcoming, pending, docNeeds };
    }, [compliances]);

    const getStatusColor = (status, dueDate) => {
        if (status === 'Completed') return colors.success;
        const days = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (days < 3) return colors.error; // At Risk
        return colors.warning; // Pending
    };

    const getStatusLabel = (status, dueDate) => {
        if (status === 'Completed') return 'Done';
        const days = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (days < 3) return 'At Risk';
        return status;
    };

    if (!businessProfile) return null; // Should not happen due to RootNavigator check

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={!!isLoading} onRefresh={refreshData} />}
            >
                {/* Health Card */}
                <View style={styles.healthCard}>
                    <View style={styles.healthHeader}>
                        <View>
                            <Text style={styles.healthTitle}>{businessProfile.businessName}</Text>
                            <Text style={styles.healthSubtitle}>Compliance Health</Text>
                        </View>
                        <Ionicons name="shield-checkmark" size={24} color={colors.success} />
                    </View>

                    <View style={styles.scoreRow}>
                        <View>
                            <Text style={styles.scoreLabel}>Score</Text>
                            <Text style={styles.scoreValue}>
                                {businessProfile.complianceHealth || 85}<Text style={styles.scoreTotal}>/100</Text>
                            </Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Good</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${businessProfile.complianceHealth || 85}%` }]} />
                    </View>
                </View>

                {/* Stats Carousel */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsContainer}>
                    <StatCard
                        icon="calendar"
                        count={stats.upcoming}
                        label="Upcoming Deadlines"
                        subLabel="Next 7 days"
                        color={colors.info}
                        bgColor="#EBF5FF"
                    />
                    <StatCard
                        icon="clipboard"
                        count={stats.pending}
                        label="Pending Filings"
                        subLabel="Requires action"
                        color={colors.warning}
                        bgColor="#FFFBEB"
                    />
                    <StatCard
                        icon="document-text"
                        count={stats.docNeeds}
                        label="Doc Needs"
                        subLabel="Upload required"
                        color={colors.error}
                        bgColor="#FEF2F2"
                    />
                </ScrollView>

                {/* Compliance Summary Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Compliance Summary</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Filing')}>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Compliance List */}
                <View style={styles.listContainer}>
                    {compliances.map((item) => (
                        <View key={item.id} style={styles.complianceCard}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <View style={[styles.tag, { backgroundColor: getStatusColor(item.status, item.dueDate) + '20' }]}>
                                    <Text style={[styles.tagText, { color: getStatusColor(item.status, item.dueDate) }]}>
                                        {getStatusLabel(item.status, item.dueDate)}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.cardDesc}>{item.description}</Text>

                            <View style={styles.cardFooter}>
                                <View style={styles.dateRow}>
                                    <Ionicons name="calendar-outline" size={14} color={colors.error} />
                                    <Text style={styles.dueDate}>Due {new Date(item.dueDate).toLocaleDateString()}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('Filing')}
                                >
                                    <Text style={styles.actionButtonText}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    {compliances.length === 0 && (
                        <Text style={styles.emptyText}>No compliances pending found.</Text>
                    )}
                </View>
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Chat')}
            >
                <Ionicons name="chatbubbles-sharp" size={24} color="white" />
                <Text style={styles.fabText}>Ask Expert</Text>
            </TouchableOpacity>
        </View>
    );
};

const StatCard = ({ icon, count, label, subLabel, color, bgColor }) => (
    <View style={styles.statCard}>
        <View style={styles.statHeader}>
            <Text style={styles.statLabel}>{label}</Text>
            <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>
        </View>
        <Text style={[styles.statCount, { color }]}>{count}</Text>
        <Text style={styles.statSubLabel}>{subLabel}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.md,
        paddingBottom: 80, // Space for FAB
    },
    healthCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    healthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    healthTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    healthSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.md,
    },
    scoreLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.success,
    },
    scoreTotal: {
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: 'normal',
    },
    statusBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 8,
    },
    statusText: {
        color: colors.success,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.success, // primary green
        borderRadius: 4,
    },
    statsScroll: {
        marginBottom: spacing.xl,
        marginHorizontal: -spacing.md, // Bleed into padding
        paddingHorizontal: spacing.md,
    },
    statsContainer: {
        paddingRight: spacing.md,
    },
    statCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        width: 140,
        marginRight: spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        flex: 1,
        marginRight: 4,
    },
    iconBox: {
        padding: 6,
        borderRadius: 8,
    },
    statCount: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: spacing.xs,
    },
    statSubLabel: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    viewAll: {
        color: colors.primary,
        fontWeight: '500',
    },
    listContainer: {
        marginBottom: spacing.md,
    },
    complianceCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.error + '30', // Light red border for effect (matches design hint)
        elevation: 1,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
    },
    cardDesc: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: spacing.md,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dueDate: {
        fontSize: 12,
        color: colors.error,
        fontWeight: '500',
    },
    actionButton: {
        backgroundColor: '#1E40AF', // Dark blue
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: 16,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 28,
        elevation: 5,
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    fabText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 16,
    },
});
