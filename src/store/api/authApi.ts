import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AuthResponse {
    user: { id: string; email: string };
    token: string;
}

export interface AuthRequest {
    email: string;
    password: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://your-api.com" }),
    endpoints: (builder) => ({
        signIn: builder.mutation<AuthResponse, AuthRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),
        signUp: builder.mutation<AuthResponse, AuthRequest>({
            query: (credentials) => ({
                url: "/auth/register",
                method: "POST",
                body: credentials,
            }),
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useSignInMutation, useSignUpMutation, useLogoutMutation } = authApi;
