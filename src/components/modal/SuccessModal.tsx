import ModalCard from "@/components/modal/ModalCard";
import React from "react";
import Button from "@/components/ui/button/Button"; // Button компонентін қолданамыз (егер бар болса)

interface SuccessModalProps {
    title?: string;
    message?: string;
    onOk: () => void;
    onClose: () => void;
    okText?: string; // OK түймесінің текстін өзгерту мүмкіндігі
    closeText?: string; // Жабу түймесінің текстін өзгерту мүмкіндігі
}

const SuccessModal: React.FC<SuccessModalProps> = ({
                                                       title = "Сәтті!",
                                                       message = "Сіз сәтті тапсырдыңыз!",
                                                       onOk,
                                                       onClose,
                                                       okText = "OK", // OK -> Ок деп өзгертуге болады
                                                       closeText = "Жабу"
                                                   }) => {
    return (
        <ModalCard onClose={onClose}>
            <div className="flex flex-col items-center text-center p-6"> {/* Ішкі отступтарды реттеу */}
                {/* Иконка */}
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Тақырып */}
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>

                {/* Хабарлама */}
                <p className="text-sm text-gray-600 mb-6">{message}</p>

                {/* Түймелер */}
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center"> {/* Адаптивті түймелер */}
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-auto order-2 sm:order-1" // Мобильдіде ретін ауыстыру
                    >
                        {closeText}
                    </Button>
                    <Button
                        onClick={onOk}
                        className="w-full sm:w-auto order-1 sm:order-2"
                        autoFocus // OK түймесіне авто-фокус
                    >
                        {okText}
                    </Button>
                </div>
            </div>
        </ModalCard>
    );
};

export default SuccessModal;