import { createApi } from "@reduxjs/toolkit/query/react";
import {Course} from "@/types/Course";
import baseQueryWithReauth from "@/store/api/baseQuery";
import {Ielts} from "@/types/Ielts";

export const ieltsApi = createApi({
    reducerPath: "ieltsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Ielts"],
    endpoints: (builder) => ({
        getIeltsModules: builder.query<Course, void>({
            query: () => ({
                url: `ielts/modules/`,
            }),
        }),
        getIeltsModule: builder.query<Course, number>({
            query: (id) => ({
                url: `ielts/modules/${id}`,
            }),
        }),
        getIeltsTests: builder.query<Ielts, number>({
            query: (id) => ({
                url: `ielts/tests/${id}`,
            }),
        })
    }),
});

export const { useGetIeltsModulesQuery, useLazyGetIeltsModuleQuery, useGetIeltsTestsQuery
} = ieltsApi;
