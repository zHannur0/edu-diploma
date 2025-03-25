import { configureStore } from '@reduxjs/toolkit'
import {authApi} from "@/store/api/authApi";
import {courseApi} from "@/store/api/courseApi";
import {generalEnglishApi} from "@/store/api/generalEnglishApi";

export const makeStore = () => {
    return configureStore({
        reducer: {
            [authApi.reducerPath]: authApi.reducer,
            [courseApi.reducerPath]: courseApi.reducer,
            [generalEnglishApi.reducerPath]: generalEnglishApi.reducer
        },
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware, generalEnglishApi.middleware);
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']