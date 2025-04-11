import ModalCard from "@/components/modal/ModalCard";
import React from "react";

interface SuccessModalProps {
    title?: string;
    message?: string;
    onOk: () => void;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ title = "Сәтті!", message = "Операция сәтті өтті!", onOk, onClose }) => {
    return (
        <ModalCard onClose={onClose}>
            <div className="flex flex-col items-center w-100">
                <div className="bg-green-200 rounded-full p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-green-600">{title}</h2>
                <p className="text-sm text-gray-600 mt-2">{message}</p>
                <div className="mt-5 flex gap-2 w-full justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 bg-gray-200 text-black rounded-2xl hover:bg-gray-300"
                    >
                        Жабу
                    </button>
                    <button
                        onClick={onOk}
                        className="px-3 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-700"
                    >
                        Окей
                    </button>
                </div>
            </div>
        </ModalCard>
    );
}

export default SuccessModal;
