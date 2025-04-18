"use client"

import {Plus} from "lucide-react";
import {useGetChatQuery} from "@/store/api/chatApi";
import {useParams} from "next/navigation";
import Link from "next/link";

export default function ChatSidebar() {
    const {chatId} = useParams();

    const {data: chats} = useGetChatQuery(undefined, {refetchOnMountOrArgChange: true});

    return (
        <div className="max-w-64 w-full bg-indigo-500 text-white flex flex-col h-full shadow-lg overflow-y-auto">
            <Link href={"/chats"}
                className="m-4 flex items-center text-indigo-100 hover:text-white hover:bg-indigo-600 rounded-md p-2 transition-colors"
            >
                <Plus className="h-4 w-4 mr-2"/>
                <p>Жаңа чат ашу</p>
            </Link>

            <div className="overflow-y-auto p-4 h-[80vh]">
                <h2 className="text-sm font-medium mb-3">Сұрақтар</h2>
                <div className="space-y-2">
                    {chats?.map((chat) => {
                        const isActive = chat.id === Number(chatId);
                        return (
                            <Link
                                href={`/chats/${chat.id}`}
                                key={chat.id}
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
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
