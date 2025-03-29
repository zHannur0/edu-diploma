import React from "react";
import Image from "next/image";

interface CourseCardProps {
    id: number;
    title: string,
    modules?: number,
    level?: string,
    progress?: number,
    image: string,
    handleClick: () => void,
    trial_passed: boolean,
    isSelected: boolean,
}

const CourseCard: React.FC<CourseCardProps> = ({ title, modules, level, image, progress, handleClick, trial_passed, isSelected}) => {
    return (
        <div className={`relative flex flex-col w-[256px] overflow-hidden rounded-t-2xl ${isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`} onClick={handleClick}>
            <div className="absolute p-2 rounded-[8px] bg-white top-3 left-3 shadow font-semibold text-xs">
                {progress ? progress : 0}%
            </div>
            <Image src={image} alt={title} width={256} height={144} />
            <div className="flex flex-col p-2 gap-1">
                <h2 className="font-medium">
                    {title}
                </h2>
                <p className="text-[#7D7D7D]">{modules} модуль<span>{level}</span></p>
                <button
                    className="font-bold w-full p-2 rounded-4xl text-sm text-white flex items-center justify-center bg-[#7B68EE] ">
                    {
                        trial_passed ? "Оқуды жалғастыру" : "Өз деңгейіңізді анықтаңыз"
                    }
                </button>
            </div>
        </div>
    );
}

export default CourseCard;