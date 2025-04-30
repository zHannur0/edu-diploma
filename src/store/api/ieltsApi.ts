import {createApi} from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/store/api/baseQuery";
import {
    Ielts, IeltsListening,
    IeltsModule,
    IeltsReading,
    IeltsSpeaking,
    IeltsSubModule,
    IeltsWriting
} from "@/types/Ielts";

export interface ListeningSubmit {
    listening: {
        listening_id: number;
        options: {
            option_id: number;
            question_id: number;
        }[];
        fills: {
            question_id: number;
            answer: string[];
        }[];
    }[];
}

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
        getIeltsReading: builder.query<IeltsReading[], number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
            transformResponse: (response: Ielts) => response.reading_passages ,
        }),
        submitIeltsReading: builder.mutation<string, {id: number, data:
                {
                    readings: {
                        reading_id: number;
                        options: {
                            option_id: number;
                            question_id: number;
                        }[];
                        fills: {
                            question_id: number;
                            answer: string[];
                        }[];
                        selects: {
                            question_id: number;
                            answer: string;
                        }[];
                    }[]
        }
        }>({
            query: ({id, data}) => ({
                url: `ielts/modules/tests/${id}/reading-submit/`,
                method: "POST",
                body: data
            }),
        }),
        getIeltsWriting: builder.query<IeltsWriting[], number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
            transformResponse: (response: Ielts) => response.writing_tasks ,
        }),
        submitIeltsWriting: builder.mutation<string, {id: number, data: {writings: {answer: string, writing_id: number }[]}}>({
            query: ({id, data}) => ({
                url: `ielts/modules/tests/${id}/writing-submit/`,
                method: "POST",
                body: data
            }),
        }),
        getIeltsSpeaking: builder.query<IeltsSpeaking[], number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
            transformResponse: (response: Ielts) => response.speaking_parts ,
        }),
        submitIeltsSpeaking: builder.mutation<string, {id: number, data: {speakings: {answer: string, speaking_id: number }[]}}>({
            query: ({id, data}) => ({
                url: `ielts/modules/tests/${id}/speaking-submit/`,
                method: "POST",
                body: data
            }),
        }),
        getIeltsListening: builder.query<IeltsListening, number>({
            query: (id) => ({
                url: `ielts/modules/test/${id}/`,
            }),
            transformResponse: (response: Ielts) => response.listening ,
        }),
        submitIeltsListening: builder.mutation<string, {id: number, data: ListeningSubmit[]}>({
            query: ({id, data}) => ({
                url: `ielts/modules/tests/${id}/listening-submit/`,
                method: "POST",
                body: data
            }),
        }),
    }),
});

export const { useGetIeltsModulesQuery, useGetIeltsTestsQuery, useGetIeltsReadingQuery, useGetIeltsWritingQuery, useSubmitIeltsWritingMutation, useGetIeltsSpeakingQuery, useSubmitIeltsSpeakingMutation, useSubmitIeltsReadingMutation, useGetIeltsListeningQuery, useSubmitIeltsListeningMutation
} = ieltsApi;
