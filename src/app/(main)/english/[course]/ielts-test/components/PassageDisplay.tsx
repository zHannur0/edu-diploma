// src/app/(main)/listening/[course]/ielts-test/components/PassageDisplay.tsx

"use client";

import React from 'react';

interface PassageDisplayProps {
    title: string;
    content: string; // Ожидаем HTML или простой текст
}

export default function PassageDisplay({ title, content }: PassageDisplayProps) {
    return (
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md h-full max-h-[calc(100vh-200px)] overflow-y-auto"> {/* Ограничение высоты и скролл */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h2>
            {/* Используем dangerouslySetInnerHTML, если content содержит HTML.
                 Убедись, что HTML с бэкенда безопасен (санитизирован)!
                 Если content - простой текст, можно использовать <p> или <pre> */}
            <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed" // Используем Tailwind Prose для стилизации текста
                dangerouslySetInnerHTML={{ __html: content }}
            />
            {/* Альтернатива для простого текста:
             <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
             */}
        </div>
    );
}