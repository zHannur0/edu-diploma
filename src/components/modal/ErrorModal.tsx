import ModalCard from "@/components/modal/ModalCard";
import React from "react";
import Button from "@/components/ui/button/Button"; // Button компонентін қолданамыз

interface ErrorModalProps {
    title?: string;
    message?: string;
    onClose: () => void;
    closeText?: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
                                                   title = "Қате!",
                                                   message = "Бір қате пайда болды. Өтінеміз, кейінірек қайталап көріңіз.",
                                                   onClose,
                                                   closeText = "Жабу"
                                               }) => {
    return (
        <ModalCard onClose={onClose}>
            <div className="flex flex-col items-center text-center px-20">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>

                <p className="text-sm text-gray-600 mb-6">{message}</p>

                <div className="w-full flex justify-center">
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-auto"
                        height={40}
                        autoFocus
                    >
                        {closeText}
                    </Button>
                </div>
            </div>
        </ModalCard>
    );
};

export default ErrorModal;