"use client";

import Image from "next/image";
import Link from "next/link";
// Добавляем useState и useEffect
import React, { useState, useEffect } from "react";
import { useAddFavoritesMutation, useDeleteFavoritesMutation } from "@/store/api/universityApi";
import { LoaderCircleIcon } from "lucide-react";

interface CardProps {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    duration: string;
    studyMode: string;
    language: string;
    type: string;
    isFavorite: boolean; // Оригинальное состояние из пропсов
    isUniversityLoading: boolean;
}

const UniversityCard = ({
                            id,
                            title,
                            description,
                            duration,
                            studyMode,
                            language,
                            isFavorite, // Пропс с реальным состоянием "избранного"
                            isUniversityLoading
                        }: CardProps) => {

    const [addFavoriteMutation, { isLoading: isAdding }] = useAddFavoritesMutation();
    const [deleteFavoriteMutation, { isLoading: isDeleting }] = useDeleteFavoritesMutation();

    // --- Оптимистичное обновление ---
    // Локальное состояние для *отображаемой* иконки
    const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);

    // Синхронизируем локальное состояние, если пропс isFavorite изменился извне
    useEffect(() => {
        setOptimisticFavorite(isFavorite);
    }, [isFavorite]);
    // --- Конец оптимистичного обновления ---

    // Состояние загрузки именно для действия с избранным
    const isFavoriteActionLoading = isAdding || isDeleting;

    const handleFavoriteToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (isFavoriteActionLoading) return;

        // --- Оптимистичное обновление ---
        // Сохраняем предыдущее состояние на случай ошибки
        const previousOptimisticState = optimisticFavorite;
        // *Сразу* меняем локальное состояние для мгновенного отклика UI
        setOptimisticFavorite(!previousOptimisticState);
        // --- Конец оптимистичного обновления ---

        try {
            if (previousOptimisticState) { // Используем СОХРАНЕННОЕ состояние для определения действия
                console.log(`Deleting favorite for university ID: ${id}`);
                await deleteFavoriteMutation({ university: id }).unwrap();
            } else {
                console.log(`Adding favorite for university ID: ${id}`);
                await addFavoriteMutation({ university: id }).unwrap();
            }
            // При успехе ничего не делаем с optimisticFavorite, оно уже правильное.
            // RTK Query обновит isFavorite в фоне.
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            // !!! Важно: При ошибке откатываем изменение в UI
            setOptimisticFavorite(previousOptimisticState);
            // TODO: Показать пользователю сообщение об ошибке (например, toast)
        }
    };

    const getAriaLabel = () => {
        // Можно оставить aria-label зависимым от optimisticFavorite для большей точности
        if (isFavoriteActionLoading) {
            return optimisticFavorite ? "Removing from favorites..." : "Adding to favorites...";
        }
        return optimisticFavorite ? "Remove from favorites" : "Add to favorites";
    };

    const linkClassName = `relative bg-[#EEF4FF] rounded-[4px] p-3 w-full max-w-[325px] block group ${
        isUniversityLoading ? 'opacity-70 pointer-events-none' : ''
    }`;

    return (
        <Link href={`/university/${id}`} className={linkClassName} aria-disabled={isUniversityLoading}>
            <button
                type="button"
                onClick={handleFavoriteToggle}
                // Блокируем кнопку только во время сетевого запроса
                disabled={isFavoriteActionLoading || isUniversityLoading}
                className={`absolute right-4 top-4 z-10 p-2 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center
                           ${isFavoriteActionLoading ? 'opacity-70 cursor-wait bg-black/20' : 'opacity-100 hover:bg-black/10 active:bg-black/20'}
                           ${isUniversityLoading ? 'cursor-default opacity-50' : ''}
                          `}
                aria-label={getAriaLabel()}
                style={{ width: '40px', height: '40px' }}
            >
                {/* Показываем спиннер, только когда идет реальный запрос */}
                {isFavoriteActionLoading && (
                    <LoaderCircleIcon className="h-6 w-6 animate-spin text-white" />
                )}

                {/* Иконка сердца показывается всегда, когда НЕТ загрузки.
                    Её цвет определяется ОПТИМИСТИЧНЫМ состоянием. */}
                {!isFavoriteActionLoading && (
                    <Image
                        // !!! Используем optimisticFavorite для определения цвета
                        src={optimisticFavorite ? "/icon/favoriteRed.svg" : "/icon/favoriteWhite.svg"}
                        alt=""
                        width={24}
                        height={24}
                        // Можно убрать transition-opacity отсюда, если не нужно
                        // className="transition-opacity duration-150 ease-in-out"
                    />
                )}
            </button>

            {/* Остальной контент карты */}
            {isUniversityLoading ? (
                <div className="animate-pulse">
                    {/* Skeleton loader */}
                    <div className="overflow-hidden rounded-[8px] mb-3 bg-gray-300 h-[230px] w-full"></div>
                    <div>
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
                        <div className="h-8 bg-gray-300 rounded w-full"></div>
                    </div>
                </div>
            ) : (
                <>
                    {/* ... (ваш код для контента карты без изменений) ... */}
                    <div className="overflow-hidden rounded-[8px] mb-3">
                        <img
                            className="w-full h-[230px] object-cover transition-transform duration-300 group-hover:scale-105"
                            src={"/img/University.png"} // Use actual imageUrl prop if available: imageUrl
                            alt={title}
                        />
                    </div>
                    <div>
                        <h3 className="text-[20px] font-semibold text-[#D32F2F] w-full mb-2 truncate" title={title}>{title}</h3>
                        <div className="flex items-center w-full gap-3 font-semibold text-sm text-[#424242]">
                            <div className="flex items-center gap-1">
                                <Image src={"/icon/time.svg"} alt="" width={16} height={16}/>
                                <span>• {duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Image src={"/icon/gadget.svg"} alt="" width={16} height={16}/>
                                <span>• Кампуста</span>
                            </div>
                        </div>
                        <div className="flex items-center w-full gap-3 mt-1 font-semibold text-sm text-[#424242]">
                            <div className="flex items-center gap-1">
                                <Image src={"/icon/day.svg"} alt="" width={16} height={16}/>
                                <span>• {studyMode}</span>
                            </div>
                            <div className="flex items-center gap-1 line-break">
                                <Image src={"/icon/global.svg"} alt="" width={16} height={16}/>
                                <span>• {language}</span>
                            </div>
                        </div>
                        <p className="text-[#616161] mt-2 text-sm line-clamp-2">{description}</p>
                    </div>
                </>
            )}
        </Link>
    );
}

export default UniversityCard;