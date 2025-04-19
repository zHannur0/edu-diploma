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
import {ReadingAttempt} from "@/types/Attempts";

export const generalEnglishApi = createApi({
    reducerPath: "generalEnglishApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Modules"],
    endpoints: (builder) => ({
        getModules: builder.query<Course, number>({
            query: (id) => ({
                url: `courses/courses/${id}/modules/`,
            }),
            providesTags: ["Modules"]
        }),
        getModule: builder.query<Module, number>({
            query: (id) => ({
                url: `general-english/modules/${id}/details/`,
            }),
            providesTags: ["Modules"]
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
            invalidatesTags: ["Modules"]
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
            invalidatesTags: ["Modules"]
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
            invalidatesTags: ["Modules"]
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
            invalidatesTags: ["Modules"]
        }),
        finish: builder.query<{ section: string;score: number }[], number>({
            query: (id) => ({
                url: `general-english/modules/submits/${id}/get-score/`,
            }),
            providesTags: ["Modules"]
        }),
        getReadingAttempt: builder.query<ReadingAttempt, {id: number, section_name: string}>({
            query: ({id, section_name}) => ({
                url: `general-english/modules/submits/${id}/get-score/`,
                params: {
                    section_name: section_name
                }
            }),
            providesTags: ["Modules"]
        }),
    }),
});

export const { useGetModulesQuery, useGetModuleQuery, useGetReadingQuery, useSubmitReadingMutation, useGetListeningQuery, useSubmitListeningMutation,
    useGetWritingQuery, useSubmitWritingMutation, useGetSpeakingQuery, useSubmitSpeakingMutation, useFinishQuery, useGetReadingAttemptQuery
} = generalEnglishApi;
