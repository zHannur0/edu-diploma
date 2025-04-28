// components/team/TeamMemberCard.tsx (или features/landing/TeamMemberCard)
import Image from 'next/image';
import React from 'react';

interface TeamMemberCardProps {
    name: string;
    role: string;
    imageUrl: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, role, imageUrl }) => {
    return (
        // Добавим высоту и границу для эффекта при наведении
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-transparent hover:border-purple-200 hover:shadow-md transition-all duration-300 h-full">
            <div className="relative w-32 h-32 md:w-36 md:h-36 mb-5"> {/* Немного уменьшил размер фото */}
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="rounded-full object-cover" // Убрал рамку и тень с фото, т.к. есть на карточке
                />
            </div>
            <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">{name}</h4>
            {/* Применяем цвет #7B68EE к роли */}
            <p className="text-sm md:text-base text-[#7B68EE] font-medium">{role}</p>
        </div>
    );
};

export default TeamMemberCard;