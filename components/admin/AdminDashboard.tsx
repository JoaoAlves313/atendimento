import React, { useState, useEffect } from 'react';
import { EscalatedChat } from '../../types';
import ChatMessage from '../ChatMessage';
import LogoutIcon from '../icons/LogoutIcon';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import TrashIcon from '../icons/TrashIcon';

interface AdminDashboardProps {
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [chats, setChats] = useState<EscalatedChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<EscalatedChat | null>(null);

    useEffect(() => {
        const storedChats = localStorage.getItem('escalatedChats');
        if (storedChats) {
            // Sort chats by timestamp, newest first
            const parsedChats = JSON.parse(storedChats) as EscalatedChat[];
            parsedChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setChats(parsedChats);
        }
    }, []);

    const handleDeleteChat = (chatId: string) => {
        if (window.confirm('Are you sure you want to delete this chat record? This action cannot be undone.')) {
            const updatedChats = chats.filter(chat => chat.id !== chatId);
            setChats(updatedChats);
            localStorage.setItem('escalatedChats', JSON.stringify(updatedChats));
            if (selectedChat?.id === chatId) {
                setSelectedChat(null);
            }
        }
    };

    if (selectedChat) {
        return (
            <div className="flex flex-col h-screen bg-base-100 text-white font-sans">
                <header className="flex items-center justify-between p-4 bg-base-200 border-b border-base-300 sticky top-0 z-10">
                    <button onClick={() => setSelectedChat(null)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors">
                        <ChevronLeftIcon className="w-6 h-6" />
                        <span className="font-bold">Back to List</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold">Chat with {selectedChat.discordUsername}</h1>
                        <p className="text-xs text-gray-400">{new Date(selectedChat.timestamp).toLocaleString()}</p>
                    </div>
                    <button onClick={onLogout} className="p-2 rounded-full hover:bg-base-300 transition-colors" aria-label="Logout">
                        <LogoutIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="bg-base-200 p-4 rounded-lg border border-base-300">
                            <h2 className="font-bold mb-2 text-brand-secondary">User's Initial Query:</h2>
                            <p className="text-gray-300 italic">"{selectedChat.userQuery}"</p>
                        </div>
                        <div className="space-y-6">
                           {selectedChat.messages.map((msg, index) => (
                                <ChatMessage key={index} message={msg} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-base-100 text-white font-sans">
            <header className="flex items-center justify-between p-4 bg-base-200 border-b border-base-300">
                <h1 className="text-xl font-bold text-brand-primary">Admin Dashboard</h1>
                 <button onClick={onLogout} className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-base-300 transition-colors" aria-label="Logout">
                    <LogoutIcon className="w-6 h-6" />
                    <span className="font-semibold">Logout</span>
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Escalated Chats ({chats.length})</h2>
                    {chats.length === 0 ? (
                        <p className="text-center text-gray-400 mt-12 text-lg">No escalated chats found.</p>
                    ) : (
                        <div className="space-y-3">
                            {chats.map(chat => (
                                <div key={chat.id} className="bg-base-200 p-4 rounded-lg flex items-center justify-between hover:ring-2 hover:ring-brand-secondary transition-all duration-200">
                                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedChat(chat)}>
                                        <p className="font-bold text-lg">{chat.discordUsername}</p>
                                        <p className="text-sm text-gray-300 truncate max-w-md my-1">Query: {chat.userQuery}</p>
                                        <p className="text-xs text-gray-400">{new Date(chat.timestamp).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => handleDeleteChat(chat.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-base-100 rounded-full transition-colors" aria-label="Delete Chat">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
