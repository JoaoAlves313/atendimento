
import React from 'react';
import { Message, Role } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isModel = message.role === Role.MODEL;

    const wrapperClasses = `flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`;
    const bubbleClasses = `max-w-lg lg:max-w-2xl px-5 py-3 rounded-2xl ${
        isModel ? 'bg-base-200 rounded-tl-none' : 'bg-brand-primary text-white rounded-tr-none'
    }`;
    const textContainerClasses = "prose prose-invert prose-sm leading-relaxed whitespace-pre-wrap";

    return (
        <div className={wrapperClasses}>
            {isModel && <BotIcon className="w-8 h-8 mt-1 text-brand-secondary flex-shrink-0" />}
            <div className={bubbleClasses}>
                <div className={textContainerClasses} dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }}></div>
            </div>
            {!isModel && <UserIcon className="w-8 h-8 mt-1 bg-base-300 p-1 rounded-full flex-shrink-0" />}
        </div>
    );
};

export default ChatMessage;
