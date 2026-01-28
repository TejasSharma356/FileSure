import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { apiService } from '../services/apiService';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ChatScreen = ({ navigation, route }) => {
    const { user } = useAuth();
    const { businessProfile } = useData(); // Context for LLM
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const flatListRef = useRef();

    // Start chat on mount
    useEffect(() => {
        const initChat = async () => {
            try {
                // In real app, we might check for existing active conversation first
                const data = await apiService.startChat(user?.id);
                setConversationId(data.conversationId);

                // Add initial greeting
                setMessages([{
                    id: 'init',
                    role: 'assistant',
                    content: `Hello! I'm your Vyapar Mitra assistant. I know you run a ${businessProfile?.type || 'business'} (${businessProfile?.businessName || ''}). How can I help you with your compliance today?`
                }]);
            } catch (error) {
                console.error("Failed to start chat", error);
            }
        };
        initChat();
    }, []);

    const handleSend = async () => {
        if (!inputText.trim() || !conversationId) return;

        const userMsgText = inputText.trim();
        setInputText('');

        // 1. Add User Message Optimistically
        const newMsg = { id: Date.now().toString(), role: 'user', content: userMsgText };
        setMessages(prev => [...prev, newMsg]);

        setIsLoading(true);
        try {
            // 2. Call API
            const context = {
                currentScreen: 'ChatScreen', // Could be dynamic if passed via params
                currentStep: 0,
                businessContext: businessProfile
            };

            const response = await apiService.sendMessage(conversationId, userMsgText, context);

            // 3. Add Assistant Reply
            const botMsg = {
                id: Date.now().toString() + '_bot',
                role: 'assistant',
                content: response.reply
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            const errMsg = { id: Date.now(), role: 'assistant', content: "Sorry, I couldn't reach the server. Please check your connection." };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const isUser = item.role === 'user';
        return (
            <View style={[styles.msgContainer, isUser ? styles.msgRight : styles.msgLeft]}>
                {!isUser && (
                    <View style={styles.botIcon}>
                        <Ionicons name="sparkles" size={16} color="white" />
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
                    <Text style={[styles.msgText, isUser ? styles.textRight : styles.textLeft]}>
                        {item.content}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Vyapar Mitra Assistant</Text>
                    <Text style={styles.headerSubtitle}>AI-Powered Guidance</Text>
                </View>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask about GST, deadlines, or rules..."
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || isLoading}
                    >
                        {isLoading ? <ActivityIndicator color="white" size="small" /> : <Ionicons name="send" size={20} color="white" />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 2,
    },
    backBtn: {
        marginRight: spacing.md,
        padding: 4
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    headerSubtitle: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500'
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    msgContainer: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        alignItems: 'flex-end',
    },
    msgLeft: {
        justifyContent: 'flex-start',
    },
    msgRight: {
        justifyContent: 'flex-end',
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
    bubbleLeft: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    bubbleRight: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    msgText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textLeft: {
        color: colors.text,
    },
    textRight: {
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: spacing.sm,
        fontSize: 15,
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
        backgroundColor: '#9CA3AF',
    },
});
