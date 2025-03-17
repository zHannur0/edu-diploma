import { configureStore } from '@reduxjs/toolkit'
import {authApi} from "@/store/api/authApi";

export const makeStore = () => {
    return configureStore({
        reducer: {
            [authApi.reducerPath]: authApi.reducer
        },
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware().concat(authApi.middleware);
        }
    })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']