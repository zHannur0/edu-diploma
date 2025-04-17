import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {
    DegreeType,
    FieldOfStudy,
    Language,
    Location,
    StudyFormat,
    UniversitiesResponse,
    University
} from "@/types/University";

export const universityApi = createApi({
    reducerPath: "universityApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.aqylshyn.kz/" }),
    tagTypes: ["Ielts"],
    endpoints: (builder) => ({
        getUniversities: builder.query<UniversitiesResponse[], void>({
            query: () => ({
                url: `universities/`,
            }),
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
    }),
});

export const { useGetUniversitiesQuery, useGetDegreeTypesQuery, useGetLanguagesQuery,
    useGetFieldStudiesQuery, useGetStudyFormatsQuery, useGetUniversityQuery, useGetLocationsQuery
} = universityApi;
