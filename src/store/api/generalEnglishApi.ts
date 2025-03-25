import { createApi } from "@reduxjs/toolkit/query/react";
import {Course} from "@/types/Course";
import {Answer} from "@/types/Answer";
import baseQuery from "@/store/api/baseQuery";
import {Question, TrialQuestions} from "@/types/TrialQuestions";

export const generalEnglishApi = createApi({
    reducerPath: "generalEnglishApi",
    baseQuery: baseQuery,
    tagTypes: ["Courses"],
    endpoints: (builder) => ({
        getModules: builder.query<Course[], void>({
            query: () => ({
                url: "courses/courses/general-english-modules/",
            }),
        }),
        getTrialTest: builder.query<Question[], number>({
            query: (id) => ({
                url: `general-english/trial-tests/course/${id}/trial-questions/`,
            }),
            transformResponse: (response: TrialQuestions) => response.questions,
        })
        ,
        finishTrialTest: builder.mutation<string, {id: number, data: {answers: Answer[]}}>({
            query: ({id, data}) => ({
                url: `general-english/trial-tests/course/${id}/send-answer/`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Courses"]
        })
    }),
});

export const { useGetModulesQuery, useGetTrialTestQuery, useFinishTrialTestMutation } = generalEnglishApi;
