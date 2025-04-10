import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SignUpResponse {
   id: number;
   first_name: string;
   email: string;
}

export interface SignUpRequest {
    first_name: string,
    email: string,
    password: string,
    password2: string
}

export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.aqylshyn.kz/" }),
    endpoints: (builder) => ({
        signIn: builder.mutation<AuthResponse, AuthRequest>({
            query: (credentials) => ({
                url: "auth/token",
                method: "POST",
                body: credentials,
            }),
        }),
        signUp: builder.mutation<SignUpResponse, SignUpRequest>({
            query: (credentials) => ({
                url: "auth/register/",
                method: "POST",
                body: credentials,
            }),
        }),
    }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
