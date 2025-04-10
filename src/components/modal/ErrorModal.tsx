import ModalCard from "@/components/modal/ModalCard";
import React from "react";

interface ErrorModalProps {
    title?: string;
    message?: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ title = "Ошибка!", message = "Произошла ошибка, пожалуйста, попробуйте снова.", onClose }) => {
    return (
        <ModalCard onClose={onClose}>
            <div className="flex flex-col items-center p-6">
                <div className="bg-red-200 rounded-full p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-red-600">{title}</h2>
                <p className="text-sm text-gray-600 mt-2">{message}</p>
                <div className="mt-4 flex gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </ModalCard>
    );
}

export default ErrorModal;
