
import React, { useState, KeyboardEvent } from 'react';
import SendIcon from './icons/SendIcon';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');

    const handleSubmit = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex items-center gap-3 bg-base-200 p-2 rounded-xl border border-base-300 focus-within:ring-2 focus-within:ring-brand-secondary transition-shadow duration-200">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our products, pricing, or policies..."
                className="flex-1 bg-transparent resize-none focus:outline-none p-2 placeholder-gray-400 disabled:opacity-50"
                rows={1}
                disabled={isLoading}
                style={{ maxHeight: '100px' }}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="bg-brand-secondary text-white p-2 rounded-full hover:bg-brand-primary disabled:bg-base-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                aria-label="Send message"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ChatInput;
