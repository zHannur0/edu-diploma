// src/app/(main)/listening/[course]/ielts-test/components/QuestionDisplay.tsx
"use client";

import React from 'react';
import { QuestionIelts, OptionIelts } from "@/types/Ielts"; // Убедитесь, что эти типы определены правильно

type ReadingAnswersState = { [questionId: number]: string | number | null | string[] };

type SelectInsertOptionsData = {
    options?: (string | { id: number | string; value: string | number; text?: string })[];
};

interface QuestionDisplayProps {
    questions: QuestionIelts[];
    answers: ReadingAnswersState;
    onAnswerChange: (questionId: number, answer: string | number | null | string[]) => void;
}

export default function QuestionDisplay({ questions, answers, onAnswerChange }: QuestionDisplayProps) {

    const handleFillInputChange = (questionId: number, inputIndex: number, value: string) => {
        const currentAnswer = answers[questionId];
        const currentArray = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
        currentArray[inputIndex] = value;
        onAnswerChange(questionId, currentArray);
    };

    const renderQuestionInput = (question: QuestionIelts) => {
        const currentAnswer = answers[question.id];

        switch (question.question_type) {
            case 'OPTIONS':
                if (Array.isArray(question.options) && question.options.length > 0 && typeof question.options[0] === 'object' && 'id' in question.options[0]) {
                    const options = question.options as OptionIelts[];
                    return (
                        <div className="flex flex-col gap-2 mt-2">
                            {options.map((option) => (
                                <label key={option.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question_${question.id}`}
                                        value={option.id}
                                        checked={currentAnswer === option.id}
                                        onChange={(e) => {
                                            onAnswerChange(question.id, Number(e.target.value));
                                        }}
                                        className="form-radio h-4 w-4 text-[#7B68EE]"
                                    />
                                    <span className="text-sm text-gray-700">{option.option}</span>
                                </label>
                            ))}
                        </div>
                    );
                }
                else if (Array.isArray(question.options)) {
                    console.warn(`Question ${question.id} (OPTIONS) has options as string[], expected OptionIelts[].`);
                    return <p className="text-orange-500 text-xs mt-1">Unexpected options format (string array).</p>;
                }
                return <p className="text-red-500 text-xs mt-1">Invalid or empty options format for OPTIONS type.</p>;

            case 'FILL':
                const placeholder = '___';
                const content = question.question_content || "";
                const parts = content.split(placeholder);
                const numberOfInputs = Math.max(0, parts.length - 1);

                if (numberOfInputs <= 0) {
                    console.warn(`Question ${question.id} (FILL) has no placeholders ('___') in content. Rendering single input.`);
                    const singleAnswer = Array.isArray(currentAnswer) ? currentAnswer[0] || "" : (typeof currentAnswer === 'string' ? currentAnswer : "");
                    return (
                        <input
                            type="text"
                            value={singleAnswer}
                            onChange={(e) => onAnswerChange(question.id, [e.target.value])}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7B68EE] focus:border-[#7B68EE] sm:text-sm"
                            placeholder="Type your answer here"
                        />
                    );
                }

                const currentAnswerArray: string[] = Array.isArray(currentAnswer)
                    ? currentAnswer
                    : Array(numberOfInputs).fill('');

                return (
                    <div className="flex flex-col gap-3 mt-2">
                        {Array.from({ length: numberOfInputs }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={currentAnswerArray[index] || ''}
                                    onChange={(e) => handleFillInputChange(question.id, index, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7B68EE] focus:border-[#7B68EE] sm:text-sm"
                                    placeholder={`Answer ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                );

            case 'SELECT_INSERT': {
                let selectOptions: { value: string | number; text: string }[] = [];
                // Проверяем, что question.options существует, это объект, не массив,
                // и у него есть свойство 'options', которое является массивом.
                if (
                    question.options &&
                    typeof question.options === 'object' &&
                    !Array.isArray(question.options) &&
                    'options' in question.options && // Используем 'in' для проверки свойства
                    Array.isArray((question.options as SelectInsertOptionsData).options) // Уточняем тип для доступа к вложенному полю
                ) {
                    // Теперь мы знаем, что question.options.options это массив, но какого типа элементы?
                    const nestedOptions = (question.options as SelectInsertOptionsData).options!; // '!' т.к. мы проверили Array.isArray

                    // Проверяем, являются ли все элементы массива строками
                    if (nestedOptions.every((opt): opt is string => typeof opt === 'string')) {
                        selectOptions = nestedOptions.map(optText => ({
                            value: optText,
                            text: optText
                        }));
                    }
                    // Сюда можно добавить проверку на массив объектов, если необходимо
                    // else if (nestedOptions.every(opt => /* проверка на объект */)) { ... }
                }

                if (selectOptions.length > 0) {
                    const currentSelectedValue = typeof currentAnswer === 'string' ? currentAnswer : "";

                    return (
                        <select
                            value={currentSelectedValue}
                            onChange={(e) => {
                                const selectedStringValue = e.target.value;
                                onAnswerChange(question.id, selectedStringValue === "" ? null : selectedStringValue);
                            }}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#7B68EE] focus:border-[#7B68EE] sm:text-sm bg-white"
                        >
                            <option value="">-- Select Answer --</option>
                            {selectOptions.map((option, index) => (
                                <option key={index} value={String(option.value)}>
                                    {option.text}
                                </option>
                            ))}
                        </select>
                    );
                }
                return <p className="text-red-500 text-xs mt-1">Invalid or empty options format for SELECT_INSERT type.</p>;
            }
            default:
                return <p className="text-red-500 text-xs mt-1">Unsupported question type: {question.question_type}</p>;
        }
    };

    return (
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md h-full max-h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-800 text-center sticky top-0 bg-white py-2 -mt-5 md:-mt-6 z-10 border-b">Questions</h2>
            <div className="pt-2">
                {questions && questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div key={question.id || index} className="border-b border-gray-200 pb-4 mb-4">
                            <p className="text-sm font-medium text-gray-800 mb-1">Question {index + 1}</p>
                            {question.question_content && (
                                <div
                                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: question.question_content }}
                                />
                            )}
                            {renderQuestionInput(question)}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No questions available for this passage.</p>
                )}
            </div>
        </div>
    );
}