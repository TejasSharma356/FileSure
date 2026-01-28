// src/screens/chat/ChatScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { grokService } from '../../services/grokService';

const SUGGESTED_QUESTIONS = [
    "How do I file GSTR-1?",
    "What are late fee penalties?",
    "How to claim ITC?",
    "Show me upcoming deadlines"
];

export const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Surefile Compliance Expert. How can I assist you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef();

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text: text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);

        try {
            // Prepare message history for API
            const apiMessages = messages.concat(userMsg).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            // Only send last 10 messages to save tokens/context
            const recentMessages = apiMessages.slice(-10);

            const response = await grokService.sendMessage(recentMessages);

            const botMsg = { id: Date.now() + 1, text: response.content, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            const errorMsg = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server. Please try again.", sender: 'bot', isError: true };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgContainer, isUser ? styles.msgRight : styles.msgLeft]}>
                {!isUser && (
                    <View style={styles.botIcon}>
                        <Ionicons name="logo-android" size={16} color="white" />
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleRight : styles.bubbleLeft, item.isError && styles.bubbleError]}>
                    <Text style={[styles.msgText, isUser ? styles.textRight : styles.textLeft]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Surefile AI Expert</Text>
                    <Text style={styles.headerSubtitle}>Powered by Grok</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />

            {/* Suggestions Chips - Only show when idle */}
            {messages.length < 3 && !isLoading && (
                <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionsLabel}>Suggested Questions:</Text>
                    <View style={styles.chipsRow}>
                        {SUGGESTED_QUESTIONS.map((q, index) => (
                            <TouchableOpacity key={index} style={styles.chip} onPress={() => sendMessage(q)}>
                                <Text style={styles.chipText}>{q}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.loadingText}>Thinking...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask about GST, deadlines..."
                    placeholderTextColor={colors.textSecondary}
                    onSubmitEditing={() => sendMessage(inputText)}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                    onPress={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                >
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: Platform.OS === 'android' ? 40 : spacing.md, // Adjust for status bar if not handled by SafeArea
    },
    backBtn: {
        marginRight: spacing.md,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.primary,
    },
    headerSubtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 20,
    },
    msgContainer: {
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'flex-end',
    },
    msgRight: {
        justifyContent: 'flex-end',
    },
    msgLeft: {
        justifyContent: 'flex-start',
    },
    botIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 4,
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    bubbleRight: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 2,
    },
    bubbleLeft: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomLeftRadius: 2,
    },
    bubbleError: {
        backgroundColor: '#FEE2E2',
        borderColor: colors.error,
    },
    msgText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textRight: {
        color: 'white',
    },
    textLeft: {
        color: colors.text,
    },
    suggestionsContainer: {
        padding: spacing.md,
        backgroundColor: colors.background, // Transparent-ish
    },
    suggestionsLabel: {
        ...typography.caption,
        marginBottom: spacing.sm,
        color: colors.textSecondary,
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    chipText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '500',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    loadingText: {
        marginLeft: 8,
        color: colors.textSecondary,
        fontSize: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: spacing.sm,
        fontSize: 16,
        maxHeight: 100,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: colors.border,
    },
});
