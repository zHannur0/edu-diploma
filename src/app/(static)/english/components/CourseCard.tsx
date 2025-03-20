import React from "react";
import Image from "next/image";

interface CourseCardProps {
    id: number;
    title: string,
    modules: number,
    level: string,
    progress: number,
    image: string
    handleClick: () => void
}

const CourseCard: React.FC<CourseCardProps> = ({ title, modules, level, image, progress, handleClick}) => {
    return (
        <div className="relative flex flex-col w-[256px]" onClick={handleClick}>
            <div className="absolute p-2 rounded-full bg-white top-1 left-1">
                {progress}
            </div>
            <Image src={image} alt={title} width={256} height={144} />
            <div className="flex flex-col p-2">
                <h2>
                    {title}
                </h2>
                <p>{modules} <span>{level}</span></p>
                <button
                    className="font-bold w-full p-2 rounded-4xl text-sm text-white flex items-center justify-center bg-[#7B68EE] ">
                    Өз деңгейіңізді анықтаңыз
                </button>
            </div>
        </div>
    );
}

export default CourseCard;