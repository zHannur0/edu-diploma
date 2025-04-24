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
        resetPasswordEmail: builder.mutation<void, { email: string }>({
            query: (credentials) => ({
                url: "auth/request-reset-password/",
                method: "POST",
                body: credentials,
            }),
        }),
        verifyResetPassword: builder.mutation<{ session_token:string }, { email: string, otp: string }>({
            query: (credentials) => ({
                url: "auth/verify-request-password/",
                method: "POST",
                body: credentials,
            }),
        }),
        resetPassword: builder.mutation<void, { password: string, password2: string, session_token: string }>({
            query: (credentials) => ({
                url: "auth/reset-password/",
                method: "POST",
                body: credentials,
            }),
        }),
    }),
});

export const { useSignInMutation, useSignUpMutation, useResetPasswordEmailMutation, useVerifyResetPasswordMutation, useResetPasswordMutation } = authApi;
