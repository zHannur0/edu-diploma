import Header from "@/components/layout/Header";
import ChatSidebar from "@/features/chats/chat-sidebar";
import React from "react";

export default function BasicLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
    <section className="h-screen max-h-screen relative flex flex-col items-center font-Montserrat w-full">
        <Header />
        <div className="flex h-full bg-white w-full items-start">
            <ChatSidebar/>
            {children}
        </div>
    </section>
    )
}