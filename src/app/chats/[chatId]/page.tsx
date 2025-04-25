"use client"

import {FormEvent, useEffect, useState} from "react"
import {Send, LoaderCircleIcon} from "lucide-react"
import {Message} from "@/types/Chat";
import {useGetChatHistoryQuery, useSendMessageMutation} from "@/store/api/chatApi";
import {useParams} from "next/navigation";

export default function ChatIdPage() {
    const {chatId} = useParams();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);

    const {data: chatHistory, refetch} = useGetChatHistoryQuery(Number(chatId), {
        skip: !chatId,
        refetchOnMountOrArgChange: true
    });

    const [sendMessage, {isLoading}] = useSendMessageMutation();

    useEffect(() => {
        if (chatHistory) {
            setMessages(chatHistory?.messages || []);
        }
    }, [chatHistory]);

    const handleClick = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message.trim()) return;

        const currentMessage = message;

        setMessages(prevMessages => [...prevMessages, { text: currentMessage, sender: "USER", sender_name: prevMessages[0].sender_name }]);

        setMessage("");

        try {
            const res = await sendMessage({
                chat_id: Number(chatId),
                message: currentMessage
            }).unwrap();

            setMessages(prevMessages => [...prevMessages, { text: res.message, sender: "AQYLBEK" }]);

            refetch();

        } catch (e) {
            console.error("Ошибка при отправке сообщения:", e);
        }
    }

    useEffect(() => {
        if (messages.length > 0) {
            const chatContainer = document.querySelector('.chat-messages');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }, [messages]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch((err) => {
            console.error("Failed to copy text: ", err);
        });
    };

    return (
        <div className="flex flex-col overflow-hidden relative h-full w-full bg-[#f0f2f5]">
            <div className="overflow-y-auto p-5 bg-[#f0f2f5] max-h-[80vh] chat-messages pb-[5vh]">
                <div className="max-w-5xl mx-auto space-y-4 ">
                    {messages.map((msg, index) => (
                        <div key={index} className={`${msg.sender === "USER" ? "flex justify-end" : ""}`}>
                            <div
                                className={`${
                                    msg?.sender === "USER"
                                        ? "bg-blue-100 rounded-2xl p-4 w-[50%] shadow-sm"
                                        : "bg-white rounded-2xl p-4 w-[50%] shadow-sm"
                                }`}
                            >
                                <div className="flex items-center mb-2">
                                    <div className="flex items-center">
                                        {msg?.sender === "USER" ? (
                                            <>
                                                <div className="font-medium">{msg?.sender_name}</div>
                                            </>
                                        ) : (
                                            <div className="font-medium text-indigo-600">AQYLBEK</div>
                                        )}
                                    </div>
                                    <button className="ml-auto text-gray-400" aria-label="Copy message" onClick={() => copyToClipboard(msg.text)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="text-gray-800 whitespace-pre-wrap break-words">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <form className="p-4 border-t bg-[#f0f2f5] absolute bottom-0 w-full max-h-[15vh]" onSubmit={handleClick}>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center bg-white rounded-full border p-2 shadow-sm">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Хабарлама жазыңыз..."
                            className="flex-1 px-3 py-2 outline-none bg-transparent"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`w-8 h-8 flex items-center justify-center ${isLoading ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'} text-white rounded-full ml-1`}
                            disabled={isLoading || !message.trim()}
                        >
                            {
                                isLoading ? (
                                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )
                            }
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}