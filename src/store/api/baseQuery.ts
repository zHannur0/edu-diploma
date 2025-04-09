import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh");

    try {
        const response = await fetch('https://api.aqylshyn.kz/auth/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.access);
            localStorage.setItem("refresh", data.refresh);
            return { data };
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            return { error: data };
        }
    } catch (error) {
        return { error };
    }
}

const baseQueryWithReauth: BaseQueryFn <
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
        baseUrl: 'https://api.aqylshyn.kz/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await refreshAccessToken();

        if (!refreshResult.error) {
            result = await baseQuery(args, api, extraOptions);
        } else {
        }
    }

    return result;
};

export default baseQueryWithReauth;
