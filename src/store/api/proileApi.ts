import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/store/api/baseQuery";
import {CourseProgress, UserProfile} from "@/types/User";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getProfile: builder.query<UserProfile, void>({
            query: () => ({
                url: `users/me/`,
            }),
        }),
        getCourseProgress: builder.query<CourseProgress, void>({
            query: () => ({
                url: `users/my-courses/progresses/`,
            }),
            transformResponse: (res: CourseProgress[]) => res?.[0] as CourseProgress,
        }),
        updateProfile: builder.mutation<void, FormData>({
            query: (data) => ({
                url: "users/profile/",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"]
        })
    }),
});

export const { useGetProfileQuery, useGetCourseProgressQuery, useUpdateProfileMutation
} = profileApi;
