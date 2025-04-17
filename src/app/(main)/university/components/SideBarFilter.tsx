import { useState, ReactNode, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    useGetDegreeTypesQuery,
    useGetFieldStudiesQuery,
    useGetLanguagesQuery,
    useGetLocationsQuery,
    useGetStudyFormatsQuery
} from "@/store/api/universityApi";
import { useFilters } from "@/hooks/useFilter";

interface FilterSectionProps {
    title: string;
    isActive?: boolean;
    children?: ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
                                                         title,
                                                         isActive = false,
                                                         children
                                                     }) => {
    const [isOpen, setIsOpen] = useState(isActive);

    return (
        <div className="border-t border-gray-200">
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-gray-800 font-medium">{title}</h3>
                <div className="flex items-center">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            {isOpen && <div className="px-4 pb-3">{children}</div>}
        </div>
    );
};

interface FilterItem {
    id: number;
    name: string;
}

const SideBarFilter: React.FC = () => {
    const { filters, setFilter, resetFilters, removeFilter } = useFilters();
    const [selectedFilters, setSelectedFilters] = useState<Array<{key: string, value: string, id: number}>>([]);

    const { data: fieldsOfStudy = [], isLoading: isLoadingFields, isError: isErrorFields } = useGetFieldStudiesQuery();
    const { data: degreeTypes = [], isLoading: isLoadingDegrees, isError: isErrorDegrees } = useGetDegreeTypesQuery();
    const { data: studyFormats = [], isLoading: isLoadingFormats, isError: isErrorFormats } = useGetStudyFormatsQuery();
    const { data: locations = [], isLoading: isLoadingLocations, isError: isErrorLocations } = useGetLocationsQuery();
    const { data: languages = [], isLoading: isLoadingLanguages, isError: isErrorLanguages } = useGetLanguagesQuery();

    // Update selectedFilters when URL params change
    useEffect(() => {
        const newSelectedFilters: Array<{key: string, value: string, id: number}> = [];

        // Process each filter type
        if (filters.degree_type) {
            const degree = degreeTypes.find(d => d.name === filters.degree_type);
            if (degree) {
                newSelectedFilters.push({ key: 'degree_type', value: degree.name, id: degree.id });
            }
        }

        if (filters.fields_of_study) {
            const field = fieldsOfStudy.find(f => f.name === filters.fields_of_study);
            if (field) {
                newSelectedFilters.push({ key: 'fields_of_study', value: field.name, id: field.id });
            }
        }

        if (filters.location) {
            const location = locations.find(l => l.name === filters.location);
            if (location) {
                newSelectedFilters.push({ key: 'location', value: location.name, id: location.id });
            }
        }

        if (filters.languages) {
            const language = languages.find(l => l.name === filters.languages);
            if (language) {
                newSelectedFilters.push({ key: 'languages', value: language.name, id: language.id });
            }
        }

        if (filters.study_formats) {
            const format = studyFormats.find(f => f.name === filters.study_formats);
            if (format) {
                newSelectedFilters.push({ key: 'study_formats', value: format.name, id: format.id });
            }
        }

        setSelectedFilters(newSelectedFilters);
    }, [filters, degreeTypes, fieldsOfStudy, locations, languages, studyFormats]);

    const handleFilterClick = (key: string, item: FilterItem) => {
        setFilter(key, item.id);
    };

    const handleRemoveFilter = (key: string) => {
        removeFilter(key);
    };

    const renderLoadingState = (label: string) => <p>Жүктелуде: {label}...</p>;
    const renderErrorState = (label: string) => <p>Қателік: {label} жүктелмеді</p>;

    return (
        <div className="w-full max-w-[282px] border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Сүзгілер</h3>
                <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={resetFilters}
                >
                    Қайтару
                </button>
            </div>

            {selectedFilters.length > 0 && (
                <div className="px-4 py-3 flex flex-wrap gap-2">
                    {selectedFilters.map((filter, index) => (
                        <div key={index} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                            <span>{filter.value}</span>
                            <button
                                className="ml-1 text-gray-500 hover:text-gray-700"
                                onClick={() => handleRemoveFilter(filter.key)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <FilterSection title="Оқу түрі">
                {isLoadingDegrees ? renderLoadingState('Оқу түрі') : isErrorDegrees ? renderErrorState('Оқу түрі') : (
                    <ul>
                        {degreeTypes.map((degree) => (
                            <li
                                key={degree.id}
                                className="flex justify-between items-center mb-2 cursor-pointer"
                                onClick={() => handleFilterClick('degree_type', degree)}
                            >
                                <span className="text-gray-700">{degree.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </FilterSection>

            <FilterSection title="Оқу салалары" isActive={true}>
                {isLoadingFields ? renderLoadingState('Оқу салалары') : isErrorFields ? renderErrorState('Оқу салалары') : (
                    <div className="py-2">
                        <ul>
                            {fieldsOfStudy.map((field) => (
                                <li
                                    key={field.id}
                                    className="flex justify-between items-center mb-2 cursor-pointer"
                                    onClick={() => handleFilterClick('fields_of_study', field)}
                                >
                                    <span className="text-gray-700">{field.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </FilterSection>

            <FilterSection title="Мекен-жайы">
                {isLoadingLocations ? renderLoadingState('Орындар') : isErrorLocations ? renderErrorState('Орындар') : (
                    <ul>
                        {locations.map((location) => (
                            <li
                                key={location.id}
                                className="flex justify-between items-center mb-2 cursor-pointer"
                                onClick={() => handleFilterClick('location', location)}
                            >
                                <span className="text-gray-700">{location.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </FilterSection>

            <FilterSection title="Тілдер">
                {isLoadingLanguages ? renderLoadingState('Тілдер') : isErrorLanguages ? renderErrorState('Тілдер') : (
                    <ul>
                        {languages.map((language) => (
                            <li
                                key={language.id}
                                className="flex justify-between items-center mb-2 cursor-pointer"
                                onClick={() => handleFilterClick('languages', language)}
                            >
                                <span className="text-gray-700">{language.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </FilterSection>

            <FilterSection title="Оқу форматы">
                {isLoadingFormats ? renderLoadingState('Оқу форматы') : isErrorFormats ? renderErrorState('Оқу форматы') : (
                    <ul>
                        {studyFormats.map((studyFormat) => (
                            <li
                                key={studyFormat.id}
                                className="flex justify-between items-center mb-2 cursor-pointer"
                                onClick={() => handleFilterClick('study_formats', studyFormat)}
                            >
                                <span className="text-gray-700">{studyFormat.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </FilterSection>
        </div>
    );
};

export default SideBarFilter;