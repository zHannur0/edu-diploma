"use client"

import {useState} from "react";
import {Plus} from "lucide-react";

export default function ChatSidebar() {
    const [activeChat, setActiveChat] = useState("general");

    const chatOptions = [
        {id: "general", name: "General English"},
        {id: "101", name: "101 сұрақтар тізімі"},
        {id: "learning", name: "Ағылшын үйренудің жолы"},
        {id: "toefl", name: "TOEFL дайындық"},
    ];

    return (
        <div className="w-64 bg-indigo-500 text-white flex flex-col h-full shadow-lg">
            <button
                onClick={() => {
                }}
                className="m-4 flex items-center text-indigo-100 hover:text-white hover:bg-indigo-600 rounded-md p-2 transition-colors"
            >
                <Plus className="h-4 w-4 mr-2"/>
                <span>Жаңа чат ашу</span>
            </button>

            <div className="flex-1 overflow-y-auto p-4">
                <h2 className="text-sm font-medium mb-3">Сұрақтар</h2>
                <div className="space-y-2">
                    {chatOptions.map((chat) => {
                        const isActive = chat.id === activeChat;
                        return (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat.id)}
                                className={`w-full flex items-center p-2 rounded-md transition-colors ${
                                    isActive ? "bg-indigo-600" : "hover:bg-indigo-600"
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 mr-3 rounded-sm flex items-center justify-center ${
                                        isActive
                                            ? "bg-white text-indigo-600"
                                            : "border border-white text-transparent"
                                    }`}
                                >
                                    {isActive && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 6 9 17l-5-5"/>
                                        </svg>
                                    )}
                                </div>
                                <span className="flex-1 text-left">{chat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
