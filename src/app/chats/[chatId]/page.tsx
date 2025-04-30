"use client"

import {FormEvent, useEffect, useState, useRef, ChangeEvent} from "react"
import {Send, LoaderCircleIcon, Paperclip, X as XIcon} from "lucide-react"
import {Message} from "@/types/Chat";
import {useGetChatHistoryQuery, useSendMessageMutation} from "@/store/api/chatApi";
import {useParams} from "next/navigation";

export default function ChatIdPage() {
    const {chatId} = useParams();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
        if(e.target) e.target.value = '';
    };

    const handleClick = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message.trim() && !selectedFile) return;

        const currentMessage = message;
        const currentFile = selectedFile;

        if (currentMessage.trim()) {
            setMessages(prevMessages => [...prevMessages, { text: currentMessage, sender: "USER", sender_name: prevMessages[0]?.sender_name || "User" }]);
        }

        setMessage("");
        setSelectedFile(null);

        const formData = new FormData();
        formData.append('chat_id', String(chatId));
        if (currentMessage.trim()) {
            formData.append('message', currentMessage.trim());
        }
        if (currentFile) {
            formData.append('file', currentFile);
        }

        try {
            const res = await sendMessage(formData).unwrap();

            setMessages(prevMessages => [...prevMessages, { text: res.message, sender: "AQYLBEK" }]);

            refetch();

        } catch (err) {
            console.log("Ошибка при отправке сообщения:", err);
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
            console.log("Failed to copy text: ", err);
        });
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
    }

    return (
        <div className="flex flex-col overflow-hidden relative h-full w-full bg-[#f0f2f5]">
            <div className="overflow-y-auto p-5 bg-[#f0f2f5] flex-grow chat-messages pb-[10vh]">
                <div className="max-w-5xl mx-auto space-y-4 ">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`rounded-2xl p-4 max-w-[70%] shadow-sm ${
                                    msg?.sender === "USER"
                                        ? "bg-blue-100"
                                        : "bg-white"
                                }`}
                            >
                                <div className="flex items-center mb-2">
                                    <div className="flex items-center">
                                        {msg?.sender === "USER" ? (
                                            <>
                                                <div className="font-medium">{msg?.sender_name || "User"}</div>
                                            </>
                                        ) : (
                                            <div className="font-medium text-indigo-600">AQYLBEK</div>
                                        )}
                                    </div>
                                    <button className="ml-auto pl-2 text-gray-400 hover:text-gray-600" aria-label="Copy message" onClick={() => copyToClipboard(msg.text)}>
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

            <form className="p-4 border-t bg-[#f0f2f5] absolute bottom-0 w-full" onSubmit={handleClick}>
                <div className="max-w-4xl mx-auto">
                    {selectedFile && (
                        <div className="mb-2 p-2 bg-gray-100 rounded-md text-sm flex justify-between items-center border border-gray-200">
                            <span className="truncate text-gray-700">
                                File: {selectedFile.name}
                            </span>
                            <button
                                type="button"
                                onClick={removeSelectedFile}
                                className="ml-2 p-1 text-red-500 hover:text-red-700"
                                aria-label="Remove file"
                                disabled={isLoading}
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center bg-white rounded-full border p-2 shadow-sm">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={handleAttachClick}
                            className="p-2 text-gray-500 hover:text-indigo-600"
                            aria-label="Attach file"
                            disabled={isLoading}
                        >
                            <Paperclip className="h-5 w-5" />
                        </button>

                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Хабарлама жазыңыз..."
                            className="flex-1 px-3 py-2 outline-none bg-transparent mx-1"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                                (isLoading || (!message.trim() && !selectedFile))
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                            } text-white rounded-full ml-1`}
                            disabled={isLoading || (!message.trim() && !selectedFile)}
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