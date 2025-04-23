"use client";

import Image from "next/image";
import { useGetFieldStudiesQuery } from "@/store/api/universityApi";
import { FieldOfStudy } from "@/types/University";
import { useRouter } from 'next/navigation';
import {categoriesEn} from '@/config/categories'; // Иконкалар үшін импорттау
import {AlertTriangle, Book } from 'lucide-react'; // Иконкалар мен индикаторлар

const ProgramByCategory = () => {
    const router = useRouter();
    const { data: fieldsOfStudy = [], isLoading, isError } = useGetFieldStudiesQuery();

    const getIconForField = (fieldName: string): string | undefined => {
        const category = categoriesEn.find(cat => fieldName.toLowerCase().includes(cat.title.toLowerCase()));
        return category?.icon;
    };

    const handleCategoryClick = (fieldId: number) => {
        const params = new URLSearchParams();
        params.set('fields_of_study', String(fieldId));
        router.push(`/university/all?${params.toString()}`);
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center gap-6 mb-16 md:mb-20">
                <p className="text-3xl font-bold text-center mb-4">
                    Санаты бойынша өзіңе керек бағдарламаны таңда
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-4">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center justify-center gap-4 bg-gray-200 rounded-3xl h-48 md:h-52 animate-pulse p-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-300 rounded-full"></div>
                            <div className="h-5 md:h-6 bg-gray-300 rounded w-3/4 mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full flex flex-col items-center gap-6 mb-16 md:mb-20 text-center">
                <p className="text-3xl font-bold mb-4">
                    Санаты бойынша өзіңе керек бағдарламаны таңда
                </p>
                <div className="flex flex-col items-center text-red-600">
                    <AlertTriangle size={48} className="mb-2" />
                    <p>Оқу салаларын жүктеу кезінде қате пайда болды.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-6 mb-16 md:mb-20">
            <p className="text-3xl font-bold text-center mb-4">
                Санаты бойынша өзіңе керек бағдарламаны таңда
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-4">
                {
                    fieldsOfStudy.map((field: FieldOfStudy) => {
                        const iconPath = getIconForField(field.name);
                        return (
                            <div
                                key={field.id}
                                onClick={() => handleCategoryClick(field.id)}
                                className="flex flex-col items-center justify-center text-center gap-2 md:gap-4 bg-[#EEF4FF] rounded-3xl h-48 md:h-52 p-4 cursor-pointer hover:shadow-xl hover:bg-blue-100 transform hover:-translate-y-1 transition-all duration-200 ease-in-out group"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 relative mb-2 flex items-center justify-center">
                                    {iconPath ? (
                                        <Image
                                            src={iconPath}
                                            alt=""
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 64px, 80px"
                                        />
                                    ) : (
                                        <Book size={48} className="text-gray-400" strokeWidth={1.5} />
                                    )}
                                </div>
                                <b className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 leading-tight">
                                    {field.name}
                                </b>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default ProgramByCategory;