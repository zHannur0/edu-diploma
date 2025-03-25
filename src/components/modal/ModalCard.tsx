import { ReactNode, useEffect } from "react";

interface ModalCardProps {
    children: ReactNode;
    onClose: () => void;
}

const ModalCard = ({ children, onClose }: ModalCardProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="modal-card p-8 rounded-xl flex flex-col bg-[#FCFCFF] w-full max-w-[750px] max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default ModalCard;
