export enum Role {
    USER = 'user',
    MODEL = 'model',
}

export interface Message {
    role: Role;
    text: string;
}

// This will be the structure for chats saved for admin review
export interface EscalatedChat {
    id: string;
    timestamp: string;
    messages: Message[];
    discordUsername: string;
    userQuery: string;
}
