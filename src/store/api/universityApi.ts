import {createApi} from "@reduxjs/toolkit/query/react";
import {
    DegreeType, FavoritesData,
    FieldOfStudy,
    Language,
    Location,
    StudyFormat,
    UniversitiesResponse,
    University
} from "@/types/University";
import baseQueryWithReauth from "@/store/api/baseQuery";

type FilterValue = string | number | boolean | undefined | null;

interface GetUniversitiesParams {
    degree_type?: number | number[];
    duration?: number | number[];
    fields_of_study?: number | number[];
    languages?: number | number[];
    location?: string | string[];
    name?: string;
    study_formats?: string | string[];
    [key: string]: FilterValue | FilterValue[];
}


export const universityApi = createApi({
    reducerPath: "universityApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["University"],
    endpoints: (builder) => ({
        getUniversities: builder.query<UniversitiesResponse[], GetUniversitiesParams>({
            query: (args) => {
                const apiParams: Record<string, string> = {};

                Object.entries(args).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (Array.isArray(value)) {
                            const filteredValues = value.filter(v => v !== undefined && v !== null && v !== '');
                            if (filteredValues.length > 0) {
                                apiParams[key] = filteredValues.join(',');
                            }
                        } else if (value !== '') {
                            apiParams[key] = String(value);
                        }
                    }
                });

                return {
                    url: `universities/`,
                    params: apiParams,
                };
            },
            providesTags: ["University"]
        }),
        getUniversity: builder.query<University, number>({
            query: (id) => ({
                url: `universities/${id}`,
            }),
        }),
        getDegreeTypes: builder.query<DegreeType[], void>({
            query: () => ({
                url: `universities/degree-types/`,
            }),
        }),
        getFieldStudies: builder.query<FieldOfStudy[], void>({
            query: () => ({
                url: `universities/field-studies/`,
            }),
        }),
        getLanguages: builder.query<Language[], void>({
            query: () => ({
                url: `universities/languages/`,
            }),
        }),
        getLocations: builder.query<Location[], void>({
            query: () => ({
                url: `universities/locations/`,
            }),
        }),
        getStudyFormats: builder.query<StudyFormat[], void>({
            query: () => ({
                url: `universities/study-formats/`,
            }),
        }),
        getFavorites: builder.query<FavoritesData[], void>({
            query: () => ({
                url: `universities/favorites/`,
            }),
            providesTags: ["University"]

        }),
        addFavorites: builder.mutation<string, { university: number }>({
            query: (data) => ({
                url: `universities/favorites/`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["University"]
        }),
        deleteFavorites: builder.mutation<string, { university: number }>({
            query: (data) => ({
                url: `universities/favorites/`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["University"]
        }),
    }),
});

export const { useGetUniversitiesQuery, useGetDegreeTypesQuery, useGetLanguagesQuery,
    useGetFieldStudiesQuery, useGetStudyFormatsQuery, useGetUniversityQuery, useGetLocationsQuery,
    useDeleteFavoritesMutation, useAddFavoritesMutation, useGetFavoritesQuery
} = universityApi;