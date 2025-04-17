import { configureStore } from '@reduxjs/toolkit'
import {authApi} from "@/store/api/authApi";
import {courseApi} from "@/store/api/courseApi";
import {generalEnglishApi} from "@/store/api/generalEnglishApi";
import {ieltsApi} from "@/store/api/ieltsApi";
import {profileApi} from "@/store/api/proileApi";
import {universityApi} from "@/store/api/universityApi";
import {chatApi} from "@/store/api/chatApi";

export const makeStore = () => {
    return configureStore({
        reducer: {
            [authApi.reducerPath]: authApi.reducer,
            [courseApi.reducerPath]: courseApi.reducer,
            [generalEnglishApi.reducerPath]: generalEnglishApi.reducer,
            [ieltsApi.reducerPath]: ieltsApi.reducer,
            [profileApi.reducerPath]: profileApi.reducer,
            [universityApi.reducerPath]: universityApi.reducer,
            [chatApi.reducerPath]: chatApi.reducer
        },
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(authApi.middleware,
                courseApi.middleware,
                generalEnglishApi.middleware,
                ieltsApi.middleware,
                profileApi.middleware,
                universityApi.middleware,
                chatApi.middleware,
            );
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']