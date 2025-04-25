"use client"

import {FormEvent, useState, useEffect} from "react"
import {Send, LoaderCircleIcon} from "lucide-react"
import {Message} from "@/types/Chat";
import {useSendMessageMutation} from "@/store/api/chatApi";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

export default function Chats() {
    const router = useRouter();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);
    const {isAuthenticated} = useAuth();
    const [sendMessage, {isLoading}] = useSendMessageMutation();

    useEffect(() => {
        if (messages.length > 0) {
            const chatContainer = document.querySelector('.chat-messages');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message.trim()) return;

        const currentMessage = message;

        setMessages(prevMessages => [...prevMessages, { text: currentMessage, sender: "USER" }]);

        setMessage("");

        try {
            const res = await sendMessage({
                chat_id: 0,
                message: currentMessage
            }).unwrap();

            if (res.chat_id) {
                router.push(`/chats/${res.chat_id}`);
            } else {
                console.error("Сервер не вернул ID чата");
            }
        } catch (e) {
            console.error("Ошибка при создании чата:", e);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch((err) => {
            console.error("Failed to copy text: ", err);
        });
    };

    return (
        <div className="flex flex-col flex-1 overflow-hidden relative h-full w-full bg-[#f0f2f5]">
            {
                isAuthenticated !== null && !isAuthenticated && (
                    <div className="fixed w-full flex items-center flex-col left-0 p-6 h-screen bg-white z-[1000]">
                        <svg className="mx-auto h-12 w-12 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                        </svg>
                        <p className="text-base font-semibold text-gray-700">
                            Өтінемін тіркеліңіз
                        </p>
                        <p className="text-sm text-gray-500 mt-1 mb-3">
                            Сайттың толық мүмкіндіктерін пайдалану үшін тіркелу қажет.
                        </p>
                        <button className="bg-[#7B68EE] text-white px-11 py-3 rounded-xl"
                                onClick={() => router.push("/login")}>
                            Тіркелу
                        </button>
                    </div>

                )
            }
            <div className="flex-1 overflow-y-auto p-5 bg-[#f0f2f5] max-h-[80vh] chat-messages pb-[5vh]">
                <div className="max-w-5xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-500 text-center">
                                <p className="text-xl font-medium mb-2">Жаңа чат бастаңыз</p>
                                <p className="text-sm">Жаңа әңгімені бастау үшін кез-келген нәрсе жазсаңыз болады!</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
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
                                                    <div className="font-medium">{msg?.sender}</div>
                                                </>
                                            ) : (
                                                <div className="font-medium text-indigo-600">{msg.sender}</div>
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
                        ))
                    )}
                </div>
            </div>
            <form className="p-4 border-t bg-[#f0f2f5] absolute max-h-[15vh] bottom-0 w-full" onSubmit={handleSubmit}>
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