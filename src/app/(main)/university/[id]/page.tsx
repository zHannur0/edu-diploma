"use client";

import { useParams } from 'next/navigation';
import React, {Suspense, useEffect, useState} from 'react';
import {useAddFavoritesMutation, useDeleteFavoritesMutation, useGetUniversityQuery} from "@/store/api/universityApi";
import { University } from "@/types/University"; // Типтерге жолды тексеріңіз
import Wrapper from "@/components/layout/Wrapper";
import {
    Globe,
    Clock,
    DollarSign,
    CalendarDays,
    BookOpen,
    Zap,
    GraduationCap,
    MapPin, LoaderCircleIcon
} from 'lucide-react';
import Image from "next/image";

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 text-[#7B68EE]">{icon}</div>
        <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
            <div className="font-medium text-sm">{value || '-'}</div>
        </div>
    </div>
);

const ContentSection: React.FC<{ title: string; content: string | null | undefined; className?: string }> = ({ title, content, className = "" }) => {
    if (!content) return null;
    return (
        <div className={className}>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: content }}>
            </div>
        </div>
    );
};


function ProgramDetailContent() {
    const params = useParams();
    const universityId = params?.id ? Number(params.id) : undefined;
    const { data: university, isLoading, isError } = useGetUniversityQuery(universityId!, {
        skip: universityId === undefined,
    });

    const [addFavoriteMutation, { isLoading: isAdding }] = useAddFavoritesMutation();
    const [deleteFavoriteMutation, { isLoading: isDeleting }] = useDeleteFavoritesMutation();

    const [optimisticFavorite, setOptimisticFavorite] = useState(university?.is_favorite);

    useEffect(() => {
        setOptimisticFavorite(university?.is_favorite);
    }, [university]);

    const isFavoriteActionLoading = isAdding || isDeleting;

    const handleFavoriteToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();

        if (isFavoriteActionLoading) return;

        const previousOptimisticState = optimisticFavorite;
        setOptimisticFavorite(!previousOptimisticState);

        try {
            if (previousOptimisticState) {
                console.log(`Deleting favorite for university ID: ${university?.id}`);
                await deleteFavoriteMutation({ university: university?.id || 0}).unwrap();
            } else {
                console.log(`Adding favorite for university ID: ${university?.id}`);
                await addFavoriteMutation({ university: university?.id || 0}).unwrap();
            }
        } catch (error) {
            console.log("Failed to toggle favorite:", error);
            setOptimisticFavorite(previousOptimisticState);
        }
    };

    const getAriaLabel = () => {
        if (isFavoriteActionLoading) {
            return optimisticFavorite ? "Removing from favorites..." : "Adding to favorites...";
        }
        return optimisticFavorite ? "Remove from favorites" : "Add to favorites";
    };


    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><p>Жүктелуде...</p></div>;
    }

    if (isError || !university) {
        return <div className="flex justify-center items-center min-h-[50vh]"><p>Мәліметтерді жүктеу мүмкін болмады немесе университет табылмады.</p></div>;
    }

    const formatDuration = (durationData: University['duration'] | null | undefined): string => {
        if (!durationData) return '-';
        return `${durationData.duration} ${durationData.prefix || ''}`.trim();
    }

    const formatArrayField = (items: Array<{ name: string }> | null | undefined): string => {
        if (!items || items.length === 0) return '-';
        return items.map(item => item.name).join(', ');
    }



    return (
        <>
            <div className="mb-2 text-sm text-gray-500">
                {university.location?.name || 'Университет атауы'}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
                {university.name || 'Бағдарлама атауы'}
            </h1>
            <div className="mb-6 text-sm text-gray-600">
                <MapPin size={14} className="inline mr-1 mb-0.5" />
                {university.location?.name || 'Орналасқан жері көрсетілмеген'}
            </div>

            <div
                className={`relative w-full h-[350px] md:h-[450px] bg-cover bg-center bg-no-repeat rounded-2xl mb-12 md:mb-20 ${!university.image ? 'bg-gray-200' : ''}`}
                style={{backgroundImage: university?.image ? `url(${university?.image})` : `url(/img/UniverBg.png)`}}>
                <button
                    type="button"
                    onClick={handleFavoriteToggle}
                    disabled={isFavoriteActionLoading || isLoading}
                    className={`absolute right-4 top-4 z-10 p-2 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center
                           ${isFavoriteActionLoading ? 'opacity-70 cursor-wait bg-black/20' : 'opacity-100 hover:bg-black/10 active:bg-black/20'}
                           ${isLoading ? 'cursor-default opacity-50' : ''}
                          `}
                    aria-label={getAriaLabel()}
                    style={{width: '40px', height: '40px'}}
                >
                    {isFavoriteActionLoading && (
                        <LoaderCircleIcon className="h-6 w-6 animate-spin text-white"/>
                    )}

                    {!isFavoriteActionLoading && (
                        <Image
                            src={optimisticFavorite ? "/icon/favoriteRed.svg" : "/icon/favoriteWhite.svg"}
                            alt=""
                            width={24}
                            height={24}
                        />
                    )}
                </button>
                <div
                    className="absolute bottom-[-40px] md:bottom-[-60px] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1000px] bg-white p-6 md:p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 md:gap-8">
                        <div>
                            <h3 className="font-semibold mb-3 text-lg">Негізгі ақпарат</h3>
                            <p className="text-sm text-gray-700 mb-4 prose prose-sm max-w-none">
                                {university.key_summary || 'Негізгі ақпарат жоқ.'}
                            </p>
                        </div>

                        <div className="gap-y-4 gap-x-2 grid grid-cols-2">
                            <DetailItem
                                icon={<Globe size={20}/>}
                                label="Оқыту тілдері"
                                value={formatArrayField(university.languages)}
                            />
                            <DetailItem
                                icon={<Zap size={20}/>}
                                label="Қарқын" // Немесе "Темп"
                                value={university.pace}
                            />
                            <DetailItem
                                icon={<DollarSign size={20}/>}
                                label="Оқу ақысы"
                                value={university.tuition_fees}
                            />
                            <DetailItem
                                icon={<BookOpen size={20}/>}
                                label="Оқу форматы"
                                value={formatArrayField(university.study_formats)}
                            />
                            <DetailItem
                                icon={<CalendarDays size={20}/>}
                                label="Құжат қабылдау мерзімі"
                                value={university.application_deadline}
                            />
                            <DetailItem
                                icon={<Clock size={20}/>}
                                label="Ұзақтығы"
                                value={formatDuration(university.duration)}
                            />
                            {university.degree_type && (
                                <DetailItem
                                    icon={<GraduationCap size={20}/>}
                                    label="Оқу түрі"
                                    value={university.degree_type.name}
                                />
                            )}
                            <p className="text-sm text-gray-600 mb-4 prose prose-sm max-w-none">
                                Баға оқу ақысына жасалған жеңілдікті қамтиды. Толық мәліметтерді университет вебсайтынан
                                қараңыз.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-16 md:pt-24 space-y-12 mb-12">
                <ContentSection title="Кіріспе" content={university.introduction}/>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {university?.study_highlights && <div>
                        <h2 className="text-2xl font-bold mb-4">Мұнда оқу нені білдіреді?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                            {
                                university?.study_highlights?.map((study, index) => (
                                    <li key={index}>{study}</li>
                                ))
                            }
                        </ul>
                    </div>}
                    {university?.program_benefits && <div>
                        <h2 className="text-2xl font-bold mb-4">Неге бұл бағдарламаны таңдау керек?</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                            {
                                university?.program_benefits?.map((program, index) => (
                                    <li key={index}>{program}</li>
                                ))
                            }
                        </ul>
                    </div>}
                </div>


                {university.academic_requirements && (
                    <div className="bg-gray-50 p-6 md:p-8 rounded-xl">
                        <ContentSection title="Академиялық талаптар" content={university.academic_requirements} />
                    </div>
                )}

                {university.scholarships_funding && (
                    <div className="bg-blue-50 p-6 md:p-8 rounded-xl">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Стипендиялар және қаржыландыру</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                                {
                                    university?.scholarships_funding?.trim().split("–").map((scholarship, index) => (
                                        <div key={index}>
                                            {
                                                scholarship && (
                                                    <li>{scholarship}</li>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                )}

            </div>

            {/* Пікірлер бөлімі (қажет болса) */}
            {/*
             <div className="mb-12">
                 <h2 className="text-2xl font-bold mb-6">Пікірлер</h2>
                 ... (пікірлер коды) ...
             </div>
             */}
        </>
    );
}


export default function ProgramDetailPage() {
    return (
        <div className="w-full bg-[#EEF4FF] py-12 flex justify-center">
            <Wrapper>
                <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><p>Бет жүктелуде...</p></div>}>
                    <ProgramDetailContent />
                </Suspense>
            </Wrapper>
        </div>

    );
}