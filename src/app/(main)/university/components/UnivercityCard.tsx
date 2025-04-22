"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {useAddFavoritesMutation, useDeleteFavoritesMutation} from "@/store/api/favoritesApi"; // Импортируем React для MouseEvent

interface CardProps {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    duration: string;
    studyMode: string;
    language: string;
    type: string;
    isFavorite: boolean;
}


const UniversityCard = ({
                            id,
                            title,
                            description,
                            duration,
                            studyMode,
                            language,
                            isFavorite,
                        }: CardProps) => {

    const [addFavoriteMutation, { isLoading: isAdding }] = useAddFavoritesMutation();
    const [deleteFavoriteMutation, { isLoading: isDeleting }] = useDeleteFavoritesMutation();

    const isLoading = isAdding || isDeleting;

    const handleFavoriteToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (isLoading) return;

        try {
            if (isFavorite) {
                console.log(`Deleting favorite for university ID: ${id}`);
                await deleteFavoriteMutation(id).unwrap();
            } else {
                console.log(`Adding favorite for university ID: ${id}`);
                await addFavoriteMutation({ university: id }).unwrap();
            }
        } catch (error) {
            console.log("Failed to toggle favorite:", error);
        }
    };

    return (
        <Link href={`/university/${id}`} className="relative bg-[#EEF4FF] rounded-[4px] p-3 w-full max-w-[325px] block group">
            <button
                onClick={handleFavoriteToggle}
                disabled={isLoading}
                className={`absolute right-4 top-4 z-10 p-2 rounded-full transition-opacity duration-150 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:bg-black/10'}`} // Позиционирование и стили для кнопки
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                <Image
                    src={isFavorite ? "/icon/favoriteRed.svg" : "/icon/favoriteWhite.svg"}
                    alt={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    width={24}
                    height={24}
                />
            </button>

            <div className="overflow-hidden rounded-[8px] mb-3">
                <img
                    className="w-full h-[230px] object-cover transition-transform duration-300 group-hover:scale-105"
                    src={"/img/University.png"}
                    alt={title}
                />
            </div>
            <div>
                <h3 className="text-[20px] font-semibold text-[#D32F2F] w-full mb-2 truncate">{title}</h3>
                <div className="flex items-center w-full gap-3 font-semibold text-sm text-[#424242]">
                    <div className="flex items-center gap-1">
                        <Image src={"/icon/time.svg"} alt={"time"} width={16} height={16}/>
                        <span>• {duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image src={"/icon/gadget.svg"} alt={"gadget"} width={16} height={16}/>
                        <span>• Кампуста</span>
                    </div>
                </div>
                <div className="flex items-center w-full gap-3 mt-1 font-semibold text-sm text-[#424242]"> {/* Уменьшил gap и размер шрифта, уменьшил mt */}
                    <div className="flex items-center gap-1">
                        <Image src={"/icon/day.svg"} alt={"day"} width={16} height={16}/>
                        <span>• {studyMode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image src={"/icon/global.svg"} alt={"global"} width={16} height={16}/>
                        <span>• {language}</span>
                    </div>
                </div>
                <p className="text-[#616161] mt-2 text-sm line-clamp-2">{description}</p>
            </div>
        </Link>
    );
}

export default UniversityCard;