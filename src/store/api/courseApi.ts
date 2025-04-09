import { createApi } from "@reduxjs/toolkit/query/react";
import {Course} from "@/types/Course";
import baseQueryWithReauth from "@/store/api/baseQuery";

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
    }),
});

export const { useGetCourseQuery, useGetCoursesQuery } = courseApi;
