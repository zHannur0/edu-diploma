import {createApi} from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/store/api/baseQuery";
import {Ielts, IeltsModule, IeltsReading, IeltsSubModule, IeltsWriting} from "@/types/Ielts";

export const ieltsApi = createApi({
    reducerPath: "ieltsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Ielts"],
    endpoints: (builder) => ({
        getIeltsModules: builder.query<IeltsModule[], void>({
            query: () => ({
                url: `ielts/modules/`,
            }),
        }),
        getIeltsModule: builder.query<IeltsModule, number>({
            query: (id) => ({
                url: `ielts/modules/${id}`,
            }),
        }),
        getIeltsSubModules: builder.query<IeltsSubModule, number>({
            query: (id) => ({
                url: `ielts/submodules/${id}`,
            }),
        }),
        getIeltsTests: builder.query<Ielts, number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
        }),
        getIeltsReading: builder.query<IeltsReading, number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
            transformResponse: (response: Ielts) => response.readings ,
        }),
        getIeltsWriting: builder.query<IeltsWriting[], number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
            transformResponse: (response: Ielts) => response.writings ,
        })
    }),
});

export const { useGetIeltsModulesQuery, useGetIeltsTestsQuery, useGetIeltsReadingQuery, useGetIeltsWritingQuery
} = ieltsApi;
