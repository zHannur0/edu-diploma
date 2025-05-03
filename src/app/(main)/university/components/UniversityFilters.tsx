"use client";

import React, { useState, useEffect } from 'react';
import { useFilters } from '@/hooks/useFilter'; // useFilter қажет болса, бастапқы күйді оқу үшін қалдырамыз
import { useRouter } from 'next/navigation'; // useRouter импорттау
import {
    useGetDegreeTypesQuery, useGetDurationsQuery,
    useGetFieldStudiesQuery,
    useGetLanguagesQuery,
    useGetLocationsQuery,
    useGetStudyFormatsQuery
} from "@/store/api/universityApi";
import { Loader2 } from 'lucide-react';
import Button from "@/components/ui/button/Button";

interface OptionType {
    id?: number | string;
    name?: string;
    duration?: number;
    prefix?:string;
}

const SelectPlaceholder: React.FC<{ label: string; isLoading: boolean }> = ({ label, isLoading }) => (
    <div className="relative w-full">
        <select
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 appearance-none cursor-not-allowed"
            aria-label={label}
        >
            <option>{isLoading ? 'Жүктелуде...' : label}</option>
        </select>
        {isLoading && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
    </div>
);

const UniversityFilters = () => {
    const router = useRouter(); // useRouter шақыру
    const { filters } = useFilters(); // Бастапқы мәндерді оқу үшін қалдыруға болады

    const { data: degreeTypes = [], isLoading: isLoadingDegrees, isError: isErrorDegrees } = useGetDegreeTypesQuery();
    const { data: fieldsOfStudy = [], isLoading: isLoadingFields, isError: isErrorFields } = useGetFieldStudiesQuery();
    const { data: languages = [], isLoading: isLoadingLanguages, isError: isErrorLanguages } = useGetLanguagesQuery();
    const { data: locations = [], isLoading: isLoadingLocations, isError: isErrorLocations } = useGetLocationsQuery();
    const { data: studyFormats = [], isLoading: isLoadingFormats, isError: isErrorFormats } = useGetStudyFormatsQuery();
    const { data: durations = [], isLoading: isLoadingDurations, isError: isErrorDurations } = useGetDurationsQuery();

    // const durationOptions: OptionType[] = [ /* ... */ { id: '1', name: '1 жыл' }, { id: '2', name: '2 жыл' }, { id: '3', name: '3 жыл' }, { id: '4', name: '4+ жыл' }];
    // const academicScoreOptions: OptionType[] = [ /* ... */ { id: 'any', name: 'Кез келген' }, { id: '4.5', name: 'Жоғары (>4.5)' }, { id: '3.5', name: 'Орташа (3.5-4.4)' }, { id: '0', name: 'Төмен (<3.5)' }];


    const [selectedField, setSelectedField] = useState<string>(filters.fields_of_study?.toString() || '');
    const [selectedScore, setSelectedScore] = useState<string>(filters.academic_score?.toString() || '');
    const [selectedDuration, setSelectedDuration] = useState<string>(filters.duration?.toString() || '');
    const [selectedLanguage, setSelectedLanguage] = useState<string>(filters.languages?.toString() || '');
    const [selectedLocation, setSelectedLocation] = useState<string>(filters.location?.toString() || '');
    const [selectedFormat, setSelectedFormat] = useState<string>(filters.study_formats?.toString() || '');
    const [selectedDegree, setSelectedDegree] = useState<string>(filters.degree_type?.toString() || '');

    useEffect(() => {
        setSelectedField(filters.fields_of_study?.toString() || '');
        setSelectedScore(filters.academic_score?.toString() || '');
        setSelectedDuration(filters.duration?.toString() || '');
        setSelectedLanguage(filters.languages?.toString() || '');
        setSelectedLocation(filters.location?.toString() || '');
        setSelectedFormat(filters.study_formats?.toString() || '');
        setSelectedDegree(filters.degree_type?.toString() || '');
    }, [filters]);

    // ӨЗГЕРТІЛГЕН handleSearch функциясы
    const handleSearch = () => {
        const filtersToSet = {
            fields_of_study: selectedField || undefined,
            academic_score: selectedScore === 'any' ? undefined : selectedScore || undefined,
            duration: selectedDuration || undefined,
            languages: selectedLanguage || undefined,
            location: selectedLocation || undefined,
            study_formats: selectedFormat || undefined,
            degree_type: selectedDegree || undefined,
        };

        const params = new URLSearchParams();

        Object.entries(filtersToSet).forEach(([key, value]) => {
            // Тек белсенді (undefined емес) фильтрлерді қосамыз
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value));
            }
        });

        const queryString = params.toString();
        const targetPath = '/university/all'; // Өту керек бет

        // Жаңа бетке query string арқылы өту
        router.push(`${targetPath}${queryString ? `?${queryString}` : ''}`);
    };

    // ... (renderSelect функциясы - бұрынғы код)
    const renderSelect = (
        label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
        options: OptionType[], isLoading: boolean, isError: boolean
    ) => {
        if (isLoading || isError) { return <SelectPlaceholder label={label} isLoading={isLoading} />; }
        return (
            <div className="relative w-full">
                <select value={value} onChange={onChange} className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 appearance-none bg-white cursor-pointer" aria-label={label} >
                    <option value="">{label}</option>
                    {options.map(option => (<option key={option.id} value={option.id}>{option.name || `${option.duration + " " + option.prefix}`}</option>))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
            </div>
        );
    };


    return (
        <div className="grid grid-cols-1 gap-4 items-end ">
            <div className={"grid grid-cols-2 gap-4"}>
                {renderSelect("Оқу саласы", selectedField, (e) => setSelectedField(e.target.value), fieldsOfStudy, isLoadingFields, isErrorFields)}
                {/*{renderSelect("", selectedScore, (e) => setSelectedScore(e.target.value), academicScoreOptions, false, false)}*/}
                {renderSelect("Ұзақтығы", selectedDuration, (e) => setSelectedDuration(e.target.value), durations, isLoadingDurations, isErrorDurations)}
                {renderSelect("Оқыту тілі", selectedLanguage, (e) => setSelectedLanguage(e.target.value), languages, isLoadingLanguages, isErrorLanguages)}
                {renderSelect("Орналасқан жері", selectedLocation, (e) => setSelectedLocation(e.target.value), locations, isLoadingLocations, isErrorLocations)}
                {renderSelect("Оқу форматы", selectedFormat, (e) => setSelectedFormat(e.target.value), studyFormats, isLoadingFormats, isErrorFormats)}
                {renderSelect("Оқу түрі", selectedDegree, (e) => setSelectedDegree(e.target.value), degreeTypes, isLoadingDegrees, isErrorDegrees)}
            </div>

            {/* Іздеу батырмасы (onClick өзгеріссіз қалады, себебі handleSearch жаңартылды) */}
            <Button
                onClick={handleSearch}
                className="w-full md:w-auto justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 h-[42px]"
            >
                Іздеу
            </Button>
        </div>
    );
};

export default UniversityFilters;