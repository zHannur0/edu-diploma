"use client"

import {useState} from "react"
import {Send, Mic, Paperclip} from "lucide-react"
import ChatSidebar from "@/features/chats/chat-sidebar";

export default function Home() {
    const [message, setMessage] = useState("That's great! I real!")
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "user",
            content: "Ағылшын тілінде Космонавт қалай болады және суреттерін жібер, Ағылшын тілінде Космонавт қалай болады және суреттерін жібер,Ағылшын тілінде Космонавт қалай болады және суреттерін жібер,Ағылшын тілінде Космонавт қалай болады және суреттерін жібер,Ағылшын тілінде Космонавт қалай болады және суреттерін жібер,",
            timestamp: "5 мин бұрын",
            avatar: "/avatar.png",
            username: "Дильназ",
        },
        {
            id: 2,
            sender: "AI",
            content: 'Ағылшынша космонавт сөзі "astronaut" болып аударылады',
            timestamp: "5 мин бұрын",
            username: "Aqyl'Shyn'",
            avatar: "/avatar.png",
        },
        {
            id: 3,
            sender: "user",
            content: "Рақмет",
            timestamp: "5 мин бұрын",
            avatar: "/avatar.png",
            username: "Дильназ",
        },
    ])

    return (
        <div className="flex h-screen bg-white">
            <ChatSidebar/>
            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 bg-[#f0f2f5]">
                    <div className="max-w-5xl mx-auto space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`${msg.sender === "user" ? "flex justify-end" : ""}`}>
                                <div
                                    className={`${
                                        msg.sender === "user"
                                            ? "bg-white rounded-2xl p-4 max-w-[50%] shadow-sm"
                                            : "bg-white rounded-2xl p-4 max-w-[50%] shadow-sm"
                                    }`}
                                >
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {msg.sender === "user" ? (
                                                <>
                                                    <div className="font-medium">{msg.username}</div>
                                                    <div className="text-xs text-gray-500 ml-2">{msg.timestamp}</div>
                                                </>
                                            ) : (
                                                <div className="font-medium text-indigo-600">{msg.username}</div>
                                            )}
                                        </div>
                                        <button className="ml-auto text-gray-400">
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
                                    <div className="text-gray-800">{msg.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t bg-[#f0f2f5]">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center bg-white rounded-full border p-2 shadow-sm">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-3 py-2 outline-none bg-transparent"
                            />
                            <button
                                className="w-8 h-8 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-full ml-1"
                            >
                                <Send className="h-4 w-4"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
