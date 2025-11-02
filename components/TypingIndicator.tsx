
import React from 'react';
import BotIcon from './icons/BotIcon';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center gap-3 justify-start">
            <BotIcon className="w-8 h-8 text-brand-secondary flex-shrink-0" />
            <div className="flex items-center space-x-1.5 bg-base-200 px-5 py-3 rounded-2xl rounded-tl-none">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
        </div>
    );
};

export default TypingIndicator;
