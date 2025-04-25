export interface Message {
    id?: number;
    text: string;
    sender: 'USER' | 'ADMIN' | 'AQYLBEK';
    sender_name?: string;
}

export interface ChatHistory {
    id: number;
    name: string;
    messages: Message[];
}

export interface Chat {
    id: number;
    name: string;
}

export interface ChatMessage {
    message: string;
    chat_id: number;
}