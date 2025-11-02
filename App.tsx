import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Message, Role, EscalatedChat } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminIcon from './components/icons/AdminIcon';
import { COMPANY_KNOWLEDGE_BASE } from './constants';
import EscalationForm from './components/EscalationForm';

const ESCALATION_TAG = '[escalate]';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [view, setView] = useState<'chat' | 'admin-login' | 'admin-dashboard'>('chat');
    const [escalationState, setEscalationState] = useState<'none' | 'pending' | 'submitted'>('none');
    const [apiKeyError, setApiKeyError] = useState(false);

    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        const initChat = () => {
            try {
                if (!process.env.API_KEY) {
                    console.error("API_KEY environment variable not set.");
                    setApiKeyError(true);
                    return;
                }
                
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const chatSession = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: `You are a helpful and friendly customer support assistant for Global Tech Inc. Your goal is to answer user questions based *only* on the information provided in the following knowledge base. Do not make up information.

**Escalation Protocol:**
You MUST escalate to a human agent under the following conditions:
1. The user asks to speak to a human, agent, or real person.
2. The user expresses significant frustration (e.g., "this is not working", "I'm getting angry").
3. The user asks the same question multiple times, indicating they are not satisfied with the answer.
4. The user's query is complex and requires human intervention (e.g., custom enterprise plans, security vulnerabilities, complex billing disputes).

When you decide to escalate, your response MUST politely inform the user you are connecting them with an agent and then MUST end with the special tag: ${ESCALATION_TAG}.
Example of an escalation response: "I understand this is a complex issue and I'd be happy to connect you with a human support agent who can better assist you. ${ESCALATION_TAG}"

Here is the knowledge base:
${COMPANY_KNOWLEDGE_BASE}
`,
                    },
                });
                setChat(chatSession);

                setMessages([{
                    role: Role.MODEL,
                    text: "Hello! I'm the Global Tech assistant. How can I help you with our products, pricing, or policies today?"
                }]);
            } catch (e) {
                console.error("Failed to initialize chat:", e);
                setApiKeyError(true); 
            }
        };
        initChat();
    }, []);

    const handleSendMessage = async (text: string) => {
        if (!chat || isLoading) return;

        const userMessage: Message = { role: Role.USER, text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: text });
            let modelText = response.text;

            if (modelText.includes(ESCALATION_TAG)) {
                modelText = modelText.replace(ESCALATION_TAG, '').trim();
                setEscalationState('pending'); 
            }

            const modelResponse: Message = { role: Role.MODEL, text: modelText };
            setMessages(prev => [...prev, modelResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = { role: Role.MODEL, text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleEscalationSubmit = (details: { discordUsername: string; userQuery: string }) => {
        const existingChatsRaw = localStorage.getItem('escalatedChats');
        const existingChats: EscalatedChat[] = existingChatsRaw ? JSON.parse(existingChatsRaw) : [];

        const newEscalatedChat: EscalatedChat = {
            id: `chat-${Date.now()}`,
            timestamp: new Date().toISOString(),
            messages: messages,
            discordUsername: details.discordUsername,
            userQuery: details.userQuery,
        };

        const updatedChats = [...existingChats, newEscalatedChat];
        localStorage.setItem('escalatedChats', JSON.stringify(updatedChats));

        setEscalationState('submitted');
        const confirmationMessage: Message = { 
            role: Role.MODEL, 
            text: "Thank you! Your request has been sent to our support team. They will contact you on Discord shortly. Please make sure you are in our server to receive a response." 
        };
        setMessages(prev => [...prev, confirmationMessage]);
    };

    if (apiKeyError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-red-400 p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
                <p>The API key is missing or invalid. Please ensure the <code>API_KEY</code> environment variable is set correctly.</p>
                <p className="text-sm text-gray-400 mt-2">The application cannot function without a valid API key.</p>
            </div>
        );
    }

    if (view === 'admin-login') {
        return <AdminLogin onLoginSuccess={() => setView('admin-dashboard')} onBack={() => setView('chat')} />;
    }
    if (view === 'admin-dashboard') {
        return <AdminDashboard onLogout={() => setView('chat')} />;
    }

    return (
        <div className="flex flex-col h-screen bg-base-100 text-white font-sans">
            <header className="flex items-center justify-between p-4 bg-base-200 border-b border-base-300">
                <h1 className="text-xl font-bold text-brand-primary">Global Tech Support</h1>
                <button onClick={() => setView('admin-login')} className="p-2 rounded-full hover:bg-base-300 transition-colors" aria-label="Admin Login">
                    <AdminIcon className="w-6 h-6" />
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </main>
             <footer className="p-4 md:p-6 bg-base-100">
                <div className="max-w-4xl mx-auto">
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </footer>
            {escalationState === 'pending' && (
                <EscalationForm
                    onSubmit={handleEscalationSubmit}
                    onCancel={() => setEscalationState('none')}
                />
            )}
        </div>
    );
};

export default App;