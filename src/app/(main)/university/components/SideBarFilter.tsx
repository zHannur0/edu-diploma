import { useState, ReactNode, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
    useGetDegreeTypesQuery, useGetDurationsQuery,
    useGetFieldStudiesQuery,
    useGetLanguagesQuery,
    useGetLocationsQuery,
    useGetStudyFormatsQuery
} from "@/store/api/universityApi";
import { useFilters } from "@/hooks/useFilter";
import {Duration} from "@/types/University";

interface FilterSectionProps {
    title: string;
    isActive?: boolean;
    children?: ReactNode;
}
type FilterValue = string | number | boolean | undefined | null;


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

const mapDurationsToFilterItems = (data: Duration[]): FilterItem[] => {
    return data.map(d => ({
        id: d.id,
        name: `${d.duration} ${d.prefix}`
    }));
};

const DISPLAY_LIMIT = 10;

const SideBarFilter: React.FC = () => {
    const { filters, setFilter, resetFilters } = useFilters();
    const [selectedFilters, setSelectedFilters] = useState<Array<{key: string, value: string, id: number}>>([]);

    const { data: fieldsOfStudy = [], isLoading: isLoadingFields, isError: isErrorFields } = useGetFieldStudiesQuery();
    const { data: degreeTypes = [], isLoading: isLoadingDegrees, isError: isErrorDegrees } = useGetDegreeTypesQuery();
    const { data: studyFormats = [], isLoading: isLoadingFormats, isError: isErrorFormats } = useGetStudyFormatsQuery();
    const { data: locations = [], isLoading: isLoadingLocations, isError: isErrorLocations } = useGetLocationsQuery();
    const { data: languages = [], isLoading: isLoadingLanguages, isError: isErrorLanguages } = useGetLanguagesQuery();
    const { data: durations = [], isLoading: isLoadingDurations, isError: isErrorDurations } = useGetDurationsQuery();

    const [showAllFields, setShowAllFields] = useState(false);
    const [showAllDegrees, setShowAllDegrees] = useState(false);
    const [showAllFormats, setShowAllFormats] = useState(false);
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [showAllLanguages, setShowAllLanguages] = useState(false);
    const [showAllDurations, setShowAllDurations] = useState(false);

    const allData = {
        degree_type: degreeTypes,
        fields_of_study: fieldsOfStudy,
        location: locations,
        languages: languages,
        study_formats: studyFormats,
        duration: durations,
    }

    useEffect(() => {
        const newSelectedFilters: Array<{key: string, value: string, id: number}> = [];
        Object.entries(filters).forEach(([key, value]) => {
            const dataList = allData[key as keyof typeof allData] || [];
            if (Array.isArray(value)) {
                value.forEach(id => {
                    const item = dataList.find(d => d.id === Number(id));
                    if (item) {
                        let displayValue = '';
                        if (key === 'duration') {
                            const durationItem = item as Duration;
                            displayValue = `${durationItem.duration} ${durationItem.prefix}`;
                        } else {
                            displayValue = (item as { name: string }).name;
                        }
                        newSelectedFilters.push({ key, value: displayValue, id: item.id });
                    }
                });
            } else if (value !== undefined && value !== null && value !== "") {
                const item = dataList.find(d => d.id === Number(value));
                if (item) {
                    let displayValue = '';
                    if (key === 'duration') {
                        const durationItem = item as Duration;
                        displayValue = `${durationItem.duration} ${durationItem.prefix}`;
                    } else {
                        displayValue = (item as { name: string }).name;
                    }
                    newSelectedFilters.push({ key, value: displayValue, id: item.id });
                }
            }
        });

        setSelectedFilters(newSelectedFilters);
    }, [filters]);


    const handleFilterClick = useCallback((key: string, item: FilterItem) => {
        const currentValues = filters[key] ? (Array.isArray(filters[key]) ? filters[key] : [filters[key]]) : [];
        const numericId = Number(item.id);
        let newValues: FilterValue[];

        if (currentValues.includes(numericId)) {
            newValues = currentValues.filter(id => id !== numericId);
        } else {
            newValues = [...currentValues, numericId];
        }

        setFilter(key, newValues);
    }, [filters, setFilter]);

    const handleRemoveFilter = useCallback((key: string, idToRemove: number) => {
        const currentValues = filters[key] ? (Array.isArray(filters[key]) ? filters[key] : [filters[key]]) : [];
        const numericIdToRemove = Number(idToRemove);
        const newValues = currentValues.filter(id => Number(id) !== numericIdToRemove);
        setFilter(key, newValues);
    }, [filters, setFilter]);


    const renderFilterList = (
        items: FilterItem[],
        filterKey: string,
        showAll: boolean,
        setShowAll: (show: boolean) => void,
        isLoading: boolean,
        isError: boolean,
        loadingLabel: string,
        errorLabel: string
    ) => {
        if (isLoading) return <p>Жүктелуде: {loadingLabel}...</p>;
        if (isError) return <p>Қателік: {errorLabel} жүктелмеді</p>;

        const currentFilterValues = filters[filterKey] ? (Array.isArray(filters[filterKey]) ? filters[filterKey] : [filters[filterKey]]) : [];
        const displayedItems = showAll ? items : items.slice(0, DISPLAY_LIMIT);

        return (
            <div>
                <ul>
                    {displayedItems.map((item) => {
                        const isSelected = currentFilterValues.includes(Number(item.id));
                        return (
                            <li
                                key={item.id}
                                className={`flex justify-between items-center mb-2 cursor-pointer ${isSelected ? 'font-semibold text-[#7B68EE]' : 'text-gray-700'}`}
                                onClick={() => handleFilterClick(filterKey, item)}
                            >
                                <span >{item.name}</span>
                                {isSelected && <span className="text-[#7B68EE]">✓</span>}
                            </li>
                        );
                    })}
                </ul>
                {items.length > DISPLAY_LIMIT && (
                    <button
                        className="text-blue-600 hover:text-[#7B68EE] text-sm mt-2"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Жабу' : `Қалғандарын көрсету (${items.length - DISPLAY_LIMIT})`}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-[282px] border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Сүзгілер</h3>
                <button
                    className="text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => {
                        resetFilters();
                        setShowAllFields(false);
                        setShowAllDegrees(false);
                        setShowAllFormats(false);
                        setShowAllLocations(false);
                        setShowAllLanguages(false);
                    }}
                >
                    Қайтару
                </button>
            </div>

            {selectedFilters.length > 0 && (
                <div className="px-4 pt-3 flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                    {selectedFilters.map((filter, index) => (
                        <div key={`${filter.key}-${filter.id}-${index}`} className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                            <span>{filter.value}</span>
                            <button
                                className="ml-1.5 text-gray-500 hover:text-gray-700 text-xs"
                                onClick={() => handleRemoveFilter(filter.key, filter.id)}
                                aria-label={`Remove ${filter.value}`}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <FilterSection title="Оқу түрі">
                {renderFilterList(
                    degreeTypes,
                    'degree_type',
                    showAllDegrees,
                    setShowAllDegrees,
                    isLoadingDegrees,
                    isErrorDegrees,
                    'Оқу түрі',
                    'Оқу түрі'
                )}
            </FilterSection>

            <FilterSection title="Оқу салалары" isActive={true}>
                {renderFilterList(
                    fieldsOfStudy,
                    'fields_of_study',
                    showAllFields,
                    setShowAllFields,
                    isLoadingFields,
                    isErrorFields,
                    'Оқу салалары',
                    'Оқу салалары'
                )}
            </FilterSection>

            <FilterSection title="Мекен-жайы">
                {renderFilterList(
                    locations,
                    'location',
                    showAllLocations,
                    setShowAllLocations,
                    isLoadingLocations,
                    isErrorLocations,
                    'Орындар',
                    'Орындар'
                )}
            </FilterSection>

            <FilterSection title="Тілдер">
                {renderFilterList(
                    languages,
                    'languages',
                    showAllLanguages,
                    setShowAllLanguages,
                    isLoadingLanguages,
                    isErrorLanguages,
                    'Тілдер',
                    'Тілдер'
                )}
            </FilterSection>

            <FilterSection title="Оқу форматы">
                {renderFilterList(
                    studyFormats,
                    'study_formats',
                    showAllFormats,
                    setShowAllFormats,
                    isLoadingFormats,
                    isErrorFormats,
                    'Оқу форматы',
                    'Оқу форматы'
                )}
            </FilterSection>

            <FilterSection title="Ұзақтығы">
                {renderFilterList(
                    mapDurationsToFilterItems(durations),
                    'duration',
                    showAllDurations,
                    setShowAllDurations,
                    isLoadingDurations,
                    isErrorDurations,
                    'Ұзақтығы',
                    'Ұзақтығы'
                )}
            </FilterSection>
        </div>
    );
};

export default SideBarFilter;