"use client"

import {Plus, Trash} from "lucide-react";
import {useDeleteChatMutation, useGetChatQuery} from "@/store/api/chatApi";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";

export default function ChatSidebar() {
    const router = useRouter();
    const {chatId} = useParams();

    const {data: chats} = useGetChatQuery(undefined, {refetchOnMountOrArgChange: true});
    const [deleteChatMutation, { isLoading: isDeleting }] = useDeleteChatMutation();

    const handleDeleteChat = async (event: React.MouseEvent<HTMLButtonElement>, chatIdToDelete: number) => {
        event.stopPropagation();
        event.preventDefault();

        try {
            console.log(`Attempting to delete chat ID: ${chatIdToDelete}`);
            await deleteChatMutation({ id: chatIdToDelete }).unwrap();
            console.log(`Chat ID: ${chatIdToDelete} deleted successfully.`);

            if (chatId && Number(chatId) === chatIdToDelete) {
                router.push('/chats');
            }

        } catch (error) {
            console.log(`Failed to delete chat ID: ${chatIdToDelete}`, error);
        }
    };

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
                            <div key={chat.id} className="relative group">
                                <Link
                                    href={`/chats/${chat.id}`}
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
                                <button
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                    disabled={isDeleting}
                                    className={`absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded text-indigo-200 hover:text-white hover:bg-indigo-700 
                                                opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150
                                                ${isDeleting ? 'cursor-not-allowed opacity-50' : ''}`} // Стили для блокировки и видимости при наведении
                                    aria-label="Чатты жою" // "Удалить чат"
                                >
                                    <Trash className="h-4 w-4"/>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
        ;
}
