import { createApi } from "@reduxjs/toolkit/query/react";
import {Course, Module} from "@/types/Course";
import {
    AnswerSpeaking,
    AnswerTest,
    Listening,
    QuestionListening,
    QuestionReading,
    Reading,
    Speaking,
    SpeakingQuestion,
    Writing
} from "@/types/Sections";
import baseQueryWithReauth from "@/store/api/baseQuery";

export const generalEnglishApi = createApi({
    reducerPath: "generalEnglishApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Modules"],
    endpoints: (builder) => ({
        getModules: builder.query<Course, number>({
            query: (id) => ({
                url: `courses/courses/${id}/modules/`,
            }),
        }),
        getModule: builder.query<Module, number>({
            query: (id) => ({
                url: `general-english/modules/${id}/details/`,
            }),
        }),
        getReading: builder.query<QuestionReading[], number>({
            query: (id) => ({
                url: `general-english/modules/${id}/readings/`,
            }),
            transformResponse: (response: Reading) => response.readings,
        }),
        submitReading: builder.mutation<string, {id: number, data: {options: AnswerTest[]}}>({
            query: ({id, data}) => ({
                url: `general-english/modules/submits/${id}/reading/`,
                method: "POST",
                body: data
            }),
        }),
        getListening: builder.query<QuestionListening[], number>({
            query: (id) => ({
                url: `general-english/modules/${id}/listening-questions/`,
            }),
            transformResponse: (response: Listening) => response.listening_questions,
        }),
        submitListening: builder.mutation<string, {id: number, data: {options: AnswerTest[]}}>({
            query: ({id, data}) => ({
                url: `general-english/modules/submits/${id}/listening/`,
                method: "POST",
                body: data
            }),
        }),
        getWriting: builder.query<Writing, number>({
            query: (id) => ({
                url: `general-english/modules/${id}/writing/`,
            }),
        }),
        submitWriting: builder.mutation<string, {id: number, data: {writing: string}}>({
            query: ({id, data}) => ({
                url: `general-english/modules/submits/${id}/writing/`,
                method: "POST",
                body: data
            }),
        }),
        getSpeaking: builder.query<SpeakingQuestion[], number>({
            query: (id) => ({
                url: `general-english/modules/${id}/speakings/`,
            }),
            transformResponse: (response: Speaking) => response.speakings,
        }),
        submitSpeaking: builder.mutation<string, {id: number, data: {answers: AnswerSpeaking[]}}>({
            query: ({id, data}) => ({
                url: `general-english/modules/submits/${id}/speaking/`,
                method: "POST",
                body: data
            }),
        }),
        finish: builder.query<{ section: string;score: number }[], number>({
            query: (id) => ({
                url: `general-english/modules/submits/${id}/get-score/`,
            }),
        }),
    }),
});

export const { useGetModulesQuery, useGetModuleQuery, useGetReadingQuery, useSubmitReadingMutation, useGetListeningQuery, useSubmitListeningMutation,
    useGetWritingQuery, useSubmitWritingMutation, useGetSpeakingQuery, useSubmitSpeakingMutation, useFinishQuery
} = generalEnglishApi;
