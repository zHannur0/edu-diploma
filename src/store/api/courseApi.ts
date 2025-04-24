import { createApi } from "@reduxjs/toolkit/query/react";
import {Course} from "@/types/Course";
import baseQueryWithReauth from "@/store/api/baseQuery";
import {Question, TrialQuestions} from "@/types/TrialQuestions";
import {Answer} from "@/types/Answer";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Courses"],
    endpoints: (builder) => ({
        getCourses: builder.query<Course[], void>({
            query: () => ({
                url: "courses/courses/",
            }),
            providesTags: ["Courses"]
        }),
        getCourse: builder.query<Course, number>({
            query: (id) => ({
                url: `courses/courses/${id}/`,
            }),
        }),
        getTrialTest: builder.query<Question[], number>({
            query: (id) => ({
                url: `general-english/trial-tests/course/${id}/trial-questions/`,
            }),
            transformResponse: (response: TrialQuestions) => response.questions,
        }),
        finishTrialTest: builder.mutation<{ score: string, user_level: string }, {id: number, data: {answers: Answer[]}}>({
            query: ({id, data}) => ({
                url: `general-english/trial-tests/course/${id}/send-answer/`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Courses"]
        }),
    }),
});

export const { useGetCourseQuery, useGetCoursesQuery, useGetTrialTestQuery, useFinishTrialTestMutation } = courseApi;
