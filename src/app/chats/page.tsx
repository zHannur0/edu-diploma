"use client"

import {FormEvent, useState, useEffect, useRef, ChangeEvent} from "react"
import {Send, LoaderCircleIcon, Paperclip, X as XIcon} from "lucide-react"
import {Message} from "@/types/Chat";
import {useSendMessageMutation} from "@/store/api/chatApi"; // Убедитесь, что эта мутация принимает FormData
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/useAuth";

export default function Chats() {
    const router = useRouter();
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        } else {
            setSelectedFile(null);
        }
        if(e.target) e.target.value = '';
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!message.trim() && !selectedFile) return;

        const currentMessage = message;
        const currentFile = selectedFile;

        if (currentMessage.trim()) {
            setMessages(prevMessages => [...prevMessages, { text: currentMessage, sender: "USER" }]);
        }
        // Можно добавить плейсхолдер для файла, если нужно
        // if (currentFile) {
        //     setMessages(prevMessages => [...prevMessages, { text: `Отправка файла: ${currentFile.name}`, sender: "USER" }]);
        // }


        setMessage("");
        setSelectedFile(null);

        const formData = new FormData();
        formData.append('chat_id', '0'); // Для создания нового чата
        if (currentMessage.trim()) {
            formData.append('message', currentMessage.trim());
        }
        if (currentFile) {
            formData.append('file', currentFile); // Убедитесь, что ключ 'file' правильный для вашего API
        }


        try {
            const res = await sendMessage(formData).unwrap();

            if (res.chat_id) { // Предполагаем, что ответ содержит chat_id
                router.push(`/chats/${res.chat_id}`);
            } else {
                // Если chat_id не пришел, возможно, показать сообщение об ошибке или остаться на странице
                console.error("Сервер не вернул ID чата для перенаправления");
                // Можно добавить ответное сообщение от AI в текущий интерфейс, если оно есть в `res`
                // if (res.message) {
                //    setMessages(prev => [...prev, { text: res.message, sender: "AQYLBEK" }]);
                // }
                // Или откатить добавленное сообщение
                // setMessages(prev => prev.slice(0, -1)); // Удалить последнее оптимистично добавленное сообщение
            }
        } catch (err) { // Изменено имя переменной
            console.error("Ошибка при создании чата:", err);
            // Можно вернуть сообщение и файл в инпуты или показать уведомление
            // setMessage(currentMessage);
            // setSelectedFile(currentFile); // Восстановление файла сложнее
            // setMessages(prev => prev.slice(0, -1)); // Удалить последнее оптимистично добавленное сообщение
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
        }).catch((err) => {
            console.error("Failed to copy text: ", err);
        });
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
    }


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
            <div className="flex-1 overflow-y-auto p-5 bg-[#f0f2f5] chat-messages pb-[10vh]">
                <div className="max-w-5xl mx-auto space-y-4 h-full"> {/* Добавлен h-full */}
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <p className="text-xl font-medium mb-2">Жаңа чат бастаңыз</p>
                                <p className="text-sm">Жаңа әңгімені бастау үшін кез-келген нәрсе жазсаңыз болады!</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`rounded-2xl p-4 max-w-[70%] shadow-sm ${
                                        msg?.sender === "USER"
                                            ? "bg-blue-100"
                                            : "bg-white" // Возможно, ответ AI здесь не отображается до редиректа
                                    }`}
                                >
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            <div className="font-medium">{msg?.sender === "USER" ? "Сіз" : msg.sender}</div>
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
                        ))
                    )}
                </div>
            </div>
            <form className="p-4 border-t bg-[#f0f2f5] absolute bottom-0 w-full" onSubmit={handleSubmit}>
                <div className="max-w-4xl mx-auto">
                    {selectedFile && (
                        <div className="mb-2 p-2 bg-gray-100 rounded-md text-sm flex justify-between items-center border border-gray-200">
                            <span className="truncate text-gray-700">
                                Файл: {selectedFile.name}
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