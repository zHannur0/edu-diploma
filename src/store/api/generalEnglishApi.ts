import { createApi } from "@reduxjs/toolkit/query/react";
import {Course} from "@/types/Course";
import {Answer} from "@/types/Answer";
import baseQuery from "@/store/api/baseQuery";
import {Question, TrialQuestions} from "@/types/TrialQuestions";
import {AnswerTest, Listening, QuestionListening, QuestionReading, Reading} from "@/types/Sections";

export const generalEnglishApi = createApi({
    reducerPath: "generalEnglishApi",
    baseQuery: baseQuery,
    tagTypes: ["Courses"],
    endpoints: (builder) => ({
        getModules: builder.query<Course, number>({
            query: (id) => ({
                url: `courses/courses/${id}/modules/`,
            }),
        }),
        getTrialTest: builder.query<Question[], number>({
            query: (id) => ({
                url: `general-english/trial-tests/course/${id}/trial-questions/`,
            }),
            transformResponse: (response: TrialQuestions) => response.questions,
        }),
        finishTrialTest: builder.mutation<{ score: string }, {id: number, data: {answers: Answer[]}}>({
            query: ({id, data}) => ({
                url: `general-english/trial-tests/course/${id}/send-answer/`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Courses"]
        }),
        getReading: builder.query<QuestionReading[], number>({
            query: (id) => ({
                url: `general-english/modules/${id}/readings/`,
            }),
            transformResponse: (response: Reading) => response.questions,
        }),
        submitReading: builder.mutation<string, {id: number, data: {options: AnswerTest[]}}>({
            query: ({id, data}) => ({
                url: `general-english/modules/submits/${id}/readings/`,
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
        })
    }),
});

export const { useGetModulesQuery, useGetTrialTestQuery, useFinishTrialTestMutation, useGetReadingQuery, useSubmitReadingMutation, useGetListeningQuery, useSubmitListeningMutation } = generalEnglishApi;
