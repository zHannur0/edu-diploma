"use client"

import {Copy, CheckCheck, ThumbsUp, ThumbsDown} from "lucide-react"
import {useState} from "react"
import Button from "@/components/ui/button/Button";

interface MessageProps {
    message: {
        id: number
        role: "user" | "assistant"
        content: string
    }
}

export default function ChatMessage({message}: MessageProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`py-5 px-4 ${message.role === "assistant" ? "bg-gray-50" : "bg-white"}`}>
            <div className="max-w-3xl mx-auto flex">
                <div className="w-7 h-7 rounded-sm flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    {message.role === "user" ? (
                        <div
                            className="bg-gray-300 text-gray-800 w-full h-full rounded-sm flex items-center justify-center">
                            <span className="text-sm font-semibold">U</span>
                        </div>
                    ) : (
                        <div
                            className="bg-green-600 text-white w-full h-full rounded-sm flex items-center justify-center">
                            <span className="text-sm font-semibold">AI</span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                        {message.content.split("\n").map((paragraph, i) => (
                            <p key={i} className={i > 0 ? "mt-4" : ""}>
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {message.role === "assistant" && (
                        <div className="flex items-center mt-4 space-x-2">
                            <Button
                                onClick={copyToClipboard}
                            >
                                {copied ? <CheckCheck className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}
                            </Button>
                            <Button>
                                <ThumbsUp className="h-4 w-4"/>
                            </Button>
                            <Button
                                className="h-7 w-7 rounded-md text-gray-500 hover:text-gray-700">
                                <ThumbsDown className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
