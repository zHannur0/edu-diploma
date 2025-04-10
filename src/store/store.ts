import { configureStore } from '@reduxjs/toolkit'
import {authApi} from "@/store/api/authApi";
import {courseApi} from "@/store/api/courseApi";
import {generalEnglishApi} from "@/store/api/generalEnglishApi";
import {ieltsApi} from "@/store/api/ieltsApi";
import {profileApi} from "@/store/api/proileApi";

export const makeStore = () => {
    return configureStore({
        reducer: {
            [authApi.reducerPath]: authApi.reducer,
            [courseApi.reducerPath]: courseApi.reducer,
            [generalEnglishApi.reducerPath]: generalEnglishApi.reducer,
            [ieltsApi.reducerPath]: ieltsApi.reducer,
            [profileApi.reducerPath]: profileApi.reducer

        },
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(authApi.middleware,
                courseApi.middleware,
                generalEnglishApi.middleware,
                ieltsApi.middleware,
                profileApi.middleware,
            );
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']