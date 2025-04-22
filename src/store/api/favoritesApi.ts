import {createApi} from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/store/api/baseQuery";
import {FavoritesData} from "@/types/University";

export const universityApi = createApi({
    reducerPath: "universityApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getFavorites: builder.query<FavoritesData[], void>({
            query: () => ({
                url: `universities/favorites/`,
            }),
        }),
        addFavorites: builder.mutation<string, { university: number }>({
            query: (data) => ({
                url: `universities/favorites/`,
                method: "POST",
                body: data
            }),
        }),
        deleteFavorites: builder.mutation<string, number>({
            query: (id) => ({
                url: `universities/favorites/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useDeleteFavoritesMutation, useAddFavoritesMutation
} = universityApi;